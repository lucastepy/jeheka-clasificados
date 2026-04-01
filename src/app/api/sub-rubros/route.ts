import { NextResponse } from "next/server";
import { rubroService } from "@/services/location";

/**
 * Endpoint para obtener sub-rubros por rubro.
 * GET /api/sub-rubros?rub_id=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rubId = searchParams.get("rub_id");

  if (!rubId) {
    return NextResponse.json({ error: "Debe proporcionar un rub_id" }, { status: 400 });
  }

  try {
    const data = await rubroService.getSubRubros(parseInt(rubId));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sub-rubros:", error);
    return NextResponse.json({ error: "No se pudieron obtener los sub-rubros" }, { status: 500 });
  }
}
