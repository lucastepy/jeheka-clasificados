import { NextResponse } from "next/server";
import { rubroService } from "@/services/location";

/**
 * Endpoint para obtener rubros.
 * GET /api/rubros
 */
export async function GET() {
  try {
    const data = await rubroService.getRubros();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching rubros:", error);
    return NextResponse.json({ error: "No se pudieron obtener los rubros" }, { status: 500 });
  }
}
