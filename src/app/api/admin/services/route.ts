import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const services = await db.service.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ services });
}

// Simpan semua harga sekaligus: body = { services: [{key, name, price, isSubscription, isActive}] }
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.services)) {
    return NextResponse.json({ error: "Format data salah." }, { status: 400 });
  }

  for (const s of body.services) {
    const price = Math.max(0, Math.round(Number(s.price) || 0));
    await db.service.update({
      where: { key: String(s.key) },
      data: {
        name: String(s.name).slice(0, 60),
        price,
        isSubscription: Boolean(s.isSubscription),
        isActive: Boolean(s.isActive),
      },
    });
  }

  const services = await db.service.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ ok: true, services });
}