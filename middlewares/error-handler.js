const errorHandler = (err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    details: err.details || {},
    name: err.name,
    code: err.code,
  });

  const { statusCode = 500, message } = err;

  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(statusCode).send({
    message:
      statusCode === 500 && !isDevelopment
        ? "An error occurred on the server"
        : message,
    error: isDevelopment
      ? {
          details: err.details,
          stack: err.stack,
          name: err.name,
          code: err.code,
        }
      : {},
  });
};

module.exports = errorHandler;
