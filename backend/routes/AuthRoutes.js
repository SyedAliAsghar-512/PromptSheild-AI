import express from "express";
import {
  register,
  login,
  logout,
  me,
} from "../controllers/AuthController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticatedUser, logout);
router.get("/me", isAuthenticatedUser, me);

export default router;
