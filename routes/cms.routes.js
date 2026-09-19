import express from "express";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const model = (name) => mongoose.model(name);
const crud = (path, name) => {
  router.get(path, authenticate, async (req, res) =>
    res.json(await model(name).find()),
  );
  router.post(path, authenticate, async (req, res) => {
    const data =
      name === "CMSBlog"
        ? { ...req.body, date: new Date().toLocaleDateString() }
        : req.body;
    res.json(await model(name).create(data));
  });
  router.patch(`${path}/:id`, authenticate, async (req, res) =>
    res.json(
      await model(name).findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }),
    ),
  );
  router.delete(`${path}/:id`, authenticate, async (req, res) =>
    res.json(await model(name).findByIdAndDelete(req.params.id)),
  );
};

crud("/cms/pages", "CMSPage");
crud("/cms/blogs", "CMSBlog");
crud("/cms/sliders", "CMSSlider");
crud("/cms/seo", "CMSSEO");

export default router;
