import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await db.query(
    `SELECT column_name, data_type, character_maximum_length 
     FROM information_schema.columns 
     WHERE table_name = 'avisos';`
  );
  return NextResponse.json(res.rows);
}
