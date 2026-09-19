import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/pharmacy/inventory", authenticate, async (req, res) =>
  res.json(await model("PharmacyItem").find()),
);
router.post("/pharmacy/inventory", authenticate, async (req, res) =>
  res.json(await model("PharmacyItem").create(req.body)),
);
router.patch("/pharmacy/inventory/:id", authenticate, async (req, res) =>
  res.json(
    await model("PharmacyItem").findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }),
  ),
);
router.delete("/pharmacy/inventory/:id", authenticate, async (req, res) =>
  res.json(await model("PharmacyItem").findByIdAndDelete(req.params.id)),
);
router.get("/pharmacy/sales", authenticate, async (req, res) =>
  res.json(await model("PharmacySale").find()),
);
router.post("/pharmacy/sales", authenticate, async (req, res) =>
  res.json(await model("PharmacySale").create(req.body)),
);
router.get("/pharmacy/suppliers", authenticate, async (req, res) =>
  res.json(await model("PharmacySupplier").find()),
);
router.post("/pharmacy/suppliers", authenticate, async (req, res) =>
  res.json(await model("PharmacySupplier").create(req.body)),
);

export default router;
