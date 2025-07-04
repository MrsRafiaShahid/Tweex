import express from "express";
import {
  getUserProfile,
  suggestedUsers,
  getUser,
  updateUser,
  followUnfollowUser,
  blockUnblockUser,
  blockList,
  deleteUser,
  searchUser,
} from "../controllers/user.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

//profile 
router.get("/profile/:username",protectRoute,getUserProfile)
//suggested users
router.get("/suggested",protectRoute,suggestedUsers)
//get the User instance
router.get("/:userID",protectRoute, getUser);
//Update the user
router.post("/update",protectRoute, updateUser);
// router.put("/update/:userID",protectRoute, updateUser);
//Follow/Unfollow User
router.post("/follow/:userID",protectRoute, followUnfollowUser);
//Block/unblock User
router.post("/block/:userID",protectRoute, blockUnblockUser);
//Get blockList
router.get("/blocked/:userID",protectRoute, blockList);
//Delete the user
router.delete("/delete/:userID",protectRoute, deleteUser);

//Search User
router.get("/search/:query",protectRoute, searchUser);
export default router;
