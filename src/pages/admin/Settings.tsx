import React, { useState, useEffect } from "react";
import axios from "axios";
import { QrCode, MessageCircle, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [paymentQrCode, setPaymentQrCode] = useState<File | null>(null);
  const [currentQrCode, setCurrentQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWhatsappNumber(data.whatsappNumber);
      setCurrentQrCode(data.paymentQrCode);
    } catch (error) {
      console.error("Error fetching settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("whatsappNumber", whatsappNumber);
    if (paymentQrCode) formData.append("paymentQrCode", paymentQrCode);

    try {
      await axios.put("/api/admin/settings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Settings updated successfully");
      fetchSettings();
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Platform Settings</h2>
        <p className="text-white/40">Configure global settings for your academy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 ml-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp Support Number
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="919876543210 (with country code)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <p className="text-[10px] text-white/30 ml-1">Include country code without '+' (e.g., 91 for India)</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-white/70 ml-1 flex items-center gap-2">
              <QrCode className="w-4 h-4" /> Payment QR Code
            </label>
            
            <div className="flex items-start gap-6">
              <div className="bg-white p-2 rounded-2xl shrink-0">
                {currentQrCode ? (
                  <img
                    src={`/${currentQrCode}`}
                    alt="Current QR"
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center text-black/20 font-bold border-2 border-dashed border-black/10">
                    No QR
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentQrCode(e.target.files?.[0] || null)}
                    className="hidden"
                    id="qr-upload"
                  />
                  <label
                    htmlFor="qr-upload"
                    className="flex items-center gap-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <ImageIcon className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/60 truncate">
                      {paymentQrCode ? paymentQrCode.name : "Upload New QR Code"}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-white/30">Upload your UPI/Bank QR code for manual payments.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Settings</>}
        </button>
      </form>
    </div>
  );
}
