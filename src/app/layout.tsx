import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { decrypt } from "@/app/login/actions";

export const dynamic = "force-dynamic";
import { UserMenu } from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Jeheka Clasificados | Tu Portal de Servicios",
  description: "Encuentra y publica servicios profesionales de manera rápida y segura en el ecosistema Jeheka.",
  keywords: ["servicios", "clasificados", "publicar", "buscar", "profesionales"],
  icons: {
    icon: "/logo-jeheka.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  let session = null;
  if (sessionToken) {
    try {
      session = await decrypt(sessionToken);
    } catch (e) {
      session = null;
    }
  }

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
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <img 
                  src="/logo-jeheka.png" 
                  alt="jeheka logo" 
                  className="h-11 w-auto object-contain rounded-xl transition-all group-hover:scale-105 shadow-md"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold tracking-tighter lowercase">jeheka</span>
                  <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest leading-tight">Clasificado de<br/>Servicios en Paraguay</span>
                </div>
              </Link>
              {session && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter">
                  Portal
                </span>
              )}
              {sessionToken && !session && (
                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
                  DEBUG: Cookie detectada pero inválida
                </span>
              )}
            </div>


            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              
              {!session ? (
                <>
                  <Link href="/login" className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
                    Ingresar
                  </Link>
                  <Link href="/login" className="btn-premium px-4 py-1.5 text-[10px] uppercase tracking-widest inline-block">
                    Crear Aviso
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/mis-datos" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-500/5 transition-all group">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-emerald-500 transition-all">Mis Datos</span>
                  </Link>
                  <UserMenu user={session} />
                  <Link href="/mis-avisos/nuevo" className="btn-premium px-4 py-1.5 text-[10px] uppercase tracking-widest inline-block text-center">
                    Nuevo Aviso
                  </Link>
                </>
              )}
            </div>
          </header>
          <Toaster position="top-right" richColors closeButton />
          
          <main className="pt-14">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
