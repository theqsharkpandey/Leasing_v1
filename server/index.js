const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const {
  IMAGE_SIZE_LIMIT_MB,
  DOC_SIZE_LIMIT_MB,
  IMAGE_MAX_COUNT,
  DOC_MAX_COUNT,
} = require("./middleware/upload");

dotenv.config({ path: require("path").join(__dirname, ".env") });

// Write logs to a file for debugging (local dev only)
if (process.env.NODE_ENV !== "production") {
  const logFile = fs.createWriteStream(__dirname + "/debug.log", {
    flags: "a",
  });
  const origLog = console.log.bind(console);
  const origErr = console.error.bind(console);
  console.log = (...a) => {
    origLog(...a);
    logFile.write("[LOG] " + a.join(" ") + "\n");
  };
  console.error = (...a) => {
    origErr(...a);
    logFile.write("[ERR] " + a.join(" ") + "\n");
  };
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : ["http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting — public API endpoints
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

// Stricter rate limit for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later." },
});
app.use("/api/auth", authLimiter);

// Global request logger
app.use((req, res, next) => {
  process.stdout.write(`[REQ] ${req.method} ${req.path}\n`);
  next();
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const leadRoutes = require("./routes/leads");
const uploadRoutes = require("./routes/upload");
const shortlistRoutes = require("./routes/shortlist");
const statsRoutes = require("./routes/stats");
const userAdminRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const visitRoutes = require("./routes/visits");
const savedSearchRoutes = require("./routes/savedSearches");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/shortlist", shortlistRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/saved-searches", savedSearchRoutes);

// Global Error Handler (Express 5 compatible — no bare next() call)
app.use((err, req, res, _next) => {
  // Derive a safe message — err.message may be undefined for non-Error objects,
  // which would cause JSON.stringify({ error: undefined }) === '{}' (silent data loss).
  const message =
    err?.message ||
    (typeof err === "string" ? err : null) ||
    "An unexpected error occurred";
  console.error("Global Error:", err);

  if (err instanceof multer.MulterError) {
    // Make file-too-large errors self-explanatory by including the actual limit
    let userMessage = message;
    if (err.code === "LIMIT_FILE_SIZE") {
      const limitMb =
        err.field === "documents" ? DOC_SIZE_LIMIT_MB : IMAGE_SIZE_LIMIT_MB;
      userMessage = `File too large. Maximum allowed size is ${limitMb} MB per file.`;
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      const maxCount =
        err.field === "documents" ? DOC_MAX_COUNT : IMAGE_MAX_COUNT;
      userMessage = `Too many files. You can upload a maximum of ${maxCount} files at once.`;
    }
    return res
      .status(400)
      .json({ error: userMessage, type: "MulterError", code: err.code });
  }
  // Custom fileFilter rejections
  if (
    err?.code === "INVALID_FILE_TYPE" ||
    message.includes("image files") ||
    message.includes("PDF")
  ) {
    return res.status(400).json({ error: message });
  }
  return res.status(500).json({ error: message });
});

app.get("/", (req, res) => {
  res.send("The Leasing World API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
