//const { get } = require("mongoose");
const e = require("express");
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: e.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: "Error from createItem", e });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: e.message });
      } else if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: e.message });
      } else {
        res.status(500).send({ message: "Error from updateItem", e });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => ClothingItem.deleteOne({ _id: itemId }))
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: e.message });
      } else if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: e.message });
      } else {
        return res.status(500).send({ message: "Error from deleteItem", e });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: e.message });
      } else if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: e.message });
      } else {
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: e.message });
      }
    });
};

const disLikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(200).send({ message: e.message }))
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: e.message });
      } else if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_STATUS).send({ message: e.message });
      } else {
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({ message: e.message });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  disLikeItem,
};
