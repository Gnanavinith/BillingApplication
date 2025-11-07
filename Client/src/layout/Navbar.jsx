import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoNotificationsCircle } from "react-icons/io5";

const Icon = ({ path, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

export default function Navbar({
  isSidebarOpen = true,
  onToggleSidebar = () => {},
}) {
  const navigate = useNavigate();
  return (
    <motion.header
      className="flex items-center justify-between bg-white shadow-sm border-b border-gray-100 px-4 py-3 sticky top-0 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Show sidebar"
            onClick={onToggleSidebar}
          >
            <Icon
              className="w-6 h-6 text-gray-700"
              path="M3 6h18M3 12h18M3 18h18"
            />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md hidden md:block">
        <Icon
          className="absolute left-3 top-3 text-gray-400 w-5 h-5"
          path="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
        />
        <input
          placeholder="Search..."
          aria-label="Search"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <div
          className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition"
          onClick={() => navigate('/notifications')}
        >
          <IoNotificationsCircle className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-white"></span>
        </div>

        {/* Profile Icon */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
            A
          </div>
        </div>
      </div>
    </motion.header>
  );
}
