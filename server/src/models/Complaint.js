import mongoose from "mongoose";

export const COMPLAINT_CATEGORIES = [
  "Water problem",
  "Road problem",
  "Electricity problem",
  "Drainage problem",
  "Health issue",
  "Education issue",
  "Sanitation problem",
  "Government scheme issue",
  "Other"
];

export const COMPLAINT_STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

const complaintUpdateSchema = new mongoose.Schema(
  {
    status: { type: String, enum: COMPLAINT_STATUSES, required: true },
    message: { type: String, trim: true, maxlength: 1000 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedByName: { type: String, required: true }
  },
  { timestamps: true }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    villagerName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"]
    },
    village: { type: String, required: true, trim: true, maxlength: 80, index: true },
    ward: { type: String, required: true, trim: true, maxlength: 20, index: true },
    category: { type: String, enum: COMPLAINT_CATEGORIES, required: true, index: true },
    originalText: { type: String, required: true, trim: true, maxlength: 5000 },
    translatedEnglishText: { type: String, required: true, trim: true, maxlength: 5000 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    image: {
      url: { type: String },
      filename: { type: String },
      mimetype: { type: String },
      size: { type: Number }
    },
    status: { type: String, enum: COMPLAINT_STATUSES, default: "Pending", index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    adminResponse: { type: String, trim: true, maxlength: 1000, default: "" },
    updates: [complaintUpdateSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
