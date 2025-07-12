import { CustomError } from "../middleware/error.js";
import Notification from "../models/Notification.js";

export const getNotification = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User not authenticated" });
    }
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId })
      .populate({
        path: "from",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    // Mark all notifications as read
    await Notification.updateMany(
      { to: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};
