import Bill from "../models/Bill.js";
import Product from "../models/Product.js";

// @desc    Get Sales Report
// @route   GET /api/reports/sales
// @access  Private (admin, manager, staff)
export const getSalesReport = async (req, res) => {
  try {
    const { from, to, search } = req.query;
    const query = {};

    // Date range filter
    if (from && to) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      query.date = {
        $gte: fromDate,
        $lte: toDate,
      };
    } else if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      query.date = { $gte: fromDate };
    } else if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      query.date = { $lte: toDate };
    }

    // Search filter
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const bills = await Bill.find(query).sort({ date: -1, createdAt: -1 });

    const totalSales = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgSaleValue = bills.length > 0 ? totalSales / bills.length : 0;

    // Format bills for response
    const formattedBills = bills.map((bill) => ({
      _id: bill._id,
      date: bill.date || bill.createdAt,
      invoice: `INV-${bill._id.toString().slice(-6).toUpperCase()}`,
      customer: bill.customerName || "N/A",
      customerPhone: bill.customerPhone || "",
      total: bill.totalAmount || 0,
      status: bill.status || "Pending",
    }));

    res.status(200).json({
      success: true,
      message: "Sales report retrieved successfully",
      data: {
        totalSales,
        count: bills.length,
        avgSaleValue: Math.round(avgSaleValue * 100) / 100,
        bills: formattedBills,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sales report",
      error: error.message,
    });
  }
};

// @desc    Get Profit & Loss Report
// @route   GET /api/reports/profit-loss
// @access  Private (admin, manager only)
export const getProfitLossReport = async (req, res) => {
  try {
    const { period } = req.query; // 'month', 'quarter', 'year', or 'all'

    const now = new Date();
    const start = new Date(now);

    // Set start date based on period
    if (period === "month") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (period === "quarter") {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      start.setMonth(currentQuarter * 3);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (period === "year") {
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else {
      // 'all' or no period specified - get all time data
      start.setFullYear(2000, 0, 1);
    }

    now.setHours(23, 59, 59, 999);

    const bills = await Bill.find({
      date: { $gte: start, $lte: now },
    });
    const products = await Product.find();

    let totalSales = 0;
    let totalPurchase = 0;

    for (const bill of bills) {
      for (const item of bill.items) {
        const product = products.find(
          (p) => p._id.toString() === item.productId?.toString()
        );
        if (product && product.purchasePrice) {
          totalSales += item.qty * item.price;
          totalPurchase += item.qty * product.purchasePrice;
        }
      }
    }

    const profit = totalSales - totalPurchase;
    const profitPercent =
      totalSales > 0 ? ((profit / totalSales) * 100).toFixed(2) : "0.00";

    res.status(200).json({
      success: true,
      message: "Profit & Loss report retrieved successfully",
      data: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalPurchase: Math.round(totalPurchase * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        profitPercent,
        period: period || "all",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profit & loss report",
      error: error.message,
    });
  }
};

// @desc    Get Stock Report
// @route   GET /api/reports/stock
// @access  Private (admin, manager, staff)
export const getStockReport = async (req, res) => {
  try {
    const { lowStockOnly } = req.query;

    const query = lowStockOnly === "true" ? { stock: { $lte: 5 } } : {};

    const products = await Product.find(query).sort({ stock: 1 });

    const formattedProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category || "N/A",
      stock: p.stock || 0,
      price: p.sellingPrice || 0,
      purchasePrice: p.purchasePrice || 0,
      status: p.stock <= 5 ? "Low Stock" : "In Stock",
      barcode: p.barcode || "",
    }));

    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;
    const totalStockValue = products.reduce(
      (sum, p) => sum + (p.stock || 0) * (p.purchasePrice || 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "Stock report retrieved successfully",
      data: {
        products: formattedProducts,
        summary: {
          totalProducts,
          lowStockCount,
          totalStockValue: Math.round(totalStockValue * 100) / 100,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stock report",
      error: error.message,
    });
  }
};

