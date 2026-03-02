import User from "../models/User.ts";
import Course from "../models/Course.ts";
import Payment from "../models/Payment.ts";

export const getStudents = async (req: any, res: any) => {
  const students = await User.find({ role: "student" }).select("-password");
  res.json(students);
};

export const createStudent = async (req: any, res: any) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: "student",
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const deleteStudent = async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "Student removed" });
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

export const toggleBlockStudent = async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isBlocked = !user.isBlocked;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

export const getDashboardStats = async (req: any, res: any) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalCourses = await Course.countDocuments({});
  const payments = await Payment.find({ status: "success" });
  const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const recentPayments = await Payment.find({ status: "success" })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("studentId", "firstName lastName email")
    .populate("courseId", "title");

  res.json({
    totalStudents,
    totalCourses,
    totalRevenue,
    recentPayments,
  });
};
