import { NextResponse } from "next/server";
import { locationService } from "@/services/location";

/**
 * Endpoint para obtener distritos por departamento.
 * GET /api/locations/distritos?dep_cod=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const depCod = searchParams.get("dep_cod");

  if (!depCod) {
    return NextResponse.json({ error: "Debe proporcionar un dep_cod" }, { status: 400 });
  }

  try {
    const data = await locationService.getDistritos(parseInt(depCod));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching distritos:", error);
    return NextResponse.json({ error: "No se pudieron obtener los distritos" }, { status: 500 });
  }
}
