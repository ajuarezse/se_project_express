//const { get } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((e) => {
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
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
