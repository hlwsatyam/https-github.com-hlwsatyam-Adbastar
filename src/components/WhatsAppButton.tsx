import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/admin/settings");
        setWhatsappNumber(data.whatsappNumber);
      } catch (error) {
        console.error("Error fetching settings", error);
      }
    };
    fetchSettings();
  }, []);

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform animate-bounce"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
    </a>
  );
}
