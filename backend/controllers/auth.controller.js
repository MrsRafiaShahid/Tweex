import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../middleware/error.js";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";

const register = async (req, res, next) => {
  try {
    const { email, password, username, fullName } = req.body;
    if (!email || !password || !username) {
      throw new CustomError("All fields are required", 400);
    }
    //validate username
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    if (!usernameRegex.test(username)) {
      throw new CustomError(
        "Username must be 3-16 characters long and can only contain letters, numbers, underscores, and hyphens",
        400
      );
    }
    //exist username or email
    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
      throw new CustomError("Username or email already exists", 400);
    }
    //validate email and password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new CustomError("Invalid email format", 400);
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
      throw new CustomError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        400
      );
      if (password.length < 8) {
        throw new CustomError("Password must be at least 8 characters long", 400);
      }
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      // save user to database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } else {
      throw new CustomError("User not saved", 500);
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    if (!req.body.email && !req.body.username) {
      throw new CustomError("Email or username is required", 400);
    }
    // Find user by email or username
    const { email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!user || !isMatch) {
      throw new CustomError("User not found or Invalid crendiatials", 404);
    }
    // Generate token
    generateTokenAndSetCookie(user._id, res);
    // Return user data
    res.status(200).json({ message: "user login succesfully", user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logged out successfully" });
  } catch (error) {
    next(error);
  }
}; 

const refetch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, refetch };
