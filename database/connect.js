import mongoose from "mongoose";
import { seed } from "./seed.js";

export const connectDatabase = async () => {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healsync_testing";

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("✅ Connected to MongoDB");
    await seed();
  } catch (error) {
    console.warn("⚠️ Database connection issue.");
  }
};
