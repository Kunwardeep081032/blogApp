// Category controller only for admin routes

import type { Request, Response } from "express";
import { z } from "zod";
import { Category } from "../models";
import ApiError from "../utils/apiError";
import { handleControllerError } from "../utils/helper";
import { categorySchema } from "../validators";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = categorySchema.parse(req.body);

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = categorySchema.parse(req.body);

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, updatedAt: Date.now() },
      { new: true },
    );

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      handleControllerError(error, res);
    }
  }
};
