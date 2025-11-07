import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      qty: Number,
      price: Number,
      total: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);

