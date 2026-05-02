import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_DIR || "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Village Voice Helpdesk API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
