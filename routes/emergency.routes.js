import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const EmergencyCase = () => mongoose.model("EmergencyCase");

router.get("/emergency/cases", authenticate, async (req, res) =>
  res.json(await EmergencyCase().find()),
);
router.post("/emergency/cases", authenticate, async (req, res) =>
  res.json(
    await EmergencyCase().create({
      ...req.body,
      timestamp: new Date().toLocaleString(),
    }),
  ),
);
router.patch("/emergency/cases/:id", authenticate, async (req, res) =>
  res.json(
    await EmergencyCase().findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.delete("/emergency/cases/:id", authenticate, async (req, res) =>
  res.json(await EmergencyCase().findByIdAndDelete(req.params.id)),
);

export default router;
