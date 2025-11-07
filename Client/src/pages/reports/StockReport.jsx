import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiFilter, FiLoader } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const StockReport = () => {
  const [products, setProducts] = useState([]);
  const [onlyLow, setOnlyLow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStockReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyLow]);

  const fetchStockReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (onlyLow) params.append("lowStockOnly", "true");

      const { data } = await axiosInstance.get(
        `${API_ROUTES.REPORTS.STOCK}${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (data.success && data.data) {
        setProducts(data.data.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stock report");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    return products;
  }, [products]);

  const exportCsv = () => {
    const header = ["Product", "Category", "Stock", "Price", "Status"];
    const data = rows.map((r) => [
      r.name,
      r.category,
      r.stock,
      r.price,
      r.status,
    ]);
    const csv = [header, ...data].map((a) => a.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Stock Report</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyLow((v) => !v)}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
              onlyLow
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-white text-gray-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiFilter /> {onlyLow ? "Showing Low Stock" : "All Items"}
          </button>
          <button
            onClick={exportCsv}
            disabled={loading || rows.length === 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-2">Product</th>
              <th className="p-2">Category</th>
              <th className="p-2 text-center">Stock</th>
              <th className="p-2 text-right">Price (₹)</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <FiLoader className="animate-spin inline text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading stock data...</span>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((item, i) => (
                <motion.tr
                  key={item._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2 text-center">{item.stock}</td>
                  <td className="p-2 text-right font-medium">
                    ₹{item.price.toLocaleString("en-IN")}
                  </td>
                  <td className="p-2 text-center">
                    {item.status === "Low Stock" ? (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 italic">
                  {onlyLow
                    ? "No low stock items found."
                    : "No products available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StockReport;
