import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

export default function AddProduct() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("edit");
  const isEdit = Boolean(productId);

  // Product State
  const [product, setProduct] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    barcode: "",
  });

  // Barcode Input State
  const [barcodeInput, setBarcodeInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch product if editing
  useEffect(() => {
    if (isEdit && productId) {
      fetchProduct(productId);
    }
  }, [isEdit, productId]);

  const fetchProduct = async (id) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_ROUTES.PRODUCTS.BY_ID(id));
      if (data.success && data.data) {
        setProduct({
          name: data.data.name || "",
          category: data.data.category || "",
          purchasePrice: data.data.purchasePrice || "",
          sellingPrice: data.data.sellingPrice || "",
          stock: data.data.stock || "",
          barcode: data.data.barcode || "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  // Handle barcode scanning or manual entry - search in API
  const handleScan = async (barcode) => {
    if (!barcode.trim()) return;
    
    try {
      setLoading(true);
      setMessage("");
      // Fetch all products and search by barcode
      const { data } = await axiosInstance.get(API_ROUTES.PRODUCTS.LIST);
      if (data.success && data.data) {
        const found = data.data.find((p) => p.barcode === barcode.trim());
        if (found) {
          setProduct({
            name: found.name || "",
            category: found.category || "",
            purchasePrice: found.purchasePrice || "",
            sellingPrice: found.sellingPrice || "",
            stock: found.stock || "",
            barcode: found.barcode || "",
          });
          setMessage(`✅ Product found: ${found.name}`);
        } else {
          setProduct({ ...product, barcode: barcode.trim() });
          setMessage(`⚠️ No product found for barcode: ${barcode}. You can create a new product.`);
        }
      }
    } catch (err) {
      setMessage(`⚠️ Error searching for product: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const productData = {
        name: product.name,
        category: product.category,
        purchasePrice: Number(product.purchasePrice),
        sellingPrice: Number(product.sellingPrice),
        stock: Number(product.stock),
        barcode: product.barcode || undefined, // Let backend generate if empty
      };

      let response;
      if (isEdit) {
        response = await axiosInstance.put(
          API_ROUTES.PRODUCTS.BY_ID(productId),
          productData
        );
      } else {
        response = await axiosInstance.post(
          API_ROUTES.PRODUCTS.LIST,
          productData
        );
      }

      if (response.data.success) {
        navigate("/inventory");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save product"
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>
        <button
          className="px-3 py-1.5 border rounded-lg"
          onClick={() => navigate("/inventory")}
        >
          Cancel
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Barcode Section */}
      <motion.div
        className="mb-4 bg-gray-50 p-4 rounded-lg border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="block text-gray-600 text-sm mb-1">
          Scan or Enter Barcode
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && barcodeInput.trim() && !loading) {
                handleScan(barcodeInput);
                setBarcodeInput("");
              }
            }}
            placeholder="Scan or enter product barcode and press Enter"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => {
              if (barcodeInput.trim() && !loading) {
                handleScan(barcodeInput);
                setBarcodeInput("");
              }
            }}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FiLoader className="animate-spin" /> : "Search"}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">
            Product Name
          </label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter category"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Purchase & Selling Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Purchase Price (₹)
            </label>
            <input
              name="purchasePrice"
              value={product.purchasePrice}
              onChange={handleChange}
              type="number"
              placeholder="Enter purchase price"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Selling Price (₹)
            </label>
            <input
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleChange}
              type="number"
              placeholder="Enter selling price"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">
            Stock Quantity
          </label>
          <input
            name="stock"
            value={product.stock}
            onChange={handleChange}
            type="number"
            placeholder="Enter stock qty"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Barcode</label>
          <input
            name="barcode"
            value={product.barcode}
            onChange={handleChange}
            placeholder="Leave empty to auto-generate"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to auto-generate a barcode
          </p>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiCheckCircle />
          )}
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Product"
            : "Add Product"}
        </motion.button>
      </form>
    </motion.div>
  );
}
