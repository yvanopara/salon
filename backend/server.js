import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { initSocket } from "./controllers/socket.js";

import passport from "passport";
import dotenv from "dotenv";
import googleRoute from "./middleweres/googleAuth.js";
import reservationRouter from "./routes/reservationRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import bannerRouter from "./routes/bannerRoutes.js";





const app = express();
app.use(express.json());
const server = http.createServer(app);
dotenv.config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);
// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // à sécuriser en production
    methods: ["GET", "POST"]
  }
});

// Connexion à la base de données
connectDB();

// 🚏 Routes API
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
// app.use("/api/product", userRouter);
app.use("/api/messages", messageRouter);
app.use(passport.initialize());
app.use("/auth", googleRoute);
app.use("/api/reservations", reservationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/banner", bannerRouter);
// app.use("/", googleRoute);


// Route test
app.get("/", (req, res) => {
  res.send("Serveur Express fonctionne !");
});

// Initialiser Socket.IO
initSocket(io);

// Lancer le serveur
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
