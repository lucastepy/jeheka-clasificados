"use client";

import React, { useState } from "react";
import { Clock, Eye, Trash2, Edit3, ImageIcon, Briefcase, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteAviso } from "./actions";
import { toast } from "sonner";
import Link from "next/link";

interface Aviso {
  avi_id: string;
  avi_titulo: string;
  avi_descripcion: string;
  avi_precio: number;
  avi_estado: string;
  avi_fec_alta: string;
  avi_vistas_count: number;
  avi_imagenes: any;
  rubro_nombre?: string;
  avi_es_suscripcion?: boolean;
  avi_fec_vto?: string;
  avi_cancelado?: boolean;
}

export function AvisosList({ initialAvisos }: { initialAvisos: Aviso[] }) {
  const [avisos, setAvisos] = useState(initialAvisos);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este aviso?")) return;

    const res = await deleteAviso(id);
    if (res.success) {
      setAvisos(avisos.filter(a => a.avi_id !== id));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm("¿Deseas cancelar el débito automático? Tu aviso seguirá activo hasta el vencimiento actual.")) return;
    
    // Importación dinámica para el front
    const { cancelSubscription } = await import("./actions");
    const res = await cancelSubscription(id);
    
    if (res.success) {
       toast.success(res.message);
       // Actualizamos el estado local
       setAvisos(avisos.map(a => a.avi_id === id ? { ...a, avi_cancelado: true } : a));
    } else {
       toast.error(res.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {avisos.map((aviso) => {
          const imagenes = Array.isArray(aviso.avi_imagenes) ? aviso.avi_imagenes : [];
          return (
            <motion.div
              key={aviso.avi_id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-[2rem] border border-white/5 overflow-hidden flex flex-col group h-full"
            >
              {/* Image / Thumbnail */}
              <div className="h-48 bg-slate-500/10 relative overflow-hidden">
                {imagenes[0] ? (
                  <img src={imagenes[0]} alt={aviso.avi_titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sin Imágenes</span>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                  {aviso.avi_estado === 'AC' ? 'Activo' : aviso.avi_estado}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-widest border border-emerald-500/20">
                    {aviso.rubro_nombre || "Servicio"}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-emerald-500 transition-colors uppercase">
                  {aviso.avi_titulo}
                </h3>
                <p className="text-xs opacity-40 line-clamp-2 mb-4 leading-relaxed italic">
                  "{aviso.avi_descripcion}"
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Precio Estimado</span>
                    <span className="text-md font-black text-emerald-500">
                      {aviso.avi_precio ? `Gs. ${new Intl.NumberFormat('es-PY').format(aviso.avi_precio)}` : "A consultar"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs opacity-40">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> {aviso.avi_vistas_count}
                    </div>
                  </div>
                </div>

                {/* Info de Suscripción */}
                {aviso.avi_es_suscripcion && aviso.avi_fec_vto && (
                  <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Vencimiento</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${aviso.avi_cancelado ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {aviso.avi_cancelado ? 'No renovará' : 'Débito activo'}
                      </span>
                    </div>
                    <span className="text-xs font-medium opacity-60">
                      {new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(aviso.avi_fec_vto))}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest opacity-30">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(aviso.avi_fec_alta))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/mis-avisos/${aviso.avi_id}/editar`}
                    className="p-2.5 rounded-xl hover:bg-emerald-500/10 text-emerald-500 transition-all border border-transparent hover:border-emerald-500/20"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  
                  {aviso.avi_es_suscripcion && !aviso.avi_cancelado && (
                    <button 
                      onClick={() => handleCancelSubscription(aviso.avi_id)}
                      className="p-2.5 rounded-xl hover:bg-orange-500/10 text-orange-500 transition-all border border-transparent hover:border-orange-500/20"
                      title="Cancelar Débito Automático"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(aviso.avi_id)}
                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
