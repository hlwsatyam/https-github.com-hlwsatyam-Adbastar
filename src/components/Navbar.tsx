import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, BookOpen, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Lumina
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Courses
            </Link>
            {user && (
              <Link to="/my-courses" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                My Learning
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">{user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-white/70" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/10 px-4 py-6 space-y-4"
          >
            <Link to="/" className="block text-lg font-medium text-white/70" onClick={() => setIsOpen(false)}>
              Courses
            </Link>
            {user && (
              <Link to="/my-courses" className="block text-lg font-medium text-white/70" onClick={() => setIsOpen(false)}>
                My Learning
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="block text-lg font-medium text-emerald-400" onClick={() => setIsOpen(false)}>
                Admin Panel
              </Link>
            )}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 font-medium">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" className="text-center py-3 text-white/70" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3 bg-emerald-500 text-black font-bold rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
