import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/lab/tests", authenticate, async (req, res) =>
  res.json(await model("LabTest").find()),
);
router.get("/lab/samples", authenticate, async (req, res) =>
  res.json(await model("LabSample").find()),
);
router.patch("/lab/samples/:id/status", authenticate, async (req, res) =>
  res.json(
    await model("LabSample").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.get("/radiology/orders", authenticate, async (req, res) =>
  res.json(await model("RadiologyOrder").find()),
);
router.post("/radiology/orders", authenticate, async (req, res) =>
  res.json(
    await model("RadiologyOrder").create({
      ...req.body,
      requestDate: new Date().toLocaleDateString(),
      status: "Requested",
    }),
  ),
);
router.patch("/radiology/orders/:id/status", authenticate, async (req, res) =>
  res.json(
    await model("RadiologyOrder").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);

export default router;
