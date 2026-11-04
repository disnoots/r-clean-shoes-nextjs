"use client";

import Link from "next/link";

const LINKS = [
  { href: "#harga", label: "Harga" },
  { href: "#promo", label: "Promo" },
  { href: "#galeri", label: "Hasil" },
  { href: "#pesan", label: "Pesan" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader({ showGaleri }: { showGaleri: boolean }) {
  return (
    <header className="sticky top-0 z-20 bg-navy text-white">
      <div className="mx-auto flex h-15 max-w-255 items-center justify-between px-5">
        <Link
          href="#"
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-[0.02em] no-underline"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-8.5 w-auto"
            onError={(e) => e.currentTarget.remove()}
          />
          R CLEAN SHOES
        </Link>

        <nav
          aria-label="Menu utama"
          className="hidden gap-5 text-[0.92rem] font-medium max-sm:hidden"
        >
          {LINKS.filter((l) => l.href !== "#galeri" || showGaleri).map((l) => (
            <a key={l.href} href={l.href} className="opacity-85 hover:opacity-100">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-wa px-3.5 py-2 text-[0.9rem] font-bold text-white"
          href="https://wa.me/6285218221931"
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
