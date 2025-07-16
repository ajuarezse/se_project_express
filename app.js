require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const limiter = require("./middlewares/rateLimiter");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

// Trust proxy - required for Vercel deployment
app.set("trust proxy", 1);

// Debug logs for MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
    console.log("MongoDB URI:", process.env.MONGODB_URI?.split("@")[1]); // Log only the host part for security
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Configure CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://wtwr.vercel.app"],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security middleware
app.use(helmet());
app.use(limiter);

// Logging middleware
app.use(requestLogger);

// Health check endpoint with environment info
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "WTWR API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// MongoDB connection test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    // Test the database connection
    await mongoose.connection.db.admin().ping();
    res.json({
      status: "success",
      message: "MongoDB connection successful",
      dbName: mongoose.connection.db.databaseName,
      state: mongoose.connection.readyState, // 1 = connected
    });
  } catch (err) {
    console.error("Database connection test failed:", err);
    res.status(500).json({
      status: "error",
      message: "MongoDB connection failed",
      error: err.message,
      state: mongoose.connection.readyState, // 0 = disconnected
    });
  }
});

// Debug endpoint (remove in production)
if (process.env.NODE_ENV !== "production") {
  app.get("/crash-test", () => {
    setTimeout(() => {
      throw new Error("Server will crash now");
    }, 0);
  });
}

// Routes
app.use("/", mainRouter);

// Error handling
app.use(errorLogger);
app.use(errors()); // celebrate error handler
app.use(errorHandler);

// Unhandled error handler
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV);
});
