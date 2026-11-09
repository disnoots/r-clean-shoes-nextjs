import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getWaNumber } from "@/lib/settings";

// Publik: daftar layanan aktif + nomor WA admin (untuk semua tombol chat)
export async function GET() {
  const [services, waNumber] = await Promise.all([
    db.service.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { key: true, name: true, price: true, isSubscription: true },
    }),
    getWaNumber(),
  ]);
  return NextResponse.json(
    { services, waNumber },
    { headers: { "Cache-Control": "no-store" } }
  );
}