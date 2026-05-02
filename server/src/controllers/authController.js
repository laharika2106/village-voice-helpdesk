import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/User.js";

export const loginValidation = [
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

export async function login(req, res, next) {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid phone number or password" });
    }

    if (!["panchayat_member", "admin"].includes(user.role)) {
      return res.status(403).json({ message: "Only Panchayat staff can access the dashboard" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token: signToken(user), user: userResponse });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: req.user });
}
