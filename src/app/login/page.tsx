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

  // Campos complementarios
  const [whatsapp, setWhatsapp] = useState("");
  const [direccion, setDireccion] = useState("");
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [rubros, setRubros] = useState<any[]>([]);
  const [subRubros, setSubRubros] = useState<any[]>([]);
  
  const [depId, setDepId] = useState("");
  const [disId, setDisId] = useState("");
  const [ciuId, setCiuId] = useState("");
  const [rubId, setRubId] = useState("");
  const [subRubId, setSubRubId] = useState("");
  const [esEmpresa, setEsEmpresa] = useState(false);

  // Cargar Departamentos y Rubros iniciales
  React.useEffect(() => {
    if (mode === "register") {
      fetch("/api/locations/departamentos").then(r => r.json()).then(setDepartamentos).catch(() => {});
      fetch("/api/rubros").then(r => r.json()).then(setRubros).catch(() => {});
    }
  }, [mode]);

  // Cargar Distritos cuando cambie DepId
  React.useEffect(() => {
    if (depId) {
      fetch(`/api/locations/distritos?dep_cod=${depId}`).then(r => r.json()).then(setDistritos).catch(() => {});
      setDisId("");
      setCiudades([]);
    }
  }, [depId]);

  // Cargar Ciudades cuando cambie DisId
  React.useEffect(() => {
    if (disId) {
      fetch(`/api/locations/ciudades?dis_cod=${disId}`).then(r => r.json()).then(setCiudades).catch(() => {});
      setCiuId("");
    }
  }, [disId]);

  // Cargar Sub-rubros cuando cambie RubId
  React.useEffect(() => {
    if (rubId) {
      fetch(`/api/sub-rubros?rub_id=${rubId}`).then(r => r.json()).then(setSubRubros).catch(() => {});
      setSubRubId("");
    }
  }, [rubId]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === "register") {
        const res = await registerUser({ 
          name, 
          email, 
          whatsapp, 
          direccion,
          departamentoId: parseInt(depId) || undefined,
          distritoId: parseInt(disId) || undefined,
          ciudadId: parseInt(ciuId) || undefined,
          rubroId: parseInt(rubId) || undefined,
          subRubroId: parseInt(subRubId) || undefined,
          esEmpresa
        });
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
        } else if (res?.success) {
          toast.success("Ingreso exitoso", { description: res.message });
          window.location.href = "/";
        } else {
          toast.error("Error de ingreso", { description: res?.message || "Credenciales incorrectas" });
        }
      } else if (mode === "force_change") {
        const res = await finalizePasswordChange({ userId, newPassword });
        if (res.success) {
          toast.success("Contraseña actualizada", { description: res.message });
          window.location.href = "/";
        } else {
          toast.error("Error al actualizar", { description: res?.message || "Algo salió mal" });
        }
      }
    } catch (err: any) {
      if (err.digest?.startsWith("NEXT_REDIRECT")) return;
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
        className={`w-full transition-all duration-500 ${mode === 'register' ? 'max-w-4xl' : 'max-w-md'}`}
      >
        <div className="text-center mb-8 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl glass-emerald border border-emerald-500/20 text-emerald-500 mb-6 font-bold uppercase tracking-widest text-[9px]">
            <ShieldCheck className="w-5 h-5 mb-0.5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">
            {mode === "login" ? "Bienvenido" : mode === "register" ? "Únete" : "Seguridad"}
          </h1>
          <p className="text-xs opacity-50 font-semibold uppercase tracking-widest leading-relaxed">
            {mode === "login" ? "Regresa a tu cuenta" : mode === "register" ? "Crea tu perfil profesional" : "Actualiza tu contraseña"}
          </p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          <form className="space-y-4" onSubmit={handleAuth}>
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="reg-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Fila 1: Nombre */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Nombre Completo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all font-bold" />
                      <input
                        type="text"
                        required
                        placeholder="Ej: Juan Pérez"
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Fila 2: WhatsApp y Empresa toggle */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">WhatsApp</label>
                       <input
                         type="tel"
                         placeholder="09xx..."
                         className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                         value={whatsapp}
                         onChange={(e) => setWhatsapp(e.target.value)}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Tipo Cuenta</label>
                       <div className="flex items-center gap-2 h-11 px-4 bg-background/50 border border-black/5 dark:border-white/5 rounded-xl">
                         <span className="text-[10px] font-bold opacity-40">PERSONAL</span>
                         <button 
                           type="button"
                           onClick={() => setEsEmpresa(!esEmpresa)}
                           className={`w-10 h-5 rounded-full relative transition-colors ${esEmpresa ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                         >
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${esEmpresa ? 'right-1' : 'left-1'}`} />
                         </button>
                         <span className="text-[10px] font-bold opacity-40">EMPRESA</span>
                       </div>
                    </div>
                  </div>

                  {/* Fila 3: Dirección */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Dirección</label>
                    <input
                      type="text"
                      placeholder="Calle, Nro de casa..."
                      className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>

                  {/* Ubicación: Dept -> Dist -> Ciudad */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-tight opacity-40">Dep.</label>
                      <select 
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-lg py-2 px-2 text-[10px] focus:ring-1 focus:ring-emerald-500/30 outline-none"
                        value={depId}
                        onChange={(e) => setDepId(e.target.value)}
                      >
                         <option value="">Sel...</option>
                         {departamentos.map(d => <option key={d.dep_cod} value={d.dep_cod}>{d.dep_dsc}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-tight opacity-40">Distrito</label>
                      <select 
                        disabled={!depId}
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-lg py-2 px-2 text-[10px] focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-50"
                        value={disId}
                        onChange={(e) => setDisId(e.target.value)}
                      >
                         <option value="">Sel...</option>
                         {distritos.map(d => <option key={d.dis_cod} value={d.dis_cod}>{d.dis_dsc}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-tight opacity-40">Ciudad</label>
                      <select 
                        disabled={!disId}
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-lg py-2 px-2 text-[10px] focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-50"
                        value={ciuId}
                        onChange={(e) => setCiuId(e.target.value)}
                      >
                         <option value="">Sel...</option>
                         {ciudades.map(c => <option key={c.ciu_cod} value={c.ciu_cod}>{c.ciu_dsc}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Rubro y Subrubro */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Rubro</label>
                      <select 
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none"
                        value={rubId}
                        onChange={(e) => setRubId(e.target.value)}
                      >
                         <option value="">Seleccionar rubro</option>
                         {rubros.map(r => <option key={r.rub_id} value={r.rub_id}>{r.rub_nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Sub-rubro</label>
                       <select 
                        disabled={!rubId}
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-50"
                        value={subRubId}
                        onChange={(e) => setSubRubId(e.target.value)}
                      >
                         <option value="">Seleccionar sub-rubro</option>
                         {subRubros.map(s => <option key={s.sub_id} value={s.sub_id}>{s.sub_nombre}</option>)}
                      </select>
                    </div>
                  </div>

                  {!esEmpresa && (
                    <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                       <p className="text-[9px] font-bold text-emerald-500 leading-relaxed uppercase tracking-widest">
                         ✨ Como profesional, generaremos tu perfil/CV automáticamente basado en tu rubro. Podrás editarlo luego.
                       </p>
                    </div>
                  )}
                </motion.div>
              )}

              {mode === "force_change" && (
                <motion.div
                  key="force-pass"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/20 text-[9px] text-orange-500 font-bold uppercase tracking-widest text-center mb-2">
                    Clave temporal detectada
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Nueva Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {mode !== "force_change" && (
                <motion.div key="base-fields" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                      <input
                        type="email"
                        required
                        placeholder="tu@email.com"
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                      <input
                        type="password"
                        required={mode === "login"}
                        disabled={mode === "register"}
                        placeholder={mode === "login" ? "••••••••" : "Se enviará al correo"}
                        className="w-full bg-background/50 border border-black/5 dark:border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50 outline-none"
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
              className="btn-premium w-full py-4 mt-6 text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 group disabled:opacity-50"
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
            {mode === "login" && (
              <div className="text-center mt-4">
                <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 hover:text-emerald-500 transition-colors">¿Perdiste la clave?</button>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-8">
          {mode !== "force_change" ? (
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">
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
              className="text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
            >
              Cancelar Proceso
            </button>
          ) }
        </div>
      </motion.div>
    </div>
  );
}
