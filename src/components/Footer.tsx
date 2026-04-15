"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-12 border-t border-black/5 dark:border-white/5 bg-slate-500/5 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex items-center gap-4">
            <img 
              src="/logo-jeheka.png" 
              alt="jeheka logo" 
              className="h-12 w-auto object-contain rounded-xl"
            />
            <div className="flex flex-col">
              <div className="text-xl font-[900] tracking-tighter lowercase leading-none">jeheka</div>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest leading-tight">
                Portal de Clasificados<br/>de Servicios
              </p>
            </div>
          </div>
          <p className="text-xs opacity-50 font-medium leading-relaxed">
            Conectamos a los mejores profesionales con quienes buscan soluciones rápidas y seguras en todo Paraguay.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Plataforma</h4>
            <div className="flex flex-col gap-3 text-xs font-bold opacity-60 uppercase tracking-widest">
              <Link href="/" className="hover:text-emerald-500 transition-colors">Inicio</Link>
              <Link href="/avisos" className="hover:text-emerald-500 transition-colors">Explorar</Link>
              <Link href="/sobre-nosotros" className="hover:text-emerald-500 transition-colors">Nosotros</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Legal</h4>
            <div className="flex flex-col gap-3 text-xs font-bold opacity-60 uppercase tracking-widest">
              <Link href="/politicas" className="hover:text-emerald-500 transition-colors">Términos y Políticas</Link>
              <Link href="/politicas#reembolso" className="hover:text-emerald-500 transition-colors">Reembolsos</Link>
              <Link href="/politicas#envio" className="hover:text-emerald-500 transition-colors">Envíos</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Soporte</h4>
            <div className="flex flex-col gap-3 text-xs font-bold opacity-60 uppercase tracking-widest">
              <Link href="/contacto" className="hover:text-emerald-500 transition-colors">Contacto</Link>
              <Link href="/ayuda" className="hover:text-emerald-500 transition-colors">Preguntas Frecuentes</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
        <span>© {new Date().getFullYear()} Jeheka Corp. All Rights Reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-emerald-500 cursor-pointer transition-colors">PY</span>
          <span className="hover:text-emerald-500 cursor-pointer transition-colors">EN</span>
        </div>
      </div>
    </footer>
  );
}
