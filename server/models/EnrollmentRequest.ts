import mongoose from "mongoose";

const enrollmentRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    paymentScreenshot: { type: String }, // Optional: student can upload a screenshot
  },
  { timestamps: true }
);

const EnrollmentRequest = mongoose.model("EnrollmentRequest", enrollmentRequestSchema);
export default EnrollmentRequest;
