const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again later",
  skipFailedRequests: true, // Don't count failed requests
  // Vercel-specific configuration
  trustProxy: true,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        message:
          "Too many requests from this IP, please try again after 15 minutes",
        code: "TOO_MANY_REQUESTS",
      },
    });
  },
  // Use a more reliable key generator for Vercel
  keyGenerator: (req) => {
    const xForwardedFor = req.headers["x-forwarded-for"];
    const xRealIp = req.headers["x-real-ip"];

    if (Array.isArray(xForwardedFor)) {
      return xForwardedFor[0] || xRealIp || req.ip;
    }

    return xForwardedFor?.split(",")[0].trim() || xRealIp || req.ip;
  },
});

module.exports = limiter;
