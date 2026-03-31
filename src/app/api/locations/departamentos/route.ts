import { NextResponse } from "next/server";
import { locationService } from "@/services/location";

/**
 * Endpoint para obtener departamentos.
 * GET /api/locations/departamentos
 */
export async function GET() {
  try {
    const data = await locationService.getDepartamentos();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching departamentos:", error);
    return NextResponse.json({ error: "No se pudieron obtener los departamentos" }, { status: 500 });
  }
}
