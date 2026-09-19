import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./models/index.js";
import { connectDatabase } from "./database/connect.js";
import authRoutes from "./routes/auth/auth.routes.js";
import dashboardRoutes from "./routes/dashboard/dashboard.routes.js";
import patientsRoutes from "./routes/patients/patients.routes.js";
import doctorsRoutes from "./routes/doctors/doctors.routes.js";
import appointmentsRoutes from "./routes/appointments/appointments.routes.js";
import departmentsRoutes from "./routes/departments/departments.routes.js";
import billingRoutes from "./routes/billing/billing.routes.js";
import pharmacyRoutes from "./routes/pharmacy/pharmacy.routes.js";
import insuranceRoutes from "./routes/insurance/insurance.routes.js";
import cmsRoutes from "./routes/cms/cms.routes.js";
import communicationsRoutes from "./routes/communications/communications.routes.js";
import analyticsRoutes from "./routes/analytics/analytics.routes.js";
import laboratoryRoutes from "./routes/laboratory/laboratory.routes.js";
import emergencyRoutes from "./routes/emergency/emergency.routes.js";
import settingsRoutes from "./routes/settings/settings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", patientsRoutes);
app.use("/api", doctorsRoutes);
app.use("/api", appointmentsRoutes);
app.use("/api", departmentsRoutes);
app.use("/api", billingRoutes);
app.use("/api", pharmacyRoutes);
app.use("/api", insuranceRoutes);
app.use("/api", cmsRoutes);
app.use("/api", communicationsRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", laboratoryRoutes);
app.use("/api", emergencyRoutes);
app.use("/api", settingsRoutes);

connectDatabase();

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Clinical API active on http://127.0.0.1:${PORT}`),
);
