import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";


import {
  addBanner,
  listBanners,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
  reorderBanners
} from "../controllers/bannerController.js";

const bannerRouter = express.Router();

// ---------- MULTER CONFIG ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Seules les images (jpeg, jpg, png, webp) sont acceptées"));
  }
});

// ---------- ROUTES PUBLIQUES ----------
bannerRouter.get("/", listBanners);

// ---------- ROUTES ADMIN ----------
bannerRouter.post(
  "/add",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addBanner
);

bannerRouter.put(
  "/update/:id",

  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBanner
);

bannerRouter.patch("/toggle/:id", toggleBannerStatus);

bannerRouter.delete("/delete/:id", deleteBanner);

bannerRouter.put("/reorder", reorderBanners);

export default bannerRouter;