import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/insurance/panels", authenticate, async (req, res) =>
  res.json(await model("InsurancePanel").find()),
);
router.post("/insurance/panels", authenticate, async (req, res) =>
  res.json(await model("InsurancePanel").create(req.body)),
);
router.patch("/insurance/panels/:id", authenticate, async (req, res) =>
  res.json(
    await model("InsurancePanel").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.delete("/insurance/panels/:id", authenticate, async (req, res) =>
  res.json(await model("InsurancePanel").findByIdAndDelete(req.params.id)),
);
router.get("/insurance/claims", authenticate, async (req, res) =>
  res.json(await model("InsuranceClaim").find()),
);
router.patch("/insurance/claims/:id/status", authenticate, async (req, res) =>
  res.json(
    await model("InsuranceClaim").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.get("/insurance/coverage/:id", authenticate, async (req, res) =>
  res.json(await model("PatientCoverage").find({ patientId: req.params.id })),
);
router.post("/insurance/coverage", authenticate, async (req, res) =>
  res.json(await model("PatientCoverage").create(req.body)),
);

export default router;
