"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, NEXT_STATUS } from "@/lib/domain";

// ---------- tipe & util ----------
type Service = { id: number; key: string; name: string; price: number; isSubscription: boolean; isActive: boolean };
type Hour = { id: number; dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string };
type Order = {
  id: number; orderNo: string; customerName: string; phone: string; orderType: string;
  qty: number; amount: number; total: number; discount: number; status: string; isPaid: boolean;
  pickupDate: string; pickupSlot: string; address: string; notes: string | null; createdAt: string;
};
type Stats = { income: number; totalOrders: number; completedOrders: number; pendingOrders: number; autoCancelled: number };

const SERVICE_LABEL: Record<string, string> = {
  fast: "Fast Clean", deep: "Deep Clean", express: "Express",
  premium: "Premium", hemat: "Paket Hemat", aktif: "Paket Aktif",
};
const DAY_LABEL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const STATUS_COLOR: Record<string, string> = {
  BARU: "bg-gold/20 text-gold-dark", DIKONFIRMASI: "bg-blue-100 text-blue-800",
  DIJEMPUT: "bg-purple-100 text-purple-800", DICUCI: "bg-cyan-100 text-cyan-800",
  DIKIRIM: "bg-orange-100 text-orange-800", SELESAI: "bg-green-100 text-green-800",
  BATAL: "bg-red-100 text-red-700",
};
const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

/** 0812… / 62812… -> https://wa.me/62812… (untuk tombol konfirmasi outbound) */
function waLink(phone: string, text: string) {
  let n = phone.replace(/\D/g, "");
  if (n.startsWith("62")) n = n.slice(2);
  else if (n.startsWith("0")) n = n.slice(1);
  return `https://wa.me/62${n}?text=${encodeURIComponent(text)}`;
}
const confirmMsg = (o: Order) =>
  `Halo ${o.customerName}, pesanan ${o.orderNo} (${SERVICE_LABEL[o.orderType] ?? o.orderType}, jemput ${o.pickupSlot}) sudah kami terima. Kurir bisa datang ya. Terima kasih! — R Clean Shoes`;

