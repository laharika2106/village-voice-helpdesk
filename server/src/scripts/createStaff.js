import "dotenv/config";
import { connectDb } from "../config/db.js";
import User from "../models/User.js";

async function main() {
  const required = ["STAFF_NAME", "STAFF_PHONE", "STAFF_PASSWORD", "STAFF_VILLAGE"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  await connectDb();

  const existing = await User.findOne({ phone: process.env.STAFF_PHONE });
  if (existing) {
    throw new Error("A user with STAFF_PHONE already exists");
  }

  await User.create({
    name: process.env.STAFF_NAME,
    phone: process.env.STAFF_PHONE,
    password: process.env.STAFF_PASSWORD,
    village: process.env.STAFF_VILLAGE,
    role: process.env.STAFF_ROLE || "panchayat_member"
  });

  console.log("Staff user created");
  process.exit(0);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
