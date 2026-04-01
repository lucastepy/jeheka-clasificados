import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

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
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-14 flex items-center px-6 lg:px-12 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-600">
                JEHEKA
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter">
                Publicar
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-emerald-500 transition-all">
                Cómo funciona
              </a>
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
                Ingresar
              </Link>
              <button className="btn-premium px-4 py-1.5 text-[10px] uppercase tracking-widest">
                Crear Aviso
              </button>
            </div>
          </header>
          
          <main className="pt-14">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
