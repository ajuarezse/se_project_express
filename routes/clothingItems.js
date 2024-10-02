const router = require("express").Router();

router.get("/", () => console.log("GET items"));
router.post("/", () => console.log("POST items"));
router.delete("/:itemsId", () => console.log("Delete items by ID"));

module.exports = router;
