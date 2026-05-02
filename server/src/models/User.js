import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"]
    },
    role: {
      type: String,
      enum: ["villager", "panchayat_member", "admin"],
      default: "panchayat_member",
      required: true
    },
    village: { type: String, required: true, trim: true, maxlength: 80 },
    password: { type: String, required: true, minlength: 8, select: false }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
