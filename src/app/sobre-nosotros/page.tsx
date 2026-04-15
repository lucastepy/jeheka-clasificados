"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Search, MessageCircle, Star, CheckCircle2, ShieldCheck } from "lucide-react";

export default function SobreNosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 bg-slate-500/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full glass-emerald border border-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-widest mb-8 mx-auto w-fit uppercase"
          >
            <Rocket className="w-2.5 h-2.5" />
            <span>Nuestra Misión</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter leading-none mb-8 uppercase">
            REDEFINIENDO EL<br />
            <span className="text-gradient">TRABAJO EN PARAGUAY</span>
          </h1>
          <p className="text-lg md:text-xl opacity-60 font-medium max-w-2xl mx-auto leading-relaxed">
            Jeheka nació con una idea simple: encontrar servicios profesionales no debería ser una tarea difícil. Conectamos talento local con necesidades reales.
          </p>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">¿Qué es Jeheka?</h2>
            <div className="space-y-4 text-base opacity-70 leading-relaxed font-medium">
              <p>
                En guaraní, "Jeheka" significa búsqueda. Somos el primer portal de clasificados especializado exclusivamente en <strong>servicios</strong> en Paraguay.
              </p>
              <p>
                A diferencia de otras plataformas de venta de productos, nos enfocamos en el valor humano: electricistas, desarrolladores, abogados, médicos y creativos que ofrecen su experiencia para solucionar problemas del día a día.
              </p>
            </div>
            
            <div className="pt-6 grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-black text-emerald-500 mb-1">500+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Profesionales</div>
              </div>
              <div>
                <div className="text-4xl font-black text-emerald-500 mb-1">15+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Categorías</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 relative">
            <div className="p-8 rounded-[32px] glass border border-emerald-500/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">Seguridad Garantizada</h3>
              <p className="text-[11px] opacity-50 leading-relaxed font-bold uppercase tracking-tight">
                Verificamos manualmente los perfiles destacados para asegurar que recibas un servicio de calidad.
              </p>
            </div>

            <div className="p-8 rounded-[32px] glass border border-emerald-500/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">Enfoque Local</h3>
              <p className="text-[11px] opacity-50 leading-relaxed font-bold uppercase tracking-tight">
                Diseñado por paraguayos para paraguayos. Conocemos tus necesidades y el mercado local.
              </p>
            </div>

            {/* Floating decoration */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 lg:px-12 bg-slate-500/5">
        <div className="max-w-6xl mx-auto w-full text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">¿Cómo funciona?</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500 opacity-60">El camino hacia tu solución en 3 pasos</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              icon: Search,
              title: "Busca",
              desc: "Utiliza nuestro motor de búsqueda inteligente para filtrar por categoría, ubicación y calificación."
            },
            {
              icon: MessageCircle,
              title: "Contacta",
              desc: "Comunícate directamente con el profesional vía WhatsApp o llamada telefónica sin intermediarios."
            },
            {
              icon: Star,
              title: "Califica",
              desc: "Tu feedback es vital. Ayuda a otros usuarios compartiendo tu experiencia con el servicio recibido."
            }
          ].map((item, idx) => (
            <div key={idx} className="relative group text-center md:text-left">
              <div className="mb-6 mx-auto md:mx-0 w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-3 tracking-tight">{item.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed font-medium">{item.desc}</p>
              {idx < 2 && (
                <div className="hidden lg:block absolute top-8 -right-6 w-12 h-px bg-emerald-500/20" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-10 rounded-3xl glass border border-white/5 hover:border-emerald-500/30 transition-colors">
            <Users className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Comunidad Primero</h3>
            <p className="text-sm opacity-60 leading-relaxed font-medium">
              Empoderamos a los emprendedores locales dándoles la plataforma que necesitan para crecer profesionalmente de manera justa.
            </p>
          </div>
          <div className="p-10 rounded-3xl glass border border-white/5 hover:border-emerald-500/30 transition-colors">
            <Target className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Transparencia Total</h3>
            <p className="text-sm opacity-60 leading-relaxed font-medium">
              Sin costos ocultos ni comisiones por contacto. Nuestra transparencia es el pilar de la confianza en el ecosistema Jeheka.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
