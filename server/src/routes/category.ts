// catrgory router

import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category";
import { auth, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.post("/", auth, isAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", auth, isAdmin, updateCategory);
router.delete("/:id", auth, isAdmin, deleteCategory);

export default router;
