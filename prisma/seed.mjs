// Seed awal: isi tabel Service, BusinessHour, dan Setting.
// Jalankan sekali setelah `prisma db push`:  node prisma/seed.mjs
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const SERVICES = [
  { key: "fast", name: "Fast Clean", price: 35000, isSubscription: false },
  { key: "deep", name: "Deep Clean", price: 40000, isSubscription: false },
  { key: "express", name: "Express", price: 50000, isSubscription: false },
  { key: "premium", name: "Premium", price: 0, isSubscription: false },
  { key: "hemat", name: "Paket Hemat", price: 80000, isSubscription: true },
  { key: "aktif", name: "Paket Aktif", price: 110000, isSubscription: true },
];

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const SETTINGS = [
  { key: "wa_number", value: "6285218221931" }, // nomor WA admin, bisa diubah dari /admin
];

async function main() {
  for (const s of SERVICES) {
    await db.service.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  for (let day = 0; day < 7; day++) {
    await db.businessHour.upsert({
      where: { dayOfWeek: day },
      update: {},
      create: { dayOfWeek: day, isOpen: true, openTime: "09.00", closeTime: "22.00" },
    });
  }
  for (const s of SETTINGS) {
    await db.setting.upsert({
      where: { key: s.key },
      update: {}, // jangan menimpa nilai yang sudah diubah admin
      create: s,
    });
  }
  console.log(`Seed selesai: ${SERVICES.length} layanan, 7 hari buka (${DAYS.join(", ")}), ${SETTINGS.length} setting`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());