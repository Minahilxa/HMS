import { Settings, User } from "../models/index.js";

export const seed = async () => {
  if ((await User.countDocuments()) === 0) {
    await User.insertMany([
      {
        username: "admin",
        password: "password123",
        name: "Master Admin",
        role: "Super Admin",
        email: "abbasminahil1@gmail.com",
      },
      {
        username: "receptionist",
        password: "password123",
        name: "Alice Front",
        role: "Receptionist",
        email: "alice@healsync.com",
      },
      {
        username: "doctor",
        password: "password123",
        name: "Dr. Sarah Wilson",
        role: "Doctor",
        email: "sarah@healsync.com",
      },
      {
        username: "lab_tech",
        password: "password123",
        name: "Mark Tech",
        role: "Lab Technician",
        email: "mark@healsync.com",
      },
      {
        username: "radiologist",
        password: "password123",
        name: "Dr. Ray X",
        role: "Radiologist",
        email: "ray@healsync.com",
      },
      {
        username: "pharmacist",
        password: "password123",
        name: "Pharma Phil",
        role: "Pharmacist",
        email: "phil@healsync.com",
      },
    ]);
    console.log("👤 Seeded administrative roles");
  }

  if ((await Settings.countDocuments()) === 0) {
    await Settings.create({
      name: "HealSync General Hospital",
      tagline: "Excellence in Clinical Care",
    });
  }
};
