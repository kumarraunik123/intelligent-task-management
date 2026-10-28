const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const requestLogger = require("./middleware/requestLogger");
const connectDB = require("./db");

const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limit API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Parse JSON requests and reject bodies larger than 10 KB
app.use(express.json({ limit: "10kb" }));

// Log incoming requests
app.use(requestLogger);

// Public health check
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Intelligent Task Management API is running",
  });
});

// Public authentication routes
app.use("/api/auth", apiLimiter, authRoutes);

// Protected task routes: a valid JWT is required
app.use("/api/tasks", apiLimiter, authMiddleware, taskRoutes);

// Handle unknown routes
app.use(notFoundHandler);

// Centralized error handling (must remain last)
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;  s
