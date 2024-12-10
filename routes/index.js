const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const NotFoundError = require("../utils/NotFoundError");
const { createUser, login } = require("../controllers/users");
const {
  validateUserCreation,
  validateUserLogin,
} = require("../middlewares/validation");

router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserLogin, login);

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
