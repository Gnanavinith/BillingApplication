import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiShoppingCart,
  FiPackage,
  FiBarChart2,
  FiLoader,
} from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Total Sales", value: "₹0", icon: <FiShoppingCart />, color: "blue" },
    { label: "Profit", value: "₹0", icon: <FiTrendingUp />, color: "green" },
    { label: "Total Bills", value: "0", icon: <FiBarChart2 />, color: "yellow" },
    { label: "Stock Items", value: "0", icon: <FiPackage />, color: "purple" },
  ]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, salesResponse] = await Promise.all([
        axiosInstance.get(API_ROUTES.DASHBOARD.STATS),
        axiosInstance.get(API_ROUTES.DASHBOARD.WEEKLY_SALES),
      ]);

      if (statsResponse.data.success && statsResponse.data.data) {
        const data = statsResponse.data.data;
        setStats([
          {
            label: "Total Sales",
            value: `₹${formatNumber(data.totalSales)}`,
            icon: <FiShoppingCart />,
            color: "blue",
          },
          {
            label: "Profit",
            value: `₹${formatNumber(data.profit)}`,
            icon: <FiTrendingUp />,
            color: "green",
          },
          {
            label: "Total Bills",
            value: formatNumber(data.totalBills),
            icon: <FiBarChart2 />,
            color: "yellow",
          },
          {
            label: "Stock Items",
            value: formatNumber(data.totalStock),
            icon: <FiPackage />,
            color: "purple",
          },
        ]);
      }

      if (salesResponse.data.success && salesResponse.data.data) {
        setSalesData(salesResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(num || 0));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="animate-spin text-blue-600 text-2xl" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 ${
              stat.color === "blue"
                ? "bg-blue-50"
                : stat.color === "green"
                ? "bg-green-50"
                : stat.color === "yellow"
                ? "bg-yellow-50"
                : "bg-purple-50"
            }`}
          >
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p
                className={`text-xl font-semibold mt-1 ${
                  stat.color === "blue"
                    ? "text-blue-700"
                    : stat.color === "green"
                    ? "text-green-700"
                    : stat.color === "yellow"
                    ? "text-yellow-700"
                    : "text-purple-700"
                }`}
              >
                {stat.value}
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                stat.color === "blue"
                  ? "text-blue-600 bg-blue-100"
                  : stat.color === "green"
                  ? "text-green-600 bg-green-100"
                  : stat.color === "yellow"
                  ? "text-yellow-600 bg-yellow-100"
                  : "text-purple-600 bg-purple-100"
              }`}
            >
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiBarChart2 className="text-blue-600" /> Weekly Sales Overview
        </h3>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                formatter={(value) => `₹${formatNumber(value)}`}
                labelStyle={{ color: "#333" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#2563eb", fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No sales data available
          </div>
        )}
      </div>
    </motion.div>
  );
}
