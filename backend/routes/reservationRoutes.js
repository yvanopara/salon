import express from "express";
import upload from "../middleweres/multer.js";
import auth from "../middleweres/auth.js";
import authAdmin from "../middleweres/authAdmin.js";

import {
  createReservation,
  cancelReservation,
  completeReservation,
  getBookedSlots
} from "../controllers/reservationController.js";
import authOptional from "../middleweres/authOptional.js";

const reservationRouter = express.Router();

// ➕ réserver (user OU invité)
reservationRouter.post(
  "/add",
  upload.single("styleImage"),
  authOptional,
  createReservation
);

// ❌ annuler
reservationRouter.patch("/:id/cancel", cancelReservation);

// ✅ compléter (admin)
reservationRouter.patch("/:id/complete", authAdmin, completeReservation);

// 📅 heures occupées
reservationRouter.get("/booked-slots", getBookedSlots);

export default reservationRouter;
