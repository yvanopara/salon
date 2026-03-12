import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel' // référence polymorphe : user ou admin
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["User", "Admin"] // définit si c'est un User ou Admin
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel' // référence polymorphe
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ["User", "Admin"]
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
