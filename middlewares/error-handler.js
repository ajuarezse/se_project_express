const errorHandler = (err, req, res, next) => {
  console.error("Error in error handler:", {
    error: err,
    stack: err.stack,
    name: err.name,
    code: err.code,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Handle MongoDB timeout errors
  if (
    err.name === "MongooseError" &&
    err.message.includes("buffering timed out")
  ) {
    console.error("MongoDB operation timed out");
    return res.status(500).send({
      message: "Database operation timed out. Please try again.",
      error: "MONGODB_TIMEOUT",
    });
  }

  // Handle validation errors from celebrate/joi
  if (err.joi) {
    console.error("Validation error details:", err.joi.details);
    return res.status(400).send({
      message: "Validation error",
      details: err.joi.details.map((detail) => detail.message),
      error: "VALIDATION_ERROR",
    });
  }

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
    details:
      process.env.NODE_ENV === "development" ? err.toString() : undefined,
  });
};

module.exports = errorHandler;
