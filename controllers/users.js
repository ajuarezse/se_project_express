const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  DUPLICATION_ERROR_STATUS,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS)
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(DUPLICATION_ERROR_STATUS)
        .send({ message: "Duplication Error" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => User.create({ name, avatar, email, password: hash }))
      .then((user) => {
        const userObject = {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
          __v: user.__v,
        };
        return res.status(201).send(userObject);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
        }
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: "An error has occurred on the server" });
      });
  });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
