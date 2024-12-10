const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const NotFoundError = require("../utils/NotFoundError");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
