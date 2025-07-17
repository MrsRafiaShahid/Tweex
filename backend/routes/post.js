import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost, 
  createPost,
  deletePost,
  getFollowPost,
  getPost,
  getReposts,
  getUserPost,
  likePosts,
  likeUnlikeComment,
  likeUnlikePost,
  repost,
  repostPost,
  updatePost,
} from "../controllers/post.controller.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});
//get post
router.get("/all", protectRoute, getPost);
//create post
router.post("/create", protectRoute,upload.single("image"), createPost);
//get follow post
router.get("/following", protectRoute, getFollowPost);
//get user post
router.get("/user/:username", protectRoute, getUserPost);
//delete post
router.delete("/:id", protectRoute, deletePost);
//update Post
router.put("/update/:id", protectRoute, updatePost);
//like/Unlike post
router.post("/like/:id", protectRoute, likeUnlikePost);
//like posts
router.get("/likes/:userId", protectRoute, likePosts);
//comments on post
router.post("/comment/:postId", protectRoute, commentPost);
//like/unlike comment
router.post("/:postId/comments/:commentId/like",protectRoute,likeUnlikeComment)
//repost
router.post("/repost/:postId",protectRoute,repost)
// repost post
router.post("/repostPost/:postId", protectRoute, repostPost);
// get reposts
router.get("/reposts",protectRoute,getReposts);
export default router;
