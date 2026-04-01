"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Grid, Heart, ChevronRight, Zap, Target, Star, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-12 px-6 lg:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full glass-emerald border border-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-[0.15em] mb-6 shadow-sm"
        >
          <Zap className="w-2.5 h-2.5 fill-emerald-500" />
          <span>PORTAL DE CLASIFICADOS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-[800] tracking-tight leading-[1.1] max-w-3xl"
        >
          Encuentra lo que <span className="text-gradient">necesitas</span>,<br />
          JEHEKA lo hace <span className="relative inline-block italic text-emerald-500">fácil.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base opacity-60 max-w-lg mt-4 font-normal"
        >
          La red de profesionales verificados a tu alcance.
        </motion.p>

        {/* Search Engine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full max-w-3xl mt-10 p-1.5 rounded-2xl transition-all duration-500 ease-out ${
            isFocused 
            ? "glass shadow-[0_20px_50px_-10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30" 
            : "bg-slate-500/5 border border-black/5 dark:border-white/5 shadow-md"
          }`}
        >
          <div className="flex flex-col md:flex-row items-stretch gap-1.5">
            <div className="flex-[2] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="¿Qué servicio buscas?"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 pl-11 pr-4 rounded-xl"
              />
            </div>
            
            <div className="hidden md:block w-px h-6 bg-current opacity-10 my-auto self-center" />

            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="Ubicación"
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 pl-11 pr-4 rounded-xl"
              />
            </div>

            <button className="btn-premium px-10 py-3 text-xs uppercase tracking-widest font-black shrink-0">
              Buscar
            </button>
          </div>
        </motion.div>

        {/* Quick Tags */}
        <div className="mt-5 flex gap-4 text-[10px] opacity-40 flex-wrap justify-center font-bold tracking-widest">
          {["ELECTRICISTA", "HOGAR", "LEGAL", "MUDANZAS"].map(tag => (
            <button key={tag} className="hover:text-emerald-500 transition-colors cursor-pointer tracking-tighter">#{tag}</button>
          ))}
        </div>
      </section>

      {/* Trust Mini-Bar */}
      <section className="py-6 border-y border-black/5 dark:border-white/5 glass">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-70" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Verificados</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500 opacity-70" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Búsqueda Smart</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-500 opacity-70" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Feedback Real</span>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-black tracking-tight uppercase">Categorías</h2>
          <button className="text-[10px] text-emerald-500 font-black hover:underline uppercase tracking-widest">Ver Todas</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Construcción", icon: Grid },
            { name: "Hogar", icon: Heart },
            { name: "Tecnología", icon: Zap },
            { name: "Digital", icon: Target }
          ].map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -3, backgroundColor: "rgba(16, 185, 129, 0.05)" }}
              className="p-5 rounded-2xl bg-slate-500/5 border border-black/5 dark:border-white/5 transition-all flex flex-col items-start gap-4 cursor-pointer"
            >
              <cat.icon className="w-5 h-5 text-emerald-500 opacity-80" />
              <span className="font-bold text-[10px] uppercase tracking-wide opacity-70">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 lg:px-12 border-t border-black/5 dark:border-white/5 bg-slate-500/5">
        <div className="max-w-4xl mx-auto flex justify-between items-center opacity-40">
          <div className="text-[10px] font-black tracking-widest uppercase">JEHEKA CLASIFICADOS</div>
          <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500">Ayuda</a>
            <a href="#" className="hover:text-emerald-500">Términos</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
