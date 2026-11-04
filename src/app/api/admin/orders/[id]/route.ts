import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { STATUSES, NEXT_STATUS } from "@/lib/domain";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const orderId = Number(id);
  const body = await req.json().catch(() => ({}));

  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (!existing) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  }

  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const target = String(body.status);
    if (!(STATUSES as readonly string[]).includes(target)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }
    data.status = target;
    if (target === "SELESAI" && !existing.completedAt) {
      data.completedAt = new Date();
    }
  }

  if (body.isPaid !== undefined) {
    data.isPaid = Boolean(body.isPaid);
    data.paidAt = body.isPaid ? new Date() : null;
  }

  const updated = await db.order.update({ where: { id: orderId }, data });
  return NextResponse.json({
    ok: true,
    order: updated,
    nextStatus: NEXT_STATUS[updated.status],
  });
}