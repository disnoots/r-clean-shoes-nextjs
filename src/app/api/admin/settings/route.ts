import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { getWaNumber } from "@/lib/settings";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    waNumber: await getWaNumber(),
  });
}

// Simpan setting: body = { waNumber: "62xxxxxxxxxx" }
// Terima 08xx / 8xx / 62xx, normalisasi semua ke 62xx (format wa.me)
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const raw = String(body?.waNumber ?? "").replace(/\D/g, "");

  let normalized = raw;
  if (normalized.startsWith("0")) normalized = "62" + normalized.slice(1);
  if (normalized.startsWith("8")) normalized = "62" + normalized;

  if (!/^62\d{7,13}$/.test(normalized)) {
    return NextResponse.json(
      { error: "Nomor tidak valid. Contoh yang benar: 081234567890 atau 6281234567890." },
      { status: 400 }
    );
  }

  await db.setting.upsert({
    where: { key: "wa_number" },
    update: { value: normalized },
    create: { key: "wa_number", value: normalized },
  });

  return NextResponse.json({ ok: true, waNumber: normalized });
}