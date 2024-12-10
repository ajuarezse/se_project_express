/*
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = payload;
  return next();
};
*/

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/UnauthorizedError");

module.exports = (req, res, next) => {
  console.log("Entering auth middleware");
  const { authorization } = req.headers;
  console.log("Authorization header:", authorization);

  if (!authorization || !authorization.startsWith("Bearer")) {
    console.log("No valid authorization header found");
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Token verified. Payload:", payload);
  } catch (err) {
    console.error("Token verification failed:", err);
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = payload;
  console.log("User set in request:", req.user);
  return next();
};
