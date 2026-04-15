"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Mensaje enviado con éxito. Te contactaremos pronto.", {
        description: "Gracias por escribirnos a Jeheka.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pt-20 pb-20 px-6 lg:px-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-emerald border border-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-widest mb-6 mx-auto w-fit uppercase">
          <MessageSquare className="w-2.5 h-2.5" />
          <span>Atención al Cliente</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-[900] tracking-tight leading-none mb-6 uppercase">
          ¿Cómo podemos <span className="text-gradient">ayudarte?</span>
        </h1>
        <p className="text-base opacity-60 font-medium max-w-2xl mx-auto text-balance">
          Nuestro equipo está listo para responder tus dudas sobre el registro, publicaciones o cualquier inconveniente en la plataforma.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl p-8 border border-white/5 space-y-8">
            <div className="flex gap-6 items-start">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Escríbenos</h3>
                <p className="text-sm font-bold">soporte@jeheka.com.py</p>
                <p className="text-[10px] opacity-40 font-bold uppercase mt-1">Respuesta en menos de 24hs</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Oficina Central</h3>
                <p className="text-sm font-bold">Asunción, Paraguay</p>
                <p className="text-[10px] opacity-40 font-bold uppercase mt-1">Denis Roa esq. Alas Paraguayas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-10 border border-white/5 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-500/5 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-emerald-500/30 focus:bg-emerald-500/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Correo Electrónico</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-slate-500/5 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-emerald-500/30 focus:bg-emerald-500/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Asunto</label>
              <select className="w-full bg-slate-500/5 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-emerald-500/30 focus:bg-emerald-500/5 transition-all appearance-none cursor-pointer">
                <option value="soporte">Soporte Técnico</option>
                <option value="ventas">Ventas y Planes</option>
                <option value="reclamos">Reclamos</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Mensaje</label>
              <textarea 
                required
                rows={5}
                placeholder="Cuéntanos más detalles..."
                className="w-full bg-slate-500/5 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-emerald-500/30 focus:bg-emerald-500/5 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full btn-premium py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enviar Mensaje</span>
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
