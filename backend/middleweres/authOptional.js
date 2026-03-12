import jwt from "jsonwebtoken";

const authOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 👉 Pas de token = invité
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
      
    };
console.log("TOKEN DECODED:", decoded);

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export default authOptional;
