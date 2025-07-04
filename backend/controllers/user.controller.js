import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import { CustomError } from "../middleware/error.js";
//models
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comments.js";
import Story from "../models/Story.js";
import Notification from "../models/Notification.js";

//profile
const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username })
      .populate("followers", "username fullName profilePicture")
      .populate("following", "username fullName profilePicture")
      .select("-password");
    if (!user) throw new CustomError("User not found", 404);

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    const stories = await Story.find({ user: user._id }).sort({
      createdAt: -1,
    });
    const comments = await Comment.find({ user: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ user, posts, stories, comments });
  } catch (error) {
    next(error);
  }
};

//get user
const getUser = async (req, res, next) => {
  const { userID } = req.params;
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const { password, ...data } = user._doc;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
//update user
const updateUser = async (req, res, next) => {
  const { fullName, email, password, newPassword, bio } = req.body;
  let { profilePicture, coverPicture } = req.body;

  const userID = req.user._id;
  try {
    let user = await User.findById(userID);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if ((!newPassword && password) || (newPassword && !password)) {
      throw new CustomError("Password mismatch", 400);
    }
    if (newPassword && password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new CustomError("Invalid credentials", 401);
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
      if (!passwordRegex.test(newPassword)) {
        throw new CustomError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
          400
        );
      }
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
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
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
    // Check if the user is blocked
    if (
      currentUser.blockList.includes(userID) ||
      ModifyUser.blockList.includes(req.user._id)
    ) {
      return res.status(403).json({
        message:
          "You cannot follow a user you have blocked or who has blocked you",
      });
    }
    const isFollowing = currentUser.following.includes(userID);

    if (isFollowing) {
      // unfollow user
      ModifyUser = await User.findByIdAndUpdate(
        userID,
        { $pull: { followers: req.user._id } },
        { new: true }
      );
      currentUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: userID } },
        { new: true }
      );
    } else {
      // follow user
      currentUser.following.push(userID);
      ModifyUser.followers.push(req.user._id);
      //send notification to the user
      const newNotification = new Notification({
        from: req.user._id,
        to: userID,
        type: "follow",
      });
      await newNotification.save();
    }
    await currentUser.save();
    await ModifyUser.save();
    //TODO: return the id of the user as a response
    res.status(200).json({
      message: isFollowing
        ? "User unfollowed successfully"
        : "User followed successfully",
    });
  } catch (error) {
    next(error);
  }
};
//Block/unblock the user
const blockUnblockUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const blockUser = await User.findById(userID);
    const currentUser = await User.findById(req.user._id);
    if (userID === req.user._id.toString())
      throw new CustomError("You cannot block/unblock yourself", 400);
    if (!blockUser || !currentUser)
      throw new CustomError("User not found", 404);
    const isBlocked = currentUser.blockList.includes(userID);

    if (isBlocked) {
      // unblock user
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { blockList: userID } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userID,
        { $pull: { followers: req.user._id } },
        { new: true }
      );
    } else {
      // block user
      currentUser.blockList.push(userID);
      blockUser.followers = blockUser.followers.filter(
        (follow) => follow.toString() !== req.user._id
      );
      blockUser.following = blockUser.following.filter(
        (follow) => follow.toString() !== req.user._id
      );
    }
    await currentUser.save();
    await blockUser.save();
    res.status(200).json({
      message: isBlocked
        ? "User unblocked successfully"
        : "User blocked successfully",
    });
  } catch (error) {
    next(error);
  }
};

//get blockList
const blockList = async (req, res, next) => {
  const { userID } = req.params;
  try {
    const user = await User.findById(userID)
      .populate("blockList", "username fullName profilePicture")
      .select("blockList");
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const { blockList, ...data } = user;

    res.status(200).json(blockList);
  } catch (error) {
    next(error);
  }
};

//delete user
const deleteUser = async (req, res, next) => {
  const { userID } = req.params;
  try {
    const user = await User.findByIdAndDelete(userID);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    await Post.deleteMany({ user: userID });
    await Post.deleteMany({ "comments.user": userID });
    await Post.deleteMany({ "comments.replies.user": userID });
    await Comment.deleteMany({ user: userID });
    // await Reply.deleteMany({ user: userID });
    await User.updateMany(
      { _id: { $in: user.following } },
      { $pull: { followers: userID } }
    );
    await User.updateMany(
      { _id: { $in: user.followers } },
      { $pull: { following: userID } }
    );
    await Comment.updateMany(
      { "replies.user": userID },
      { $pull: { "replies.user": userID } }
    );
    await Comment.updateMany(
      { "likes.user": userID },
      { $pull: { likes: { user: userID } } }
    );
    await Comment.updateMany(
      { "replies.likes": userID },
      { $pull: { "replies.likes": { user: userID } } }
    );
    await Post.updateMany({}, { $pull: { likes: userID } });
    await User.updateMany(
      { "likes.user": userID },
      { $pull: { likes: { user: userID } } }
    );
    await User.updateMany(
      { "dislikes.user": userID },
      { $pull: { dislikes: { user: userID } } }
    );
    const replies = await Comment.find({ "replies.user": userID });
    await Promise.all(
      replies.map(async (reply) => {
        reply.replies = reply.replies.filter(
          (reply) => reply.user.toString() != userID
        );
        await reply.save();
      })
    );
    await user.deleteOne();
    await Story.deleteMany({ user: userID });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//search user
const searchUser = async (req, res, next) => {
  const { query } = req.params;
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: new RegExp(query, "i") } },
        { fullName: { $regex: new RegExp(query, "i") } },
      ],
    }).select("username fullName profilePicture");
    res.status(200).json(users);
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
export {
  getUserProfile,
  suggestedUsers,
  getUser,
  updateUser,
  followUnfollowUser,
  blockUnblockUser,
  blockList,
  deleteUser,
  searchUser,
};
