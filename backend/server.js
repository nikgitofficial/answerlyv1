import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import questionSetRoutes from "./routes/questionSetRoutes.js";
import adminRoutes from "./routes/admin.js";
import profileRoutes from './routes/profileRoutes.js';
import contactRoutes from "./routes/contactRoutes.js";





dotenv.config();
const app = express();

// ✅ Environment variables
const PORT = process.env.PORT || 5000;

const CLIENT_URLS = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173", // local dev
  "https://answerlyv1.vercel.app",
   "https://answerlyv1.vercel.app",
   "https://answerlyv1-l2eh8f2r2-nikkos-projects-06c8e312.vercel.app",
   "https://answerlyv1-git-main-nikkos-projects-06c8e312.vercel.app", // deployed frontend
  
  
];

// ✅ CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || CLIENT_URLS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
}));
// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/question-sets", questionSetRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/contact", contactRoutes)









// ✅ MongoDB + Server Start
mongoose.connect(process.env.MONGO_URI, {
  
}).then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});