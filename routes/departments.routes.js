import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/departments", authenticate, async (req, res) =>
  res.json(await model("Department").find()),
);
router.post("/departments", authenticate, async (req, res) =>
  res.json(await model("Department").create(req.body)),
);
router.patch("/departments/:id", authenticate, async (req, res) =>
  res.json(
    await model("Department").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.get("/services", authenticate, async (req, res) =>
  res.json(await model("Service").find()),
);
router.post("/services", authenticate, async (req, res) =>
  res.json(await model("Service").create(req.body)),
);
router.patch("/services/:id", authenticate, async (req, res) =>
  res.json(
    await model("Service").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.delete("/services/:id", authenticate, async (req, res) =>
  res.json(await model("Service").findByIdAndDelete(req.params.id)),
);

export default router;
