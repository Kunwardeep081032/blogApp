// posts router

import express from "express";
const router = express.Router();
import { createPost, deletePost, getPost, likePost, searchPosts, updatePost } from "../controllers/post";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

router.get("/search", searchPosts);
router.post("/", auth, upload.single("image"), createPost);
router.get("/:id", auth, getPost);
router.put("/:id", auth, upload.single("image"), updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:postId/like", auth, likePost);

export default router;
