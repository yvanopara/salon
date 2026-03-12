import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Nouvel utilisateur connecté:", socket.id);

    // Rejoindre une "room" spécifique (conversation)
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} a rejoint la room: ${roomId}`);
    });

    // Envoyer un message en temps réel
    socket.on("sendMessage", async ({ senderId, senderModel, receiverId, receiverModel, content }) => {
      try {
        // 1️⃣ Créer le message en DB
        const message = await Message.create({ sender: senderId, senderModel, receiver: receiverId, receiverModel, content });

        // 2️⃣ Ajouter le message aux tableaux messages
        if (senderModel === "User") {
          await User.findByIdAndUpdate(senderId, { $push: { messages: message._id } });
          await Admin.findByIdAndUpdate(receiverId, { $push: { messages: message._id } });
        } else {
          await Admin.findByIdAndUpdate(senderId, { $push: { messages: message._id } });
          await User.findByIdAndUpdate(receiverId, { $push: { messages: message._id } });
        }

        // 3️⃣ Envoyer le message à tous dans la room
        const roomId = [senderId, receiverId].sort().join("_"); // ID unique pour la conversation
        io.to(roomId).emit("receiveMessage", message);
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté:", socket.id);
    });
  });
};
