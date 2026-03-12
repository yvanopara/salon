import mongoose from "mongoose";

const addonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    // 🎥📸 MEDIA ADDON (max 4 images + 1 video côté controller)
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Addon", addonSchema);
