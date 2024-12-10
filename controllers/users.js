const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { ConflictError } = require("../utils/errors");
const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("Email already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) =>
      res.status(201).send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
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
