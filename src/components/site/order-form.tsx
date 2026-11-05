"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "./bits";
import { useWaNumber } from "./wa-context";

// const WA_NUMBER = "6285218221931";
const WA_NUMBER = "6289665614852";

const P: Record<string, number> = {
  fast: 35000,
  deep: 40000,
  express: 50000,
  premium: 0,
  hemat: 80000,
  aktif: 110000,
};

const N: Record<string, string> = {
  fast: "Fast Clean",
  deep: "Deep Clean",
  express: "Express",
  premium: "Premium",
  hemat: "Paket Hemat",
  aktif: "Paket Aktif",
};

const CODE = "NEWCLEAN10";
const END = new Date("2026-12-31T23:59:59+07:00");

const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

/** Normalisasi nomor WhatsApp Indonesia: 08xx / 62xx -> 8xx. Return null jika tidak valid. */
function phone(v: string): string | null {
  let n = v.replace(/\D/g, "");
  if (n.indexOf("62") === 0) n = n.slice(2);
  else if (n.indexOf("0") === 0) n = n.slice(1);
  return /^8\d{8,12}$/.test(n) ? n : null;
}

export default function OrderForm({
  svc,
  setSvc,
  kode,
  setKode,
}: {
  svc: string;
  setSvc: (v: string) => void;
  kode: string;
  setKode: (v: string) => void;
}) {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [tgl, setTgl] = useState("");
  const [tglMin, setTglMin] = useState("");
  const [jam, setJam] = useState("09.00–12.00");
  const [alamat, setAlamat] = useState("");
  const [qty, setQty] = useState("1");
  const [cat, setCat] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const waNumber = useWaNumber();

  const namaRef = useRef<HTMLInputElement>(null);
  const waRef = useRef<HTMLInputElement>(null);
  const tglRef = useRef<HTMLInputElement>(null);
  const alamatRef = useRef<HTMLTextAreaElement>(null);
  const refs = {
    nama: namaRef,
    wa: waRef,
    tgl: tglRef,
    alamat: alamatRef,
  };

  // Tanggal min = hari ini (dijalankan di client saja agar tidak hydration mismatch)
  useEffect(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const today = d.toISOString().slice(0, 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nilai ini hanya diketahui di client (mencegah hydration mismatch)
    setTglMin(today);
    setTgl(today);
  }, []);

  const paket = svc === "hemat" || svc === "aktif";
  const q = paket ? 1 : Math.max(1, parseInt(qty) || 1);

  // Logika kalkulasi & validasi kode promo — sama seperti script HTML asli
  const calc = useMemo(() => {
    const k = kode.trim().toUpperCase();
    let msg = "";
    let disc = 0;
    let ok = false;
    const sub = P[svc] * q;
    if (k) {
      if (k !== CODE) msg = "Kode tidak dikenali.";
      else if (new Date() > END) msg = "Kode sudah berakhir.";
      else if (paket || svc === "premium")
        msg = "Kode berlaku untuk layanan satuan (Fast, Deep, Express).";
      else {
        disc = Math.round(sub * 0.1);
        ok = true;
      }
    }
    return { sub, disc, ok, k, msg };
  }, [kode, paket, q, svc]);

  const kodeMsg = calc.ok ? "Kode dipakai: diskon 10%." : calc.msg;
  const total = svc === "premium" ? null : calc.sub - calc.disc;
  const tnote =
    "Antar jemput gratis" +
    (calc.disc ? " · hemat " + rp(calc.disc) : "") +
    (paket ? " · per bulan" : "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const next: Record<string, string> = {};
    let firstBad: string | null = null;
    const check = (id: string, cond: boolean, m: string) => {
      if (!cond && !firstBad) firstBad = id;
      if (!cond) next[id] = m;
    };
    check("nama", nama.trim().length > 1, "Isi nama lengkap.");
    check(
      "wa",
      !!phone(wa),
      "Isi nomor WhatsApp yang benar, contoh 08123456789."
    );
    check(
      "tgl",
      !!tgl && tgl >= tglMin,
      "Pilih tanggal jemput mulai hari ini."
    );
    check("alamat", alamat.trim().length > 5, "Isi alamat penjemputan.");
    setErrors(next);
    if (firstBad) {
      refs[firstBad as keyof typeof refs].current?.focus();
      return;
    }

    setSubmitting(true);
    setResult(null);

    // 1) Simpan pesanan ke database lewat API (server menghitung ulang harga
    //    & promo, jadi angka dari client tidak dipercaya)
    let orderNo: string | null = null;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: nama,
          phone: wa,
          orderType: svc,
          qty: q,
          pickupDate: tgl,
          pickupSlot: jam,
          address: alamat,
          notes: cat,
          promoCode: calc.ok ? kode : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({
          ok: false,
          msg: data.error ?? "Gagal menyimpan pesanan. Coba lagi atau chat admin.",
        });
        setSubmitting(false);
        return;
      }
      orderNo = data.orderNo ?? null;
      setResult({
        ok: true,
        msg: `Pesanan ${orderNo} tersimpan. Melanjutkan ke WhatsApp…`,
      });
    } catch {
      setResult({
        ok: false,
        msg: "Koneksi bermasalah. Coba lagi atau chat admin langsung.",
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(false);

    // 2) Buka WhatsApp dengan pesanan + nomor pesanan di dalamnya
    const t = tgl.split("-").reverse().join("-");
    const lines = [
      "Halo R Clean Shoes, saya mau pesan jemput sepatu.",
      "",
      "No. pesanan: " + orderNo,
      "Nama: " + nama.trim(),
      "WhatsApp: " + wa.trim(),
      "Tanggal jemput: " + t + ", jam " + jam,
      "Alamat: " + alamat.trim(),
      "Layanan: " + N[svc] + (paket ? "" : " x" + q + " pasang"),
      "Catatan: " + (cat.trim() || "-"),
      "Kode promo: " + (calc.ok ? calc.k : "-"),
      "Estimasi total: " + (total === null ? "dikonfirmasi setelah cek" : rp(total)),
    ];
    window.open(
      "https://wa.me/" +
        waNumber +
        "?text=" +
        encodeURIComponent(lines.join("\n")),
      "_blank",
      "noopener"
    );
  };

  const inputCls =
    "w-full rounded-[10px] border-[1.5px] border-[#b9c7d9] bg-white px-3 py-3 font-normal text-ink";
  const errCls = "min-h-[1.1em] text-[0.85rem] font-medium text-[#b3261e]";

  return (
    <section id="pesan" className="bg-foam py-14">
      <div className="mx-auto max-w-255 px-5">
        <SectionHeading
          title="Pesan jemput"
          sub="Isi data di bawah. Setelah kirim, kamu diarahkan ke WhatsApp untuk konfirmasi dengan admin."
        />

        <form onSubmit={submit} noValidate className="grid max-w-160 gap-4">
          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <label className="grid gap-1.25 text-[0.92rem] font-bold">
              Nama lengkap
              <input
                ref={namaRef}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                autoComplete="name"
                className={inputCls}
              />
              <span className={errCls}>{errors.nama ?? ""}</span>
            </label>
            <label className="grid gap-1.25 text-[0.92rem] font-bold">
              Nomor WhatsApp
              <input
                ref={waRef}
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                type="tel"
                inputMode="tel"
                placeholder="08xxxxxxxxxx"
                required
                autoComplete="tel"
                className={inputCls}
              />
              <span className={errCls}>{errors.wa ?? ""}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <label className="grid gap-1.25 text-[0.92rem] font-bold">
              Tanggal jemput
              <input
                ref={tglRef}
                value={tgl}
                min={tglMin}
                onChange={(e) => setTgl(e.target.value)}
                type="date"
                required
                className={inputCls}
              />
              <span className={errCls}>{errors.tgl ?? ""}</span>
            </label>
            <label className="grid gap-1.25 text-[0.92rem] font-bold">
              Jam jemput
              <select
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                className={inputCls}
              >
                <option>09.00–12.00</option>
                <option>12.00–15.00</option>
                <option>15.00–18.00</option>
                <option>18.00–21.00</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1.25 text-[0.92rem] font-bold">
            Alamat penjemputan
            <textarea
              ref={alamatRef}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={2}
              required
              autoComplete="street-address"
              className={inputCls}
            />
            <span className={errCls}>{errors.alamat ?? ""}</span>
          </label>

          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <label className="grid gap-1.25 text-[0.92rem] font-bold">
              Layanan
              <select
                value={svc}
                onChange={(e) => setSvc(e.target.value)}
                className={inputCls}
              >
                <option value="fast">Fast Clean – Rp35.000</option>
                <option value="deep">Deep Clean – Rp40.000</option>
                <option value="express">Express – Rp50.000</option>
                <option value="premium">Premium (kulit, suede, bahan mewah)</option>
                <option value="hemat">Paket Hemat – Rp80.000/bulan</option>
                <option value="aktif">Paket Aktif – Rp110.000/bulan</option>
              </select>
            </label>
            <label className="grid gap-1.25 text-[0.92rem] font-bold">
              Jumlah pasang
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                type="number"
                min={1}
                max={20}
                disabled={paket}
                className={`${inputCls} disabled:opacity-50`}
              />
            </label>
          </div>

          <label className="grid gap-1.25 text-[0.92rem] font-bold">
            Jenis sepatu dan catatan
            <textarea
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              rows={2}
              placeholder="Contoh: Nike Air Force 1 putih, noda kuning di sol"
              className={inputCls}
            />
          </label>

          <label className="grid gap-1.25 text-[0.92rem] font-bold">
            Kode promo (opsional)
            <input
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="NEWCLEAN10"
              autoCapitalize="characters"
              className={inputCls}
            />
            <span
              aria-live="polite"
              className={errCls}
              style={calc.ok ? { color: "#1a7f3c" } : undefined}
            >
              {kodeMsg}
            </span>
          </label>

          <div className="grid gap-1 rounded-xl bg-foam px-4.5 py-4" aria-live="polite">
            <small className="text-mute">Estimasi total</small>
            <strong className="text-[1.4rem] font-extrabold">
              {svc === "premium" ? "Dikonfirmasi setelah cek" : rp(total as number)}
            </strong>
            <small className="text-mute">{tnote}</small>
          </div>

          {result ? (
            <p
              aria-live="polite"
              className={`rounded-[10px] px-4 py-3 text-[0.9rem] font-medium ${
                result.ok
                  ? "bg-[#e8f6ee] text-[#1a7f3c]"
                  : "bg-[#fdecea] text-[#b3261e]"
              }`}
            >
              {result.msg}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-wa px-5.5 py-3.25 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Menyimpan pesanan…"
              : "Kirim pesanan ke WhatsApp"}
          </button>
        </form>
      </div>
    </section>
  );
}