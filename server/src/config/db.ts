// db connection config

import mongoose from "mongoose";

export const dbconnect = async () => {
  try {
    //TODO: idk why but DATABASE_URL is the real db url not the in-memory one
    await mongoose.connect(process.env.DATABASE_URL!);
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};
