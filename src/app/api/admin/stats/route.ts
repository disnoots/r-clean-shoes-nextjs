import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { jakartaToday, periodStart } from "@/lib/domain";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = new URL(req.url).searchParams.get("range") ?? "today";
  const start = periodStart(range); // Senin utk "week", tgl 1 utk "month"

  // Fail-safe: pesanan BARU yang tanggal jemputnya sudah lewat -> BATAL otomatis
  const todayStart = new Date(`${jakartaToday()}T00:00:00+07:00`);
  const expired = await db.order.updateMany({
    where: { status: "BARU", pickupDate: { lt: todayStart } },
    data: { status: "BATAL" },
  });

  const [sums, totalOrders, completedOrders, pendingOrders] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: { status: "SELESAI", completedAt: { gte: start } },
    }),
    db.order.count({ where: { createdAt: { gte: start } } }),
    db.order.count({ where: { status: "SELESAI", completedAt: { gte: start } } }),
    db.order.count({ where: { status: { in: ["BARU", "DIKONFIRMASI", "DIJEMPUT", "DICUCI", "DIKIRIM"] } } }),
  ]);

  return NextResponse.json({
    income: sums._sum.total ?? 0,
    totalOrders,
    completedOrders,
    pendingOrders,
    autoCancelled: expired.count,
  });
}