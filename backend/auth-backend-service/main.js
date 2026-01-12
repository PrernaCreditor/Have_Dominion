require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { logger } = require("../internal/common/logger");
const { errorHandler } = require("../internal/common/error-handler");
const authRoutes = require("../internal/api/routes/auth.routes");
const userRoutes = require("../internal/api/routes/user.routes");
const adminRoutes = require("../internal/api/routes/admin.routes");
const contactRoutes = require("../internal/api/routes/contact.routes");
const tradelineRoutes = require("../internal/api/routes/tradeline.routes");

const app = express();

/* ======================
   SECURITY & CORS
====================== */

// Allowed origins
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(o => o.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://have-dominion.onrender.com",
      "https://have-dominion-1.onrender.com",
      "https://universal-helpers-j1p7.vercel.app",
      "https://universal-helpers-1.onrender.com",
    ];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl / Postman (no origin)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }

    // In development, allow localhost origins
    if (process.env.NODE_ENV === "development" && origin.includes("localhost")) {
      return callback(null, origin);
    }

    logger.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Security headers (configured to not interfere with CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

/* ======================
   MIDDLEWARE
====================== */

app.use(
  morgan("combined", {
    stream: { write: msg => logger.info(msg.trim()) },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   ROUTES
====================== */

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello World!!!!!!" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);
app.use(`${apiPrefix}/contact`, contactRoutes);
app.use(`${apiPrefix}/tradeline`, tradelineRoutes);

/* ======================
   ERROR HANDLING
====================== */

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

/* ======================
   DATABASE
====================== */

const connectDB = async () => {
  try {
    let mongoUrl =
      process.env.MONGODB_URL ||
      "mongodb://localhost:27017/auth-service";

    logger.info("Connecting to MongoDB...");
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    logger.warn("Starting server without database - using in-memory storage");
    // Don't exit, continue with in-memory storage
  }
};

/* ======================
   SERVER
====================== */

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(
        `Environment: ${process.env.NODE_ENV || "development"}`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
