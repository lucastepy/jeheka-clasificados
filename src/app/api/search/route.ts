import { NextResponse } from "next/server";
import { searchService } from "@/services/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get("query") || undefined;
  const categoria = searchParams.get("categoria") ? parseInt(searchParams.get("categoria")!) : undefined;
  const ciudad = searchParams.get("ciudad") ? parseInt(searchParams.get("ciudad")!) : undefined;
  const min_precio = searchParams.get("min_precio") ? parseFloat(searchParams.get("min_precio")!) : undefined;
  const max_precio = searchParams.get("max_precio") ? parseFloat(searchParams.get("max_precio")!) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;
  const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

  try {
    const results = await searchService.buscarAvisos({
      query,
      categoria,
      ciudad,
      min_precio,
      max_precio,
      limit,
      offset
    });
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}
