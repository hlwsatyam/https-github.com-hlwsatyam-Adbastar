import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Plus, Search, Trash2, Shield, ShieldOff, Edit } from "lucide-react";
import Overview from "./admin/Overview";
import StudentManagement from "./admin/StudentManagement";
import CourseManagement from "./admin/CourseManagement";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: BookOpen, label: "Courses", path: "/admin/courses" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 p-6 hidden lg:block">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/courses" element={<CourseManagement />} />
        </Routes>
      </main>
    </div>
  );
}
