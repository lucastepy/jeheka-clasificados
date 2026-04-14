"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Megaphone, 
  AlignLeft, 
  DollarSign, 
  Briefcase, 
  MapPin, 
  Camera, 
  Upload, 
  X,
  Loader2,
  Save,
  Phone,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { createAviso, updateAviso, getPlanesPortal } from "../actions";

export default function AvisoForm({ 
  userData, 
  initialData 
}: { 
  userData?: any; 
  initialData?: any;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [displayPrecio, setDisplayPrecio] = useState("");

  const handlePrecioChange = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    setPrecio(numeric);
    if (!numeric) {
      setDisplayPrecio("");
      return;
    }
    setDisplayPrecio(new Intl.NumberFormat("es-PY").format(parseInt(numeric)));
  };

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData?.avi_precio) {
      handlePrecioChange(initialData.avi_precio.toString());
    }
  }, [initialData]);

  // Form State - Pre-filled with userData or initialData
  const [titulo, setTitulo] = useState(initialData?.avi_titulo || "");
  const [descripcion, setDescripcion] = useState(initialData?.avi_descripcion || "");
  const [precio, setPrecio] = useState(initialData?.avi_precio?.toString() || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.avi_whatsapp || userData?.usu_whatsapp || "");
  const [imagenes, setImagenes] = useState<string[]>(initialData?.avi_imagenes || []);
  const [planId, setPlanId] = useState(initialData?.avi_plan_id?.toString() || "");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [depId, setDepId] = useState(initialData?.avi_departamento_id?.toString() || userData?.usu_departamento_id?.toString() || "");
  const [disId, setDisId] = useState(initialData?.avi_distrito_id?.toString() || userData?.usu_distrito_id?.toString() || "");
  const [ciuId, setCiuId] = useState(initialData?.avi_ciudad_id?.toString() || userData?.usu_ciudad_id?.toString() || "");
  const [rubId, setRubId] = useState(initialData?.avi_rubro_id?.toString() || userData?.usu_rubro_id?.toString() || "");
  const [subRubId, setSubRubId] = useState(initialData?.avi_sub_rubro_id?.toString() || userData?.usu_sub_rubro_id?.toString() || "");

  // Track if it's the first render to avoid clearing values
  const isInitialLoad = useRef(true);
  useEffect(() => {
    isInitialLoad.current = false;
  }, []);

  // Master Data State
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [rubros, setRubros] = useState<any[]>([]);
  const [subRubros, setSubRubros] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);

  // Loading States for Cascading
  const [loadingDistritos, setLoadingDistritos] = useState(false);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loadingSubRubros, setLoadingSubRubros] = useState(false);

  // Initial Loads
  useEffect(() => {
    fetch("/api/locations/departamentos").then(r => r.json()).then(setDepartamentos).catch(() => {});
    fetch("/api/rubros").then(r => r.json()).then(setRubros).catch(() => {});
    getPlanesPortal().then(setPlanes).catch(() => {});
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
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`La imagen ${file.name} es muy pesada`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
             const canvas = document.createElement("canvas");
             const MAX_WIDTH = 800;
             const MAX_HEIGHT = 800;
             let width = img.width;
             let height = img.height;
             
             if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
             } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
             }
             
             canvas.width = width;
             canvas.height = height;
             const ctx = canvas.getContext("2d");
             ctx?.drawImage(img, 0, 0, width, height);
             const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
             
             setImagenes(prev => [...prev, dataUrl].slice(0, 5)); // Límite de 5 imágenes
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imagenes.length === 0) {
      toast.error("Debes subir al menos una foto de tu servicio");
      return;
    }
    
    if (!planId) {
      toast.error("Debes seleccionar un plan para tu aviso");
      return;
    }

    if (!isEditing && !aceptaTerminos) {
      toast.error("Debes aceptar las bases y condiciones para continuar con el débito automático");
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        titulo,
        descripcion,
        precio: precio ? parseFloat(precio) : undefined,
        rubroId: parseInt(rubId),
        subRubroId: parseInt(subRubId) || undefined,
        departamentoId: parseInt(depId) || undefined,
        distritoId: parseInt(disId) || undefined,
        ciudadId: parseInt(ciuId) || undefined,
        whatsapp,
        imagenes,
        planId: parseInt(planId)
      };

      if (isEditing) {
        const res = await updateAviso(initialData.avi_id, payload);
        if (res.success) {
          toast.success(res.message);
          router.push("/mis-avisos");
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createAviso(payload);
        if (res.success) {
          // Redirección directa según documentación de dLocal API
          if (res.checkoutUrl) {
             toast.success("Redirigiendo a la plataforma de pago...");
             window.location.href = res.checkoutUrl as string;
             return;
          }

          toast.success(res.message);
          router.push("/mis-avisos");
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      toast.error("Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección 1: Información del Servicio */}
        <div className="glass p-8 rounded-[2rem] border border-white/10">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-40 flex items-center gap-2">
           <Megaphone className="w-4 h-4" /> Detalles del Servicio
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Título del Aviso</label>
            <div className="relative group">
              <Megaphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
              <input
                type="text"
                required
                placeholder="Ej: Electricista Matriculado 24hs"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all placeholder:opacity-30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Descripción Detallada</label>
            <div className="relative group">
              <AlignLeft className="absolute left-4 top-4 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
              <textarea
                required
                rows={4}
                placeholder="Cuéntanos más sobre lo que ofreces, tu experiencia, etc..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none resize-none transition-all placeholder:opacity-30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Precio Estimado (Opcional)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                <input
                  type="text"
                  placeholder="Ej: 150.000"
                  value={displayPrecio}
                  onChange={(e) => handlePrecioChange(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all placeholder:opacity-30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">WhatsApp de Contacto</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-emerald-500 transition-all" />
                <input
                  type="tel"
                  placeholder="Ej: 0981 123456"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  readOnly
                  className="w-full bg-background/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm outline-none cursor-not-allowed opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Categoría y Ubicación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2rem] border border-white/10">
           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-40 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Clasificación
           </h2>
           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Rubro Principal</label>
                <select 
                  required
                  value={rubId}
                  onChange={(e) => { 
                    setRubId(e.target.value); 
                    if (!isInitialLoad.current) setSubRubId(""); 
                  }}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-4 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none cursor-pointer transition-all"
                >
                  <option value="">Seleccionar rubro</option>
                  {rubros.map(r => <option key={r.rub_id} value={r.rub_id}>{r.rub_nombre}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Sub-rubro</label>
                <select 
                  value={subRubId}
                  disabled={!rubId}
                  onChange={(e) => setSubRubId(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-4 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-20 transition-all cursor-pointer"
                >
                  <option value="">{loadingSubRubros ? "Cargando sub-rubros..." : "Cualquier sub-rubro"}</option>
                  {subRubros.map(s => <option key={s.sub_id} value={s.sub_id}>{s.sub_nombre}</option>)}
                </select>
              </div>

              {!isEditing && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Plan del Aviso</label>
                  <select 
                    required
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl py-4 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none cursor-pointer text-emerald-500 font-bold"
                  >
                    <option value="">Seleccionar plan de pago</option>
                    {planes.map(p => {
                      const net = Number(p.precio_mensual);
                      const sPorc = Number(p.plan_sum_porc || 0);
                      const sFijo = Number(p.plan_sum_fijo || 0);
                      const bruto = sPorc >= 100 ? (net + sFijo) : Math.ceil((net + sFijo) / (1 - (sPorc / 100)));
                      
                      return (
                        <option key={p.id} value={p.id}>
                          {p.nombre} - Gs. {new Intl.NumberFormat('es-PY').format(bruto)}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
           </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/10">
           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-40 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Ubicación del Servicio
           </h2>
           <div className="space-y-4">
              <select 
                required
                value={depId}
                onChange={(e) => { 
                  setDepId(e.target.value); 
                  if (!isInitialLoad.current) {
                    setDisId(""); 
                    setCiuId(""); 
                  }
                }}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-4 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-20 cursor-pointer transition-all"
              >
                <option value="">Departamento</option>
                {departamentos.map(d => <option key={d.dep_cod} value={d.dep_cod}>{d.dep_dsc}</option>)}
              </select>
              <select 
                disabled={!depId}
                value={disId}
                onChange={(e) => { setDisId(e.target.value); setCiuId(""); }}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-4 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-20 cursor-pointer transition-all"
              >
                <option value="">{loadingDistritos ? "Cargando distritos..." : "Distrito"}</option>
                {distritos.map(d => <option key={d.dis_cod} value={d.dis_cod}>{d.dis_dsc}</option>)}
              </select>
              <select 
                disabled={!disId}
                value={ciuId}
                onChange={(e) => setCiuId(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-xl py-4 px-4 text-sm focus:ring-1 focus:ring-emerald-500/30 outline-none disabled:opacity-20 cursor-pointer transition-all"
              >
                <option value="">{loadingCiudades ? "Cargando ciudades..." : "Ciudad / Localidad"}</option>
                {ciudades.map(c => <option key={c.ciu_cod} value={c.ciu_cod}>{c.ciu_dsc}</option>)}
              </select>
           </div>
        </div>
      </div>

      {/* Sección 3: Galería de Imágenes */}
      <div className="glass p-8 rounded-[2rem] border border-white/10">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Galería de Fotos (Máx 5)
           </h2>
           <button 
             type="button"
             onClick={() => fileInputRef.current?.click()}
             className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2"
           >
             <Upload className="w-3.5 h-3.5" /> Subir Fotos
           </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {imagenes.map((img, idx) => (
             <div key={idx} className="aspect-square rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden relative group">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImagen(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                   <X className="w-3 h-3" />
                </button>
             </div>
           ))}
           {imagenes.length < 5 && (
             <button 
               type="button"
               onClick={() => fileInputRef.current?.click()}
               className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center opacity-30 hover:opacity-100 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-[9px] font-bold uppercase tracking-widest gap-2"
             >
                <Plus className="w-6 h-6" />
                <span>Agregar</span>
             </button>
           )}
        </div>
      </div>
      {/* Sección 4: Bases y Condiciones */}
      {!isEditing && (
        <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
          <input 
            type="checkbox" 
            id="terms"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/10 bg-background/50 text-emerald-500 focus:ring-emerald-500/30"
          />
          <label htmlFor="terms" className="text-xs opacity-60 leading-relaxed cursor-pointer select-none">
            Acepto las <span className="text-emerald-500 font-bold underline">Bases y Condiciones</span> del portal y manifiesto mi conformidad para que se realicen los <span className="text-emerald-500 font-bold">débitos automáticos</span> mensuales a través de dLocal Go para el mantenimiento de mi aviso destacado.
          </label>
        </div>
      )}

      <div className="flex justify-end pt-8">
        <button 
          disabled={loading}
          className="btn-premium px-16 py-5 text-xs font-bold uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             <Save className="w-5 h-5" />
          )}
          {loading ? (isEditing ? "Guardando..." : "Publicando Aviso...") : (isEditing ? "Guardar Cambios" : "Publicar Ahora")}
        </button>
      </div>
    </form>
  );
}
