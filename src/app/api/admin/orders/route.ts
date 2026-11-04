import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const status = params.get("status");
  const limit = Math.min(200, Number(params.get("limit")) || 50);

  const orders = await db.order.findMany({
    where: status && status !== "SEMUA" ? { status } : undefined,
    orderBy: { id: "desc" },
    take: limit,
    select: {
      id: true, orderNo: true, customerName: true, phone: true,
      orderType: true, qty: true, amount: true, total: true, discount: true,
      status: true, isPaid: true, pickupDate: true, pickupSlot: true,
      address: true, notes: true, createdAt: true,
    },
  });

  return NextResponse.json({ orders });
}