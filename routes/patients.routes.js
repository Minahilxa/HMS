import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const Patient = () => mongoose.model("Patient");

router.get("/patients", authenticate, async (req, res) =>
  res.json(await Patient().find()),
);
router.post("/patients", authenticate, async (req, res) =>
  res.json(await Patient().create(req.body)),
);
router.patch("/patients/:id", authenticate, async (req, res) =>
  res.json(
    await Patient().findByIdAndUpdate(req.params.id, req.body, { new: true }),
  ),
);
router.post("/patients/:id/ehr", authenticate, async (req, res) => {
  const patient = await Patient().findById(req.params.id);
  patient.medicalHistory.push({ ...req.body, id: Date.now().toString() });
  await patient.save();
  res.json(patient);
});
router.post("/patients/:id/prescriptions", authenticate, async (req, res) => {
  const patient = await Patient().findById(req.params.id);
  patient.prescriptions.push({ ...req.body, id: Date.now().toString() });
  await patient.save();
  res.json(patient);
});

export default router;
