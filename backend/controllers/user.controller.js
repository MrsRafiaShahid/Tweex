import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import { CustomError } from "../middleware/error.js";
//models
import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

//profile
const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new CustomError("User not found", 404);
    res.status(200).json({ user, posts, stories, comments });
  } catch (error) {
    next(error);
  }
};
//update user
const updateUser = async (req, res, next) => {
  const { fullName, email, currentPassword, newPassword, bio, link } = req.body;
  let { profilePicture, coverPicture } = req.body;

  const userID = req.user._id;
  try {
    let user = await User.findById(userID);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      throw new CustomError("Password mismatch", 400);
    }
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) throw new CustomError("Invalid credentials", 401);

      if (newPassword.length < 8) {
        throw new CustomError("Password must be at least 8 characters", 400);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    if (profilePicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        );
      }
      const result = await cloudinary.uploader.upload(profilePicture);
      profilePicture = result.secure_url;
    }
    if (coverPicture) {
      if (user.coverPicture) {
        await cloudinary.uploader.destroy(
          user.coverPicture.split("/").pop().split(".")[0]
        );
      }
      const result = await cloudinary.uploader.upload(coverPicture);
      coverPicture = result.secure_url;
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profilePicture = profilePicture || user.profilePicture;
    user.coverPicture = coverPicture || user.coverPicture;
    user = await user.save();
    //password should be null
    user.password = null;
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};
//follow user
const followUnfollowUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    let ModifyUser = await User.findById(userID);
    let currentUser = await User.findById(req.user._id);
    if (userID === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }
    if (!ModifyUser || !currentUser)
      throw new CustomError("User not found", 404);
    const isFollowing = currentUser.following.includes(userID);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();
    }
    res.status(200).json({
      message: isFollowing
        ? "User unfollowed successfully"
        : "User followed successfully",
    });
  } catch (error) {
    next(error);
  }
};
//suggested user
const suggestedUsers = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const userFollowedByMe = await User.findById(userID).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userID },
        },
      },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    next(error);
  }
};
// Export the controller functions
export { getUserProfile, suggestedUsers, updateUser, followUnfollowUser };
