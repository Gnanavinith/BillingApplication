import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const StockUpdate = () => {
  const [products, setProducts] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_ROUTES.PRODUCTS.LIST);
      if (data.success && data.data) {
        setProducts(data.data);
        // Initialize stock updates with current stock values
        const initialUpdates = {};
        data.data.forEach((p) => {
          initialUpdates[p._id] = p.stock;
        });
        setStockUpdates(initialUpdates);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, value) => {
    setStockUpdates({
      ...stockUpdates,
      [id]: parseInt(value) || 0,
    });
  };

  const updateStock = async (id) => {
    const newStock = stockUpdates[id];
    if (newStock === undefined || newStock < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    try {
      setUpdating({ ...updating, [id]: true });
      const { data } = await axiosInstance.patch(
        API_ROUTES.PRODUCTS.STOCK(id),
        { stock: newStock }
      );
      if (data.success) {
        // Update local products state
        setProducts(
          products.map((p) =>
            p._id === id ? { ...p, stock: newStock } : p
          )
        );
        alert("Stock updated successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdating({ ...updating, [id]: false });
    }
  };

  return (
    <motion.div
      className="p-6 w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Stock Update
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600 text-2xl" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products available. Add products first!
        </div>
      ) : (
        <motion.table
          className="w-full bg-white rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="p-3">Product</th>
              <th className="p-3 text-center">Current Stock</th>
              <th className="p-3 text-center">Update Stock</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <motion.tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition"
                whileHover={{ scale: 1.01 }}
              >
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-center font-medium">{p.stock}</td>
                <td className="p-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={stockUpdates[p._id] !== undefined ? stockUpdates[p._id] : p.stock}
                    onChange={(e) => handleStockChange(p._id, e.target.value)}
                    className="border rounded-lg w-24 text-center p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="p-3 text-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateStock(p._id)}
                    disabled={updating[p._id]}
                    className="flex items-center mx-auto bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating[p._id] ? (
                      <FiLoader className="animate-spin mr-1" />
                    ) : (
                      <FiCheckCircle className="mr-1" />
                    )}
                    {updating[p._id] ? "Saving..." : "Save"}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}
    </motion.div>
  );
};

export default StockUpdate;
