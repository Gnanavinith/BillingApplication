import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiLoader } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_ROUTES.BILLING.BY_ID(id));
      if (data.success && data.data) {
        setInvoice(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatInvoiceId = (id) => {
    return `INV-${id.slice(-6).toUpperCase()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="animate-spin text-blue-600 text-2xl" />
        <span className="ml-2 text-gray-600">Loading invoice...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || "Invoice not found"}</p>
          <button
            onClick={() => navigate("/billing")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Billing List
          </button>
        </div>
      </div>
    );
  }

  const total = invoice.totalAmount || invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  return (
    <motion.div
      className="p-6 w-full bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
        <div className="flex gap-2">
          <motion.button
            onClick={handlePrint}
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiDownload className="mr-2" /> Print
          </motion.button>
          <button
            onClick={() => navigate("/billing")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <p className="mb-2"><strong>Invoice ID:</strong> {formatInvoiceId(invoice._id)}</p>
        <p className="mb-2"><strong>Customer:</strong> {invoice.customerName}</p>
        {invoice.customerPhone && (
          <p className="mb-2"><strong>Phone:</strong> {invoice.customerPhone}</p>
        )}
        <p className="mb-2"><strong>Date:</strong> {formatDate(invoice.date || invoice.createdAt)}</p>
        <p className="mb-2">
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              invoice.status === "Paid"
                ? "bg-green-100 text-green-700"
                : invoice.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {invoice.status}
          </span>
        </p>
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="text-gray-600 text-left border-b">
            <th className="p-2">Product</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Price</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <motion.tr
              key={index}
              className="border-b hover:bg-gray-50 transition"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.qty}</td>
              <td className="p-2">₹{item.price}</td>
              <td className="p-2">₹{item.total || item.qty * item.price}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-semibold text-lg text-gray-800">Total: ₹{total}</div>
    </motion.div>
  );
};

export default InvoiceView;
