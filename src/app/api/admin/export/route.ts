import ExcelJS from "exceljs";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { periodStart } from "@/lib/domain";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = new URL(req.url).searchParams.get("range");

  const orders = await db.order.findMany({
    where:
      range && range !== "semua"
        ? { createdAt: { gte: periodStart(range) } }
        : undefined,
    orderBy: { id: "desc" },
    take: 5000,
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Pesanan");
  ws.columns = [
    { header: "No Pesanan", key: "orderNo", width: 14 },
    { header: "Nama", key: "customerName", width: 22 },
    { header: "WhatsApp", key: "phone", width: 16 },
    { header: "Layanan", key: "orderType", width: 12 },
    { header: "Jumlah", key: "qty", width: 8 },
    { header: "Harga", key: "amount", width: 12 },
    { header: "Diskon", key: "discount", width: 12 },
    { header: "Total", key: "total", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Lunas", key: "isPaid", width: 8 },
    { header: "Tgl Jemput", key: "pickupDate", width: 12 },
    { header: "Slot", key: "pickupSlot", width: 14 },
    { header: "Alamat", key: "address", width: 34 },
    { header: "Catatan", key: "notes", width: 34 },
    { header: "Dibuat", key: "createdAt", width: 18 },
  ];
  ws.getRow(1).font = { bold: true };

  for (const o of orders) {
    ws.addRow({
      orderNo: o.orderNo,
      customerName: o.customerName,
      phone: o.phone,
      orderType: o.orderType,
      qty: o.qty,
      amount: o.amount,
      discount: o.discount,
      total: o.total,
      status: o.status,
      isPaid: o.isPaid ? "Ya" : "Belum",
      pickupDate: o.pickupDate.toISOString().slice(0, 10),
      pickupSlot: o.pickupSlot,
      address: o.address,
      notes: o.notes ?? "",
      createdAt: o.createdAt.toISOString().slice(0, 16).replace("T", " "),
    });
  }

  const buf = await wb.xlsx.writeBuffer();
  const name = `pesanan-rclean-${range ?? "semua"}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return new Response(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}