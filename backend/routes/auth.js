import express from "express";
import {
  login,
  logout,
  refetch,
  register,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const app = express();
const router = express.Router();
app.use(express.json());

//Register routes
router.post("/register", register);

//Logins routes

router.post("/login", login);

//Logout routes
router.post("/logout", logout);

// Fetch current user route
router.get("/me", protectRoute, refetch);

export default router;
