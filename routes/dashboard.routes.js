import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";
import { getAggregatedStats } from "../utils/dashboardStats.js";

const router = express.Router();

router.get("/init-dashboard", authenticate, async (req, res) => {
  try {
    res.json(await getAggregatedStats());
  } catch (error) {
    res.status(500).json({ error: "Failed to aggregate dashboard data" });
  }
});

router.get("/stats", authenticate, async (req, res) => {
  try {
    const data = await getAggregatedStats();
    res.json(data.stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

router.get("/stats", authenticate, async (req, res) => {
  const Patient = mongoose.model("Patient");
  const Doctor = mongoose.model("Doctor");
  const EmergencyCase = mongoose.model("EmergencyCase");
  const Invoice = mongoose.model("Invoice");
  const [patients, doctors, emergencies, invoices] = await Promise.all([
    Patient.countDocuments(),
    Doctor.find(),
    EmergencyCase.countDocuments({ status: "Active" }),
    Invoice.find(),
  ]);
  res.json({
    dailyAppointments: 12,
    opdPatients: patients,
    ipdPatients: 5,
    emergencyCases: emergencies,
    totalRevenue: invoices.reduce((a, c) => a + c.total, 0),
    doctorsOnDuty: doctors.filter((d) => d.status === "On Duty").length,
  });
});

export default router;
