import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiPrinter, FiTrash2, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiRoutes";

const CreateBill = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch products from inventory API
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

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search customers when customer name changes
  useEffect(() => {
    const searchCustomers = async () => {
      if (customerName.trim().length >= 2) {
        try {
          setSearchingCustomers(true);
          const { data } = await axiosInstance.get(
            `${API_ROUTES.CUSTOMERS.SEARCH}?query=${encodeURIComponent(customerName.trim())}`
          );
          if (data.success && data.data) {
            setCustomerSuggestions(data.data);
          }
        } catch (err) {
          // Silently fail - don't show error for customer search
          setCustomerSuggestions([]);
        } finally {
          setSearchingCustomers(false);
        }
      } else {
        setCustomerSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchCustomers();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(debounceTimer);
  }, [customerName]);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode?.includes(searchTerm)
  );

  // Add product by object
  const addProduct = (product) => {
    // Check if product already added
    if (selectedProducts.find((p) => p._id === product._id)) {
      alert("Product already added to bill");
      return;
    }

    // Check stock availability
    if (product.stock <= 0) {
      alert(`Product "${product.name}" is out of stock`);
      return;
    }

    setSelectedProducts([
      ...selectedProducts,
      {
        _id: product._id,
        name: product.name,
        price: product.sellingPrice,
        barcode: product.barcode,
        stock: product.stock,
        qty: 1,
      },
    ]);
    setSearchTerm("");
  };

  // Handle barcode scan
  const handleScan = (barcode) => {
    const product = products.find((p) => p.barcode === barcode.trim());
    if (product) {
      addProduct(product);
    } else {
      alert(`No product found for barcode: ${barcode}`);
    }
  };

  const updateQty = (id, qty) => {
    const qtyNum = parseInt(qty) || 1;
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p._id === id) {
          // Check if quantity exceeds stock
          if (qtyNum > p.stock) {
            alert(`Only ${p.stock} units available in stock`);
            return { ...p, qty: p.stock };
          }
          return { ...p, qty: qtyNum };
        }
        return p;
      })
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== id));
  };

  const total = selectedProducts.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateInvoice = async () => {
    if (!customerName.trim()) {
      setError("Please enter customer name");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Please add at least one product");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const billData = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        items: selectedProducts.map((item) => ({
          productId: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
      };

      const { data } = await axiosInstance.post(API_ROUTES.BILLING.LIST, billData);

      if (data.success) {
        // Navigate to invoice view
        navigate(`/billing/invoice/${data.data._id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create bill"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const autofillCustomer = (customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone || "");
    setShowCustomerDropdown(false);
    setCustomerSuggestions([]);
  };

  // Barcode manual entry
  const [barcodeInput, setBarcodeInput] = useState("");

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-xl w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Barcode input */}
      <div className="mb-4 flex items-center gap-2">
        <input
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && barcodeInput.trim()) {
              handleScan(barcodeInput);
              setBarcodeInput("");
            }
          }}
          placeholder="Scan or enter barcode and press Enter"
          className="border rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            if (barcodeInput.trim()) {
              handleScan(barcodeInput);
              setBarcodeInput("");
            }
          }}
        >
          Add
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Create New Bill</h2>
        <motion.button
          onClick={handlePrint}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPrinter className="mr-2" /> Print Invoice
        </motion.button>
      </div>

      {/* Customer Details */}
      <motion.div
        className="grid md:grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative" ref={dropdownRef}>
          <label className="block text-gray-600 text-sm mb-1">
            Customer Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setShowCustomerDropdown(true);
              }}
              placeholder="Enter customer name"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={submitting}
            />
            {searchingCustomers && (
              <div className="absolute right-3 top-2.5">
                <FiLoader className="animate-spin text-gray-400 text-sm" />
              </div>
            )}
          </div>

          {/* Customer Suggestions Dropdown */}
          {showCustomerDropdown &&
            customerName &&
            customerSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bg-white border rounded-lg w-full mt-1 shadow-lg max-h-40 overflow-y-auto z-20"
              >
                {customerSuggestions.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => autofillCustomer(c)}
                    className="p-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{c.name}</span>
                        {c.phone && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({c.phone})
                          </span>
                        )}
                      </div>
                      {c.totalBills > 1 && (
                        <span className="text-xs text-gray-400">
                          {c.totalBills} bills
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {submitting && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600">Creating invoice...</p>
        </div>
      )}

      {/* Product Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search product by name, category, or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={loading}
        />

        {loading && (
          <div className="absolute right-3 top-3">
            <FiLoader className="animate-spin text-gray-400" />
          </div>
        )}

        {searchTerm && !loading && (
          <motion.div
            className="absolute bg-white border rounded-lg mt-1 w-full max-h-48 overflow-y-auto z-10 shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <div
                  key={p._id}
                  onClick={() => addProduct(p)}
                  className={`flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer transition ${
                    p.stock <= 0 ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <span className="block">{p.name}</span>
                    <span className="text-xs text-gray-500">
                      {p.category} {p.stock <= 0 && "• Out of Stock"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-700 block">
                      ₹{p.sellingPrice}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-500 text-sm">No products found</p>
            )}
          </motion.div>
        )}
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <motion.div
          className="overflow-x-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-2">Product</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-center">Price</th>
                <th className="p-2 text-center">Total</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((item) => (
                <motion.tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.qty > item.stock && (
                        <div className="text-xs text-red-600">
                          Max available: {item.stock}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, e.target.value)}
                      className="w-16 border rounded-md p-1 text-center focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-2 text-center">₹{item.price}</td>
                  <td className="p-2 text-center font-medium">
                    ₹{item.qty * item.price}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Total */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-4">
        <p className="text-lg font-semibold text-gray-700">
          Total: <span className="text-blue-600">₹{total}</span>
        </p>

        <motion.button
          onClick={handleGenerateInvoice}
          disabled={submitting || selectedProducts.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.95 }}
        >
          {submitting ? (
            <>
              <FiLoader className="animate-spin" />
              Creating...
            </>
          ) : (
            "Generate Invoice"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateBill;
