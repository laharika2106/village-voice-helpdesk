import "dotenv/config";
import { connectDb } from "../config/db.js";
import User from "../models/User.js";

async function main() {
  const required = ["ADMIN_NAME", "ADMIN_PHONE", "ADMIN_PASSWORD", "ADMIN_VILLAGE"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  await connectDb();

  const existing = await User.findOne({ phone: process.env.ADMIN_PHONE });
  if (existing) {
    throw new Error("A user with ADMIN_PHONE already exists");
  }

  await User.create({
    name: process.env.ADMIN_NAME,
    phone: process.env.ADMIN_PHONE,
    password: process.env.ADMIN_PASSWORD,
    village: process.env.ADMIN_VILLAGE,
    role: "admin"
  });

  console.log("Admin user created");
  process.exit(0);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
