import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_ROUTES.PRODUCTS.LIST);
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search)
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const { data } = await axiosInstance.delete(API_ROUTES.PRODUCTS.BY_ID(id));
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <motion.div
      className="p-6 w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
        <motion.button
          onClick={() => navigate('/inventory/new')}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" /> Add Product
        </motion.button>
      </div>

      <div className="relative mb-5 w-full sm:w-80">
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search product..."
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
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search ? "No products found matching your search." : "No products available. Add your first product!"}
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
              <th className="p-3">Category</th>
              <th className="p-3">Selling Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <motion.tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition"
                whileHover={{ scale: 1.01 }}
              >
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₹{p.sellingPrice}</td>
                <td className={`p-3 font-medium ${p.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                  {p.stock}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => navigate(`/inventory/new?edit=${p._id}`)}
                    className="p-2 rounded-full hover:bg-blue-100 transition"
                    title="Edit"
                  >
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
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

export default ProductList;
