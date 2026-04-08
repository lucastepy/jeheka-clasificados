import React from "react";
import { getUserData } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { Mail, Phone, MapPin, Briefcase, Building2, ShieldCheck, Star, Award, Calendar, User } from "lucide-react";
import { db } from "@/lib/db";

async function getCategoryNames(rubroId?: number, subRubroId?: number) {
  let rubro = "";
  let subRubro = "";

  if (rubroId) {
    const r = await db.query("SELECT nombre FROM rubros WHERE id = $1", [rubroId]);
    rubro = r.rows[0]?.nombre || "";
  }
  if (subRubroId) {
    const s = await db.query("SELECT nombre FROM sub_rubros WHERE id = $1", [subRubroId]);
    subRubro = s.rows[0]?.nombre || "";
  }

  return { rubro, subRubro };
}

export default async function MiPerfilPage() {
  const user = await getUserData();
  if (!user) redirect("/login");

  const { rubro, subRubro } = await getCategoryNames(user.usu_rubro_id, user.usu_sub_rubro_id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Banner */}
      <div className="h-48 bg-gradient-to-r from-emerald-500/20 via-emerald-500/5 to-background border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Basic Info */}
          <div className="w-full md:w-80 flex flex-col gap-6">
            <div className="glass p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 p-1 mb-6 shadow-xl shadow-emerald-500/20">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center border-4 border-background overflow-hidden relative group">
                   {user.usu_foto_url ? (
                     <img src={user.usu_foto_url} alt={user.usu_nombre} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-4xl font-black text-emerald-500">{user.usu_nombre.charAt(0).toUpperCase()}</span>
                   )}
                </div>
              </div>

              <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">{user.usu_nombre}</h1>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold tracking-widest uppercase mb-4">
                <ShieldCheck className="w-3 h-3" /> Profesional Verificado
              </div>

              <div className="w-full space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs opacity-60">
                  <Mail className="w-4 h-4 text-emerald-500" /> {user.usu_email}
                </div>
                {user.usu_whatsapp && (
                  <div className="flex items-center gap-3 text-xs opacity-60">
                    <Phone className="w-4 h-4 text-emerald-500" /> {user.usu_whatsapp}
                  </div>
                )}
                {user.usu_direccion && (
                  <div className="flex items-center gap-3 text-xs opacity-60">
                    <MapPin className="w-4 h-4 text-emerald-500" /> {user.usu_direccion}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass p-6 rounded-3xl border border-white/5">
               <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4 ml-1">Estadísticas</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-xl font-black text-emerald-500 mb-1">0</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-40 leading-none">Avisos</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-xl font-black text-emerald-500 mb-1">0.0</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-40 leading-none">Rating</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="flex-1 space-y-8 w-full mt-4 md:mt-0">
             {/* Hoja de Oficio Header */}
             <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <Briefcase className="w-32 h-32" />
                </div>
                
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 opacity-50">
                  <Award className="w-4 h-4" /> Hoja de Oficio
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mb-3">Especialidad Principal</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 rounded-xl glass-emerald border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                        {rubro || "No especificado"}
                      </span>
                      {subRubro && (
                        <span className="px-4 py-2 rounded-xl bg-slate-500/10 border border-white/5 text-xs font-bold uppercase tracking-widest opacity-80">
                          {subRubro}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mb-3">Biografía / Presentación</label>
                    <p className="text-sm leading-relaxed opacity-70 italic">
                      "Soy un profesional comprometido con la excelencia. Mi objetivo es brindar soluciones rápidas y de calidad en el área de {rubro || 'mi especialidad'}."
                    </p>
                  </div>
                </div>
             </div>

             {/* Sections Placeholder */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-3xl border border-white/5 opacity-50 grayscale pointer-events-none">
                   <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Calendar className="w-3.5 h-3.5" /> Experiencia
                   </h3>
                   <p className="text-[10px] tracking-widest uppercase">Próximamente</p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/5 opacity-50 grayscale pointer-events-none">
                   <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Star className="w-3.5 h-3.5" /> Valoraciones
                   </h3>
                   <p className="text-[10px] tracking-widest uppercase">Próximamente</p>
                </div>
             </div>

             <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">¿Quieres actualizar esta información?</span>
                  <span className="text-[10px] opacity-40 uppercase tracking-widest">Los cambios se reflejan al instante.</span>
                </div>
                <a 
                  href="/mis-datos" 
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                  Editar Perfil
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
