import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    maxlength: 2200
  },
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    index: { expires: '24h' }
  }
}, { timestamps: true });

const Story = mongoose.model("Story", storySchema);

export default Story;