import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost, 
  createPost,
  deletePost,
  getFollowPost,
  getPost,
  getUserPost,
  // likePosts,
  likeUnlikePost,
  updatePost,
} from "../controllers/post.controller.js";
const router = express.Router();

//get post
router.get("/all", protectRoute, getPost);
//create post
router.post("/create", protectRoute, createPost);
//get follow post
router.get("/following", protectRoute, getFollowPost);
//get user post
router.get("/user/:username", protectRoute, getUserPost);
//delete post
router.delete("/:id", protectRoute, deletePost);
//update Post
router.put("/update/:id", protectRoute, updatePost);
//like/Unlike post
router.post("/likes/:id", protectRoute, likeUnlikePost);
//comments on post
router.post("/comment/:postId", protectRoute, commentPost);
export default router;
