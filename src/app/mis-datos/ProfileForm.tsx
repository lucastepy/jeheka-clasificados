"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, Building2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserData } from "@/app/login/actions";

interface ProfileFormProps {
  initialData: any;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState(initialData?.usu_nombre || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.usu_whatsapp || "");
  const [direccion, setDireccion] = useState(initialData?.usu_direccion || "");
  const [esEmpresa, setEsEmpresa] = useState(initialData?.usu_es_empresa || false);
  
  const [depId, setDepId] = useState(initialData?.usu_departamento_id?.toString() || "");
  const [disId, setDisId] = useState(initialData?.usu_distrito_id?.toString() || "");
  const [ciuId, setCiuId] = useState(initialData?.usu_ciudad_id?.toString() || "");
  const [rubId, setRubId] = useState(initialData?.usu_rubro_id?.toString() || "");
  const [subRubId, setSubRubId] = useState(initialData?.usu_sub_rubro_id?.toString() || "");

  // Master Data State
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [rubros, setRubros] = useState<any[]>([]);
  const [subRubros, setSubRubros] = useState<any[]>([]);

  // Initial Load
  useEffect(() => {
    fetch("/api/locations/departamentos").then(r => r.json()).then(setDepartamentos).catch(() => {});
    fetch("/api/rubros").then(r => r.json()).then(setRubros).catch(() => {});
  }, []);

  // Cascading Loads
  useEffect(() => {
    if (depId) {
      fetch(`/api/locations/distritos?dep_cod=${depId}`).then(r => r.json()).then(setDistritos).catch(() => {});
    } else {
      setDistritos([]);
    }
  }, [depId]);

  useEffect(() => {
    if (disId) {
      fetch(`/api/locations/ciudades?dis_cod=${disId}`).then(r => r.json()).then(setCiudades).catch(() => {});
    } else {
      setCiudades([]);
    }
  }, [disId]);

  useEffect(() => {
    if (rubId) {
      fetch(`/api/sub-rubros?rub_id=${rubId}`).then(r => r.json()).then(setSubRubros).catch(() => {});
    } else {
      setSubRubros([]);
    }
  }, [rubId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateUserData({
        name,
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
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección: Información Básica */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <User className="w-32 h-32" />
        </div>
        
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 opacity-50">
          <User className="w-4 h-4" /> Información Personal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Nombre Completo</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Email (Solo lectura)</label>
            <div className="relative group opacity-50">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
              <input
                type="email"
                disabled
                value={initialData?.usu_email || ""}
                className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">WhatsApp</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="09xx..."
                className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Tipo de Perfil</label>
             <div className="flex items-center gap-4 h-12 px-6 bg-background/50 border border-white/5 rounded-xl">
               <span className={`text-[10px] font-bold tracking-widest transition-opacity ${!esEmpresa ? 'opacity-100 text-emerald-500' : 'opacity-30'}`}>PERSONAL</span>
               <button 
                 type="button"
                 onClick={() => setEsEmpresa(!esEmpresa)}
                 className={`w-12 h-6 rounded-full relative transition-colors ${esEmpresa ? 'bg-emerald-500' : 'bg-zinc-700'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${esEmpresa ? 'right-1' : 'left-1'}`} />
               </button>
               <span className={`text-[10px] font-bold tracking-widest transition-opacity ${esEmpresa ? 'opacity-100 text-emerald-500' : 'opacity-30'}`}>EMPRESA</span>
             </div>
          </div>
        </div>
      </div>

      {/* Sección: Ubicación */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/5">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 opacity-50">
          <MapPin className="w-4 h-4" /> Ubicación
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, Nro de casa..."
              className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">Departamento</label>
              <select 
                value={depId}
                onChange={(e) => { setDepId(e.target.value); setDisId(""); setCiuId(""); }}
                className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none"
              >
                 <option value="">Seleccionar...</option>
                 {departamentos.map(d => <option key={d.dep_cod} value={d.dep_cod}>{d.dep_dsc}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">Distrito</label>
              <select 
                disabled={!depId}
                value={disId}
                onChange={(e) => { setDisId(e.target.value); setCiuId(""); }}
                className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-30"
              >
                 <option value="">Seleccionar...</option>
                 {distritos.map(d => <option key={d.dis_cod} value={d.dis_cod}>{d.dis_dsc}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">Ciudad</label>
              <select 
                disabled={!disId}
                value={ciuId}
                onChange={(e) => setCiuId(e.target.value)}
                className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-30"
              >
                 <option value="">Seleccionar...</option>
                 {ciudades.map(c => <option key={c.ciu_cod} value={c.ciu_cod}>{c.ciu_dsc}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Rubro Profesional */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/5">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 opacity-50">
          <Briefcase className="w-4 h-4" /> Actividad Comercial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Rubro Principal</label>
            <select 
              value={rubId}
              onChange={(e) => { setRubId(e.target.value); setSubRubId(""); }}
              className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none"
            >
               <option value="">Seleccionar rubro</option>
               {rubros.map(r => <option key={r.rub_id} value={r.rub_id}>{r.rub_nombre}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Sub-rubro Específico</label>
            <select 
              disabled={!rubId}
              value={subRubId}
              onChange={(e) => setSubRubId(e.target.value)}
              className="w-full bg-background/50 border border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-30"
            >
               <option value="">Seleccionar sub-rubro</option>
               {subRubros.map(s => <option key={s.sub_id} value={s.sub_id}>{s.sub_nombre}</option>)}
            </select>
          </div>
        </div>

        {!esEmpresa && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4"
          >
            <Building2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-[10px] font-bold text-emerald-500/80 leading-relaxed uppercase tracking-wider">
              Como profesional independiente, los otros usuarios podrán ver tu Perfil Profesional (Hoja de Oficio) generado automáticamente. Asegúrate de que tus datos de contacto sean correctos.
            </p>
          </motion.div>
        )}
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end pt-4">
        <button 
          disabled={loading}
          className="btn-premium px-12 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
