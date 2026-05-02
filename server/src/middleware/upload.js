import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

function imageOnly(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image uploads are allowed"));
  }
  cb(null, true);
}

export const uploadComplaintImage = multer({
  storage,
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024 }
});
