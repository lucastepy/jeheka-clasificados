
import React from "react";
import { getSession } from "@/app/login/actions";
import { redirect, notFound } from "next/navigation";
import { getAvisoById, getUserDefaultData } from "../../actions";
import AvisoForm from "../../nuevo/AvisoForm";

interface EditAvisoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAvisoPage({ params }: EditAvisoPageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const [aviso, userData] = await Promise.all([
    getAvisoById(id),
    getUserDefaultData()
  ]);

  if (!aviso) return notFound();

  // Verificar que el aviso pertenezca al usuario
  if (aviso.usu_id !== session.id) {
    redirect("/mis-avisos");
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight uppercase mb-2">Editar Aviso</h1>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Modifica los detalles de tu servicio publicado</p>
        </div>

        <AvisoForm userData={userData} initialData={aviso} />
      </div>
    </div>
  );
}
