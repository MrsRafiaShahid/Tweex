import express from "express"
import { protectRoute } from "../middleware/protectRoute"
import { createStory, deleteStory, getAllActiveStories, getFollowingStories, getUserStories, viewStory } from "../controllers/story.controller";

const router =express.Router()


//create story 
router.post("/",protectRoute,createStory)
//get following story
router.get("/following", protectRoute, getFollowingStories);
//view story
router.post("/view/:storyId", protectRoute, viewStory);
//delete story
router.delete("/:storyId", protectRoute, deleteStory);
// get all user story 
router.get("/", protectRoute, getAllActiveStories);
//get user stories
router.get("/user/:username", protectRoute, getUserStories);
export default router