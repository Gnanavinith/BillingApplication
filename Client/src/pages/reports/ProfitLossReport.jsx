import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiLoader } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const ProfitLossReport = () => {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState({
    totalSales: 0,
    totalPurchase: 0,
    profit: 0,
    profitPercent: "0.00",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfitLossReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchProfitLossReport = async () => {
    try {
      setLoading(true);
      const { data: response } = await axiosInstance.get(
        `${API_ROUTES.REPORTS.PROFIT_LOSS}?period=${period}`
      );

      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profit & loss report");
    } finally {
      setLoading(false);
    }
  };

  const profit = useMemo(() => data.profit || 0, [data]);
  const profitPercent = useMemo(() => data.profitPercent || "0.00", [data]);

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Profit & Loss Report</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        >
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center shadow-sm"
        >
          <FiDollarSign className="mx-auto text-blue-600 text-3xl mb-2" />
          <h3 className="text-gray-600">Total Sales</h3>
          <p className="text-2xl font-semibold text-blue-700">
            {loading ? (
              <FiLoader className="animate-spin inline" />
            ) : (
              `₹${data.totalSales.toLocaleString("en-IN")}`
            )}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-center shadow-sm"
        >
          <FiTrendingDown className="mx-auto text-yellow-600 text-3xl mb-2" />
          <h3 className="text-gray-600">Total Purchase</h3>
          <p className="text-2xl font-semibold text-yellow-700">
            {loading ? (
              <FiLoader className="animate-spin inline" />
            ) : (
              `₹${data.totalPurchase.toLocaleString("en-IN")}`
            )}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg text-center shadow-sm border ${
            profit > 0
              ? "bg-green-50 border-green-100"
              : "bg-red-50 border-red-100"
          }`}
        >
          {profit > 0 ? (
            <FiTrendingUp className="mx-auto text-green-600 text-3xl mb-2" />
          ) : (
            <FiTrendingDown className="mx-auto text-red-600 text-3xl mb-2" />
          )}
          <h3 className="text-gray-600">Net Profit / Loss</h3>
          <p
            className={`text-2xl font-semibold ${
              profit > 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            {loading ? (
              <FiLoader className="animate-spin inline" />
            ) : (
              `₹${profit.toLocaleString("en-IN")} (${profitPercent}%)`
            )}
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default ProfitLossReport;
