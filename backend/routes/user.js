import express from "express";
import {
  getUserProfile,
  suggestedUsers,
  updateUser,
  followUnfollowUser,
} from "../controllers/user.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

//profile
router.get("/profile/:username", protectRoute, getUserProfile);
//suggested users
router.get("/suggested", protectRoute, suggestedUsers);
//Update the user
router.post("/update", protectRoute, updateUser);
//Follow/Unfollow User
router.post("/follow/:userID", protectRoute, followUnfollowUser);

// Export the router
export default router;
