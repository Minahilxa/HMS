import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/settings/hospital", authenticate, async (req, res) =>
  res.json(await model("Settings").findOne()),
);
router.patch("/settings/hospital", authenticate, async (req, res) =>
  res.json(
    await model("Settings").findOneAndUpdate({}, req.body, { new: true }),
  ),
);
router.get("/settings/emergency-numbers", authenticate, async (req, res) =>
  res.json(await model("EmergencyNumber").find()),
);
router.post("/settings/emergency-numbers", authenticate, async (req, res) =>
  res.json(await model("EmergencyNumber").create(req.body)),
);
router.patch(
  "/settings/emergency-numbers/:id",
  authenticate,
  async (req, res) =>
    res.json(
      await model("EmergencyNumber").findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      ),
    ),
);
router.delete(
  "/settings/emergency-numbers/:id",
  authenticate,
  async (req, res) =>
    res.json(await model("EmergencyNumber").findByIdAndDelete(req.params.id)),
);
router.get("/settings/payments", authenticate, async (req, res) =>
  res.json(await model("PaymentGateway").find()),
);
router.post("/settings/payments", authenticate, async (req, res) =>
  res.json(await model("PaymentGateway").create(req.body)),
);
router.patch("/settings/payments/:id", authenticate, async (req, res) =>
  res.json(
    await model("PaymentGateway").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.delete("/settings/payments/:id", authenticate, async (req, res) =>
  res.json(await model("PaymentGateway").findByIdAndDelete(req.params.id)),
);
router.get("/settings/backups", authenticate, async (req, res) =>
  res.json(await model("BackupLog").find()),
);
router.post("/settings/backups/run", authenticate, async (req, res) =>
  res.json(
    await model("BackupLog").create({
      timestamp: new Date().toLocaleString(),
      size: "42MB",
      status: "Success",
      type: "Manual",
    }),
  ),
);
router.delete("/settings/backups/:id", authenticate, async (req, res) =>
  res.json(await model("BackupLog").findByIdAndDelete(req.params.id)),
);
router.get("/settings/security", authenticate, async (req, res) =>
  res.json(await model("SecuritySetting").find()),
);
router.post("/settings/security", authenticate, async (req, res) =>
  res.json(await model("SecuritySetting").create(req.body)),
);
router.patch("/settings/security/:id", authenticate, async (req, res) =>
  res.json(
    await model("SecuritySetting").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.patch(
  "/settings/security/:id/toggle",
  authenticate,
  async (req, res) => {
    const setting = await model("SecuritySetting").findById(req.params.id);
    setting.isEnabled = !setting.isEnabled;
    await setting.save();
    res.json(setting);
  },
);
router.delete("/settings/security/:id", authenticate, async (req, res) =>
  res.json(await model("SecuritySetting").findByIdAndDelete(req.params.id)),
);

export default router;
