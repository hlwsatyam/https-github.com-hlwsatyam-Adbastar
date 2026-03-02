import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    price: { type: Number, required: true },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
