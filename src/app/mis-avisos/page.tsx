import React from "react";
import { getMisAvisos } from "./actions";
import { getSession } from "@/app/login/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Megaphone, Clock, Eye, Trash2, Edit3, Image as ImageIcon, Briefcase } from "lucide-react";
import { AvisosList } from "./AvisosList";

export default async function MisAvisosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const avisos = await getMisAvisos();

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase mb-2">Mis Avisos</h1>
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Gestiona tus servicios publicados en el portal</p>
          </div>
          
          <Link 
            href="/mis-avisos/nuevo"
            className="btn-premium px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3"
          >
            <Plus className="w-4 h-4" /> Publicar Nuevo Servicio
          </Link>
        </div>

        {avisos.length === 0 ? (
          <div className="glass p-12 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
              <Megaphone className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-2">Aún no tienes avisos activos</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest mb-8 max-w-sm">
              Publica tu primer servicio para empezar a recibir contactos de clientes potenciales.
            </p>
            <Link 
              href="/mis-avisos/nuevo"
              className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Comenzar ahora
            </Link>
          </div>
        ) : (
          <AvisosList initialAvisos={avisos} />
        )}
      </div>
    </div>
  );
}
