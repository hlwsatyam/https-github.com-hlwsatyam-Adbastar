import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
