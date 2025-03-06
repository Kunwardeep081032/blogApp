// user router

import express from "express";
import { getUserPosts } from "../controllers/post";
import { checkAuth, resendVerificationEmail, signin, signout, signup, verifyEmail } from "../controllers/user";
import { auth } from "../middlewares/auth";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.get("/auth/me", auth, checkAuth);
router.get("/auth/verify/:token", verifyEmail);
router.post("/auth/resend-verification", auth, resendVerificationEmail);
router.get("/user/posts", auth, getUserPosts);
router.post("/auth/signout", signout);

export default router;
