import mongoose from "mongoose";
import User from "./server/models/User.ts";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      await User.create({
        firstName: "Admin",
        lastName: "Lumina",
        email: "admin@lumina.com",
        password: "adminpassword123",
        role: "admin",
      });
      console.log("Admin user created: admin@lumina.com / adminpassword123");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
