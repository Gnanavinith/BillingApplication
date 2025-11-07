import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiPrinter, FiBell, FiSettings } from "react-icons/fi";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FiSettings className="text-blue-600" /> Settings
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { id: "general", label: "General", icon: FiUser },
          { id: "security", label: "Security", icon: FiLock },
          { id: "notifications", label: "Notifications", icon: FiBell },
          { id: "printer", label: "Printer", icon: FiPrinter },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border rounded-lg p-5 bg-gray-50">
        {activeTab === "general" && (
          <motion.div
            key="general"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              General Settings
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter company email"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  placeholder="Enter GST number"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Security Settings
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="Enter old password"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Notification Preferences
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" /> Email
                Notifications
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" /> SMS Alerts
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" /> Low Stock
                Reminders
              </label>
            </div>
          </motion.div>
        )}

        {activeTab === "printer" && (
          <motion.div
            key="printer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Printer Configuration
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Default Printer
                </label>
                <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Thermal Printer</option>
                  <option>Inkjet Printer</option>
                  <option>Laser Printer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Paper Size
                </label>
                <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>A4</option>
                  <option>A5</option>
                  <option>58mm</option>
                  <option>80mm</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
