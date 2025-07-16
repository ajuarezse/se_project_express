const dbConnect = require("../utils/mongodb");

module.exports = async (req, res, next) => {
  // Skip connection check for health check endpoint
  if (req.path === "/") {
    return next();
  }

  try {
    console.log("Ensuring MongoDB connection...");
    await dbConnect();
    console.log("MongoDB connection ready");
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return res.status(503).json({
      message: "Database connection failed. Please try again.",
      error: "DB_CONNECTION_FAILED",
    });
  }
};
