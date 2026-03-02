import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2, Shield, ShieldOff, Plus, UserPlus, Mail, Lock, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/admin/students", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Student created successfully");
      setShowModal(false);
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Student deleted");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await axios.patch(`/api/admin/students/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Student status updated");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredStudents = Array.isArray(students) ? students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Student Management</h2>
          <p className="text-white/40">Manage and monitor all registered students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <UserPlus className="w-5 h-5" />
          Add New Student
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 bg-white/5" />
                  </tr>
                ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                          {student.firstName[0]}
                        </div>
                        <span className="font-bold">{student.firstName} {student.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60">{student.email}</td>
                    <td className="px-6 py-4">
                      {student.isBlocked ? (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20 uppercase tracking-wider">Blocked</span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBlock(student._id)}
                          className={`p-2 rounded-xl transition-all ${
                            student.isBlocked
                              ? "text-emerald-400 hover:bg-emerald-400/10"
                              : "text-yellow-400 hover:bg-yellow-400/10"
                          }`}
                          title={student.isBlocked ? "Unblock" : "Block"}
                        >
                          {student.isBlocked ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-white/40">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Student Modal */}
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
              className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold mb-8">Add New Student</h3>

              <form onSubmit={handleCreateStudent} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Student Account"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
