const router = require("express").Router();

router.get("/", () => console.log("GET users"));
router.get("/:userID", () => console.log("GET users by ID"));
router.post("/", () => console.log("POST users"));

module.exports = router;
