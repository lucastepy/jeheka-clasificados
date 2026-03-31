import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeheka Clasificados | Tu Portal de Servicios",
  description: "Encuentra y publica servicios profesionales de manera rápida y segura en el ecosistema Jeheka.",
  keywords: ["servicios", "clasificados", "publicar", "buscar", "profesionales"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 h-16 flex items-center px-6 lg:px-12 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
              JEHEKA
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
              Clasificados
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition-colors">Categorías</a>
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition-colors">Ciudades</a>
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition-colors">Cómo funciona</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-slate-400 transition-colors">Ingresar</button>
            <button className="btn-premium px-4 py-2 text-sm">Publicar Servicio</button>
          </div>
        </header>
        
        <main className="pt-16 min-h-screen">
          {children}
        </main>

        <footer className="py-12 bg-slate-900 border-t border-white/5 px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="space-y-4">
              <span className="text-2xl font-bold text-emerald-400">JEHEKA</span>
              <p className="text-sm text-slate-400 leading-relaxed">
                La plataforma líder para la promoción de servicios profesionales. 
                Conectamos oferta y demanda con eficiencia.
              </p>
            </div>
            {/* Future Footer Sections */}
          </div>
        </footer>
      </body>
    </html>
  );
}
