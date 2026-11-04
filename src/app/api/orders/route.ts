import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jakartaToday } from "@/lib/domain";

const PROMO_CODE = "NEWCLEAN10";
const PROMO_END = new Date("2026-12-31T23:59:59+07:00");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const orderType = String(body.orderType ?? "");
  const qtyRaw = Number(body.qty) || 1;
  const pickupDate = String(body.pickupDate ?? "");
  const pickupSlot = String(body.pickupSlot ?? "");
  const address = String(body.address ?? "").trim();
  const notes = String(body.notes ?? "").trim();
  const promoCode = String(body.promoCode ?? "").trim().toUpperCase();

  // Validasi dasar (server tidak boleh percaya form)
  if (customerName.length < 2 || address.length < 6 || !phone) {
    return NextResponse.json({ error: "Data pesanan belum lengkap." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || pickupDate < jakartaToday()) {
    return NextResponse.json({ error: "Tanggal jemput tidak valid." }, { status: 400 });
  }

  // Harga diambil dari DATABASE (bukan dari client) — sesuai "price setting" admin
  const service = await db.service.findUnique({ where: { key: orderType } });
  if (!service || !service.isActive) {
    return NextResponse.json({ error: "Layanan tidak dikenali." }, { status: 400 });
  }

  const qty = service.isSubscription ? 1 : Math.max(1, Math.min(20, qtyRaw));
  const subtotal = service.price * qty;

  // Promo dihitung ulang di server: hanya untuk layanan satuan
  let discount = 0;
  let appliedCode: string | null = null;
  if (promoCode) {
    if (promoCode === PROMO_CODE && new Date() <= PROMO_END && !service.isSubscription && service.key !== "premium") {
      discount = Math.round(subtotal * 0.1);
      appliedCode = promoCode;
    }
  }

  const order = await db.order.create({
    data: {
      orderNo: "TEMP", // diisi di bawah pakai id
      customerName,
      phone,
      orderType,
      qty,
      amount: service.price,
      total: subtotal - discount,
      discount,
      promoCode: appliedCode,
      pickupDate: new Date(`${pickupDate}T00:00:00+07:00`),
      pickupSlot,
      address,
      notes: notes || null,
    },
  });

  const orderNo = `RCS-${String(order.id).padStart(5, "0")}`;
  await db.order.update({ where: { id: order.id }, data: { orderNo } });

  return NextResponse.json({
    ok: true,
    orderNo,
    total: service.price === 0 ? null : subtotal - discount,
  });
}