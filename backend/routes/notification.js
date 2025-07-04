import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotification,
  getNotification,
} from "../controllers/notify.controller.js";

const router = express.Router();

//get notification
router.get("/", protectRoute, getNotification);
//delete notification
router.delete("/", protectRoute, deleteNotification);
//delete one notification
// router.delete("/:id", protectRoute, deleteOneNotification);
export default router;
