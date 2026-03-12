import express from "express";
import { getMessages, markAsRead } from "../controllers/messageController.js"; // plus sendMessage

const router = express.Router();

// Récupérer l'historique des messages
router.get("/history/:userId/:adminId", getMessages);

// Marquer un message comme lu
router.put("/read/:messageId", markAsRead);

export default router;
