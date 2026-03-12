import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    /* =====================
       IDENTITÉ ADMIN
    ====================== */
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    /* =====================
       PRODUITS GÉRÉS
    ====================== */
    managedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    /* =====================
       MESSAGERIE (ADMIN ↔ USER)
    ====================== */
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ],

    /* =====================
       SÉCURITÉ & STATUT
    ====================== */
    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date
    },

    loginCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Admin", adminSchema);
