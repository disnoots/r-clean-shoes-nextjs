"use client";

import { SectionHeading } from "./bits";

const PRICES = [
  {
    id: "fast",
    name: "Fast Clean",
    tag: "Terpopuler",
    rp: "Rp35.000",
    desc: "Kotor ringan, sneaker, bahan aman. Selesai 2-3 hari.",
  },
  {
    id: "deep",
    name: "Deep Clean",
    tag: null,
    rp: "Rp40.000",
    desc: "Kotor berat, bau, atau perlu perawatan khusus. Selesai 2-3 hari.",
  },
  {
    id: "express",
    name: "Express",
    tag: null,
    rp: "Rp50.000",
    desc: "Diprioritaskan dan selesai dalam 1 hari.",
  },
  {
    id: "premium",
    name: "Premium",
    tag: null,
    rp: "Konsultasi",
    desc: "Kulit, suede, dan bahan mewah. Harga ditentukan setelah kami cek kondisi sepatu.",
  },
];

const PLANS = [
  {
    id: "hemat",
    name: "Paket Hemat",
    tag: null,
    rp: "Rp80.000",
    best: false,
    items: [
      "3x cuci sepatu",
      "Kotor ringan, 2-3 hari",
      "Antar jemput gratis",
      "Gratis tas sepatu",
    ],
  },
  {
    id: "aktif",
    name: "Paket Aktif",
    tag: "Terbaik",
    rp: "Rp110.000",
    best: true,
    items: [
      "4x cuci sepatu",
      "Prioritas pengerjaan",
      "Gratis 1x Express",
      "Antar jemput gratis",
      "Gratis tas sepatu",
    ],
  },
] as const;

export default function Pricing({
  onPick,
}: {
  onPick: (id: string) => void;
}) {
  return (
    <section id="harga" className="py-14">
      <div className="mx-auto max-w-255 px-5">
        <SectionHeading
          title="Harga layanan"
          sub="Harga per pasang. Pilih sesuai tingkat kotor sepatumu."
        />

        <div className="border-t-2 border-navy">
          {PRICES.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-line py-4.5"
            >
              <h3 className="text-[1.15rem] font-extrabold">
                {p.name}
                {p.tag ? (
                  <span className="ml-2 rounded-full bg-gold px-2 py-0.5 align-middle text-[0.75rem] font-bold text-navy">
                    {p.tag}
                  </span>
                ) : null}
              </h3>
              <span className="col-start-2 row-start-1 text-[1.25rem] font-extrabold">
                {p.rp}
              </span>
              <p className="col-start-1 text-[0.94rem] text-mute">{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-11 mb-2 text-[clamp(1.6rem,4vw,2.1rem)] leading-[1.2] font-extrabold tracking-[-0.01em]">
          Paket langganan bulanan
        </h2>
        <p className="mb-7 max-w-[60ch] text-mute">
          Lebih hemat untuk yang rutin cuci sepatu.
        </p>

        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4.5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-[14px] border bg-white p-6 ${
                plan.best ? "border-2 border-gold" : "border-line"
              }`}
            >
              <h3 className="font-extrabold">
                {plan.name}
                {plan.tag ? (
                  <span className="ml-2 rounded-full bg-gold px-2 py-0.5 align-middle text-[0.75rem] font-bold text-navy">
                    {plan.tag}
                  </span>
                ) : null}
              </h3>
              <div className="mt-1.5 mb-3 text-[1.9rem] font-extrabold">
                {plan.rp}{" "}
                <small className="text-[0.9rem] font-medium text-mute">
                  /bulan
                </small>
              </div>
              <ul className="mb-4.5 grid list-none gap-1.5 p-0 [&>li]:before:mr-1 [&>li]:before:font-extrabold [&>li]:before:content-['✓'] [&>li]:before:text-gold-dark">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                href="#pesan"
                data-pick={plan.id}
                onClick={() => onPick(plan.id)}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-gold px-5.5 py-3.25 font-bold text-navy no-underline"
              >
                Pilih {plan.name}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-3.5 text-[0.88rem] text-mute">
          Sepatu yang kami tangani: sneaker, kulit, suede, sport, boot, dan
          sandal.
        </p>
      </div>
    </section>
  );
}
