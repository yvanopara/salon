import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    /* =====================
       INFOS COMMUNES
    ====================== */
    name: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    itemType: {
      type: String,
      enum: ["service", "product"],
      required: true
    },

    serviceCategory: {
      type: String
    },

    productCategory: {
      type: String
    },

    prices: [
      {
        label: { type: String },
        value: { type: String },
        price: { type: Number, required: true }
      }
    ],

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

    /* =====================
       B — SERVICES
    ====================== */
    serviceDetails: {
      duration: {
        type: Number // minutes
      },
      isBookable: {
        type: Boolean,
        default: true
      }
    },

    /* =====================
       C — PRODUITS
    ====================== */
    productDetails: {
      stock: {
        type: Number
      },
      lowStockAlert: {
        type: Number
      }
    },

    /* =====================
       D — VISIBILITÉ
    ====================== */
   visibility: {
  type: String,
  enum: ["public", "hidden"],
  default: "public"
}

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
