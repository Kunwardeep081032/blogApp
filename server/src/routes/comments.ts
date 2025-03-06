// comments router

import express from "express";
import { createComment, getAllComments } from "../controllers/comments";
import { auth } from "../middlewares/auth";
const router = express.Router();

router.post("/:postId/comment", auth, createComment);
router.get("/:postId/comment", auth, getAllComments);

export default router;
