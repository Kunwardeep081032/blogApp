// Mongoose model for Post db


import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
});

postSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Add text indexes for searchable fields
postSchema.index({
  title: "text",
  content: "text",
  "author.username": "text",
  tags: "text",
});

export default mongoose.model("Post", postSchema);