// ---------- halaman ----------
export default function AdminDashboard() {
  const router = useRouter();
  const [range, setRange] = useState<"today" | "week" | "month">("today");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<Hour[]>([]);
  const [waNumber, setWaNumber] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState("");

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const loadStats = useCallback(async () => {
    const r = await fetch(`/api/admin/stats?range=${range}`);
    if (r.ok) setStats(await r.json());
  }, [range]);

  const loadOrders = useCallback(async () => {
    const r = await fetch(`/api/admin/orders?status=${statusFilter}&page=${page}`);
    if (!r.ok) return;
    const data = await r.json();
    // Jaga-jaga: halaman jadi kosong (mis. pesanan terakhir dibatalkan) -> mundur satu halaman
    if (data.orders.length === 0 && data.page > 1) {
      setPage(data.page - 1);
      return;
    }
    setOrders(data.orders);
    setPages(data.pages);
    setTotal(data.total);
  }, [statusFilter, page]);

  const loadSettings = useCallback(async () => {
    const [s, h, st] = await Promise.all([
      fetch("/api/admin/services").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/hours").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/settings").then((r) => (r.ok ? r.json() : null)),
    ]);
    if (s) setServices(s.services);
    if (h) setHours(h.hours);
    if (st) setWaNumber(st.waNumber);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data saat mount/periode berubah (setState di dalam callback async)
  useEffect(() => { loadStats(); }, [loadStats]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data saat mount/filter/halaman berubah (setState di dalam callback async)
  useEffect(() => { loadOrders(); }, [loadOrders]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data saat mount (setState di dalam callback async)
  useEffect(() => { loadSettings(); }, [loadSettings]);

  const patch = async (id: number, body: object) => {
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (r.ok) { await Promise.all([loadOrders(), loadStats()]); notify("Pesanan diperbarui."); }
    else notify("Gagal memperbarui pesanan.");
  };

  const saveServices = async () => {
    setSaving("services");
    const r = await fetch("/api/admin/services", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });
    setSaving("");
    if (r.ok) notify("Harga tersimpan. Halaman publik otomatis ikut berubah.");
    else notify("Gagal menyimpan harga.");
  };

  const saveHours = async () => {
    setSaving("hours");
    const r = await fetch("/api/admin/hours", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });
    setSaving("");
    if (r.ok) notify("Jam buka tersimpan.");
    else notify("Gagal menyimpan jam buka.");
  };

  const saveWa = async () => {
    setSaving("wa");
    const r = await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ waNumber }),
    });
    const data = await r.json().catch(() => ({}));
    setSaving("");
    if (r.ok) { setWaNumber(data.waNumber); notify("Nomor WhatsApp tersimpan. Semua tombol chat langsung ikut berubah."); }
    else notify(data.error ?? "Gagal menyimpan nomor WhatsApp.");
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const pending = useMemo(() => orders.filter((o) => o.status === "BARU"), [orders]);

  const kpi = [
    { label: "Pendapatan", value: stats ? rp(stats.income) : "…", sub: "pesanan SELESAI" },
    { label: "Total pesanan", value: stats?.totalOrders ?? "…", sub: "masuk periode ini" },
    { label: "Selesai", value: stats?.completedOrders ?? "…", sub: "diselesaikan periode ini" },
  ];

  return (
    <div className="min-h-screen bg-foam pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-navy text-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <span className="font-extrabold">Admin · R Clean Shoes</span>
          <div className="flex gap-3 text-sm font-bold">
            <a href="/api/admin/export?range=semua" className="rounded-lg bg-gold px-3 py-1.5 text-navy">
              Export Excel
            </a>
            <button onClick={logout} className="cursor-pointer rounded-lg border border-white/40 px-3 py-1.5">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-5 pt-8">
        {/* KPI */}
        <section>
          <div className="mb-4 flex flex-wrap gap-2">
            {([["today", "Hari ini"], ["week", "Minggu ini"], ["month", "Bulan ini"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setRange(v)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold ${range === v ? "bg-navy text-white" : "bg-white text-ink border border-line"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {kpi.map((k) => (
              <div key={k.label} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-sm font-bold text-mute">{k.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-navy">{k.value}</p>
                <p className="text-xs text-mute">{k.sub}</p>
              </div>
            ))}
          </div>
          {stats && stats.autoCancelled > 0 ? (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              {stats.autoCancelled} pesanan BARU lewat tanggal jemputnya → otomatis dibatalkan.
            </p>
          ) : null}
        </section>

        {/* Antrean perlu konfirmasi */}
        <section>
          <h2 className="mb-1 text-lg font-extrabold text-navy">Perlu dikonfirmasi ({pending.length})</h2>
          <p className="mb-4 text-sm text-mute">
            Pesanan baru dari form yang belum kamu konfirmasi. Klik Konfirmasi untuk chat customer langsung.
          </p>
          {pending.length === 0 ? (
            <p className="rounded-xl bg-white p-5 text-sm text-mute border border-line">Tidak ada — semua sudah ditangani. 🎉</p>
          ) : (
            <ul className="space-y-2">
              {pending.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gold/50 bg-white p-4">
                  <div className="min-w-40 flex-1">
                    <b className="text-navy">{o.orderNo}</b> · {o.customerName} ·{" "}
                    {SERVICE_LABEL[o.orderType] ?? o.orderType} · jemput {o.pickupSlot}
                  </div>
                  <a href={waLink(o.phone, confirmMsg(o))} target="_blank" rel="noopener"
                    onClick={() => patch(o.id, { status: "DIKONFIRMASI" })}
                    className="rounded-lg bg-wa px-3 py-1.5 text-sm font-bold text-white">
                    Konfirmasi via WA
                  </a>
                  <button onClick={() => patch(o.id, { status: "BATAL" })}
                    className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-sm font-bold text-red-600">
                    Batalkan
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tabel pesanan */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy">Daftar pesanan</h2>
            <select value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm">
              <option value="SEMUA">Semua status</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-180 text-sm">
              <thead>
                <tr className="border-b border-line text-left text-mute">
                  <th className="p-3">No</th><th className="p-3">Nama</th><th className="p-3">Layanan</th>
                  <th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Lunas</th><th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line/60">
                    <td className="p-3 font-bold text-navy">{o.orderNo}</td>
                    <td className="p-3">{o.customerName}</td>
                    <td className="p-3">{SERVICE_LABEL[o.orderType] ?? o.orderType}{o.qty > 1 ? ` ×${o.qty}` : ""}</td>
                    <td className="p-3">{rp(o.total)}</td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                    <td className="p-3">
                      <input type="checkbox" checked={o.isPaid} onChange={(e) => patch(o.id, { isPaid: e.target.checked })}
                        className="h-4 w-4 cursor-pointer" aria-label={`Tandai ${o.orderNo} lunas`} />
                    </td>
                    <td className="flex flex-wrap gap-1.5 p-3">
                      {NEXT_STATUS[o.status] ? (
                        <button onClick={() => patch(o.id, { status: NEXT_STATUS[o.status] })}
                          className="cursor-pointer rounded-lg bg-navy px-2.5 py-1 text-xs font-bold text-white">
                          → {NEXT_STATUS[o.status]}
                        </button>
                      ) : null}
                      {o.status !== "BATAL" && o.status !== "SELESAI" ? (
                        <button onClick={() => patch(o.id, { status: "BATAL" })}
                          className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600">
                          Batalkan
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="p-5 text-center text-mute">Belum ada pesanan.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
          {total > 0 ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-mute">
                Menampilkan {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} dari {total} pesanan
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">
                  ← Sebelumnya
                </button>
                <span className="text-sm text-mute">Halaman {page} dari {pages}</span>
                <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}
                  className="cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">
                  Berikutnya →
                </button>
              </div>
            </div>
          ) : null}
        </section>

        {/* Pengaturan harga */}
        <section>
          <h2 className="mb-1 text-lg font-extrabold text-navy">Pengaturan harga</h2>
          <p className="mb-4 text-sm text-mute">Perubahan langsung tampil di halaman publik. Pesanan lama tetap memakai harga saat dipesan.</p>
          <div className="space-y-2 rounded-xl border border-line bg-white p-4">
            {services.map((s, i) => (
              <div key={s.key} className="flex flex-wrap items-center gap-3 border-b border-line/60 pb-2 last:border-0">
                <span className="w-40 font-bold">{s.name}</span>
                <span className="text-mute">Rp</span>
                <input type="number" min={0} step={1000} value={s.price}
                  onChange={(e) => setServices((prev) => prev.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)))}
                  className="w-32 rounded-lg border border-line px-2 py-1.5" aria-label={`Harga ${s.name}`} />
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={s.isSubscription}
                    onChange={(e) => setServices((prev) => prev.map((x, j) => (j === i ? { ...x, isSubscription: e.target.checked } : x)))}
                    className="h-4 w-4" /> Paket bulanan
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={s.isActive}
                    onChange={(e) => setServices((prev) => prev.map((x, j) => (j === i ? { ...x, isActive: e.target.checked } : x)))}
                    className="h-4 w-4" /> Aktif
                </label>
              </div>
            ))}
            <button onClick={saveServices} disabled={saving === "services"}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 font-bold text-navy disabled:opacity-60">
              {saving === "services" ? "Menyimpan…" : "Simpan harga"}
            </button>
          </div>
        </section>

        {/* Nomor WhatsApp */}
        <section>
          <h2 className="mb-1 text-lg font-extrabold text-navy">Nomor WhatsApp admin</h2>
          <p className="mb-4 text-sm text-mute">
            Dipakai semua tombol chat di halaman publik (header, tombol mengapung, form pesan, FAQ, footer) dan pesanan yang masuk ke WhatsApp.
          </p>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4">
            <span className="font-bold">Nomor WA</span>
            <input
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="081234567890 atau 6281234567890"
              inputMode="tel"
              className="w-64 rounded-lg border border-line px-2 py-1.5"
              aria-label="Nomor WhatsApp admin"
            />
            <button onClick={saveWa} disabled={saving === "wa" || !waNumber.trim()}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 font-bold text-navy disabled:opacity-60">
              {saving === "wa" ? "Menyimpan…" : "Simpan nomor"}
            </button>
          </div>
        </section>

        {/* Jam buka */}
        <section>
          <h2 className="mb-1 text-lg font-extrabold text-navy">Jam buka</h2>
          <div className="space-y-2 rounded-xl border border-line bg-white p-4">
            {hours.map((h, i) => (
              <div key={h.dayOfWeek} className="flex flex-wrap items-center gap-3 border-b border-line/60 pb-2 last:border-0">
                <span className="w-20 font-bold">{DAY_LABEL[h.dayOfWeek]}</span>
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={h.isOpen}
                    onChange={(e) => setHours((prev) => prev.map((x, j) => (j === i ? { ...x, isOpen: e.target.checked } : x)))}
                    className="h-4 w-4" /> Buka
                </label>
                <input value={h.openTime} disabled={!h.isOpen}
                  onChange={(e) => setHours((prev) => prev.map((x, j) => (j === i ? { ...x, openTime: e.target.value } : x)))}
                  className="w-24 rounded-lg border border-line px-2 py-1.5 disabled:opacity-50" aria-label={`Buka ${DAY_LABEL[h.dayOfWeek]}`} />
                <span className="text-mute">–</span>
                <input value={h.closeTime} disabled={!h.isOpen}
                  onChange={(e) => setHours((prev) => prev.map((x, j) => (j === i ? { ...x, closeTime: e.target.value } : x)))}
                  className="w-24 rounded-lg border border-line px-2 py-1.5 disabled:opacity-50" aria-label={`Tutup ${DAY_LABEL[h.dayOfWeek]}`} />
              </div>
            ))}
            <button onClick={saveHours} disabled={saving === "hours"}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 font-bold text-navy disabled:opacity-60">
              {saving === "hours" ? "Menyimpan…" : "Simpan jam buka"}
            </button>
          </div>
        </section>
      </main>

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white transition-opacity ${toast ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {toast}
      </div>
    </div>
  );
}