import express from "express";
import path from "path";
// Connect to MongoDB database
import connectDB from "./database/db.js";
//routes
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/post.js";
import notificationRoute from "./routes/notification.js";

import cors from "cors";
import dotenv from "dotenv";
// Middleware for parsing cookies
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.js";
import { v2 as cloudinary } from "cloudinary";
// Load environment variables from .env file
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cookieParser());
// Enable CORS for all routes
const corsOptions = {
  origin:process.env.VITE_API_BASE_URL || "http://localhost:5173", // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
//routes for user and auth post
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"
const __dirname = path.resolve();
// Serve static files from the frontend build directory
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  // Handle any requests that don't match the above routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
// Start the server and connect to the database
app.listen(PORT,HOST, async () => {
  try {
    await connectDB();
    console.log(`Server running on port http://${HOST} ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process with failure
  }
});
