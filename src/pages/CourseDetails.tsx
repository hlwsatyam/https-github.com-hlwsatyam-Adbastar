import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { Play, Lock, Unlock, CheckCircle2, Users, Star, Clock, ArrowLeft, Loader2, IndianRupee, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// @ts-ignore
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
  enrolledStudents: string[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, login } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/api/courses/${id}`);
        setCourse(data);
        if (user) {
          const { data: enrollData } = await axios.get(`/api/courses/${id}/enrollment`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsEnrolled(enrollData.enrolled);
        }
      } catch (error) {
        console.error("Error fetching course", error);
        toast.error("Course not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user, token, navigate]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to purchase this course");
      navigate("/login");
      return;
    }

    setPaymentLoading(true);
    try {
      const { data: order } = await axios.post(
        "/api/payments/order",
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Lumina Academy",
        description: `Purchase ${course?.title}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await axios.post(
              "/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful! Course unlocked.");
            setIsEnrolled(true);
            // Refresh user data to update enrolledCourses
            const { data: userData } = await axios.get("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            login({ ...userData, token });
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>;
  if (!course) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Course Info */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                Professional Course
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">4.9 (2.4k reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8">{course.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10">
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Students</p>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">{course.enrolledStudents.length}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Duration</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">12h 30m</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Level</p>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">Intermediate</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Language</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">English</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">What you'll learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Master industry-standard tools and workflows",
                "Build real-world projects for your portfolio",
                "Understand core concepts from scratch",
                "Get lifetime access to course materials",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video & Purchase */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden p-4 shadow-2xl"
            >
              <div className="relative aspect-video rounded-[1.5rem] overflow-hidden mb-6 group">
                {isEnrolled ? (
                  <video
                    src={`/${course.videoUrl}`}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={course.thumbnail.startsWith("uploads") ? `/${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover blur-[2px] brightness-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">Content Locked</p>
                      <p className="text-xs text-white/50">Enroll in the course to unlock the full video content</p>
                    </div>
                  </>
                )}
              </div>

              <div className="px-4 pb-4">
                {!isEnrolled && (
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Price</p>
                      <h3 className="text-3xl font-bold text-emerald-400">₹{course.price}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Discount</p>
                      <p className="text-sm font-bold text-red-400">20% OFF</p>
                    </div>
                  </div>
                )}

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                      <Unlock className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400">You have full access to this course</span>
                    </div>
                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10">
                      Download Resources
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={paymentLoading}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                  >
                    {paymentLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Enroll Now <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Full lifetime access
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Access on mobile and TV
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h4 className="font-bold mb-4">Course Features</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Quizzes</span>
                  <span className="font-medium">12</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Assignments</span>
                  <span className="font-medium">05</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Resources</span>
                  <span className="font-medium">24</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
