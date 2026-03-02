import express from "express";
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, checkEnrollment } from "../controllers/courseController.ts";
import { protect, admin } from "../middleware/auth.ts";
import upload from "../config/multerConfig.ts";

const router = express.Router();

const courseUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, admin, courseUpload, createCourse);
router.put("/:id", protect, admin, courseUpload, updateCourse);
router.delete("/:id", protect, admin, deleteCourse);
router.get("/:id/enrollment", protect, checkEnrollment);

export default router;
