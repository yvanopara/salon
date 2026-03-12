import auth from "./auth.js";

const authAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé aux administrateurs"
      });
    }
    next();
  });
};

export default authAdmin;
