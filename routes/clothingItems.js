const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItems");

// Public route
router.get("/", getItems);

// Protected routes with consistent validation
router.post("/", auth, validateClothingItem, createItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);
router.put("/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/:itemId/likes", auth, validateItemId, disLikeItem);

module.exports = router;
