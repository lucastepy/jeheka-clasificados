
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  try {
    const res = await db.query("SELECT avi_estado FROM avisos WHERE avi_id = $1", [id]);
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ status: res.rows[0].avi_estado });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
