import Bill from "../models/Bill.js";
import Product from "../models/Product.js";

// @desc    Get overall dashboard summary
// @route   GET /api/dashboard/stats
// @access  Private (all authenticated users)
export const getDashboardStats = async (req, res) => {
  try {
    // Total bills count
    const totalBills = await Bill.countDocuments();

    // Total stock items (sum of all product stocks)
    const totalStockItems = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" } } },
    ]);
    const totalStock = totalStockItems[0]?.totalStock || 0;

    // Total sales (sum of all bill amounts)
    const totalSalesAgg = await Bill.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    // Calculate profit from sold products
    // Profit = (sellingPrice - purchasePrice) * quantity sold
    const allProducts = await Product.find();
    const bills = await Bill.find().populate("items.productId");
    let profit = 0;

    for (const bill of bills) {
      for (const item of bill.items) {
        // Try to find product by productId (could be ObjectId or string)
        const product = allProducts.find(
          (p) => p._id.toString() === item.productId?.toString()
        );
        if (product && product.purchasePrice) {
          const itemProfit = (item.price - product.purchasePrice) * item.qty;
          profit += itemProfit;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalSales,
        profit: Math.round(profit * 100) / 100, // Round to 2 decimal places
        totalBills,
        totalStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

// @desc    Get weekly sales data for chart
// @route   GET /api/dashboard/weekly-sales
// @access  Private (all authenticated users)
export const getWeeklySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0); // Start of 7 days ago

    // Get sales grouped by day of week
    const sales = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map MongoDB dayOfWeek (1=Sunday, 2=Monday, ..., 7=Saturday) to readable days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedSales = [];

    // Get last 7 days starting from 7 days ago
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(weekAgo.getDate() + i);
      const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const dayName = days[dayOfWeek];

      // MongoDB dayOfWeek: 1=Sunday, 2=Monday, etc.
      // JavaScript getDay(): 0=Sunday, 1=Monday, etc.
      const mongoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek + 1;

      const found = sales.find((s) => s._id === mongoDayOfWeek);
      formattedSales.push({
        name: dayName,
        sales: found ? Math.round(found.totalSales) : 0,
      });
    }

    res.status(200).json({
      success: true,
      message: "Weekly sales data retrieved successfully",
      data: formattedSales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching weekly sales",
      error: error.message,
    });
  }
};

