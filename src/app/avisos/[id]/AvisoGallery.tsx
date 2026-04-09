"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export default function AvisoGallery({ imagenes, titulo }: { imagenes: string[], titulo: string }) {
  const [index, setIndex] = useState(0);

  if (imagenes.length === 0) {
    return (
      <div className="aspect-square rounded-[2.5rem] overflow-hidden glass border border-white/5 relative bg-slate-500/10 flex flex-col items-center justify-center opacity-10">
        <ImageIcon className="w-20 h-20 mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Sin Imagen</span>
      </div>
    );
  }

  const next = () => setIndex((prev) => (prev + 1) % imagenes.length);
  const prev = () => setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-[2.5rem] overflow-hidden glass border border-white/5 relative bg-slate-500/10 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={imagenes[index]}
            alt={titulo}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-contain bg-black/40"
          />
        </AnimatePresence>

        {imagenes.length > 1 && (
          <>
            <button 
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {imagenes.map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-emerald-500 w-4' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${i === index ? 'border-emerald-500' : 'border-transparent opacity-50'}`}
            >
              <img src={img} alt={`${titulo} ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
