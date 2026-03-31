"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Grid, Heart, ChevronRight, Zap, Target, Star, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[150px] delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 px-6 lg:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-5 py-2 rounded-full glass-emerald border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-[0.2em] mb-12 shadow-inner"
        >
          <Zap className="w-3.5 h-3.5 fill-emerald-500" />
          <span>SOLUCIONES EN TIEMPO REAL</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-[800] tracking-tight leading-[0.95] max-w-5xl"
        >
          Encuentra lo que <span className="text-gradient">necesitas</span>,<br />
          JEHEKA lo hace <span className="relative inline-block italic">
            fácil.
            <div className="absolute bottom-4 left-0 w-full h-1 bg-emerald-400/30 -skew-x-12 -z-10" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl mt-10 font-normal leading-relaxed"
        >
          La red más grande de profesionales verificados a tu alcance.
        </motion.p>

        {/* Search Engine - Premium Edition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full max-w-6xl mt-16 p-4 rounded-[3xl] transition-all duration-700 ease-out group ${
            isFocused 
            ? "glass shadow-[0_40px_100px_-20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/40" 
            : "bg-slate-900/60 border border-white/5 shadow-2xl hover:bg-slate-900/80"
          }`}
        >
          <div className="flex flex-col md:flex-row items-stretch p-2 gap-4">
            <div className="flex-[2] relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="¿Qué servicio buscas? (ej. Gasista, Diseñador)"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-slate-800/20 border-none focus:ring-0 text-xl py-6 pl-16 pr-4 text-white rounded-2xl group-v-shadow transition-all"
              />
            </div>
            
            <div className="hidden md:block w-px h-10 bg-slate-700 my-auto self-center opacity-30" />

            <div className="flex-1 relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Ciudad ó Departamento"
                className="w-full bg-slate-800/20 border-none focus:ring-0 py-6 pl-14 pr-4 text-white rounded-2xl transition-all"
              />
            </div>

            <button className="btn-premium px-14 flex gap-3 text-lg">
              <Search className="w-5 h-5" />
              <span>Explorar</span>
            </button>
          </div>
        </motion.div>

        {/* Quick Tags */}
        <div className="mt-8 flex gap-3 text-sm text-slate-500 flex-wrap justify-center">
          <span className="font-bold opacity-60">POPULAR:</span>
          {["Electricista", "Limpieza", "Clases Particulares", "Mudanzas"].map(tag => (
            <button key={tag} className="hover:text-emerald-400 transition-colors cursor-pointer">#{tag}</button>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-[2xl] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-[800] uppercase tracking-wider mb-1">Perfiles Verificados</h3>
              <p className="text-slate-400 text-sm">Garantía de seguridad en cada contacto.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-[2xl] bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-[800] uppercase tracking-wider mb-1">Búsqueda Inteligente</h3>
              <p className="text-slate-400 text-sm">Encuentra exactamente lo que necesitas en segundos.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-[2xl] bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Star className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-[800] uppercase tracking-wider mb-1">Reseñas Reales</h3>
              <p className="text-slate-400 text-sm">Transparencia y feedback con valor real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-[900] tracking-tight mb-4 uppercase">Categorías Principales</h2>
            <p className="text-slate-500 text-lg">Explora la diversidad de talentos disponibles.</p>
          </div>
          <button className="flex items-center gap-2 text-emerald-400 font-bold group hover:text-emerald-300 transition-colors">
            VER TODAS <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Construcción", icon: Grid, color: "emerald" },
            { name: "Hogar", icon: Heart, color: "red" },
            { name: "Tecnología", icon: Zap, color: "blue" },
            { name: "Digital", icon: Target, color: "purple" }
          ].map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-10 rounded-[3xl] bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-start gap-8 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] group-hover:bg-emerald-500/20 transition-all" />
              <cat.icon className="w-10 h-10 text-emerald-500 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-black text-2xl uppercase tracking-tighter block">{cat.name}</span>
                <span className="text-slate-500 text-sm font-bold opacity-60">VER MÁS</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Branding Footer */}
      <footer className="mt-auto py-20 px-6 lg:px-12 border-t border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 opacity-80">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="text-2xl font-black tracking-tighter text-white">JEHEKA CLASIFICADOS</div>
            <p className="text-slate-500 max-w-sm text-sm">
              Conectando la oferta y demanda de servicios profesionales en Paraguay con la mayor eficiencia del mercado.
            </p>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-emerald-400">AYUDA</a>
            <a href="#" className="hover:text-emerald-400">TÉRMINOS</a>
            <a href="#" className="hover:text-emerald-400">PRIVACIDAD</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
