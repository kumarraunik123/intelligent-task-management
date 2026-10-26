
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  console.log("AUTH MIDDLEWARE HIT:", req.method, req.originalUrl);
  // Read the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a token.",
    });
  }

  // Extract the token after "Bearer "
  const token = authHeader.slice(7);

  try {
    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach authenticated user's ID to the request
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authMiddleware;
