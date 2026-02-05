import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Routes
import authRoutes from "./src/auth/authRoutes.js";
import emailRoutes from "./src/email/emailRoutes.js";
import googleRoutes from "./src/auth/google.js";

const app = express();

// Enable CORS for all routes with simple configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  optionsSuccessStatus: 200,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/email", emailRoutes);
app.use("/api/auth/google", googleRoutes);

// Simple test route

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default app;
