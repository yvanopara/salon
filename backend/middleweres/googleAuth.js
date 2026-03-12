import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const googleRoute = express.Router();

/* =====================
   GOOGLE OAUTH
===================== */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value
      };
      done(null, user);
    }
  )
);

// Lance l'auth Google
googleRoute.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback Google
googleRoute.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.googleId, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

/* =====================
   ROUTE PROTÉGÉE (TEST)
===================== */

googleRoute.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: "Accès autorisé ✅",
      user: decoded
    });
  } catch (err) {
    res.status(401).json({ message: "Token invalide ❌" });
  }
});

export default googleRoute;
