import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  lastBillDate: { type: Date, default: Date.now },
  totalBills: { type: Number, default: 1 },
}, { timestamps: true });

// Create index for faster search
customerSchema.index({ name: "text", phone: "text" });

export default mongoose.model("Customer", customerSchema);

