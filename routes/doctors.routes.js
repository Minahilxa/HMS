import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const Doctor = () => mongoose.model("Doctor");

router.get("/doctors", authenticate, async (req, res) =>
  res.json(await Doctor().find()),
);
router.post("/doctors", authenticate, async (req, res) =>
  res.json(await Doctor().create(req.body)),
);
router.patch("/doctors/:id", authenticate, async (req, res) =>
  res.json(
    await Doctor().findByIdAndUpdate(req.params.id, req.body, { new: true }),
  ),
);
router.patch("/doctors/:id/status", authenticate, async (req, res) =>
  res.json(
    await Doctor().findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    ),
  ),
);
router.patch("/doctors/:id/cms", authenticate, async (req, res) =>
  res.json(
    await Doctor().findByIdAndUpdate(req.params.id, req.body, { new: true }),
  ),
);
router.get("/doctors/performance", authenticate, async (req, res) =>
  res.json(await mongoose.model("DoctorPerformance").find()),
);

export default router;
