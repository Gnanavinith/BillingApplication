import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiDownload, FiPrinter, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const SalesReport = () => {
  const [filter, setFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, filter]);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (filter) params.append("search", filter);

      const { data } = await axiosInstance.get(
        `${API_ROUTES.REPORTS.SALES}${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (data.success && data.data) {
        setSalesData(data.data.bills || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const filtered = useMemo(() => {
    return salesData;
  }, [salesData]);

  const totalSales = useMemo(() => {
    return filtered.reduce((sum, s) => sum + (s.total || 0), 0);
  }, [filtered]);

  const exportCsv = () => {
    const header = ["Date", "Invoice", "Customer", "Total"];
    const rows = filtered.map((r) => [
      formatDate(r.date),
      r.invoice,
      r.customer,
      r.total,
    ]);
    const csv = [header, ...rows].map((a) => a.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  return (
    <motion.div
      className="p-6 bg-white shadow-lg rounded-2xl w-full border border-gray-100"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Sales Report
        </h2>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice or customer..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={() => navigate("/reports/stock")}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Stock Report
          </button>
          <button
            onClick={() => navigate("/reports/profit-loss")}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Profit & Loss
          </button>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiDownload /> Export
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            <FiPrinter /> Print
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center shadow-sm"
        >
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-semibold text-blue-700">
            {loading ? (
              <FiLoader className="animate-spin inline" />
            ) : (
              `₹${totalSales.toLocaleString("en-IN")}`
            )}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-green-50 border border-green-100 p-4 rounded-lg text-center shadow-sm"
        >
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-semibold text-green-700">
            {loading ? <FiLoader className="animate-spin inline" /> : filtered.length}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-center shadow-sm"
        >
          <p className="text-sm text-gray-500">Avg Sale Value</p>
          <p className="text-2xl font-semibold text-yellow-700">
            {loading ? (
              <FiLoader className="animate-spin inline" />
            ) : (
              `₹${(totalSales / (filtered.length || 1)).toFixed(2)}`
            )}
          </p>
        </motion.div>
      </div>

      {/* Table Section */}
      <div
        id="sales-table"
        className="overflow-x-auto border border-gray-100 rounded-lg"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wide">
              <th className="p-3">Date</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Customer</th>
              <th className="p-3 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  <FiLoader className="animate-spin inline text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading sales data...</span>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((s, i) => (
                <motion.tr
                  key={s._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-700">{formatDate(s.date)}</td>
                  <td className="p-3 font-medium text-gray-800">{s.invoice}</td>
                  <td className="p-3 text-gray-700">{s.customer}</td>
                  <td className="p-3 text-right font-semibold text-blue-700">
                    ₹{s.total.toLocaleString("en-IN")}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-500 italic"
                >
                  No sales data found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="mt-6 text-right text-lg font-semibold text-blue-700">
        Total Sales: ₹{totalSales.toLocaleString()}
      </div>
    </motion.div>
  );
};

export default SalesReport;
