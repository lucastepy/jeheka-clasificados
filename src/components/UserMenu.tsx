"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, LogOut, ChevronDown, Settings, Heart, LayoutDashboard } from "lucide-react";
import { logoutUser } from "@/app/login/actions";
import Link from "next/link";

interface UserMenuProps {
  user: {
    name: string;
    id: string;
    fotoUrl?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-full glass hover:bg-slate-500/10 transition-all border border-black/5 dark:border-white/5 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/20 overflow-hidden">
          {user.fotoUrl ? (
            <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black tracking-widest uppercase opacity-40 leading-none">Portal</span>
          <span className="text-[11px] font-bold truncate max-w-[100px]">{user.name}</span>
        </div>
        <ChevronDown className={`w-3 h-3 opacity-30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 glass p-2 rounded-2xl shadow-2xl z-50 border border-black/5 dark:border-white/5"
            >
              <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                   {user.fotoUrl ? (
                     <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon className="w-5 h-5 text-emerald-500" />
                   )}
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mb-0.5">Tu Cuenta</p>
                  <p className="text-xs font-bold truncate max-w-[120px]">{user.name}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Link 
                  href="/mi-perfil" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" /> Mi Perfil Público
                </Link>
                <Link 
                  href="/mis-avisos" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500/5 hover:text-emerald-500 rounded-xl transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Mis Avisos
                </Link>
                <Link 
                  href="/favoritos" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500/5 hover:text-emerald-500 rounded-xl transition-all"
                >
                  <Heart className="w-3.5 h-3.5" /> Favoritos
                </Link>
                <Link 
                  href="/mis-datos" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500/5 hover:text-emerald-500 rounded-xl transition-all"
                >
                  <Settings className="w-3.5 h-3.5" /> Mis Datos
                </Link>
                
                <div className="h-px bg-black/5 dark:border-white/5 my-2 mx-2" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
