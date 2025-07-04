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
    await Notification.updateMany({ to: userId }, { read: true });
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

//delete one notification
// export const deleteOneNotification = async (req, res, next) => {
//   try {
//     const notifyId = req.params.id;
//     const userId = req.user._id;
//     const notification = await Notification.findByIdAndDelete(notifyId);

//     if (!notification) throw new CustomError("Notification not found", 404);
//     if (notification.to.toString() !== userId)
//       throw new CustomError("Unauthorized", 401);
//     else await notification.save();
//     res.status(200).json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
