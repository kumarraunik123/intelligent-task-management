
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const taskRoutes = require("./routes/taskRoutes");
const requestLogger = require("./middleware/requestLogger");
const connectDB = require("./db");

const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limit task API requests
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

// Security and request middleware
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(requestLogger);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Intelligent Task Management API is running",
  });
});

// Task routes with rate limiting
app.use("/api/tasks", apiLimiter, taskRoutes);

// Handle unknown routes
app.use(notFoundHandler);

// Centralized error handling (keep last)
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

module.exports = app;          
      


  
