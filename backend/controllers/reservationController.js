import Reservation from "../models/reservationModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

/* =====================================================
   ➕ CRÉER UNE RÉSERVATION
===================================================== */
export const createReservation = async (req, res) => {
    try {
        const {
            serviceId,
            reservationDate,
            priceOption,
            addons,
            comment,
            guestInfo
        } = req.body;

        // 1️⃣ vérifier service
        const service = await Product.findById(serviceId);
        if (!service || service.itemType !== "service") {
            return res.status(400).json({ message: "Service invalide" });
        }

        // 2️⃣ vérifier conflit horaire
        const conflict = await Reservation.findOne({
            reservationDate,
            status: "pending"
        });

        if (conflict) {
            return res.status(400).json({
                message: "Cette heure a déjà été réservée, veuillez modifier l'heure"
            });
        }

        // 3️⃣ vérifier blocage user
        let user = null;
        if (req.user) {
            user = await User.findById(req.user.id);
            if (user?.reservationStats.isBlockedFromBooking) {
                return res.status(403).json({
                    message: "Vous avez dépassé la limite d'annulations"
                });
            }
        }

        // 4️⃣ image style
        let styleImage = null;
        if (req.file) {
            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: "salon/reservations"
            });
            styleImage = uploaded.secure_url;
        }

        const reservation = await Reservation.create({
            serviceId,
            reservationDate,
            priceOption,          // ✅ PAS de JSON.parse
            addons: addons || [], // ✅ PAS de JSON.parse
            comment,
            styleImage,
            userId: user ? user._id : null,
            guestInfo: user ? null : guestInfo
        });

        // 6️⃣ stats user
        if (user) {
            user.reservationStats.totalReservations += 1;
            user.reservationStats.lastReservationDate = new Date();
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: "Réservation effectuée avec succès",
            reservation
        });

    } catch (error) {
        console.error("createReservation:", error);
        res.status(500).json({ success: false });
    }
};

/* =====================================================
   ❌ ANNULER RÉSERVATION
===================================================== */
export const cancelReservation = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Introuvable" });

    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    await reservation.save();

    if (reservation.userId) {
        const user = await User.findById(reservation.userId);
        user.reservationStats.totalCancellations += 1;

        if (user.reservationStats.totalCancellations >= 5) {
            user.reservationStats.isBlockedFromBooking = true;
        }

        await user.save();
    }

    res.json({ success: true, message: "Réservation annulée" });
};

/* =====================================================
   ✅ COMPLÉTER (ADMIN)
===================================================== */
export const completeReservation = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Introuvable" });

    reservation.status = "completed";
    reservation.completedAt = new Date();
    await reservation.save();

    if (reservation.userId) {
        const user = await User.findById(reservation.userId);
        user.reservationStats.completedReservations += 1;
        await user.save();
    }

    res.json({ success: true, message: "Réservation complétée" });
};

/* =====================================================
   📅 DATES OCCUPÉES (FRONTEND)
===================================================== */
export const getBookedSlots = async (req, res) => {
    const reservations = await Reservation.find({
        status: "pending"
    }).select("reservationDate");

    res.json(reservations.map(r => r.reservationDate));
};


