const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
  validateItemId,
} = require("../middlewares/validation");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", auth, validateClothingItem, createItem);
router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/:itemId/likes", auth, validateItemId, disLikeItem);

module.exports = router;
