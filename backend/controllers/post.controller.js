import { CustomError } from "../middleware/error.js";
import { v2 as cloudinary } from "cloudinary";
//models
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createPost = async (req, res, next) => {
  try {
    const { caption, image } = req.body;
    // let { image } = req.body; // for cloudinary file upload
    const userID = req.user._id.toString();
    const user = await User.findById(userID);
    if (!user) throw new CustomError("User not found", 404);
    if (!caption && !image)
      throw new CustomError("Caption  or image is required", 400);
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image); // No error handling
      image = uploadedImage.secure_url;
    }

    const newPost = new Post({ caption, user: userID, image });
    await newPost.save();
    user.posts.push(newPost._id);
    await user.save(); // Save the user to the database
    res.status(201).json({ message: "Post created sucessfully", newPost });
  } catch (error) {
    next(error);
  }
};
//delete post
export const deletePost = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) throw new CustomError("Post not found", 404);
    if (post.user.toString() !== req.user._id.toString())
      throw new CustomError("Unauthorized to delete this post", 403);
    if (post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(postID);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
//update Post
export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { caption, image } = req.body;
    const post = await Post.findById(id);
    if (!post) throw new CustomError("Post not found", 404);
    if (post.user.toString() !== req.user._id.toString())
      throw new CustomError("Unauthorized to update this post", 403);
    if (image && image !== post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
      const uploadedImage = await cloudinary.uploader.upload(image);
      post.image = uploadedImage.secure_url;
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { caption, image },
      { new: true }
    );
    await post.save();
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    next(error);
  }
};
//get post
export const getPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "username fullName profilePicture")
      .populate("comments.user", "username fullName profilePicture");
    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};
//comment post
export const commentPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const user = req.user._id;
    const post = await Post.findById(postId);
    if (!comment) throw new CustomError("Comment is required", 404);
    if (!post) throw new CustomError("Post not found", 404);
    const newComment = { user, comment };
    post.comments.push(newComment);
    await post.populate("comments.user", "username profilePicture");
    await post.save();
    res.status(200).json({
      message: "Comment created successfully",
      comment: newComment,
      post,
    });
  } catch (error) {
    next(error);
  }
};
//like/unlike Post
export const likeUnlikePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) throw new CustomError("Post not found", 404);
    const userLike = post.likes.includes(userId);
    if (userLike) {
      //unlike Post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      await Notification.deleteOne({
        from: userId,
        to: post.user,
        type: "like",
      });
      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      //like Post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        createdAt: new Date(),
      });
      await notification.save();
      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    next(error);
  }
};
//follow post
export const getFollowPost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    const following = user.following;
    const followPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(followPosts);
  } catch (error) {
    next(error);
  }
};
// user post
export const getUserPost = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new CustomError("User not found", 404);
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
