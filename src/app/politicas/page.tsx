"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCcw, Truck, FileText } from "lucide-react";

export default function PoliticasPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20 pb-20 px-6 lg:px-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-emerald border border-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-widest mb-6 w-fit uppercase">
          <FileText className="w-2.5 h-2.5" />
          <span>Información Legal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-[900] tracking-tight leading-none mb-6 uppercase">
          Políticas de <span className="text-gradient">Servicio</span>
        </h1>
        <p className="text-base opacity-60 font-medium max-w-2xl">
          En Jeheka, nos tomamos muy en serio la transparencia. Aquí encontrarás todo lo que necesitas saber sobre reembolsos, envíos y el uso de nuestra plataforma.
        </p>
      </motion.div>

      <div className="space-y-20">
        {/* Reembolsos */}
        <section id="reembolso" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Política de Reembolsos</h2>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-6 text-sm opacity-70 font-medium leading-relaxed">
            <p>
              Jeheka es una plataforma de clasificados que conecta proveedores de servicios con clientes. Por lo tanto, las políticas de reembolso varían según el tipo de transacción:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 rounded-2xl glass border border-white/5">
                <h3 className="text-white font-bold mb-3 uppercase text-[11px] tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Publicaciones Pagadas
                </h3>
                <p>
                  Los pagos realizados para destacar anuncios o planes de suscripción en Jeheka no son reembolsables una vez que el servicio ha sido activado. Si ocurre un error técnico durante el pago, nuestro equipo de soporte evaluará cada caso de forma individual.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl glass border border-white/5">
                <h3 className="text-white font-bold mb-3 uppercase text-[11px] tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Servicios de Terceros
                </h3>
                <p>
                  Cualquier pago realizado directamente a un profesional o empresa contactada a través de Jeheka está sujeto a los términos de dicho proveedor. Jeheka no actúa como intermediario financiero en estas transacciones y no es responsable de los reembolsos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Envíos */}
        <section id="envio" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Política de Envíos y Entrega</h2>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-6 text-sm opacity-70 font-medium leading-relaxed">
            <p>
              Dado que Jeheka se especializa en la promoción de servicios, la "entrega" se define generalmente como la prestación del servicio acordado:
            </p>
            
            <ul className="space-y-4 list-none p-0">
              <li className="flex gap-4 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Servicios Digitales:</strong> La entrega se considera completada una vez que el profesional envía los archivos o accesos acordados a través de los canales de comunicación establecidos.
                </span>
              </li>
              <li className="flex gap-4 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Servicios Presenciales:</strong> La entrega ocurre en el lugar y hora pactados entre el cliente y el profesional. Jeheka recomienda siempre verificar la identidad del profesional antes de cualquier encuentro.
                </span>
              </li>
              <li className="flex gap-4 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Productos Físicos:</strong> Si un servicio incluye la entrega de un bien físico, el costo y método de envío debe ser acordado previamente. Jeheka no gestiona logística de envíos físicos.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
