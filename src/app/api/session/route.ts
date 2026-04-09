import { cookies } from "next/headers";
import { decrypt } from "@/app/login/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jk_auth_session")?.value;
  
  if (!token) {
    return NextResponse.json({ session: null });
  }
  
  const session = await decrypt(token);
  return NextResponse.json({ session });
}
