import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/appointments", authenticate, async (req, res) =>
  res.json(await model("Appointment").find()),
);
router.post("/appointments", authenticate, async (req, res) =>
  res.json(await model("Appointment").create(req.body)),
);
router.patch("/appointments/:id/status", authenticate, async (req, res) =>
  res.json(
    await model("Appointment").findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    ),
  ),
);
router.get("/slots", authenticate, async (req, res) =>
  res.json(await model("TimeSlot").find()),
);
router.post("/slots", authenticate, async (req, res) =>
  res.json(await model("TimeSlot").create(req.body)),
);
router.get("/leaves", authenticate, async (req, res) =>
  res.json(await model("LeaveRequest").find()),
);
router.patch("/leaves/:id/status", authenticate, async (req, res) =>
  res.json(
    await model("LeaveRequest").findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    ),
  ),
);

export default router;
