const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND_STATUS } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use((req, res) => {
  res.status(NOT_FOUND_STATUS).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
