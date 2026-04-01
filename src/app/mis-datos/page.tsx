import React from "react";
import { getUserData } from "@/app/login/actions";
import ProfileForm from "./ProfileForm";
import { redirect } from "next/navigation";
import { UserCheck, ShieldCheck, Zap } from "lucide-react";

export default async function MisDatosPage() {
  const userData = await getUserData();

  if (!userData) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Configuración de Cuenta</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Mis <span className="text-gradient">Datos</span></h1>
          <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-2 leading-relaxed">
            Personaliza tu información y optimiza tu perfil profesional para el buscador.
          </p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl glass-emerald border border-emerald-500/10 shadow-lg shadow-emerald-500/10 self-start group cursor-default">
           <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
             <UserCheck className="w-5 h-5" />
           </div>
           <div className="flex flex-col">
             <span className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Verificación</span>
             <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-bold uppercase tracking-tight">Estatus: Activo</span>
               <ShieldCheck className="w-3 h-3 text-emerald-500" />
             </div>
           </div>
        </div>
      </div>

      {/* Formulario */}
      <ProfileForm initialData={userData} />
      
      {/* Espaciador Final */}
      <div className="py-20" />
    </div>
  );
}
