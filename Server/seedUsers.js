// seedUser.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        email: "admin@gmail.com",
        password: await bcrypt.hash("123456", 10),
        role: "admin",
      },
      {
        name: "Manager User",
        email: "manager@gmail.com",
        password: await bcrypt.hash("123456", 10),
        role: "manager",
      },
      {
        name: "Staff User",
        email: "staff@gmail.com",
        password: await bcrypt.hash("123456", 10),
        role: "staff",
      },
    ];

    await User.insertMany(users);
    console.log("✅ Default users added successfully!");
    console.log(`
      ───────────────────────────────
      Admin:   admin@gmail.com / 123456
      Manager: manager@gmail.com / 123456
      Staff:   staff@gmail.com / 123456
      ───────────────────────────────
    `);
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedUsers();
