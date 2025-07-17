require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");
const limiter = require("./middlewares/rateLimiter");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const checkMongoConnection = require("./middlewares/checkMongoConnection");
const dbConnect = require("./utils/mongodb");

const app = express();
const { PORT = 3001 } = process.env;

// Trust proxy - required for Vercel deployment
app.enable("trust proxy"); // Enable proxy support
app.set("trust proxy", true); // Trust first proxy

// Initial MongoDB connection attempt
dbConnect()
  .then(() => {
    console.log("Initial MongoDB connection successful");
  })
  .catch((error) => {
    console.error("Initial MongoDB connection failed:", error);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://wtwr.vercel.app",
      "https://wtwr-react.vercel.app",
      "https://wtwr-frontend.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging
app.use(requestLogger);

// MongoDB connection check
app.use(checkMongoConnection);

// Apply rate limiting
app.use(limiter);

// Base health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WTWR API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mount all routes under /api
app.use("/api", mainRouter);

// Add MongoDB connection test endpoint
app.get("/api/test-db", async (req, res, next) => {
  try {
    const conn = await dbConnect();
    await conn.connection.db.admin().ping();
    res.json({
      status: "ok",
      message: "MongoDB connection successful",
      mongodbHost: process.env.MONGODB_URI?.split("@")[1]?.split("/")[0],
    });
  } catch (error) {
    next(error);
  }
});

// Error logging and handling
app.use(errorLogger);
app.use(errors()); // celebrate errors
app.use(errorHandler);

// Export for Vercel
module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
    console.log("Environment:", process.env.NODE_ENV || "development");
  });
}
