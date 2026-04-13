
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activateAviso } from "@/app/mis-avisos/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("dLocal Webhook Received:", body);

    const { status, order_id } = body;

    // dLocal Go envía el estado en el campo 'status'
    // PAID significa que el pago fue exitoso
    if (status === "PAID" && order_id) {
      console.log(`Activando aviso ${order_id} via Webhook`);
      await activateAviso(order_id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
  }
}
