import User from "../models/User.js";
import bcrypt from "bcrypt";
import { CustomError } from "../middleware/error.js";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";

const signup = async (req, res, next) => {
  try {
    const { email, password, username, fullName } = req.body;
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
    if (password.length < 8) {
      throw new CustomError("Password must be at least 8 characters", 400);
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

      // await newUser.save();
      // res.status(201).json({
      //   _id: newUser._id,
      //   fullName: newUser.fullName,
      //   username: newUser.username,
      //   email: newUser.email,
      //   followers: newUser.followers,
      //   following: newUser.following,
      //   profileImg: newUser.profileImg,
      //   coverImg: newUser.coverImg,
      // });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Find user by email or username
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    // Generate token
    generateTokenAndSetCookie(user._id, res);
    // Remove password from user object before sending response
    user.password = undefined; // or use .select("-password") in the query
    // Send response
    res.status(200).json({ message: "user login succesfully", user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const refetch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in refetch controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

export { signup, login, logout, refetch };
