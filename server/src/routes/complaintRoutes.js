import express from "express";
import {
  createComplaint,
  createComplaintValidation,
  getComplaint,
  listComplaints,
  listStaff,
  listValidation,
  trackComplaint,
  trackValidation,
  translateComplaintText,
  translateValidation,
  updateComplaint,
  updateComplaintValidation
} from "../controllers/complaintController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { uploadComplaintImage } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/translate", translateValidation, validate, translateComplaintText);
router.post("/", uploadComplaintImage.single("image"), createComplaintValidation, validate, createComplaint);
router.get("/track/:complaintId", trackValidation, validate, trackComplaint);

router.use(protect, restrictTo("panchayat_member", "admin"));
router.get("/", listValidation, validate, listComplaints);
router.get("/staff", listStaff);
router.get("/:id", getComplaint);
router.patch("/:id", updateComplaintValidation, validate, updateComplaint);

export default router;
