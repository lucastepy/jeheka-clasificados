
import React from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { activateAviso } from "../actions";

export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Promise<{ avisoId?: string; status?: string }>;
}) {
  const { avisoId, type } = await searchParams;
  const isSubscription = type === "sub";

  if (!avisoId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-[2rem] text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Ups! Algo salió mal</h1>
          <p className="opacity-60 mb-8">No pudimos encontrar la referencia de tu aviso.</p>
          <Link href="/mis-avisos" className="btn-premium px-8 py-3 text-xs uppercase font-bold tracking-widest">
            Volver a mis avisos
          </Link>
        </div>
      </div>
    );
  }

  // Activar el aviso
  const activation = await activateAviso(avisoId);

  if (!activation.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-[2rem] text-center max-w-md border border-red-500/20">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error de Activación</h1>
          <p className="opacity-60 mb-8">El pago fue procesado, pero tuvimos un problema activando tu aviso automáticamente. Por favor contacta a soporte.</p>
          <Link href="/mis-avisos" className="btn-premium px-8 py-3 text-xs uppercase font-bold tracking-widest">
            Ir a mis avisos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-12 rounded-[3rem] text-center max-w-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tight">¡Pago Confirmado!</h1>
        <p className="text-lg opacity-60 mb-6">
          Tu aviso ha sido activado exitosamente y ya es visible en Jeheka.
          ¡Muchos éxitos con tu venta!
        </p>

        {isSubscription && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-10 inline-block">
            <p className="text-sm text-emerald-400 font-medium">
              Suscripción activa: Se realizarán débitos automáticos mensuales para mantener tu aviso destacado.
            </p>
          </div>
        )}

        <div className="pt-2"></div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/avisos/${avisoId}`}
            className="btn-premium px-8 py-4 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2"
          >
            Ver mi aviso <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/mis-avisos"
            className="px-8 py-4 rounded-xl border border-white/10 text-xs uppercase font-bold tracking-widest hover:bg-white/5 transition-all flex items-center justify-center"
          >
            Ir al listado
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest opacity-30 mb-4">Si esta es una ventana emergente</p>
          <button 
            onClick={() => window.close()}
            className="text-emerald-500 text-xs font-bold hover:underline"
          >
            Haga clic aquí para cerrar esta ventana
          </button>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `
        // Intentar cerrar automáticamente si es un popup después de 3 segundos
        if (window.opener) {
          setTimeout(() => {
            // window.close(); // Algunos navegadores bloquean el auto-close. Mejor dejar el botón.
          }, 3000);
        }
      `}} />
    </div>
  );
}
