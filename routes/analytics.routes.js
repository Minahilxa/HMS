import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);

router.get("/revenue", authenticate, async (req, res) => {
  const invoices = await model("Invoice").find();
  res.json(
    invoices.map((invoice) => ({
      date: invoice.date,
      amount: invoice.total,
      category: invoice.category,
    })),
  );
});
router.get("/analytics/growth", authenticate, async (req, res) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  res.json(
    months.map((month) => ({
      month,
      newPatients: Math.floor(Math.random() * 50) + 20,
      discharges: Math.floor(Math.random() * 30) + 10,
    })),
  );
});
router.get("/analytics/access-history", authenticate, async (req, res) =>
  res.json(await model("AccessHistory").find()),
);
router.get("/analytics/reports", authenticate, async (req, res) =>
  res.json(await model("CustomReport").find()),
);
router.delete("/analytics/reports/:id", authenticate, async (req, res) =>
  res.json(await model("CustomReport").findByIdAndDelete(req.params.id)),
);

export default router;
