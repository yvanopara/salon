import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;