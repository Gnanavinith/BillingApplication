import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

export default function DealerForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dealerId = params.get('edit');
  const isEdit = Boolean(dealerId);

  const [dealer, setDealer] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch dealer if editing
  useEffect(() => {
    if (isEdit && dealerId) {
      fetchDealer(dealerId);
    }
  }, [isEdit, dealerId]);

  const fetchDealer = async (id) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_ROUTES.DEALERS.BY_ID(id));
      if (data.success && data.data) {
        setDealer({
          name: data.data.name || "",
          phone: data.data.phone || "",
          email: data.data.email || "",
          city: data.data.city || "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dealer");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDealer({ ...dealer, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isEdit) {
        response = await axiosInstance.put(
          API_ROUTES.DEALERS.BY_ID(dealerId),
          dealer
        );
      } else {
        response = await axiosInstance.post(
          API_ROUTES.DEALERS.LIST,
          dealer
        );
      }

      if (response.data.success) {
        navigate('/dealers');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save dealer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 w-full bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{isEdit ? 'Edit Dealer' : 'Add Dealer'}</h2>
        <button
          className="px-3 py-1.5 border rounded-lg"
          onClick={() => navigate('/dealers')}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Dealer Name</label>
          <input
            name="name"
            value={dealer.name}
            onChange={handleChange}
            placeholder="Enter dealer name"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Phone</label>
          <input
            name="phone"
            value={dealer.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            type="tel"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            name="email"
            value={dealer.email}
            onChange={handleChange}
            placeholder="Enter email"
            type="email"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">City</label>
          <input
            name="city"
            value={dealer.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              {isEdit ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            isEdit ? 'Update Dealer' : 'Add Dealer'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
