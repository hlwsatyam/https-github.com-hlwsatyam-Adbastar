import { useState, useEffect } from "react";
import axios from "axios";
import { Users, BookOpen, IndianRupee, TrendingUp, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  recentPayments: any[];
}

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl border border-white/10" />)}
    </div>
    <div className="h-96 bg-white/5 rounded-3xl border border-white/10" />
  </div>;

  const cards = [
    { label: "Total Students", value: stats?.totalStudents, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Courses", value: stats?.totalCourses, icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Revenue", value: `₹${stats?.totalRevenue}`, icon: IndianRupee, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm text-white/60 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {format(new Date(), "MMMM do, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 p-4 ${card.bg} rounded-bl-3xl opacity-50 group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <p className="text-white/50 font-medium mb-2">{card.label}</p>
            <h3 className="text-4xl font-bold">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-400 w-5 h-5" />
              Recent Payments
            </h3>
            <button className="text-sm text-emerald-400 font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-6">
            {stats?.recentPayments.map((payment, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="font-bold">{payment.studentId?.firstName} {payment.studentId?.lastName}</p>
                    <p className="text-xs text-white/40">{payment.courseId?.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">₹{payment.amount}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">{format(new Date(payment.createdAt), "MMM dd, HH:mm")}</p>
                </div>
              </div>
            ))}
            {stats?.recentPayments.length === 0 && (
              <p className="text-center text-white/40 py-10">No recent payments found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-8">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/courses" className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-emerald-500/20 transition-all">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              <span className="font-bold text-emerald-400">Add Course</span>
            </Link>
            <Link to="/admin/enrollments" className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-yellow-500/20 transition-all">
              <Clock className="w-8 h-8 text-yellow-500" />
              <span className="font-bold text-yellow-500">Enrollment Requests</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
