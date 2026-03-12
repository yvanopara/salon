import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Addon from "../models/addonModel.js";

/* =====================================================
   ➕ AJOUTER UN ITEM AU PANIER
   itemType: "product" | "service" | "addon"
   selectedAddons: [AddonId] uniquement si itemType est service ou product
   quantity: nombre d'unités
   reservationDate: uniquement si service
===================================================== */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, itemType, quantity, selectedAddons = [], reservationDate } = req.body;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "ItemId et itemType requis" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier si l'item est déjà dans le panier
    const existingItemIndex = user.cart.findIndex(
      item => item.itemId.toString() === itemId && item.itemType === itemType
    );

    if (existingItemIndex !== -1) {
      // Si déjà présent, on met à jour la quantité et les addons
      user.cart[existingItemIndex].quantity += quantity ? Number(quantity) : 1;
      if (selectedAddons.length > 0) {
        user.cart[existingItemIndex].selectedAddons = selectedAddons;
      }
      if (reservationDate) {
        user.cart[existingItemIndex].reservationDate = reservationDate;
      }
    } else {
      // Ajouter nouvel item
      const newItem = {
        itemId,
        itemType,
        quantity: quantity ? Number(quantity) : 1,
        selectedAddons,
        reservationDate: reservationDate || undefined
      };
      user.cart.push(newItem);
    }

    await user.save();

    res.status(200).json({ success: true, message: "Item ajouté au panier", cart: user.cart });
  } catch (error) {
    console.error("Erreur addToCart:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🛒 LISTER LE PANIER COMPLET
   avec infos détaillées produit/service/addon + prix total
===================================================== */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "cart.itemId",
        model: "Product"
      })
      .populate({ 
        path: "cart.selectedAddons",
        model: "Addon"
      });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Calculer le total du panier
    let total = 0;
    const detailedCart = user.cart.map(item => {
      const price = item.itemId?.prices?.[0]?.price || 0; // prix de base du produit/service
      const addonsPrice = item.selectedAddons?.reduce((sum, addon) => sum + (addon.price || 0), 0) || 0;
      const itemTotal = (price + addonsPrice) * item.quantity;
      total += itemTotal;

      return {
        ...item.toObject(),
        itemId: item.itemId,
        selectedAddons: item.selectedAddons,
        itemTotal
      };
    });

    res.json({ success: true, cart: detailedCart, total });
  } catch (error) {
    console.error("Erreur getCart:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🔄 METTRE À JOUR LA QUANTITÉ D'UN ITEM
===================================================== */
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const item = user.cart.id(cartItemId);
    if (!item) return res.status(404).json({ message: "Item non trouvé dans le panier" });

    item.quantity = quantity ? Number(quantity) : item.quantity;

    await user.save();

    res.json({ success: true, message: "Quantité mise à jour", cart: user.cart });
  } catch (error) {
    console.error("Erreur updateCartItem:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🗑️ SUPPRIMER UN ITEM DU PANIER
===================================================== */
export const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    user.cart.id(cartItemId).remove();

    await user.save();

    res.json({ success: true, message: "Item retiré du panier", cart: user.cart });
  } catch (error) {
    console.error("Erreur removeCartItem:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   ✅ RÉSERVER / COMMANDER LE PANIER
   Ici on pourrait créer la commande + vider le panier
===================================================== */
export const checkoutCart = async (req, res) => {
  try {
    const { reservationDate } = req.body;

    const user = await User.findById(req.user.id)
      .populate("cart.itemId")
      .populate("cart.selectedAddons");

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // Ici tu peux créer la logique pour créer une commande
    // Pour l'instant on met juste la date de réservation sur les services
    user.cart.forEach(item => {
      if (item.itemType === "service") {
        item.reservationDate = reservationDate || item.reservationDate;
      }
    });

    await user.save();

    res.json({ success: true, message: "Réservation effectuée", cart: user.cart });
  } catch (error) {
    console.error("Erreur checkoutCart:", error);
    res.status(500).json({ success: false });
  }
};
