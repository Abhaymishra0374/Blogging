const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Protects a route: requires a valid JWT, either from the httpOnly cookie
// (set on login) or an "Authorization: Bearer <token>" header (used by the
// frontend as a fallback since some environments block third-party cookies).
const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Optionally protects a route: if a valid JWT is provided, details are put on req.user.
// If no token or invalid token, it proceeds as guest without returning an error.
const optionalProtect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore error and proceed as guest
  }
  next();
};

module.exports = { protect, optionalProtect };
