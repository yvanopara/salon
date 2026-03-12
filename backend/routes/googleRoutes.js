// import express from "express";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import User from "../models/userModel.js";

// dotenv.config();

// googleRoute = express.Router();

// // Configuration de la stratégie Google OAuth
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Vérifie si l'utilisateur existe déjà dans la base de données
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // Si l'utilisateur n'existe pas, crée un nouvel utilisateur
//           user = new User({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             isActive: true
//           });
//           await user.save();
//         }

//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// // Route pour démarrer l'authentification Google
// googleRoute.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Callback après l'authentification Google
// googleRoute.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false, failureRedirect: "/login" }),
//   (req, res) => {
//     // Génération d'un JWT pour l'utilisateur
//     const token = jwt.sign(
//       { id: req.user._id, email: req.user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Rediriger vers le frontend avec le token en query
//     res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
//   }
// );

// export default googleRoute;
