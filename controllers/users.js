const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST_STATUS,
  AUTHENTICATION_ERROR,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  DUPLICATION_ERROR_STATUS,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = BAD_REQUEST_STATUS;
    return next(error);
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("Email already in use");
        error.statusCode = DUPLICATION_ERROR_STATUS;
        return next(error);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) => {
      res.status(201).send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and Password are required");
    error.statusCode = BAD_REQUEST_STATUS;
    return next(error);
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        const error = new Error("Incorrect email or password");
        error.statusCode = AUTHENTICATION_ERROR;
        return next(error);
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = NOT_FOUND_STATUS;
      }
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    const error = new Error("Name and avatar are required");
    error.statusCode = BAD_REQUEST_STATUS;
    return next(error);
  }

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = NOT_FOUND_STATUS;
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
