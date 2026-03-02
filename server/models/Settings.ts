import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    paymentQrCode: { type: String, default: "" }, // Path to the QR code image
    whatsappNumber: { type: String, default: "" }, // WhatsApp support number
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
