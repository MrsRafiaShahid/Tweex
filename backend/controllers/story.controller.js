//create story

import { CustomError } from "../middleware/error";
import { v2 as cloudinary } from "cloudinary";
import Story from "../models/Story";
import User from "../models/User";

export const createStory = async (req, res, next) => {
  try {
    const { image, caption } = req.body;
    const userId = req.user._id;

    if (!image) {
      throw new CustomError("Image is required", 400);
    }
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image);

    const newStory = new Story({
      user: userId,
      image: uploadedImage.secure_url,
      caption,
    });

    await newStory.save();

    // Add story to user's stories array
    await User.findByIdAndUpdate(userId, {
      $push: { stories: newStory._id },
    });

    res.status(201).json(newStory);
  } catch (error) {
    next(error);
  }
};


// View a story (mark as viewed)
export const viewStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { viewers: userId } },
      { new: true }
    );

    if (!story) {
      throw new CustomError("Story not found", 404);
    }

    res.status(200).json(story);
  } catch (error) {
    next(error);
  }
};
// Delete a story
export const deleteStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findOne({ _id: storyId, user: userId });
    
    if (!story) {
      throw new CustomError("Story not found or unauthorized", 404);
    }

    // Delete from Cloudinary
    const publicId = story.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    await Story.deleteOne({ _id: storyId });
    
    // Remove story from user's stories array
    await User.findByIdAndUpdate(userId, {
      $pull: { stories: storyId }
    });

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get stories from users you follow
export const getFollowingStories = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get the current user's following list
    const user = await User.findById(userId).select("following");
    
    // Get stories from followed users created in last 24 hours
    const stories = await Story.find({
      user: { $in: user.following },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};
// Get all active stories (not just from followed users)
export const getAllActiveStories = async (req, res, next) => {
  try {
    // Get all stories created in last 24 hours
    const stories = await Story.find({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

// Get stories for a specific user
export const getUserStories = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    if (!user) throw new CustomError("User not found", 404);

    const stories = await Story.find({
      user: user._id,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};