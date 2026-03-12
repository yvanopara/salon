import userModel from "../models/userModel.js";
import Reservation from "../models/reservationModel.js";

/* =====================================================
   👥 USERS MANAGEMENT (EXISTANT - INCHANGÉ)
===================================================== */

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur récupération utilisateurs"
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur récupération utilisateur"
    });
  }
};

export const updateUserStatus = async (req, res) => {
  const { status } = req.body;

  if (!["active", "suspended", "banned"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Statut invalide"
    });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { accountStatus: status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Statut utilisateur mis à jour",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur mise à jour statut"
    });
  }
};

export const resetCancellationCounter = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        "reservationStats.totalCancellations": 0,
        "reservationStats.isBlockedFromBooking": false
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Compteur d'annulations réinitialisé",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur reset annulations"
    });
  }
};

export const unblockUserBooking = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { "reservationStats.isBlockedFromBooking": false },
      { new: true }
    );

    res.json({
      success: true,
      message: "Utilisateur débloqué pour réservation",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur déblocage réservation"
    });
  }
};

/* =====================================================
   📊 STATS & DASHBOARD ADMIN (NOUVEAU)
===================================================== */

// 📅 Stats globales
export const getReservationStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayCount,
      weekCount,
      monthCount,
      cancelled,
      completed,
      total
    ] = await Promise.all([
      Reservation.countDocuments({ reservationDate: { $gte: today } }),
      Reservation.countDocuments({ reservationDate: { $gte: startOfWeek } }),
      Reservation.countDocuments({ reservationDate: { $gte: startOfMonth } }),
      Reservation.countDocuments({ status: "cancelled" }),
      Reservation.countDocuments({ status: "completed" }),
      Reservation.countDocuments()
    ]);

    const cancellationRate =
      total === 0 ? 0 : ((cancelled / total) * 100).toFixed(2);

    res.json({
      success: true,
      stats: {
        today: todayCount,
        week: weekCount,
        month: monthCount,
        completed,
        cancelled,
        cancellationRate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur stats réservations"
    });
  }
};

// 📈 Stats mensuelles (graphique)
export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$reservationDate" },
            month: { $month: "$reservationDate" }
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur stats mensuelles"
    });
  }
};

// 🏆 Clients fidèles
export const getTopClients = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .sort({ "reservationStats.completedReservations": -1 })
      .limit(10)
      .select("-password");

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur clients fidèles"
    });
  }
};

// 💎 Clients par niveau
export const getUsersByLoyaltyLevel = async (req, res) => {
  const { level } = req.params;

  try {
    const users = await userModel
      .find({ "loyalty.level": level })
      .select("-password");

    res.json({
      success: true,
      level,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur niveau fidélité"
    });
  }
};

// 🔥 Services les plus demandés
export const getTopServices = async (req, res) => {
  try {
    const services = await Reservation.aggregate([
      {
        $group: {
          _id: "$serviceId",
          totalReservations: { $sum: 1 }
        }
      },
      { $sort: { totalReservations: -1 } },
      { $limit: 5 }
    ]);

    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur services populaires"
    });
  }
};
