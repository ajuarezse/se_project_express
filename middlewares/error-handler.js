const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle validation errors from celebrate/joi
  if (err.joi) {
    console.error("Validation error details:", err.joi.details);
    return res.status(400).send({
      message: "Validation error",
      details: err.joi.details.map((detail) => detail.message),
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
