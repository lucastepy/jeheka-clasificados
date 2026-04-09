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
          <UserMenu user={session} />
          <Link href="/mis-avisos/nuevo" className="btn-premium px-4 py-1.5 text-[10px] uppercase tracking-widest inline-block text-center">
            Nuevo Aviso
          </Link>
        </>
      )}
    </div>
  );
}
