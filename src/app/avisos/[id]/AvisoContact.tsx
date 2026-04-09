"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, QrCode } from "lucide-react";

export default function AvisoContact({ whatsapp, titulo }: { whatsapp: string, titulo: string }) {
  const [showPopup, setShowPopup] = useState(false);

  const cleanNumber = whatsapp?.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=Hola, estoy interesado en su aviso: ${encodeURIComponent(titulo)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(waUrl)}`;

  return (
    <>
      <button 
        onClick={() => setShowPopup(true)}
        className="w-full btn-premium py-4 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
      >
        <Phone className="w-4 h-4 fill-current" />
        Contactar por WhatsApp
      </button>

      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center overflow-hidden"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <QrCode className="w-10 h-10 text-emerald-500" />
              </div>

              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Escanea para chatear</h3>
              <p className="text-xs opacity-50 uppercase tracking-widest mb-8 font-bold">Abre tu cámara y apunta al QR</p>

              <div className="p-4 bg-white rounded-3xl mb-8">
                <img src={qrUrl} alt="WhatsApp QR" className="w-48 h-48" />
              </div>

              <div className="w-full space-y-3">
                <a 
                  href={waUrl}
                  target="_blank"
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                  Abrir WhatsApp Directo
                </a>
                <button 
                   onClick={() => setShowPopup(false)}
                   className="w-full py-4 rounded-2xl bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Quizás más tarde
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
