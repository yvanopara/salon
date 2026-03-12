import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";



// Création d'un token JWT avec id et role
const createToken = (id, role) => {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
    console.log(`Token créé pour ${role}, ID: ${id}`);
    return token;
};


/* ================= USER LOGIN ================= */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (password !== user.password) return res.json({ success: false, message: "Invalid credentials" });

        console.log("Utilisateur connecté, ID:", user._id);

        const token = createToken(user._id, "user"); // rôle inclus dans le token

        res.json({
            success: true,
            message: "Login successful",
            token,
            role: "user"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Login error" });
    }
};

/* ================= USER REGISTER ================= */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password)
            return res.json({ success: false, message: "All fields are required" });

        const exist = await userModel.findOne({ email });
        if (exist) return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email))
            return res.json({ success: false, message: "Invalid email" });

        if (password.length < 4)
            return res.json({ success: false, message: "Password must be at least 4 characters" });

        const newUser = new userModel({ name, email, password });
        const user = await newUser.save();

        console.log("Nouvel utilisateur enregistré, ID:", user._id);

        const token = createToken(user._id, "user"); // rôle inclus

        res.json({
            success: true,
            message: "User registered successfully",
            token,
            role: "user"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Registration failed" });
    }
};

/* ================= ADMIN LOGIN ================= */
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
            return res.json({ success: false, message: "All fields are required" });

        const admin = await adminModel.findOne({ email });
        if (!admin) return res.json({ success: false, message: "Admin not found" });

        if (password !== admin.password) return res.json({ success: false, message: "Invalid credentials" });

        console.log("Admin connecté, ID:", admin._id);

        const token = createToken(admin._id, "admin"); // rôle inclus dans le token

        res.json({
            success: true,
            message: "Admin login successful",
            token,
            role: "admin"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Admin login error" });
    }
};

/* ================= ADMIN REGISTER ================= */
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password)
            return res.json({ success: false, message: "All fields are required" });

        const exist = await adminModel.findOne({ email });
        if (exist) return res.json({ success: false, message: "Admin already exists" });

        if (!validator.isEmail(email))
            return res.json({ success: false, message: "Invalid email" });

        if (password.length < 4)
            return res.json({ success: false, message: "Password too short" });

        const admin = new adminModel({ name, email, password });
        await admin.save();

        console.log("Nouvel admin enregistré, ID:", admin._id);

        // 🔑 Génération du token
        const token = createToken(admin._id, "admin");

        res.json({
            success: true,
            message: "Admin registered successfully",
            token,         // ✅ Le token est renvoyé
            role: "admin"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Admin registration failed" });
    }
};

/* ================= EXPORTS ================= */
export {
    loginUser,
    registerUser,
    adminLogin,
    registerAdmin
};
