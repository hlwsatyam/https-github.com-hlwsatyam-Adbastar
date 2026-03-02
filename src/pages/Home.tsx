import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Search, Filter, Play, Lock, Unlock, ArrowRight, Star, Users, Clock } from "lucide-react";
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

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = Array.isArray(courses) ? courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] -z-10 rounded-full" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Master Your Future with <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Lumina Academy
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/60 max-w-2xl mx-auto mb-10"
        >
          Access premium courses designed by industry experts. Learn at your own pace and unlock your full potential today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="Search for courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-xl"
          />
        </motion.div>
      </section>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <CourseCard key={course._id} course={course} index={index} user={user} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-white/40 text-lg">No courses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const CourseCard: React.FC<{ course: Course; index: number; user: any }> = ({ course, index, user }) => {
  const isEnrolled = user?.enrolledCourses?.includes(course._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail.startsWith("uploads") ? `/${course.thumbnail}` : course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            to={`/course/${course._id}`}
            className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform"
          >
            <Play className="w-6 h-6 fill-current" />
          </Link>
        </div>
        <div className="absolute top-4 right-4">
          {isEnrolled ? (
            <div className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Unlocked</span>
            </div>
          ) : (
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Locked</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-500/20">
            Best Seller
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">4.9</span>
          </div>
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
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">{course.enrolledStudents.length}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">12h 30m</span>
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400">
            ₹{course.price}
          </div>
        </div>

        <Link
          to={`/course/${course._id}`}
          className="mt-6 w-full py-3 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-emerald-500"
        >
          {isEnrolled ? "Start Learning" : "View Details"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
