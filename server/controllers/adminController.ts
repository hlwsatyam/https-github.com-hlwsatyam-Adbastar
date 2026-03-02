import User from "../models/User.ts";
import Course from "../models/Course.ts";
import Payment from "../models/Payment.ts";
import Settings from "../models/Settings.ts";
import EnrollmentRequest from "../models/EnrollmentRequest.ts";

export const getSettings = async (req: any, res: any) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ paymentQrCode: "", whatsappNumber: "7027944324" });
  }
  res.json(settings);
};

export const updateSettings = async (req: any, res: any) => {
  const { whatsappNumber } = req.body;
  const paymentQrCode = req.file ? req.file.path : undefined;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({ whatsappNumber, paymentQrCode });
  } else {
    settings.whatsappNumber = whatsappNumber || settings.whatsappNumber;
    if (paymentQrCode) settings.paymentQrCode = paymentQrCode;
  }

  await settings.save();
  res.json(settings);
};

export const getEnrollmentRequests = async (req: any, res: any) => {
  const requests = await EnrollmentRequest.find({})
    .populate("user", "firstName lastName email")
    .populate("course", "title price")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const approveEnrollmentRequest = async (req: any, res: any) => {
  const request = await EnrollmentRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "approved";
  await request.save();

  // Add course to user's enrolledCourses
  const user = await User.findById(request.user);
  if (user && !user.enrolledCourses.includes(request.course)) {
    user.enrolledCourses.push(request.course);
    await user.save();
  }

  // Create a payment record
  const course = await Course.findById(request.course);
  await Payment.create({
    studentId: request.user,
    courseId: request.course,
    amount: course?.price || 0,
    status: "success",
    razorpayOrderId: "manual_approval_" + request._id,
    razorpayPaymentId: "manual_approval_" + request._id,
  });

  res.json({ message: "Enrollment approved" });
};

export const rejectEnrollmentRequest = async (req: any, res: any) => {
  const request = await EnrollmentRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "rejected";
  await request.save();
  res.json({ message: "Enrollment rejected" });
};

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
