import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const DealerList = () => {
  const [search, setSearch] = useState("");
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_ROUTES.DEALERS.LIST);
      if (data.success && data.data) {
        setDealers(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dealers");
    } finally {
      setLoading(false);
    }
  };

  const filteredDealers = dealers.filter(
    (dealer) =>
      dealer.name?.toLowerCase().includes(search.toLowerCase()) ||
      dealer.phone?.includes(search) ||
      dealer.email?.toLowerCase().includes(search.toLowerCase()) ||
      dealer.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dealer?")) {
      return;
    }

    try {
      const { data } = await axiosInstance.delete(API_ROUTES.DEALERS.BY_ID(id));
      if (data.success) {
        setDealers(dealers.filter((dealer) => dealer._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete dealer");
    }
  };

  // Navigations handled via routes, saving handled in form page backed by API later

  return (
    <motion.div
      className="p-6 w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Dealers</h2>
        <motion.button
          onClick={() => navigate('/dealers/new')}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" /> Add Dealer
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5 w-full sm:w-80">
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search dealer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600 text-2xl" />
          <span className="ml-2 text-gray-600">Loading dealers...</span>
        </div>
      ) : filteredDealers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search ? "No dealers found matching your search." : "No dealers available. Add your first dealer!"}
        </div>
      ) : (
        <motion.table
          className="w-full bg-white rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">City</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((dealer) => (
              <motion.tr
                key={dealer._id}
                className="border-t hover:bg-gray-50 transition"
                whileHover={{ scale: 1.01 }}
              >
                <td className="p-3">{dealer.name}</td>
                <td className="p-3">{dealer.phone}</td>
                <td className="p-3">{dealer.email || "-"}</td>
                <td className="p-3">{dealer.city || "-"}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => navigate(`/dealers/new?edit=${dealer._id}`)}
                    className="p-2 rounded-full hover:bg-blue-100 transition"
                    title="Edit"
                  >
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(dealer._id)}
                    className="p-2 rounded-full hover:bg-red-100 transition ml-2"
                    title="Delete"
                  >
                    <FiTrash2 className="text-red-600" />
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

export default DealerList;
