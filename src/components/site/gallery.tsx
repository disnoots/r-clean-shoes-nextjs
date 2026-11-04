"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./bits";

// Taruh foto asli di folder /public:
//   before-1.jpg + after-1.jpg  → perbandingan 1
//   before-2.jpg + after-2.jpg  → perbandingan 2
// Pasangan yang salah satu fotonya tidak ada otomatis disembunyikan;
// jika semua hilang, seluruh section disembunyikan (seperti perilaku HTML asli).
const COMPARISONS = [
  {
    before: "/before-1.jpg",
    after: "/after-1.jpg",
    caption: "Deep Clean — sepatu putih menguning",
  },
  {
    before: "/before-2.jpg",
    after: "/after-2.jpg",
    caption: "Fast Clean — sneaker harian",
  },
];

function BeforeAfterSlider({
  before,
  after,
  caption,
  onFail,
}: {
  before: string;
  after: string;
  caption: string;
  onFail: () => void;
}) {
  const [pos, setPos] = useState(50);
  const beforeRef = useRef<HTMLImageElement>(null);
  const afterRef = useRef<HTMLImageElement>(null);

  // Gambar bisa gagal (404) SEBELUM React selesai hydrating, sehingga event
  // onError tidak tertangkap. Setelah mount, cek manual apakah gambar sudah
  // gagal sejak awal.
  useEffect(() => {
    const a = afterRef.current;
    const b = beforeRef.current;
    if (
      (a && a.complete && a.naturalWidth === 0) ||
      (b && b.complete && b.naturalWidth === 0)
    ) {
      onFail();
    }
  }, [onFail]);

  return (
    <figure className="m-0">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl select-none">
        {/* Foto SESUDAH (lapisan bawah, tampil penuh) */}
        <img
          ref={afterRef}
          src={after}
          alt={`Sesudah: ${caption}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          onError={onFail}
        />

        {/* Foto SEBELUM (terpotong sesuai posisi slider) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            ref={beforeRef}
            src={before}
            alt={`Sebelum: ${caption}`}
            draggable={false}
            className="h-full w-full object-cover"
            onError={onFail}
          />
        </div>

        {/* Label */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-white">
          Sebelum
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-wa/90 px-2.5 py-1 text-xs font-bold text-white">
          Sesudah
        </span>

        {/* Garis + gagang geser */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)]" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-extrabold text-ink shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            ‹›
          </div>
        </div>

        {/* Kontrol: input range transparan menutupi seluruh area,
            sehingga klik, geser (mouse), swipe (layar sentuh), dan
            panah keyboard semuanya berfungsi */}
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Geser perbandingan sebelum dan sesudah: ${caption}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-1.5 text-[0.88rem] text-mute">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Gallery({ onEmpty }: { onEmpty: () => void }) {
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const visible = COMPARISONS.filter((_, i) => !failed[i]);
  const allFailed = visible.length === 0;

  useEffect(() => {
    if (allFailed) onEmpty();
  }, [allFailed, onEmpty]);

  if (allFailed) return null;

  return (
    <section id="galeri" className="bg-foam py-14">
      <div className="mx-auto max-w-255 px-5">
        <SectionHeading
          title="Hasil pengerjaan"
          sub="Geser garis untuk melihat sebelum dan sesudah dari sepatu pelanggan kami."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
          {visible.map((p, i) => (
            <BeforeAfterSlider
              key={p.before}
              before={p.before}
              after={p.after}
              caption={p.caption}
              onFail={() => setFailed((prev) => ({ ...prev, [i]: true }))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
