"use client";

import React, { useState } from "react";
import { Clock, Eye, Trash2, Edit3, ImageIcon, Briefcase, MapPin, Loader2, ShieldCheck, CreditCard } from "lucide-react";
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
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: "red" | "emerald" | "orange";
    loading?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleDelete = async (id: string, titulo: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "¿Eliminar Aviso?",
      description: `Estás a punto de eliminar "${titulo}". Esta acción es irreversible y cancelará cualquier débito automático asociado.`,
      confirmText: "Eliminar Ahora",
      confirmColor: "red",
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        const res = await deleteAviso(id);
        if (res.success) {
          setAvisos(prev => prev.filter(a => a.avi_id !== id));
          toast.success(res.message);
          setConfirmConfig(prev => ({ ...prev, isOpen: false, loading: false }));
        } else {
          toast.error(res.message);
          setConfirmConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleCancelSubscription = async (id: string, titulo: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Cancelar Débito",
      description: `¿Deseas cancelar el débito automático de "${titulo}"? El aviso seguirá activo hasta el final de tu ciclo de pago.`,
      confirmText: "Detener Débito",
      confirmColor: "orange",
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        const { cancelSubscription } = await import("./actions");
        const res = await cancelSubscription(id);
        
        if (res.success) {
           toast.success(res.message);
           setAvisos(prev => prev.map(a => a.avi_id === id ? { ...a, avi_cancelado: true } : a));
           setConfirmConfig(prev => ({ ...prev, isOpen: false, loading: false }));
        } else {
           toast.error(res.message);
           setConfirmConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleRetryPayment = async (id: string) => {
    const loadingToast = toast.loading("Generando link de pago...");
    
    // Importación dinámica para evitar problemas de SSR si fuera necesario
    const { retryPayment } = await import("./actions");
    const res = await retryPayment(id);
    
    toast.dismiss(loadingToast);
    
    if (res.success && res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
    } else {
      toast.error(res.message || "No se pudo generar el link de pago");
    }
  };

  return (
    <>
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
                    {aviso.avi_estado === 'AC' ? 'Activo' : aviso.avi_estado === 'PE' ? 'Pendiente' : aviso.avi_estado}
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

                  {/* Botón Pagar si está Pendiente */}
                  {aviso.avi_estado === 'PE' && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleRetryPayment(aviso.avi_id)}
                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pagar y Activar Ahora
                      </button>
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
                        onClick={() => handleCancelSubscription(aviso.avi_id, aviso.avi_titulo)}
                        className="p-2.5 rounded-xl hover:bg-orange-500/10 text-orange-500 transition-all border border-transparent hover:border-orange-500/20"
                        title="Cancelar Débito Automático"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}

                    <button 
                      onClick={() => handleDelete(aviso.avi_id, aviso.avi_titulo)}
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

      {/* Premium Confirm Modal */}
      <AnimatePresence>
        {confirmConfig.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !confirmConfig.loading && setConfirmConfig(p => ({ ...p, isOpen: false }))}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center"
            >
              <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                confirmConfig.confirmColor === 'red' ? 'bg-red-500/20' : 
                confirmConfig.confirmColor === 'orange' ? 'bg-orange-500/20' : 'bg-emerald-500/20'
              }`}>
                {confirmConfig.confirmColor === 'red' && <Trash2 className="w-8 h-8 text-red-500" />}
                {confirmConfig.confirmColor === 'orange' && <Clock className="w-8 h-8 text-orange-500" />}
                {confirmConfig.confirmColor === 'emerald' && <ShieldCheck className="w-8 h-8 text-emerald-500" />}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{confirmConfig.title}</h3>
              <p className="text-sm opacity-50 mb-8 leading-relaxed">
                {confirmConfig.description}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={confirmConfig.loading}
                  onClick={confirmConfig.onConfirm}
                  className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                    confirmConfig.confirmColor === 'red' ? 'bg-red-500 hover:bg-red-600' : 
                    confirmConfig.confirmColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {confirmConfig.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmConfig.confirmText || "Confirmar"}
                </button>
                <button
                  disabled={confirmConfig.loading}
                  onClick={() => setConfirmConfig(p => ({ ...p, isOpen: false }))}
                  className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
