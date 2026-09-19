import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const Invoice = () => mongoose.model("Invoice");

router.get("/invoices", authenticate, async (req, res) =>
  res.json(await Invoice().find()),
);
router.post("/invoices", authenticate, async (req, res) => {
  const invoice = req.body;
  invoice.tax = invoice.amount * 0.1;
  invoice.total = invoice.amount + invoice.tax - (invoice.discount || 0);
  res.json(await Invoice().create(invoice));
});
router.patch("/invoices/:id", authenticate, async (req, res) =>
  res.json(
    await Invoice().findByIdAndUpdate(req.params.id, req.body, { new: true }),
  ),
);

export default router;
