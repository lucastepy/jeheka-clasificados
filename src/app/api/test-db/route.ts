import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const categoriasCount = await db.query("SELECT count(*) FROM categorias").catch(() => ({ rows: [{ count: 'error' }] }));
    const rubrosCount = await db.query("SELECT count(*) FROM rubros").catch(() => ({ rows: [{ count: 'error' }] }));

    return NextResponse.json({
      tables: tables.rows.map(r => r.table_name),
      counts: {
        categorias: categoriasCount.rows[0].count,
        rubros: rubrosCount.rows[0].count
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
