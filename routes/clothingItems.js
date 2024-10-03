const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
} = require("../controllers/clothingItems");

//CRUD
router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemsId", () => console.log("Delete items by ID"));
router.put("/:itemId", updateItem);

module.exports = router;
