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

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security middleware
app.use(helmet());
app.use(limiter);

// Logging middleware
app.use(requestLogger);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "WTWR API is running" });
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
});
