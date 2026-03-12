import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* =====================
       INFORMATIONS DE BASE
    ====================== */
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      lowercase: true
    },

    password: {
      type: String
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    phone: {
      type: String
    },

    /* =====================
       STATUT DU COMPTE
    ====================== */
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active"
    },

    /* =====================
       HISTORIQUE CONNEXION
    ====================== */
    lastLogin: {
      type: Date
    },

    loginCount: {
      type: Number,
      default: 0
    },

    /* =====================
       ADRESSE
    ====================== */
    address: {
      city: String,
      street: String,
      additionalInfo: String
    },

    /* =====================
       PANIER
    ====================== */
    cart: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "cart.itemType" // Permet de référencer Product ou Addon
        },
        itemType: {
          type: String,
          enum: ["product", "service", "addon"],
          required: true
        },
        quantity: {
          type: Number,
          default: 1
        },
        selectedAddons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Addon"
          }
        ],
        reservationDate: Date // utile uniquement pour les services
      }
    ],


    /* =====================
       COMMANDES
    ====================== */
    orders: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order"
        },

        products: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product"
            },
            quantity: Number,
            priceAtPurchase: Number
          }
        ],

        totalAmount: Number,

        status: {
          type: String,
          enum: ["pending", "paid", "cancelled", "delivered"],
          default: "pending"
        },

        orderedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    /* =====================
       COMMENTAIRES (POST-COMMANDE)
    ====================== */
    comments: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },

        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order"
        },

        rating: {
          type: Number,
          min: 1,
          max: 5
        },

        comment: String,

        commentedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    /* =====================
       WISHLIST / FAVORIS
    ====================== */
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    /* =====================
       STATISTIQUES UTILISATEUR
    ====================== */
    stats: {
      totalOrders: {
        type: Number,
        default: 0
      },

      totalSpent: {
        type: Number,
        default: 0
      },

      lastOrderDate: {
        type: Date
      }
    },

    /* =====================
       PROGRAMME DE FIDÉLITÉ
    ====================== */
    loyalty: {
      points: {
        type: Number,
        default: 0
      },

      level: {
        type: String,
        enum: ["bronze", "silver", "gold", "diamond", "platinum"],
        default: "bronze"
      }
    },

    /* =====================
       MESSAGERIE (USER → ADMIN)
    ====================== */
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ],
    reservationStats: {
      totalReservations: { type: Number, default: 0 },
      totalCancellations: { type: Number, default: 0 },
      completedReservations: { type: Number, default: 0 },
      isBlockedFromBooking: { type: Boolean, default: false },
      lastReservationDate: Date
    },

    /* =====================
       MÉTADONNÉES
    ====================== */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  },

);

export default mongoose.model("User", userSchema);
