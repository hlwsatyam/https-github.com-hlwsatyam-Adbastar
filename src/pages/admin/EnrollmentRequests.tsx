import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Loader2, Clock, User, BookOpen, IndianRupee, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

interface EnrollmentRequest {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    title: string;
    price: number;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function EnrollmentRequests() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("/api/admin/enrollment-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      await axios.patch(`/api/admin/enrollment-requests/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Enrollment ${action}d successfully`);
      fetchRequests();
    } catch (error) {
      toast.error(`Failed to ${action} enrollment`);
    }
  };

  const filteredRequests = Array.isArray(requests) ? requests.filter(
    (r) =>
      r.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      r.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.toLowerCase()) ||
      r.course.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Enrollment Requests</h2>
        <p className="text-white/40">Review and approve manual payment requests</p>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          placeholder="Search requests..."
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
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Requested At</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 bg-white/5" />
                  </tr>
                ))
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                          {request.user.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold">{request.user.firstName} {request.user.lastName}</p>
                          <p className="text-xs text-white/40">{request.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-white/40" />
                        <span className="text-sm font-medium line-clamp-1">{request.course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <IndianRupee className="w-3 h-3" />
                        {request.course.price}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {request.status === "pending" ? (
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded-full border border-yellow-500/20 uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : request.status === "approved" ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <Check className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20 uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <X className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">
                      {new Date(request.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {request.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(request._id, "approve")}
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAction(request._id, "reject")}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-white/40">No enrollment requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
