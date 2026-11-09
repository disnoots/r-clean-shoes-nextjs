import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const status = params.get("status");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(50, Math.max(5, Number(params.get("pageSize")) || 20));
  const where = status && status !== "SEMUA" ? { status } : undefined;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { id: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: {
        id: true,
        orderNo: true,
        customerName: true,
        phone: true,
        orderType: true,
        qty: true,
        amount: true,
        total: true,
        discount: true,
        status: true,
        isPaid: true,
        pickupDate: true,
        pickupSlot: true,
        address: true,
        notes: true,
        createdAt: true,
      },
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({
    orders,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  });
}