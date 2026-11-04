"use client";

import { SectionHeading } from "./bits";

export default function Promo({
  onApplyCode,
}: {
  onApplyCode: (code: string) => void;
}) {
  const CODE = "NEWCLEAN10";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(CODE)
        .then(() => onApplyCode(CODE))
        .catch(() => onApplyCode(CODE));
    } else {
      onApplyCode(CODE);
    }
  };

  return (
    <section id="promo" className="bg-foam py-14">
      <div className="mx-auto max-w-[1020px] px-5">
        <SectionHeading
          title="Promo"
          sub="Masukkan kodenya di form pesan, potongan dihitung otomatis."
        />

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[14px] bg-navy p-[22px] text-white">
          <code className="rounded-lg bg-white/10 px-3.5 py-1.5 text-[1.3rem] font-extrabold tracking-[0.06em]">
            {CODE}
          </code>
          <p className="min-w-[220px] flex-[1_1_220px] text-[0.95rem] text-haze">
            Diskon 10% cuci pertama untuk pelanggan baru. Berlaku untuk layanan
            satuan sampai 31 Desember 2026.
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer rounded-lg bg-white px-3.5 py-[9px] font-bold text-navy"
          >
            Salin kode
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          <div className="rounded-r-[10px] border-l-4 border-gold bg-foam px-[18px] py-4">
            <h3 className="mb-1 text-[1.05rem] font-extrabold">
              Tas sepatu gratis
            </h3>
            <p className="text-[0.94rem] text-mute">
              Untuk setiap Paket Hemat atau Paket Aktif, selama stok masih ada.
            </p>
          </div>
          <div className="rounded-r-[10px] border-l-4 border-gold bg-foam px-[18px] py-4">
            <h3 className="mb-1 text-[1.05rem] font-extrabold">
              Ajak teman, dapat Rp10.000
            </h3>
            <p className="text-[0.94rem] text-mute">
              Kamu dan temanmu masing-masing dapat cashback Rp10.000. Sebutkan
              kode RCLEAN-REF saat memesan, lalu konfirmasi ke admin via
              WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
