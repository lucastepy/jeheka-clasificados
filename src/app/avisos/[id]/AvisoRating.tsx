"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { rateAviso } from "../../mis-avisos/actions";

interface AvisoRatingProps {
  avisoId: string;
  promedio: number;
  cantidad: number;
}

export default function AvisoRating({ avisoId, promedio, cantidad }: AvisoRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRate = async (rating: number) => {
    setLoading(true);
    try {
      const res = await rateAviso(avisoId, rating);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Calificar Servicio</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-emerald-500">{Number(promedio || 0).toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`w-3 h-3 ${s <= Math.round(promedio || 0) ? 'fill-emerald-500 text-emerald-500' : 'text-emerald-500/20'}`} 
              />
            ))}
          </div>
          <span className="text-[9px] font-bold opacity-30">({cantidad})</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={loading}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(star)}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                className={`w-7 h-7 transition-all ${
                  star <= (hoverRating || 0)
                    ? "fill-emerald-400 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    : "text-emerald-500/20"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 ml-auto">
          {loading ? "Guardando..." : "Pulsa para votar"}
        </p>
      </div>
    </div>
  );
}
