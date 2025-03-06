// Mongoose model for User db


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  bio: {
    type: String,
    maxlength: [500, "Bio cannot be more than 500 characters"],
    default: "",
  },
  website: {
    type: String,
    trim: true,
    default: "",
  },
  socialLinks: {
    twitter: String,
    facebook: String,
    linkedin: String,
    github: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  emailVerificationToken: {
    type: String,
    default: undefined,
  },
  emailVerificationExpiry: {
    type: Date,
    default: undefined,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("User", userSchema);
