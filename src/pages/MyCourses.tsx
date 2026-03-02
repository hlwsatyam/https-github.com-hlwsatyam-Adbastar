import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Play, BookOpen, Clock, ArrowRight, Loader2, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  enrolledStudents: string[];
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await axios.get("/api/courses");
        if (Array.isArray(data)) {
          const myEnrolledCourses = data.filter((course: Course) =>
            user?.enrolledCourses?.includes(course._id)
          );
          setCourses(myEnrolledCourses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching my courses", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyCourses();
  }, [user, token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-2">My Learning</h1>
        <p className="text-white/40">Continue where you left off and master your skills</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail.startsWith("uploads") ? `/${course.thumbnail}` : course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    to={`/course/${course._id}`}
                    className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 fill-current" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">45% Complete</span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-white/50 mb-6 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs font-medium">12 Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">12h 30m</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/course/${course._id}`}
                  className="mt-6 w-full py-3 bg-emerald-500 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            You haven't enrolled in any courses yet. Explore our catalog and start your learning journey today.
          </p>
          <Link
            to="/"
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
