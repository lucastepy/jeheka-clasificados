"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Grid, Heart, ChevronRight, Zap, Target, Star, ShieldCheck, Clock, Eye, ImageIcon, Phone } from "lucide-react";

export default function HomePage() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Initial load of featured or recent ads
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&limit=12`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

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
          className="flex items-center gap-2 px-3 py-1 rounded-full glass-emerald border border-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-widest mb-6 shadow-sm"
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
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch gap-1.5">
            <div className="flex-[2] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="¿Qué servicio buscas? Ej: Electricista..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 pl-11 pr-4 rounded-xl outline-none"
              />
            </div>
            
            <div className="hidden md:block w-px h-6 bg-current opacity-10 my-auto self-center" />

            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="Toda la red"
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 pl-11 pr-4 rounded-xl outline-none"
              />
            </div>

            <button type="submit" className="btn-premium px-10 py-3 text-xs uppercase tracking-widest font-bold shrink-0">
              Buscar
            </button>
          </form>
        </motion.div>

        {/* Quick Tags */}
        <div className="mt-5 flex gap-4 text-[10px] opacity-40 flex-wrap justify-center font-bold tracking-widest">
          {["ELECTRICISTA", "HOGAR", "LEGAL", "MUDANZAS"].map(tag => (
            <button key={tag} className="hover:text-emerald-500 transition-colors cursor-pointer">#{tag}</button>
          ))}
        </div>
      </section>

      {/* Trust Mini-Bar */}
      <section className="py-6 border-y border-black/5 dark:border-white/5 glass">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-70" />
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Verificados</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500 opacity-70" />
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Búsqueda Smart</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-500 opacity-70" />
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Feedback Real</span>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full min-h-[400px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-[900] tracking-tight uppercase leading-none">
              {searched && query ? `Resultados para "${query}"` : "Anuncios Recientes"}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">Explora los mejores servicios disponibles</p>
          </div>
          
          {loading && <div className="animate-pulse flex gap-2 items-center text-[10px] font-bold uppercase text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/> Buscando...</div>}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {results.map((aviso, idx) => {
                const imagenes = Array.isArray(aviso.avi_imagenes) ? aviso.avi_imagenes : [];
                return (
                  <motion.div
                    key={aviso.avi_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass rounded-[2rem] border border-white/5 overflow-hidden flex flex-col group h-full shadow-lg hover:shadow-emerald-500/5 transition-all duration-500"
                  >
                    <div className="h-44 bg-slate-500/10 relative overflow-hidden">
                      {imagenes[0] ? (
                        <img src={imagenes[0]} alt={aviso.avi_titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                          <ImageIcon className="w-10 h-10 mb-2" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Sin Imagen</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-bold uppercase tracking-widest text-emerald-400">
                        {aviso.vendedor_nombre}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-md font-bold leading-tight mb-3 group-hover:text-emerald-500 transition-colors uppercase line-clamp-2">
                        {aviso.avi_titulo}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-emerald-500">
                             {aviso.avi_precio ? `Gs. ${new Intl.NumberFormat('es-PY').format(aviso.avi_precio)}` : "Consultar"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <button className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
                              <Phone className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
               <Search className="w-16 h-16 mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest">No encontramos anuncios que coincidan</p>
               <button onClick={() => { setQuery(""); handleSearch(); }} className="mt-4 text-emerald-400 text-[10px] font-bold uppercase tracking-widest underline">Ver todos los anuncios</button>
            </div>
          )
        )}
      </section>

      {/* Category Grid */}
      <section className="py-16 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-bold tracking-tight uppercase">Categorías</h2>
          <button className="text-[10px] text-emerald-500 font-bold hover:underline uppercase tracking-widest">Ver Todas</button>
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
      <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-black/5 dark:border-white/5 bg-slate-500/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img 
              src="/logo-jeheka.png" 
              alt="jeheka logo" 
              className="h-12 w-auto object-contain rounded-xl opacity-80"
            />
            <div className="flex flex-col text-left">
              <div className="text-sm font-bold tracking-tighter lowercase leading-none">jeheka</div>
              <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest leading-tight">
                Clasificado de<br/>Servicios en Paraguay
              </p>
            </div>
          </div>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest opacity-40">
            <a href="#" className="hover:text-emerald-500 transition-colors">Ayuda</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Términos</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
