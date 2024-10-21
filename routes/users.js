const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

//router.get("/", getUsers);
//router.get("/:userId", getUser);
router.get("/me", auth, getCurrentUser);

module.exports = router;
