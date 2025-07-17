import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    const connect = await mongoose.connect(process.env.MONGODB_URI,{
      
    });
    console.log(`MongoDB connected : ${connect.connection.host}`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(`MongoDB connection error: ${error.message}`);
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
export default connectDB;
