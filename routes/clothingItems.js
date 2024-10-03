const router = require("express").Router();
const { createItem } = require("../controllers/clothingItems");

//CRUD
router.get("/", () => console.log("GET items"));
router.post("/", createItem);
router.delete("/:itemsId", () => console.log("Delete items by ID"));

module.exports = router;
