import express from "express";
import { getStudents, createStudent, deleteStudent, toggleBlockStudent, getDashboardStats } from "../controllers/adminController.ts";
import { protect, admin } from "../middleware/auth.ts";

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/students", getStudents);
router.post("/students", createStudent);
router.delete("/students/:id", deleteStudent);
router.patch("/students/:id/block", toggleBlockStudent);
router.get("/stats", getDashboardStats);

export default router;
