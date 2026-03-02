import Course from "../models/Course.ts";
import User from "../models/User.ts";
import EnrollmentRequest from "../models/EnrollmentRequest.ts";

export const getCourses = async (req: any, res: any) => {
  const courses = await Course.find({});
  res.json(courses);
};

export const getCourseById = async (req: any, res: any) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
};

export const createCourse = async (req: any, res: any) => {
  const { title, description, price, videoUrl } = req.body;
  const thumbnail = req.files["thumbnail"] ? req.files["thumbnail"][0].path : null;

  if (!thumbnail || !videoUrl) {
    return res.status(400).json({ message: "Thumbnail and video link are required" });
  }

  const course = new Course({
    title,
    description,
    price,
    thumbnail,
    videoUrl,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
};

export const updateCourse = async (req: any, res: any) => {
  const { title, description, price, videoUrl } = req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.videoUrl = videoUrl || course.videoUrl;

    if (req.files && req.files["thumbnail"]) {
      course.thumbnail = req.files["thumbnail"][0].path;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
};

export const deleteCourse = async (req: any, res: any) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    await course.deleteOne();
    res.json({ message: "Course removed" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
};

export const checkEnrollment = async (req: any, res: any) => {
  const courseId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const request = await EnrollmentRequest.findOne({ user: userId, course: courseId });

  if (user && user.enrolledCourses.includes(courseId)) {
    res.json({ enrolled: true, status: "approved" });
  } else if (request) {
    res.json({ enrolled: false, status: request.status });
  } else {
    res.json({ enrolled: false, status: "none" });
  }
};

export const requestEnrollment = async (req: any, res: any) => {
  const courseId = req.params.id;
  const userId = req.user._id;

  const existingRequest = await EnrollmentRequest.findOne({ user: userId, course: courseId });
  if (existingRequest) {
    return res.status(400).json({ message: "Request already sent" });
  }

  await EnrollmentRequest.create({
    user: userId,
    course: courseId,
    status: "pending",
  });

  res.status(201).json({ message: "Enrollment request sent successfully" });
};
