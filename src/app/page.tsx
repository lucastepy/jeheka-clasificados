"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Grid, Heart, ChevronRight, Zap } from "lucide-react";

export default function HomePage() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-[#1e293b] to-emerald-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-emerald-500/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            <span className="uppercase tracking-wider">Servicios en segundos</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          >
            Encuentra lo que <span className="text-emerald-400">necesitas</span>,<br />
            JEHEKA lo hace <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">fácil</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Catálogo completo de servicios profesionales en un solo lugar.
          </motion.p>

          {/* Search Bar - Reverted to simple location input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`w-full max-w-5xl mt-12 p-2 rounded-3xl transition-all duration-500 ${
              isFocused ? "glass shadow-[0_0_50px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50" : "bg-slate-800/80 border border-white/5 shadow-xl"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center p-1">
              <div className="flex-1 relative group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="¿A quién estás buscando hoy?"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent border-none focus:ring-0 text-xl py-6 pl-16 pr-4 text-white placeholder-slate-500"
                />
              </div>
              
              <div className="hidden md:block w-px h-10 bg-slate-700 mx-4" />

              <div className="w-full md:w-64 relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Ubicación"
                  className="w-full bg-transparent border-none focus:ring-0 py-6 pl-12 pr-4 text-white placeholder-slate-500"
                />
              </div>

              <button className="btn-premium px-12 py-6 text-xl font-bold w-full md:w-auto">
                Buscar
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories (Mock) */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-12">Categorías Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {["Construcción", "Hogar", "Legal", "Salud", "Digital", "Eventos"].map((cat) => (
            <motion.div
              key={cat}
              whileHover={{ scale: 1.05 }}
              className="group p-8 rounded-3xl bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-4 cursor-pointer"
            >
              <Grid className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span className="font-medium text-lg uppercase tracking-tight">{cat}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
