// Mongoose model for Comment db


import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

commentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Comment", commentSchema);
