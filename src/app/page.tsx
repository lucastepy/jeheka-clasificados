"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Grid, Heart, ChevronRight, Zap, Target, Star, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* Compact Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-emerald border border-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-[0.15em] mb-8 shadow-inner"
        >
          <Zap className="w-3 h-3 fill-emerald-500" />
          <span>PORTAL DE CLASIFICADOS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-[800] tracking-tight leading-[1.1] max-w-4xl"
        >
          Encuentra lo que <span className="text-gradient">necesitas</span>,<br />
          JEHEKA lo hace <span className="relative inline-block italic">fácil.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-400 max-w-xl mt-6 font-normal leading-relaxed"
        >
          La red de profesionales verificados a tu alcance.
        </motion.p>

        {/* Compact Search Engine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full max-w-4xl mt-12 p-1.5 rounded-[2xl] transition-all duration-500 ease-out ${
            isFocused 
            ? "glass shadow-[0_20px_50px_-10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30" 
            : "bg-slate-900/80 border border-white/5 shadow-xl"
          }`}
        >
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex-[2] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="¿Qué servicio buscas? (ej. Gasista)"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-slate-800/20 border-none focus:ring-0 text-base py-3.5 pl-10 pr-4 text-white rounded-xl transition-all"
              />
            </div>
            
            <div className="hidden md:block w-px h-6 bg-slate-700 my-auto self-center opacity-30" />

            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Ciudad / Distrito"
                className="w-full bg-slate-800/20 border-none focus:ring-0 py-3.5 pl-10 pr-4 text-white rounded-xl transition-all"
              />
            </div>

            <button className="btn-premium px-8 py-3.5 text-sm uppercase tracking-wider font-bold">
              Buscar
            </button>
          </div>
        </motion.div>

        {/* Compact Quick Tags */}
        <div className="mt-6 flex gap-4 text-xs text-slate-500 flex-wrap justify-center font-medium">
          <span className="opacity-40 uppercase tracking-widest">Populares:</span>
          {["Electricista", "Hogar", "Legal", "Digital"].map(tag => (
            <button key={tag} className="hover:text-emerald-400 transition-colors cursor-pointer">#{tag}</button>
          ))}
        </div>
      </section>

      {/* Trust Mini-Bar */}
      <section className="py-10 border-y border-white/5 glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Verificados</span>
          </div>
          <div className="flex items-center gap-4">
            <Target className="w-6 h-6 text-cyan-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Búsqueda Smart</span>
          </div>
          <div className="flex items-center gap-4">
            <Star className="w-6 h-6 text-purple-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Feedback Real</span>
          </div>
        </div>
      </section>

      {/* Category Grid - More compact */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-[900] tracking-tight uppercase">Categorías</h2>
          <button className="text-xs text-emerald-400 font-bold hover:underline">VER TODAS</button>
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
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col items-start gap-4 cursor-pointer"
            >
              <cat.icon className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-xs uppercase tracking-tight">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-white/5 bg-slate-900/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <div className="text-sm font-black tracking-tighter text-white">JEHEKA CLASIFICADOS</div>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-400">Ayuda</a>
            <a href="#" className="hover:text-emerald-400">Términos</a>
            <a href="#" className="hover:text-emerald-400">Privacidad</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
