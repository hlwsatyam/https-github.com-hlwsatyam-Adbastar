import express from "express";
import { getSettings } from "../controllers/adminController.ts";

const router = express.Router();

router.get("/settings", getSettings);

export default router;
