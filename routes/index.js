const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const NotFoundError = require("../utils/NotFoundError");
const { createUser, login } = require("../controllers/users");
const {
  validateUserCreation,
  validateUserLogin,
} = require("../middlewares/validation");

// Health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WTWR API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserLogin, login);

// API routes
router.use("/users", userRouter);
router.use("/items", clothingItem);

// 404 handler - keep this last
router.use((req, res, next) => {
  // Extract the path without the /api prefix
  const requestedPath = req.path;
  next(new NotFoundError(`Route not found: ${requestedPath}`));
  console.log("404 Error for path:", req.path, "Method:", req.method);
  next(new NotFoundError(`Requested resource not found: ${req.path}`));
});

module.exports = router;
