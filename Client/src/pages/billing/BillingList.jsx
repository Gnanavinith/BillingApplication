import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiEye, FiFilter, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const BillingList = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (status && status !== "All") params.append("status", status);

      const { data } = await axiosInstance.get(
        `${API_ROUTES.BILLING.LIST}${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (data.success && data.data) {
        setBills(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bills");
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

  const formatInvoiceId = (id) => {
    // Use last 6 characters of MongoDB _id as invoice ID
    return `INV-${id.slice(-6).toUpperCase()}`;
  };

  const filtered = useMemo(() => {
    return bills;
  }, [bills]);

  return (
    <motion.div
      className="p-6 w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Billing List</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search invoice..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              className="border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate('/billing/create')}
          >
            New Bill
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600 text-2xl" />
          <span className="ml-2 text-gray-600">Loading bills...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {query || status !== "All"
            ? "No bills found matching your filters."
            : "No bills available. Create your first bill!"}
        </div>
      ) : (
        <motion.table
          className="w-full bg-white rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="p-3">Invoice ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bill) => (
              <motion.tr
                key={bill._id}
                className="border-t hover:bg-gray-50 transition"
                whileHover={{ scale: 1.01 }}
              >
                <td className="p-3">{formatInvoiceId(bill._id)}</td>
                <td className="p-3">{bill.customerName}</td>
                <td className="p-3">{formatDate(bill.date || bill.createdAt)}</td>
                <td className="p-3 font-medium">₹{bill.totalAmount}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bill.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : bill.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bill.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    className="p-2 rounded-full hover:bg-blue-100 transition"
                    onClick={() => navigate(`/billing/invoice/${bill._id}`)}
                    aria-label="View Invoice"
                    title="View Invoice"
                  >
                    <FiEye className="text-blue-600" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}
    </motion.div>
  );
};

export default BillingList;
