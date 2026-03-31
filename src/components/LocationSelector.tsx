"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";

interface Departamento {
  dep_cod: number;
  dep_dsc: string;
}

interface Distrito {
  dis_cod: number;
  dis_dsc: string;
}

/**
 * Selector de Ubicación Jeheka
 * - Selección en cascada (Depto -> Distrito)
 * - Comportamiento de salto por teclado (tecla inicial) mediante select nativo
 * - Estado vacío controlado
 */
export const LocationSelector = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [selectedDep, setSelectedDep] = useState<string>("");
  const [selectedDis, setSelectedDis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar Departamentos iniciales
    fetch("/api/locations/departamentos")
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error("Error cargando deptos:", err));
  }, []);

  useEffect(() => {
    if (!selectedDep) {
      setDistritos([]);
      setSelectedDis("");
      return;
    }

    setLoading(true);
    fetch(`/api/locations/distritos?dep_cod=${selectedDep}`)
      .then(res => res.json())
      .then(data => setDistritos(data))
      .catch(err => console.error("Error cargando distritos:", err))
      .finally(() => setLoading(false));
  }, [selectedDep]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
      {/* DEPARTAMENTOS */}
      <div className="relative w-full md:w-64 group">
        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-500/50 uppercase pointer-events-none z-10 transition-colors group-focus-within:text-emerald-400">
          Depto
        </label>
        <select
          value={selectedDep}
          onChange={(e) => setSelectedDep(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 pl-14 pr-10 text-white appearance-none cursor-pointer focus:ring-2 ring-emerald-500/30 transition-all outline-none font-medium text-sm"
        >
          <option value="">Seleccionar...</option>
          {departamentos.map((d) => (
            <option key={d.dep_cod} value={d.dep_cod} className="bg-slate-900 text-white">
              {d.dep_dsc}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>

      <div className="hidden md:block w-px h-8 bg-white/10" />

      {/* DISTRITOS */}
      <div className="relative w-full md:w-64 group">
        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-500/50 uppercase pointer-events-none z-10 transition-colors group-focus-within:text-emerald-400">
          Distrito
        </label>
        <select
          value={selectedDis}
          onChange={(e) => setSelectedDis(e.target.value)}
          disabled={!selectedDep || loading}
          className={`w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 pl-14 pr-10 text-white appearance-none transition-all outline-none font-medium text-sm ${
            !selectedDep ? "opacity-30 cursor-not-allowed" : "cursor-pointer focus:ring-2 ring-emerald-500/30"
          }`}
        >
          {!selectedDep ? (
            <option value="">(Vacio)</option>
          ) : (
            <>
              <option value="">{loading ? "Cargando..." : "Cualquier distrito"}</option>
              {distritos.map((d) => (
                <option key={d.dis_cod} value={d.dis_cod} className="bg-slate-900 text-white">
                  {d.dis_dsc}
                </option>
              ))}
            </>
          )}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
};
