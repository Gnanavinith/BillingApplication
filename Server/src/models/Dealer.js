import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  city: { type: String },
}, { timestamps: true });

export default mongoose.model("Dealer", dealerSchema);

