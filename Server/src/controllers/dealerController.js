import Dealer from "../models/Dealer.js";

// @desc    Get all dealers
// @route   GET /api/dealers
// @access  Private (all authenticated users)
export const getDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Dealers retrieved successfully",
      data: dealers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealers",
      error: error.message,
    });
  }
};

// @desc    Get single dealer by ID
// @route   GET /api/dealers/:id
// @access  Private (all authenticated users)
export const getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer retrieved successfully",
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealer",
      error: error.message,
    });
  }
};

// @desc    Add new dealer
// @route   POST /api/dealers
// @access  Private (admin, manager only)
export const addDealer = async (req, res) => {
  try {
    const dealer = await Dealer.create(req.body);
    res.status(201).json({
      success: true,
      message: "Dealer added successfully",
      data: dealer,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: "Error creating dealer",
      error: error.message,
    });
  }
};

// @desc    Update dealer
// @route   PUT /api/dealers/:id
// @access  Private (admin, manager only)
export const updateDealer = async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer updated successfully",
      data: dealer,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: "Error updating dealer",
      error: error.message,
    });
  }
};

// @desc    Delete dealer
// @route   DELETE /api/dealers/:id
// @access  Private (admin, manager only)
export const deleteDealer = async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer deleted successfully",
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting dealer",
      error: error.message,
    });
  }
};

