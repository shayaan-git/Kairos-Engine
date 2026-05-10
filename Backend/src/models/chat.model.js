import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model to associate chats with users
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
  },
  { timestamps: true },
);

// Create index for efficient user-based chat queries
chatSchema.index({ user: 1, createdAt: -1 });

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
