import express from "express";
import { 
  getStudents, 
  createStudent, 
  deleteStudent, 
  toggleBlockStudent, 
  getDashboardStats,
  getSettings,
  updateSettings,
  getEnrollmentRequests,
  approveEnrollmentRequest,
  rejectEnrollmentRequest
} from "../controllers/adminController.ts";
import { protect, admin } from "../middleware/auth.ts";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage for QR codes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/thumbnails/"); // Reusing thumbnails folder for QR code
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.use(protect);
router.use(admin);

router.get("/students", getStudents);
router.post("/students", createStudent);
router.delete("/students/:id", deleteStudent);
router.patch("/students/:id/block", toggleBlockStudent);
router.get("/stats", getDashboardStats);

// Settings routes
router.get("/settings", getSettings);
router.put("/settings", upload.single("paymentQrCode"), updateSettings);

// Enrollment request routes
router.get("/enrollment-requests", getEnrollmentRequests);
router.patch("/enrollment-requests/:id/approve", approveEnrollmentRequest);
router.patch("/enrollment-requests/:id/reject", rejectEnrollmentRequest);

export default router;
