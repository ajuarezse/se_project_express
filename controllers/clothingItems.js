//const { NotBeforeError } = require("jsonwebtoken");
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  FORBIDDEN_ERROR_STATUS,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        const error = new Error(
          "You do not have permission to delete this item."
        );
        error.statusCode = FORBIDDEN_ERROR_STATUS;
        throw error;
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = NOT_FOUND_STATUS;
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = NOT_FOUND_STATUS;
      }
      next(err);
    });
};

const disLikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(200).send({ message: "unlike successful" }))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST_STATUS;
      }
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = NOT_FOUND_STATUS;
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
