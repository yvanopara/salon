import Product from "../models/productModel.js";
import Addon from "../models/addonModel.js";
import cloudinary from "../config/cloudinary.js";

/* =====================================================
   ➕ AJOUTER UN PRODUIT (PHYSIQUE)
===================================================== */
export const addProduct = async (req, res) => {
  try {
    const { name, description, productCategory, prices } = req.body;

    if (!name || !productCategory) {
      return res.status(400).json({
        message: "Nom et catégorie produit obligatoires"
      });
    }

    // ---------- PRICES ----------
    let parsedPrices;
    try {
      parsedPrices = JSON.parse(prices);
      if (!Array.isArray(parsedPrices) || parsedPrices.length === 0) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        message: "Prices invalides (JSON attendu)"
      });
    }

    // ---------- MEDIA ----------
    const files = req.files;
    if (!files || (!files.images && !files.video)) {
      return res.status(400).json({
        message: "Au moins une image ou une vidéo requise"
      });
    }

    const media = [];

    // 📸 Images
    if (files.images) {
      const uploadedImages = await Promise.all(
        files.images.map(file =>
          cloudinary.uploader
            .upload(file.path, { folder: "salon/products" })
            .then(result => ({
              type: "image",
              url: result.secure_url
            }))
        )
      );
      media.push(...uploadedImages);
    }

    // 🎥 Vidéo
    if (files.video) {
      const uploadedVideo = await cloudinary.uploader.upload(
        files.video[0].path,
        {
          folder: "salon/products",
          resource_type: "video"
        }
      );

      media.push({
        type: "video",
        url: uploadedVideo.secure_url
      });
    }

    // ---------- CREATE PRODUCT ----------
    const product = await Product.create({
      name,
      description,
      itemType: "product",
      productCategory,
      prices: parsedPrices,
      media,
      productDetails: {
        stock: 0,
        lowStockAlert: 5
      }
    });

    res.status(201).json({
      success: true,
      message: "Produit ajouté avec succès",
      product
    });

  } catch (error) {
    console.error("Erreur addProduct:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   ➕ AJOUTER UN SERVICE
===================================================== */
export const addService = async (req, res) => {
  try {
    const { name, description, serviceCategory, duration, prices } = req.body;

    if (!name || !serviceCategory || !duration) {
      return res.status(400).json({
        message: "Nom, catégorie et durée obligatoires"
      });
    }

    let parsedPrices;
    try {
      parsedPrices = JSON.parse(prices);
    } catch {
      return res.status(400).json({
        message: "Prices invalides (JSON attendu)"
      });
    }

    const files = req.files;
    if (!files || (!files.images && !files.video)) {
      return res.status(400).json({
        message: "Image ou vidéo requise"
      });
    }

    const media = [];

    if (files.images) {
      const uploadedImages = await Promise.all(
        files.images.map(file =>
          cloudinary.uploader
            .upload(file.path, { folder: "salon/services" })
            .then(result => ({
              type: "image",
              url: result.secure_url
            }))
        )
      );
      media.push(...uploadedImages);
    }

    if (files.video) {
      const uploadedVideo = await cloudinary.uploader.upload(
        files.video[0].path,
        {
          folder: "salon/services",
          resource_type: "video"
        }
      );

      media.push({
        type: "video",
        url: uploadedVideo.secure_url
      });
    }

    const service = await Product.create({
      name,
      description,
      itemType: "service",
      serviceCategory,
      prices: parsedPrices,
      media,
      serviceDetails: {
        duration: Number(duration),
        isBookable: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Service ajouté avec succès",
      service
    });

  } catch (error) {
    console.error("Erreur addService:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   📃 LISTER TOUS LES ITEMS
===================================================== */
export const listProducts = async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    console.error("Erreur listProducts:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🔁 PUBLIC / HIDDEN
===================================================== */
export const toggleProductVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Élément introuvable" });
    }

    product.visibility =
      product.visibility === "public" ? "hidden" : "public";

    await product.save();

    res.json({
      success: true,
      message: `Visibilité changée en ${product.visibility}`,
      product
    });

  } catch (error) {
    console.error("Erreur toggleProductVisibility:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🗑️ SUPPRIMER PRODUIT / SERVICE
===================================================== */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Product.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Élément introuvable" });
    }

    res.json({
      success: true,
      message: "Suppression réussie"
    });

  } catch (error) {
    console.error("Erreur deleteProduct:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   ➕ AJOUTER UN ADDON
===================================================== */
export const addAddon = async (req, res) => {
  try {
    const { name, price } = req.body;
    const files = req.files;

    if (!name || isNaN(price)) {
      return res.status(400).json({ message: "Nom et prix requis" });
    }

    if (!files || (!files.images && !files.video)) {
      return res.status(400).json({
        message: "Image ou vidéo requise"
      });
    }

    const media = [];

    if (files.images) {
      const uploadedImages = await Promise.all(
        files.images.map(file =>
          cloudinary.uploader
            .upload(file.path, { folder: "salon/addons" })
            .then(result => ({
              type: "image",
              url: result.secure_url
            }))
        )
      );
      media.push(...uploadedImages);
    }

    if (files.video) {
      const uploadedVideo = await cloudinary.uploader.upload(
        files.video[0].path,
        {
          folder: "salon/addons",
          resource_type: "video"
        }
      );

      media.push({
        type: "video",
        url: uploadedVideo.secure_url
      });
    }

    const addon = await Addon.create({
      name,
      price: Number(price),
      media
    });

    res.status(201).json({
      success: true,
      message: "Addon ajouté avec succès",
      addon
    });

  } catch (error) {
    console.error("Erreur addAddon:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   📃 LISTER ADDONS
===================================================== */
export const listAddons = async (req, res) => {
  try {
    const addons = await Addon.find().sort({ createdAt: -1 });
    res.json({ success: true, addons });
  } catch (error) {
    console.error("Erreur listAddons:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🔁 ACTIVER / DÉSACTIVER ADDON
===================================================== */
export const toggleAddonStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const addon = await Addon.findById(id);
    if (!addon) {
      return res.status(404).json({ message: "Addon introuvable" });
    }

    addon.isActive = !addon.isActive;
    await addon.save();

    res.json({
      success: true,
      message: `Addon ${addon.isActive ? "activé" : "désactivé"}`,
      addon
    });

  } catch (error) {
    console.error("Erreur toggleAddonStatus:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🗑️ SUPPRIMER ADDON
===================================================== */
export const deleteAddon = async (req, res) => {
  try {
    const { id } = req.params;

    const addon = await Addon.findByIdAndDelete(id);
    if (!addon) {
      return res.status(404).json({ message: "Addon introuvable" });
    }

    res.json({
      success: true,
      message: "Addon supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur deleteAddon:", error);
    res.status(500).json({ success: false });
  }
};
