export const STATUSES = [
  "BARU",
  "DIKONFIRMASI",
  "DIJEMPUT",
  "DICUCI",
  "DIKIRIM",
  "SELESAI",
  "BATAL",
] as const;

export type OrderStatus = (typeof STATUSES)[number];

/** Urutan status normal untuk tombol "lanjut ke tahap berikutnya" */
export const NEXT_STATUS: Record<string, OrderStatus | null> = {
  BARU: "DIKONFIRMASI",
  DIKONFIRMASI: "DIJEMPUT",
  DIJEMPUT: "DICUCI",
  DICUCI: "DIKIRIM",
  DIKIRIM: "SELESAI",
  SELESAI: null,
  BATAL: null,
};

/** "hari ini" versi Jakarta (WIB = UTC+7), format YYYY-MM-DD */
export function jakartaToday() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Awal periode (WIB) untuk filter harian/mingguan/bulanan */
export function periodStart(range: string): Date {
  const today = jakartaToday();
  const d = new Date(`${today}T00:00:00+07:00`);
  if (range === "week") {
    const day = d.getUTCDay();
    const diff = day === 0 ? 6 : day - 1; // Senin sebagai awal minggu
    d.setUTCDate(d.getUTCDate() - diff);
  } else if (range === "month") {
    d.setUTCDate(1);
  }
  return d;
}