import { db } from "@/lib/db";

export const WA_FALLBACK = "6285218221931"; // nomor lama, dipakai jika DB kosong

/** Ambil satu setting dari DB; kalau tidak ada, kembalikan fallback */
export async function getSetting(key: string, fallback: string) {
  const row = await db.setting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

/** Nomor WhatsApp admin (format 62xxx, tanpa +) untuk semua tombol chat */
export async function getWaNumber() {
  return getSetting("wa_number", WA_FALLBACK);
}