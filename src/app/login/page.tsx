"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const title = mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta";
  const subtitle = mode === "login" 
    ? "Ingresa tus credenciales para acceder a tu panel." 
    : "Únete a la red de profesionales más grande de Paraguay.";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 bg-background">
      {/* Decorative background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl glass-emerald border border-emerald-500/20 text-emerald-500 mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">{title}</h1>
          <p className="text-sm opacity-50 font-medium leading-relaxed">{subtitle}</p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Nombre Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all" />
                    <input
                      type="text"
                      placeholder="Ej: Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Contraseña</label>
                {mode === "login" && (
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 hover:text-emerald-500">¿Olvidaste?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <button className="btn-premium w-full py-3.5 mt-4 text-xs tracking-[0.2em] uppercase font-black flex items-center justify-center gap-2 group">
              <span>{mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/5 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest px-4">
              <span className="bg-background text-slate-400 px-2 leading-none">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 rounded-xl border border-black/5 dark:border-white/5 hover:bg-slate-500/5 transition-all text-[10px] font-black uppercase tracking-wider">
              <Chrome className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 rounded-xl border border-black/5 dark:border-white/5 hover:bg-slate-500/5 transition-all text-[10px] font-black uppercase tracking-wider">
              <Github className="w-4 h-4" /> Github
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm font-medium opacity-50">
            {mode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes cuenta?"}
            <button 
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="ml-2 text-emerald-500 font-bold hover:underline"
            >
              {mode === "login" ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
