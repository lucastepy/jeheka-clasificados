import React from "react";
import { getSession } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { ArrowLeft, Megaphone } from "lucide-react";
import Link from "next/link";
import AvisoForm from "./AvisoForm";
import { getUserDefaultData } from "../actions";

export default async function NuevoAvisoPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userData = await getUserDefaultData();

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/mis-avisos" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a mis avisos
        </Link>

        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-3xl glass-emerald flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Megaphone className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase leading-none mb-2">Nuevo Aviso</h1>
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Completa los detalles de tu servicio profesional</p>
          </div>
        </div>

        <AvisoForm userData={userData} />
      </div>
    </div>
  );
}
