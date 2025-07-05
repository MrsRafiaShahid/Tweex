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

// const upload = multer({ dest: 'uploads/' });

//get post
router.get("/all", protectRoute, getPost);
//create post
router.post("/create", protectRoute, createPost);

//gwt follow post
router.get("/following", protectRoute, getFollowPost);

//get user post
router.get("/user/:username", protectRoute, getUserPost);
//delete post
router.delete("/:id", protectRoute, deletePost);
//update Post
router.put("/update/:id", protectRoute, updatePost);
//like/Unlike post
router.post("/like/:id", protectRoute, likeUnlikePost);
//get likes post
// router.get("/likes/:id", protectRoute, likePosts);
//comments on post
router.post("/comment/:postId", protectRoute, commentPost);
export default router;
