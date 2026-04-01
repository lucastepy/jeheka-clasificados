"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { registerUser, loginUser, finalizePasswordChange } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "force_change">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === "register") {
        const res = await registerUser({ name, email });
        if (res.success) {
          toast.success("¡Registro Exitoso!", { description: res.message });
          setMode("login");
        } else {
          toast.error("Error al registrar", { description: res.message });
        }
      } else if (mode === "login") {
        const res = await loginUser({ email, password });
        if (res.success && res.forcePasswordChange) {
          toast.info("Cambio requerido", { description: res.message });
          setUserId(res.userId || "");
          setMode("force_change");
        } else if (res.success) {
          toast.success("Ingreso exitoso", { description: res.message });
          window.location.href = "/";
        } else {
          toast.error("Error de ingreso", { description: res.message });
        }
      } else if (mode === "force_change") {
        const res = await finalizePasswordChange({ userId, newPassword });
        if (res.success) {
          toast.success("Contraseña actualizada", { description: res.message });
          window.location.href = "/";
        } else {
          toast.error("Error al actualizar", { description: res.message });
        }
      }
    } catch (err) {
      toast.error("Error de conexión", { description: "Hubo un problema al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl glass-emerald border border-emerald-500/20 text-emerald-500 mb-6 font-bold uppercase tracking-widest text-[9px]">
            <ShieldCheck className="w-5 h-5 mb-0.5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
            {mode === "login" ? "Bienvenido" : mode === "register" ? "Únete" : "Seguridad"}
          </h1>
          <p className="text-xs opacity-50 font-bold uppercase tracking-widest leading-relaxed">
            {mode === "login" ? "Regresa a tu cuenta" : mode === "register" ? "Crea tu perfil profesional" : "Actualiza tu contraseña"}
          </p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          <form className="space-y-4" onSubmit={handleAuth}>
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="reg-name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 font-bold">Nombre Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all font-bold" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {mode === "force_change" && (
                <motion.div
                  key="force-pass"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/20 text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] text-center mb-2">
                    Clave temporal detectada
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Nueva Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {mode !== "force_change" && (
                <motion.div key="base-fields" className="space-y-4">
                  <div className="space-y-2 font-bold">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                      <input
                        type="email"
                        required
                        placeholder="tu@email.com"
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Contraseña</label>
                      {mode === "login" && (
                        <button type="button" className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400">¿Perdiste la clave?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                      <input
                        type="password"
                        required={mode === "login"}
                        disabled={mode === "register"}
                        placeholder={mode === "login" ? "••••••••" : "Se enviará al correo"}
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={loading}
              className="btn-premium w-full py-4 mt-6 text-xs tracking-[0.2em] uppercase font-black flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login" ? "Acceder" : mode === "register" ? "Crear Cuenta" : "Finalizar Registro"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 font-bold">
          {mode !== "force_change" ? (
            <p className="text-xs font-black uppercase tracking-[0.1em] opacity-40">
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya eres miembro?"}
              <button 
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="ml-2 text-emerald-500 hover:underline"
              >
                {mode === "login" ? "Regístrate" : "Entra aquí"}
              </button>
            </p>
          ) : (
            <button 
              onClick={() => setMode("login")}
              className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
            >
              Cancelar Proceso
            </button>
          ) }
        </div>
      </motion.div>
    </div>
  );
}
