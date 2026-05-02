import { body, param, query } from "express-validator";
import { nanoid } from "nanoid";
import Complaint, { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from "../models/Complaint.js";
import User from "../models/User.js";
import { translateToEnglish } from "../services/translateService.js";

export const createComplaintValidation = [
  body("villagerName").trim().isLength({ min: 2, max: 80 }).withMessage("Name is required"),
  body("phone").trim().matches(/^[0-9+\-\s()]{7,20}$/).withMessage("Enter a valid phone number"),
  body("village").trim().isLength({ min: 2, max: 80 }).withMessage("Village name is required"),
  body("ward").trim().isLength({ min: 1, max: 20 }).withMessage("Ward number is required"),
  body("category").isIn(COMPLAINT_CATEGORIES).withMessage("Choose a valid category"),
  body("originalText").trim().isLength({ min: 5, max: 5000 }).withMessage("Problem description is required"),
  body("translatedEnglishText").optional().trim().isLength({ max: 5000 }),
  body("address").trim().isLength({ min: 3, max: 300 }).withMessage("Address is required")
];

export const translateValidation = [
  body("text").trim().isLength({ min: 1, max: 5000 }).withMessage("Text is required")
];

export const trackValidation = [
  param("complaintId").trim().isLength({ min: 6, max: 30 }).withMessage("Enter a valid complaint ID")
];

export const listValidation = [
  query("village").optional().trim().isLength({ max: 80 }),
  query("ward").optional().trim().isLength({ max: 20 }),
  query("category").optional().isIn(COMPLAINT_CATEGORIES),
  query("status").optional().isIn(COMPLAINT_STATUSES)
];

export const updateComplaintValidation = [
  param("id").isMongoId().withMessage("Invalid complaint id"),
  body("status").optional().isIn(COMPLAINT_STATUSES).withMessage("Invalid status"),
  body("adminResponse").optional().trim().isLength({ max: 1000 }),
  body("assignedTo").optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage("Invalid assignee"),
  body("message").optional().trim().isLength({ max: 1000 })
];

export async function translateComplaintText(req, res, next) {
  try {
    const translatedEnglishText = await translateToEnglish(req.body.text);
    res.json({ translatedEnglishText });
  } catch (error) {
    next(error);
  }
}

export async function createComplaint(req, res, next) {
  try {
    const translatedEnglishText =
      req.body.translatedEnglishText || (await translateToEnglish(req.body.originalText));

    const complaint = await Complaint.create({
      complaintId: `VVH-${nanoid(10).toUpperCase()}`,
      villagerName: req.body.villagerName,
      phone: req.body.phone,
      village: req.body.village,
      ward: req.body.ward,
      category: req.body.category,
      originalText: req.body.originalText,
      translatedEnglishText,
      address: req.body.address,
      image: req.file
        ? {
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
          }
        : undefined
    });

    res.status(201).json({ complaint });
  } catch (error) {
    next(error);
  }
}

export async function trackComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId })
      .populate("assignedTo", "name phone village role")
      .lean();

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });
  } catch (error) {
    next(error);
  }
}

export async function listComplaints(req, res, next) {
  try {
    const filter = {};
    for (const key of ["village", "ward", "category", "status"]) {
      if (req.query[key]) filter[key] = req.query[key];
    }

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name phone village role")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ complaints });
  } catch (error) {
    next(error);
  }
}

export async function getComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("assignedTo", "name phone village role")
      .populate("updates.updatedBy", "name role")
      .lean();

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });
  } catch (error) {
    next(error);
  }
}

export async function updateComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.body.assignedTo) {
      const assignee = await User.findOne({
        _id: req.body.assignedTo,
        role: { $in: ["panchayat_member", "admin"] }
      });
      if (!assignee) {
        return res.status(422).json({ message: "Selected Panchayat member was not found" });
      }
      complaint.assignedTo = assignee._id;
    } else if (req.body.assignedTo === null || req.body.assignedTo === "") {
      complaint.assignedTo = null;
    }

    if (req.body.status) complaint.status = req.body.status;
    if (typeof req.body.adminResponse === "string") complaint.adminResponse = req.body.adminResponse;

    complaint.updates.push({
      status: complaint.status,
      message: req.body.message || req.body.adminResponse || "",
      updatedBy: req.user._id,
      updatedByName: req.user.name
    });

    await complaint.save();
    await complaint.populate("assignedTo", "name phone village role");

    res.json({ complaint });
  } catch (error) {
    next(error);
  }
}

export async function listStaff(req, res, next) {
  try {
    const users = await User.find({ role: { $in: ["panchayat_member", "admin"] } })
      .select("name phone village role")
      .sort({ name: 1 })
      .lean();
    res.json({ users });
  } catch (error) {
    next(error);
  }
}
