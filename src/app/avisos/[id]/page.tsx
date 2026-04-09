import React from "react";
import { getAvisoById } from "../../mis-avisos/actions";
import { Phone, MapPin, Tag, Calendar, User, ChevronLeft, ImageIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AvisoDetailPage({ params }: { params: { id: string } }) {
  console.log("Buscando detalle de aviso ID:", params.id);
  const aviso = await getAvisoById(params.id);

  if (!aviso) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen opacity-40">
        <p className="text-xl font-bold uppercase tracking-widest">Aviso no encontrado</p>
        <p className="text-[10px] opacity-50 mt-2">ID: {params.id}</p>
        <Link href="/" className="mt-4 text-emerald-500 underline text-sm font-bold uppercase tracking-widest">Volver al inicio</Link>
      </div>
    );
  }

  const imagenes = Array.isArray(aviso.avi_imagenes) ? aviso.avi_imagenes : [];

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 lg:px-12 max-w-5xl mx-auto">
      <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-8">
        <ChevronLeft className="w-4 h-4" />
        Volver a la búsqueda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería / Imagen */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden glass border border-white/5 relative bg-slate-500/10">
            {imagenes[0] ? (
              <img src={imagenes[0]} alt={aviso.avi_titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                <ImageIcon className="w-20 h-20 mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sin Imagen</span>
              </div>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              {aviso.rubro_nombre || "Servicio"}
            </span>
            <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
              Ref: {aviso.avi_id.slice(0, 8)}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-[900] tracking-tight uppercase leading-none mb-4">
            {aviso.avi_titulo}
          </h1>

          <div className="flex items-center gap-2 text-2xl font-black text-emerald-500 mb-8">
            {aviso.avi_precio ? `Gs. ${new Intl.NumberFormat('es-PY').format(aviso.avi_precio)}` : "Precio a convenir"}
          </div>

          <div className="flex flex-col gap-4 mb-10 p-6 rounded-3xl bg-slate-500/5 border border-white/5">
            <div className="flex items-center gap-3 opacity-60">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wide">
                {aviso.ciu_dsc ? `${aviso.ciu_dsc}, ${aviso.dep_dsc}` : "Ubicación no especificada"}
              </span>
            </div>
            <div className="flex items-center gap-3 opacity-60">
              <User className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wide">Publicado por {aviso.usu_nombre || "Anunciante"}</span>
            </div>
            <div className="flex items-center gap-3 opacity-60">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wide">Publicada: {new Date(aviso.avi_fec_alta).toLocaleDateString('es-PY')}</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">Descripción</h2>
            <p className="text-sm opacity-70 leading-relaxed font-medium whitespace-pre-wrap">
              {aviso.avi_descripcion}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <a 
              href={`https://wa.me/${aviso.usu_tel?.replace(/\D/g, '')}`}
              target="_blank"
              className="w-full btn-premium py-4 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest"
            >
              <Phone className="w-4 h-4 fill-current" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
