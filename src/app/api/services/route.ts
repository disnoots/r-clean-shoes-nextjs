import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Publik: daftar layanan aktif untuk halaman harga & form pemesanan
export async function GET() {
  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
    select: { key: true, name: true, price: true, isSubscription: true },
  });
  return NextResponse.json(
    { services },
    { headers: { "Cache-Control": "no-store" } }
  );
}