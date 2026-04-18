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
export const revalidate = 0;
import { UserMenu } from "@/components/UserMenu";
import { HeaderActions } from "@/components/HeaderActions";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeheka.com.py"),
  title: {
    default: "Jeheka Clasificados | Tu Portal de Servicios en Paraguay",
    template: "%s | Jeheka"
  },
  description: "Encuentra y publica servicios profesionales de manera rápida y segura. La red de confianza para electricistas, plomeros, mudanzas y más en Paraguay.",
  keywords: ["servicios", "clasificados", "paraguay", "publicar anuncios", "buscar profesionales", "jeheka"],
  authors: [{ name: "Jeheka Team" }],
  creator: "Jeheka S.A.",
  publisher: "Jeheka S.A.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jeheka Clasificados | Tu Portal de Servicios",
    description: "Encuentra profesionales verificados en Paraguay. Rápido, seguro y confiable.",
    url: "https://jeheka.com.py",
    siteName: "Jeheka",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "/logo-jeheka.png",
        width: 1200,
        height: 630,
        alt: "Jeheka Clasificados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeheka Clasificados",
    description: "Tu Portal de Servicios en Paraguay",
    images: ["/logo-jeheka.png"],
  },
  icons: {
    icon: "/logo-jeheka.png",
    apple: "/logo-jeheka.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("jk_auth_session")?.value;
  let session = null;
  if (sessionToken) {
    try {
      session = await decrypt(sessionToken);
    } catch (e) {
      console.error("Layout Session Error:", e);
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
            </div>

            <HeaderActions initialSession={session} />
          </header>
          <Toaster position="top-right" richColors closeButton />
          
          <main className="pt-14 min-h-[calc(100vh-56px)] flex flex-col">
            {children}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
