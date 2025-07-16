const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
  // Configure for proxy environment
  trustProxy: true,
  // Use a more reliable key generator for Vercel
  keyGenerator: (req) => {
    // Use Vercel-specific headers if available
    return (
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip ||
      req.connection.remoteAddress
    );
  },
});

module.exports = limiter;
