"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/site/site-header";
import Hero from "@/components/site/hero";
import { Ticker } from "@/components/site/bits";
import Pricing from "@/components/site/pricing";
import Promo from "@/components/site/promo";
import Steps from "@/components/site/steps";
import Gallery from "@/components/site/gallery";
import Testimonials from "@/components/site/testimonials";
import OrderForm from "@/components/site/order-form";
import Faq from "@/components/site/faq";
import SiteFooter from "@/components/site/site-footer";
import { DEFAULT_WA, WaContext } from "@/components/site/wa-context";

export default function Home() {
  // Dipakai bersama antara tombol "Pilih paket", section promo, dan form pesan
  const [svc, setSvc] = useState("fast");
  const [kode, setKode] = useState("");
  const [toast, setToast] = useState("");
  const [showGaleri, setShowGaleri] = useState(true);
  // Nomor WA admin dari database (diatur di /admin), fallback ke nomor lama
  const [wa, setWa] = useState(DEFAULT_WA);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.waNumber) setWa(d.waNumber);
      })
      .catch(() => {});
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }, []);

  // Tombol "Salin kode" di section promo: isi kode ke form + toast
  const handleApplyCode = useCallback(
    (code: string) => {
      setKode(code);
      showToast("Kode " + code + " disalin");
    },
    [showToast]
  );

  return (
    <WaContext.Provider value={wa}>
    <div className="flex min-h-screen flex-col">
      <SiteHeader showGaleri={showGaleri} />

      <main className="flex-1">
        <Hero />
        <Ticker />
        <Pricing onPick={setSvc} />
        <Promo onApplyCode={handleApplyCode} />
        <Steps />
        <Gallery onEmpty={() => setShowGaleri(false)} />
        <Testimonials />
        <OrderForm
          svc={svc}
          setSvc={setSvc}
          kode={kode}
          setKode={setKode}
        />
        <Faq />
      </main>

      <SiteFooter />

      {/* Tombol WhatsApp mengapung */}
      <a
        className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-wa px-5.5 py-3.25 font-bold text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] fixed right-4 bottom-4 z-30"
        href={`https://wa.me/${wa}?text=Halo%20R%20Clean%20Shoes%2C%20saya%20mau%20tanya.`}
        target="_blank"
        rel="noopener"
        aria-label="Chat WhatsApp"
      >
        Chat WhatsApp
      </a>

      {/* Toast notifikasi */}
      <div
        role="status"
        className={`fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4.5 py-2.5 text-[0.9rem] text-white transition-opacity duration-200 pointer-events-none ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast}
      </div>
    </div>
    </WaContext.Provider>
  );
}