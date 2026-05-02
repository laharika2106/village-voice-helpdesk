import express from "express";
import { login, loginValidation, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/login", loginValidation, validate, login);
router.get("/me", protect, me);

export default router;
