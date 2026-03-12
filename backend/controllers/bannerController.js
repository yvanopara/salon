import Banner from "../models/bannerModel.js";
import cloudinary from "../config/cloudinary.js";

const MAX_BANNERS = 6;

/* =====================================================
   ➕ AJOUTER UNE BANNIÈRE PUBLICITAIRE
===================================================== */
export const addBanner = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "La description est obligatoire"
      });
    }

    // ---------- LIMITE MAX 6 BANNIÈRES ----------
    const count = await Banner.countDocuments();
    if (count >= MAX_BANNERS) {
      return res.status(400).json({
        message: `Maximum ${MAX_BANNERS} images publicitaires autorisées`
      });
    }

    // ---------- IMAGE ----------
    const files = req.files;
    if (!files || !files.image || files.image.length === 0) {
      return res.status(400).json({
        message: "Une image est requise"
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(
      files.image[0].path,
      { folder: "salon/banners" }
    );

    // ---------- CREATE BANNER ----------
    const banner = await Banner.create({
      description,
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      },
      order: count
    });

    res.status(201).json({
      success: true,
      message: "Bannière ajoutée avec succès",
      banner
    });

  } catch (error) {
    console.error("Erreur addBanner:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   📃 LISTER TOUTES LES BANNIÈRES
===================================================== */
export const listBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, banners });
  } catch (error) {
    console.error("Erreur listBanners:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   ✏️ MODIFIER LA DESCRIPTION D'UNE BANNIÈRE
===================================================== */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Bannière introuvable" });
    }

    if (description) banner.description = description;

    // ---------- NOUVELLE IMAGE (optionnel) ----------
    const files = req.files;
    if (files && files.image && files.image.length > 0) {
      // Supprimer l'ancienne image sur Cloudinary
      await cloudinary.uploader.destroy(banner.image.publicId);

      const uploadedImage = await cloudinary.uploader.upload(
        files.image[0].path,
        { folder: "salon/banners" }
      );

      banner.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      };
    }

    await banner.save();

    res.json({
      success: true,
      message: "Bannière mise à jour avec succès",
      banner
    });

  } catch (error) {
    console.error("Erreur updateBanner:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🔁 ACTIVER / DÉSACTIVER UNE BANNIÈRE
===================================================== */
export const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Bannière introuvable" });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({
      success: true,
      message: `Bannière ${banner.isActive ? "activée" : "désactivée"}`,
      banner
    });

  } catch (error) {
    console.error("Erreur toggleBannerStatus:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🗑️ SUPPRIMER UNE BANNIÈRE
===================================================== */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Bannière introuvable" });
    }

    // Supprimer l'image sur Cloudinary
    await cloudinary.uploader.destroy(banner.image.publicId);

    await Banner.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Bannière supprimée avec succès"
    });

  } catch (error) {
    console.error("Erreur deleteBanner:", error);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   🔀 RÉORDONNER LES BANNIÈRES
===================================================== */
export const reorderBanners = async (req, res) => {
  try {
    // orderedIds: tableau d'IDs dans le nouvel ordre souhaité
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({
        message: "orderedIds (tableau d'IDs) requis"
      });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        Banner.findByIdAndUpdate(id, { order: index })
      )
    );

    res.json({
      success: true,
      message: "Ordre des bannières mis à jour"
    });

  } catch (error) {
    console.error("Erreur reorderBanners:", error);
    res.status(500).json({ success: false });
  }
};