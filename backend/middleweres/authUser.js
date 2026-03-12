import auth from "./auth.js";

const authUser = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé aux utilisateurs"
      });
    }
    next();
  });
};

export default authUser;
 