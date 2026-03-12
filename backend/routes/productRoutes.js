import express from "express";
import upload from "../middleweres/multer.js";
import {
  addProduct,
  addService,
  listProducts,
  toggleProductVisibility,
  deleteProduct,
  addAddon,
  listAddons,
  toggleAddonStatus,
  deleteAddon
} from "../controllers/productController.js";
import authAdmin from "../middleweres/authAdmin.js";

const productRouter = express.Router();

/* =====================================================
   🛍️ PRODUITS
===================================================== */

// ➕ Ajouter un PRODUIT (images + vidéo)
productRouter.post(
  "/products/add",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 8 }
  ]),
  authAdmin,
  addProduct
);

// 📃 Lister tous les produits
// (filtrable plus tard par ?itemType=product)
productRouter.get("/products", listProducts);

// 🔁 Public / Hidden
productRouter.patch(
  "/products/:id/visibility",
  authAdmin,
  toggleProductVisibility
);

// 🗑️ Supprimer un produit
productRouter.delete("/products/:id/delete",authAdmin, deleteProduct);

/* =====================================================
   ✂️ SERVICES
===================================================== */

// ➕ Ajouter un SERVICE
productRouter.post(
  "/services/add",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 8 }
  ]),
  authAdmin,
  addService
);

// (optionnel plus tard : list services séparément)

/* =====================================================
   ➕ ADDONS
===================================================== */

// ➕ Ajouter un addon
productRouter.post(
  "/addons/add",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 4 }
  ]),
  authAdmin,
  addAddon
);

// 📃 Lister tous les addons
productRouter.get("/addons",authAdmin, listAddons);

// 🔁 Activer / Désactiver addon
productRouter.patch("/addons/:id/toggle",authAdmin, toggleAddonStatus);

// 🗑️ Supprimer addon
productRouter.delete("/addons/:id/delete",authAdmin, deleteAddon);

export default productRouter;
