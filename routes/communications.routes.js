import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/communications/announcements", authenticate, async (req, res) =>
  res.json(await model("Announcement").find()),
);
router.post("/communications/announcements", authenticate, async (req, res) =>
  res.json(
    await model("Announcement").create({
      ...req.body,
      author: req.user.name || "Admin",
    }),
  ),
);
router.delete(
  "/communications/announcements/:id",
  authenticate,
  async (req, res) =>
    res.json(await model("Announcement").findByIdAndDelete(req.params.id)),
);
router.get("/communications/sms", authenticate, async (req, res) =>
  res.json(await model("SMSLog").find()),
);
router.post("/communications/sms", authenticate, async (req, res) =>
  res.json(
    await model("SMSLog").create({
      ...req.body,
      timestamp: new Date().toLocaleString(),
      status: "Sent",
    }),
  ),
);
router.get("/emails", authenticate, async (req, res) =>
  res.json(await model("EmailLog").find()),
);
router.post("/emails/send", authenticate, async (req, res) =>
  res.json(
    await model("EmailLog").create({
      ...req.body,
      timestamp: new Date().toLocaleString(),
      status: "Sent",
    }),
  ),
);

export default router;
