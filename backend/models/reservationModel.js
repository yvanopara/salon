import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    /* =====================
       SERVICE
    ====================== */
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    priceOption: {
      label: String,
      value: String,
      price: Number
    },

    addons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addon"
      }
    ],

    /* =====================
       CLIENT
    ====================== */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    guestInfo: {
      name: String,
      phone: String,
      email: String
    },

    /* =====================
       DATE & HEURE
    ====================== */
    reservationDate: {
      type: Date,
      required: true
    },

    /* =====================
       CONTENU CLIENT
    ====================== */
    comment: String,

    styleImage: {
      type: String // Cloudinary URL
    },

    /* =====================
       STATUT
    ====================== */
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed"],
      default: "pending"
    },

    cancelledAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
