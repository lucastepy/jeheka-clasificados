
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activateAviso } from "@/app/mis-avisos/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("dLocal Webhook Received:", body);

    const { status, order_id, id: payment_id } = body;

    // El id del pago en dLocal viene como 'id' en el body del webhook
    if (status === "PAID" && order_id) {
      console.log(`Activando aviso ${order_id} via Webhook (Pago: ${payment_id})`);
      await activateAviso(order_id, payment_id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
  }
}
