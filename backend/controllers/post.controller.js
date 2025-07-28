import { CustomError } from "../middleware/error.js";
import { v2 as cloudinary } from "cloudinary";
//models
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    let { image } = req.body; // for cloudinary file upload
    const userID = req.user._id.toString();
    const user = await User.findById(userID);
    if (!user) throw new CustomError("User not found", 404);
    if (!caption && !image) {
      throw new CustomError("Caption  or image is required", 400);
    }
    if (image) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(image);
        image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new CustomError("Image upload failed", 500);
      }
    }
    const newPost = new Post({ caption, user: userID, image });
    await newPost.save();
    user.posts.push(newPost._id);
    await user.save(); // Save the user to the database
    res.status(201).json({ message: "Post created sucessfully", newPost });
  } catch (error) {
    console.error("Error in createPost:", error);
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
    const posts = await Post.find()
      .populate("user", "-password")
      .populate("comments.user", "-password")
      .populate("repostedBy", "username profilePicture fullName")
      .populate({
        path: "originalPost",
        populate: [{
          path: "user",
          select: "username profilePicture fullName"
        }]
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
//comment post
export const commentPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    if (!comment) throw new CustomError("Comment is required", 400);
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
        post: postId,
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
//like/unlike comment
export const likeUnlikeComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId).populate(
      "comments.user",
      "username fullName profilePicture"
    ); // Add population
    if (!post) throw new CustomError("Post not found", 404);
    const comment = post.comments.id(commentId);
    if (!comment) throw new CustomError("Comment not found", 404);
    const userLike = comment.likes.includes(userId);
    if (userLike) {
      // unlike comment
      comment.likes.pull(userId);
    } else {
      // like comment
      comment.likes.push(userId);
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "commentLike",
        post: postId,
        comment: commentId,
      });
      await notification.save();
    }
    await post.save();
    const updatedComment = post.comments.id(commentId);
    res.status(200).json({
      message: userLike
        ? "Comment unliked successfully"
        : "Comment liked successfully",
      updatedComment: {
        _id: updatedComment._id,
        user: updatedComment.user, // Now includes user info
        comment: updatedComment.comment,
        likes: updatedComment.likes,
        createdAt: updatedComment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in likeUnlikeComment:", error);
    next(error);
  }
};
//repost
export const repost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) throw new CustomError("Post not found", 404);

    // Check if user already reposted
    const hasReposted = post.reposts.includes(userId);

    if (hasReposted) {
      // Remove repost
      await Post.findByIdAndUpdate(postId, {
        $pull: { reposts: userId },
      });
    } else {
      // Add repost
      await Post.findByIdAndUpdate(postId, {
        $push: { reposts: userId },
      });

      // Create notification
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "repost",
      });
      await notification.save();
    }

    const updatedPost = await Post.findById(postId);
    res.status(200).json({ reposts: updatedPost.reposts });
  } catch (error) {
    next(error);
  }
};
//repost post
export const repostPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const originalPost = await Post.findById(postId)
      .populate("user", "username profilePicture fullName")
      .lean();
      
    if (!originalPost) throw new CustomError("Post not found", 404);

    // Check if user has already reposted this
    const existingRepost = await Post.findOne({
      user: userId,
      originalPost: postId
    });

    if (existingRepost) {
      // Unrepost - delete the repost
      await Post.deleteOne({ _id: existingRepost._id });
      
      // Remove user from original post's reposts
      await Post.findByIdAndUpdate(postId, {
        $pull: { reposts: userId }
      });

      // Delete notification
      await Notification.deleteOne({
        from: userId,
        to: originalPost.user,
        type: "repost",
        post: existingRepost._id
      });

      return res.status(200).json({ 
        message: "Unreposted successfully",
        unrepostId: existingRepost._id 
      });
    }

    // Create new repost
    const repost = new Post({
      user: userId,
      originalPost: postId,
      repostedBy: userId,
      caption: originalPost.caption,
      image: originalPost.image,
      likes: [],
      comments: [],
      reposts: [],
    });

    await repost.save();

    // Add to original post's reposts
    await Post.findByIdAndUpdate(postId, {
      $push: { reposts: userId }
    });

    // Create notification
    const notification = new Notification({
      from: userId,
      to: originalPost.user,
      type: "repost",
      post: repost._id,
    });
    await notification.save();

const populatedRepost = await Post.findById(repost._id)
  .populate("user", "username profilePicture fullName") 
  .populate("repostedBy", "username profilePicture")
  .populate({
    path: "originalPost",
    populate: [{
      path: "user",
      select: "username profilePicture fullName"
    }]
  });

    res.status(201).json(populatedRepost);
  } catch (error) {
    next(error);
  }
};
//get reposts
export const getReposts = async (req, res, next) => {
  try {
    const reposts = await Post.find({ originalPost: { $ne: null } })
      .populate("user", "-password")
      .populate("originalPost")
      .populate("repostedBy", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(reposts);
  } catch (error) {
    next(error);
  }
};
//like posts
export const likePosts = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate("user", "-password")
      .populate("comments.user", "-password")
      .sort({ createdAt: -1 });
    if (likedPosts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(likedPosts);
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
    const followPosts = await Post.find({
      $or: [{ user: { $in: following } }, { repostedBy: { $in: following } }],
    })
      .populate("user", "-password")
      .populate("comments.user", "-password")
      .populate("repostedBy", "username profilePicture")
      .populate("originalPost")
      .sort({ createdAt: -1 });
    res.status(200).json(followPosts);
  } catch (error) {
    next(error);
  }
};
// user post
export const getUserPost = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new CustomError("User not found", 404);
    
    const posts = await Post.find({ user: user._id })
      .populate("user", "-password")
      .populate("comments.user", "-password")
      .populate({
        path: "originalPost",
        populate: {
          path: "user",
          select: "username profilePicture fullName"
        }
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};