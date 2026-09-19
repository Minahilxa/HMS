import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const getSecret = () =>
  process.env.JWT_SECRET || "healsync_enterprise_secure_key_2024";

router.post("/auth/login", async (req, res) => {
  const User = mongoose.model("User");
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }).lean();
  if (user) {
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      getSecret(),
      { expiresIn: "12h" },
    );
    res.json({ user, token });
  } else res.status(401).json({ message: "Access Denied" });
});

router.get("/users", authenticate, async (req, res) =>
  res.json(await mongoose.model("User").find()),
);
router.patch("/users/:id/role", authenticate, async (req, res) =>
  res.json(
    await mongoose
      .model("User")
      .findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }),
  ),
);
router.post("/users/invite", authenticate, async (req, res) =>
  res.json({ message: "Invitation sent successfully." }),
);

export default router;
