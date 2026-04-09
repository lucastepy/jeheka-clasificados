import React from "react";
import { User, ShieldCheck, Mail, Phone, MapPin, Star } from "lucide-react";

export default function AvisoProfile({ 
  nombre, 
  foto, 
  email, 
  whatsapp, 
  direccion, 
  biografia,
  rubro
}: { 
  nombre: string, 
  foto?: string, 
  email?: string, 
  whatsapp?: string, 
  direccion?: string, 
  biografia?: string,
  rubro?: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-30">Información del Profesional</h2>
      
      <div className="glass rounded-[2rem] border border-white/5 p-8 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-emerald-500/30 p-1 bg-gradient-to-tr from-emerald-500 to-emerald-300">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
              {foto ? (
                <img src={foto} alt={nombre} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 opacity-20" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1.5 rounded-full border-4 border-[#020617]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-xl font-black uppercase tracking-tight mb-1">{nombre}</h3>
        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4">Profesional Verificado</span>

        {biografia && (
          <p className="text-xs opacity-50 font-medium mb-6 italic leading-relaxed">
            "{biografia}"
          </p>
        )}

        <div className="w-full h-px bg-white/5 mb-6" />

        <div className="w-full space-y-4 text-left">
          {email && (
            <div className="flex items-center gap-3 opacity-60">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold truncate">{email}</span>
            </div>
          )}
          {whatsapp && (
            <div className="flex items-center gap-3 opacity-60">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold">{whatsapp}</span>
            </div>
          )}
          {direccion && (
            <div className="flex items-center gap-3 opacity-60">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold line-clamp-1">{direccion}</span>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 w-full grid grid-cols-2 gap-4">
           <div className="text-center">
              <div className="text-xl font-black text-emerald-500">5.0</div>
              <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Valoración</div>
           </div>
           <div className="text-center">
              <div className="text-xl font-black text-emerald-500">0</div>
              <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Avisos</div>
           </div>
        </div>
      </div>
    </div>
  );
}
