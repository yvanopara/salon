import express from "express";
import authAdmin from "../middleweres/authAdmin.js";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  resetCancellationCounter,
  unblockUserBooking,
  getReservationStats,
  getMonthlyStats,
  getTopClients,
  getUsersByLoyaltyLevel,
  getTopServices
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// 🔐 toutes les routes admin protégées
adminRouter.use(authAdmin);

// 👥 utilisateurs
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/:id", getUserById);

// 🔴 statut compte
adminRouter.patch("/users/:id/status", updateUserStatus);

// 🔁 réservation
adminRouter.patch("/users/:id/reset-cancellations", resetCancellationCounter);
adminRouter.patch("/users/:id/unblock-booking", unblockUserBooking);

// 📊 stats & dashboard
adminRouter.get("/stats", getReservationStats);
adminRouter.get("/stats/monthly", getMonthlyStats);
adminRouter.get("/clients/top", getTopClients);
adminRouter.get("/clients/loyalty/:level", getUsersByLoyaltyLevel);
adminRouter.get("/services/top", getTopServices);

export default adminRouter;
