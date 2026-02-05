import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Routes
import emailRoutes from "./src/email/emailRoutes.js";
import authRoutes from "./src/auth/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth/email", emailRoutes);
app.use("/api/auth", authRoutes);

// Health
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default app;

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// // Routes
// import authRoutes from "./src/auth/authRoutes.js";
// import emailRoutes from "./src/email/emailRoutes.js";
// import googleRoutes from "./src/auth/google.js";

// const app = express();

// const corsOptions = {
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// // CORS
// app.use(cors(corsOptions));

// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/auth/email", emailRoutes);
// app.use("/api/auth/google", googleRoutes);

// // Health check
// app.get("/health", (req, res) => {
//   res.json({ status: "OK", message: "Server is running" });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("Server Error:", err);
//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || "Internal server error",
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: "Route not found",
//   });
// });

// export default app;

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// // Routes
// import authRoutes from "./src/auth/authRoutes.js";
// import emailRoutes from "./src/email/emailRoutes.js";
// import googleRoutes from "./src/auth/google.js";

// const app = express();

// // app.options("/api/auth/google/login", cors());
// // app.options("/api/auth/google/callback", cors());
// // app.options("/api/auth/email/send-otp", cors());
// // app.options("/api/auth/email/verify-otp", cors());

// const corsOptions = {
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/auth/email", emailRoutes);
// app.use("/api/auth/google", googleRoutes);

// // Health check
// app.get("/health", (req, res) => {
//   res.json({ status: "OK", message: "Server is running" });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("Server Error:", err);
//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || "Internal server error",
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: "Route not found",
//   });
// });

// export default app;
