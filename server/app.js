// app.js
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import hpp from "hpp";
import path from "path";

import contactRoutes from "./routes/contact.routes.js";
import compressRoutes from "./routes/compress.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { env, isProd } from "./config/config.js";
import { apilimiter } from "./middleware/ratelimit.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// Trust Render proxy
app.set("trust proxy", 1);

// Helmet security
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // dev React
  "https://hotelsupremestay900.vercel.app", // Vercel production
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true, // Allow cookies
  })
);

// Handle preflight
app.options("*", cors());

// Middlewares
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// Static uploads
app.use("/uploads", express.static(path.resolve(env.uploadDir)));

// Rate limiter
app.use("/api", apilimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", publicRoutes);
app.use("/api", compressRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend server running successfully." });
});

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;
