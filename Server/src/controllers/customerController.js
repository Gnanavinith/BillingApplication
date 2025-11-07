import Customer from "../models/Customer.js";

// @desc    Search customers
// @route   GET /api/customers/search
// @access  Private (all authenticated users)
export const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(200).json({
        success: true,
        message: "Customers retrieved successfully",
        data: [],
      });
    }

    const searchTerm = query.trim();
    const customers = await Customer.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .sort({ lastBillDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching customers",
      error: error.message,
    });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (all authenticated users)
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ lastBillDate: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

