import Bill from "../models/Bill.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

// @desc    Create a new bill
// @route   POST /api/billing
// @access  Private (admin, manager, staff)
export const createBill = async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in bill",
      });
    }

    // Calculate total and check stock
    let totalAmount = 0;
    const itemsToProcess = [];

    // First, validate all items and check stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.productId}`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`,
        });
      }

      const itemTotal = item.qty * item.price;
      totalAmount += itemTotal;

      itemsToProcess.push({
        productId: product._id,
        name: product.name,
        qty: item.qty,
        price: item.price,
        total: itemTotal,
      });
    }

    // Create the bill
    const newBill = await Bill.create({
      customerName,
      customerPhone,
      items: itemsToProcess,
      totalAmount,
      status: "Pending",
    });

    // Deduct stock for all products
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: newBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating bill",
      error: error.message,
    });
  }
};

// @desc    Get all bills
// @route   GET /api/billing
// @access  Private (all authenticated users)
export const getBills = async (req, res) => {
  try {
    const { query, status } = req.query;
    const filter = {};

    if (query) {
      filter.$or = [
        { customerName: { $regex: query, $options: "i" } },
        { customerPhone: { $regex: query, $options: "i" } },
      ];
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    const bills = await Bill.find(filter)
      .sort({ createdAt: -1 })
      .populate("items.productId", "name");

    res.status(200).json({
      success: true,
      message: "Bills retrieved successfully",
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bills",
      error: error.message,
    });
  }
};

// @desc    Get single bill by ID
// @route   GET /api/billing/:id
// @access  Private (all authenticated users)
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate(
      "items.productId",
      "name category barcode"
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bill retrieved successfully",
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bill",
      error: error.message,
    });
  }
};

// @desc    Update bill status
// @route   PUT /api/billing/:id/status
// @access  Private (admin, manager only)
export const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Paid", "Pending", "Overdue"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be Paid, Pending, or Overdue",
      });
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // Save customer information when bill is paid
    if (status === "Paid" && bill.customerName) {
      try {
        // Check if customer already exists
        let customer = await Customer.findOne({
          $or: [
            { name: bill.customerName, phone: bill.customerPhone },
            { phone: bill.customerPhone },
          ],
        });

        if (customer) {
          // Update existing customer
          customer.lastBillDate = new Date();
          customer.totalBills += 1;
          await customer.save();
        } else {
          // Create new customer
          await Customer.create({
            name: bill.customerName,
            phone: bill.customerPhone || "",
            lastBillDate: new Date(),
            totalBills: 1,
          });
        }
      } catch (customerError) {
        // Don't fail the bill update if customer save fails
        console.error("Error saving customer:", customerError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Bill status updated successfully",
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating bill status",
      error: error.message,
    });
  }
};

// @desc    Delete bill
// @route   DELETE /api/billing/:id
// @access  Private (admin only)
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // Optionally restore stock (if needed)
    // This is a design decision - you might want to restore stock when deleting a bill
    // For now, we'll just delete the bill

    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting bill",
      error: error.message,
    });
  }
};

