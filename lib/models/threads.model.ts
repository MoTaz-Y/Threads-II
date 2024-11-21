import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community", // Reference to the Community model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread", // Reference to the Thread model itself
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", ThreadSchema);

export default Thread;
