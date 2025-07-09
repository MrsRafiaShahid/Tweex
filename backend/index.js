import express from "express";

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
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // THIS IS CRUCIAL
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);
//routes for user and auth post
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
