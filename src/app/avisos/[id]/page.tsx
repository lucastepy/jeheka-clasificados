import React from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Calendar } from "lucide-react";
import { getAvisoById } from "../../mis-avisos/actions";
import AvisoGallery from "./AvisoGallery";
import AvisoContact from "./AvisoContact";
import AvisoProfile from "./AvisoProfile";

export const dynamic = "force-dynamic";

export default async function AvisoDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  console.log("Buscando detalle de aviso ID:", id);
  const aviso = await getAvisoById(id);

  if (!aviso) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen opacity-40">
        <p className="text-xl font-bold uppercase tracking-widest">Aviso no encontrado</p>
        <p className="text-[10px] opacity-50 mt-2">ID: {id || "No detectado"}</p>
        <Link href="/" className="mt-4 text-emerald-500 underline text-sm font-bold uppercase tracking-widest">Volver al inicio</Link>
      </div>
    );
  }

  const imagenes = Array.isArray(aviso.avi_imagenes) ? aviso.avi_imagenes : [];

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-8">
        <ChevronLeft className="w-4 h-4" />
        Volver a la búsqueda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Columna Izquierda: Galería y Descripción (span 7 o 8) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <AvisoGallery imagenes={imagenes} titulo={aviso.avi_titulo} />
          
          <div className="glass rounded-[2.5rem] border border-white/5 p-10">
            <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">Descripción del Servicio</h2>
            <p className="text-md opacity-70 leading-relaxed font-medium whitespace-pre-wrap">
              {aviso.avi_descripcion}
            </p>
          </div>
        </div>

        {/* Columna Derecha: Precio, Perfil y Contacto (span 4 o 5) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                {aviso.rubro_nombre || "Servicio"}
              </span>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                Ref: {aviso.avi_id.slice(0, 8)}
              </span>
            </div>

            <h1 className="text-3xl font-[900] tracking-tight uppercase leading-[0.9] mb-4">
              {aviso.avi_titulo}
            </h1>

            <div className="flex items-center gap-2 text-3xl font-black text-emerald-500 mb-8">
              {aviso.avi_precio ? `Gs. ${new Intl.NumberFormat('es-PY').format(aviso.avi_precio)}` : "Precio a convenir"}
            </div>

            <div className="flex flex-col gap-4 mb-8 p-6 rounded-3xl bg-slate-500/5 border border-white/5">
              <div className="flex items-center gap-3 opacity-60">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {aviso.ciu_dsc ? `${aviso.ciu_dsc}, ${aviso.dep_dsc}` : "Ubicación no especificada"}
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wide">Publicada: {new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(aviso.avi_fec_alta))}</span>
              </div>
            </div>

            <div className="mb-8">
              <AvisoContact whatsapp={aviso.usu_tel} titulo={aviso.avi_titulo} />
            </div>

            <AvisoProfile 
              nombre={aviso.usu_nombre}
              foto={aviso.usu_foto_url}
              biografia={aviso.usu_biografia}
              email={aviso.usu_email}
              whatsapp={aviso.usu_tel}
              direccion={aviso.usu_direccion}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
