import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.ts";
import User from "../models/User.ts";
import Course from "../models/Course.ts";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_your_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_razorpay_secret",
});

export const createOrder = async (req: any, res: any) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const options = {
    amount: course.price * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      studentId: req.user._id,
      courseId: courseId,
      amount: course.price,
      razorpayOrderId: order.id,
      status: "pending",
    });

    await payment.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

export const verifyPayment = async (req: any, res: any) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "your_razorpay_secret")
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (payment) {
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.status = "success";
      await payment.save();

      const user = await User.findById(payment.studentId);
      const course = await Course.findById(payment.courseId);

      if (user && course) {
        if (!user.enrolledCourses.includes(course._id)) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }
        if (!course.enrolledStudents.includes(user._id)) {
          course.enrolledStudents.push(user._id);
          await course.save();
        }
      }

      res.json({ message: "Payment verified successfully" });
    } else {
      res.status(404).json({ message: "Payment record not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid payment signature" });
  }
};
