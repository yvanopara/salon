import Message from "../models/messageModel.js";

// Récupérer l'historique entre un User et un Admin
export const getMessages = async (req, res) => {
  try {
    const { userId, adminId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: adminId },
        { sender: adminId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de récupérer les messages", error });
  }
};

// Marquer un message comme lu
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Impossible de marquer le message comme lu", error });
  }
};
