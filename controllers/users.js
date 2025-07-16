const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  // Validate password length
  if (password.length < 8) {
    return next(
      new BadRequestError("Password must be at least 8 characters long")
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  // Set default avatar if none provided
  const defaultAvatar =
    "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr/avatar_0.jpg";

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Email already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      console.log("Creating user with data:", {
        name,
        email,
        avatar: avatar || defaultAvatar,
      });

      return User.create({
        name: name || undefined,
        avatar: avatar || defaultAvatar,
        email,
        password: hash,
      });
    })
    .then((newUser) => {
      console.log("User created successfully:", {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      });

      res.status(201).send({
        _id: newUser._id,
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError(`Invalid user data: ${err.message}`));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and Password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data for user update"));
      }
      return next(err);
    });
};
