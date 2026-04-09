"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderActionsProps {
  initialSession: any;
}

export function HeaderActions({ initialSession }: HeaderActionsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const session = initialSession;

  return (
    <div className="flex items-center gap-2 md:gap-4 transition-opacity duration-300">
      {session && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter mr-2">
          Portal
        </span>
      )}
      {mounted && <ThemeToggle />}
      
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
  );
}
