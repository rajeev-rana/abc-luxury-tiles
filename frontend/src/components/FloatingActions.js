"use client";
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const handleCall = () => {
    window.open('tel:+919876543210', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I am browsing the ABC Luxury Tiles catalog and would like to get a quotation.");
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* WhatsApp Button */}
      <button 
        onClick={handleWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
        title="WhatsApp Support"
        aria-label="WhatsApp Support"
      >
        <MessageCircle size={22} className="fill-white stroke-none" />
      </button>

      {/* Direct Call Button */}
      <button 
        onClick={handleCall}
        className="bg-gold hover:bg-gold-dark text-black rounded-full p-4 shadow-lg transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
        title="Call Dealer"
        aria-label="Call Dealer"
      >
        <Phone size={22} className="fill-black" />
      </button>
    </div>
  );
}
