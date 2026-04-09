"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Briefcase, Building2, Save, Loader2, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { updateUserData } from "@/app/login/actions";

interface ProfileFormProps {
  initialData: any;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState(initialData?.usu_nombre || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.usu_whatsapp || "");
  const [direccion, setDireccion] = useState(initialData?.usu_direccion || "");
  const [esEmpresa, setEsEmpresa] = useState(initialData?.usu_es_empresa || false);
  const [fotoUrl, setFotoUrl] = useState(initialData?.usu_foto_url || "");
  
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
  
  // Loading States
  const [loadingDistritos, setLoadingDistritos] = useState(false);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loadingSubRubros, setLoadingSubRubros] = useState(false);

  // Initial Load
  useEffect(() => {
    fetch("/api/locations/departamentos").then(r => r.json()).then(setDepartamentos).catch(() => {});
    fetch("/api/rubros").then(r => r.json()).then(setRubros).catch(() => {});
  }, []);

  // Cascading Loads
  useEffect(() => {
    if (depId) {
      setLoadingDistritos(true);
      fetch(`/api/locations/distritos?dep_cod=${depId}`)
        .then(r => r.json())
        .then(data => {
          setDistritos(data);
          setLoadingDistritos(false);
        })
        .catch(() => setLoadingDistritos(false));
    } else {
      setDistritos([]);
      setLoadingDistritos(false);
    }
  }, [depId]);

  useEffect(() => {
    if (disId) {
      setLoadingCiudades(true);
      fetch(`/api/locations/ciudades?dis_cod=${disId}`)
        .then(r => r.json())
        .then(data => {
          setCiudades(data);
          setLoadingCiudades(false);
        })
        .catch(() => setLoadingCiudades(false));
    } else {
      setCiudades([]);
      setLoadingCiudades(false);
    }
  }, [disId]);

  useEffect(() => {
    if (rubId) {
      setLoadingSubRubros(true);
      fetch(`/api/sub-rubros?rub_id=${rubId}`)
        .then(r => r.json())
        .then(data => {
          setSubRubros(data);
          setLoadingSubRubros(false);
        })
        .catch(() => setLoadingSubRubros(false));
    } else {
      setSubRubros([]);
      setLoadingSubRubros(false);
    }
  }, [rubId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen es demasiado pesada (máx 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Crear un canvas para redimensionar
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Convertir a base64 comprimido (calidad 0.7)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setFotoUrl(dataUrl);
          toast.success("Foto optimizada y cargada");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

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
        esEmpresa,
        fotoUrl
      });

      if (res.success) {
        toast.success(res.message);
        router.push("/");
        router.refresh();
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
      <div className="glass p-6 md:p-12 rounded-3xl border-2 border-emerald-500/40 overflow-visible shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <User className="w-32 h-32" />
        </div>
        
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 opacity-50">
          <User className="w-4 h-4" /> Información Personal
        </h2>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-slate-500/10 border-2 border-white/5 flex items-center justify-center overflow-hidden relative group cursor-pointer"
            >
              {fotoUrl ? (
                <img src={fotoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 opacity-20" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-1">
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[7px] font-bold text-white uppercase tracking-widest">Cambiar</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
            >
              <Upload className="w-2.5 h-2.5" /> Adjuntar Foto
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                />
              </div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 px-1">
              La foto que selecciones se mostrará en tu hoja de oficio pública.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Sección: Ubicación ... */}
      <div className="glass p-6 md:p-12 rounded-3xl border-2 border-emerald-500/40 overflow-visible shadow-[0_0_50px_rgba(16,185,129,0.15)]">
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
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none"
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
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-30"
              >
                 <option value="">{loadingDistritos ? "Cargando..." : "Seleccionar..."}</option>
                 {distritos.map(d => <option key={d.dis_cod} value={d.dis_cod}>{d.dis_dsc}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">Ciudad</label>
              <select 
                disabled={!disId}
                value={ciuId}
                onChange={(e) => setCiuId(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-30"
              >
                 <option value="">{loadingCiudades ? "Cargando..." : "Seleccionar..."}</option>
                 {ciudades.map(c => <option key={c.ciu_cod} value={c.ciu_cod}>{c.ciu_dsc}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Rubro Profesional ... */}
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
              className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none"
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
              className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-30"
            >
               <option value="">{loadingSubRubros ? "Cargando..." : "Seleccionar sub-rubro"}</option>
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
