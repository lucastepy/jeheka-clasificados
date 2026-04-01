import { NextResponse } from "next/server";
import { locationService } from "@/services/location";

/**
 * Endpoint para obtener ciudades por distrito.
 * GET /api/locations/ciudades?dis_cod=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const disCod = searchParams.get("dis_cod");

  if (!disCod) {
    return NextResponse.json({ error: "Debe proporcionar un dis_cod" }, { status: 400 });
  }

  try {
    const data = await locationService.getCiudades(parseInt(disCod));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching ciudades:", error);
    return NextResponse.json({ error: "No se pudieron obtener las ciudades" }, { status: 500 });
  }
}
