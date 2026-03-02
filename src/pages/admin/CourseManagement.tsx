import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2, Edit, Plus, X, Loader2, Image as ImageIcon, Video, IndianRupee, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
  enrolledStudents: string[];
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { token } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    videoUrl: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [token]);

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

  const handleOpenModal = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        videoUrl: course.videoUrl,
      });
    } else {
      setEditingCourse(null);
      setFormData({ title: "", description: "", price: "", videoUrl: "" });
    }
    setThumbnail(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("videoUrl", formData.videoUrl);
    if (thumbnail) data.append("thumbnail", thumbnail);

    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course updated successfully");
      } else {
        await axios.post("/api/courses", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course created successfully");
      }
      setShowModal(false);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const filteredCourses = Array.isArray(courses) ? courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Course Management</h2>
          <p className="text-white/40">Create and manage your educational content</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Course
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/10" />
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course._id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="relative aspect-video">
                <img
                  src={course.thumbnail.startsWith("uploads") ? `/${course.thumbnail}` : course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenModal(course)}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-full text-red-400 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1 line-clamp-1">{course.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">{course.enrolledStudents.length} Students</span>
                  <span className="text-emerald-400 font-bold">₹{course.price}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-white/40">No courses found.</p>
          </div>
        )}
      </div>

      {/* Course Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold mb-8">{editingCourse ? "Edit Course" : "Create New Course"}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Mastering Web Development"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter course details..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Price (INR)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="999"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Thumbnail</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex items-center gap-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <ImageIcon className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/60 truncate">
                          {thumbnail ? thumbnail.name : "Choose Image"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Course Video Link (YouTube/Vimeo/Direct)</label>
                  <div className="relative group">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCourse ? "Update Course" : "Create Course"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
