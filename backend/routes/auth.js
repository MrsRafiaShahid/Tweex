import express from "express";
import {
  login,
  logout,
  refetch,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const app = express();
const router = express.Router();
app.use(express.json());

// Fetch current user route
router.get("/me", protectRoute, refetch);

//Register routes
router.post("/signup", signup);

//Logins routes

router.post("/login", login);

//Logout routes
router.post("/logout", logout);

export default router;
