import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const hours = await db.businessHour.findMany({ orderBy: { dayOfWeek: "asc" } });
  return NextResponse.json({ hours });
}

// Simpan jam buka sekaligus: body = { hours: [{dayOfWeek, isOpen, openTime, closeTime}] }
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.hours)) {
    return NextResponse.json({ error: "Format data salah." }, { status: 400 });
  }

  for (const h of body.hours) {
    await db.businessHour.update({
      where: { dayOfWeek: Number(h.dayOfWeek) },
      data: {
        isOpen: Boolean(h.isOpen),
        openTime: String(h.openTime).slice(0, 10),
        closeTime: String(h.closeTime).slice(0, 10),
      },
    });
  }

  const hours = await db.businessHour.findMany({ orderBy: { dayOfWeek: "asc" } });
  return NextResponse.json({ ok: true, hours });
}