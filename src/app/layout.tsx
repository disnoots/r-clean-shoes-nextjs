import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getWaNumber, WA_FALLBACK } from "@/lib/settings";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://rcleanshoesid.netlify.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Laundry Sepatu Jakarta Barat | Antar Jemput Gratis – R Clean Shoes",
  description:
    "R Clean Shoes: cuci sepatu profesional di Tanjung Duren, Jakarta Barat. Antar jemput gratis, Express 1 hari selesai, mulai Rp30.000. Pesan lewat WhatsApp.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    title: "R Clean Shoes – Laundry Sepatu Jakarta Barat",
    description:
      "Cuci sepatu profesional, antar jemput gratis, Express 1 hari selesai.",
    url: SITE_URL,
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1E3D",
};

const jsonLd = (waNumber: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "R Clean Shoes",
  description: "Laundry sepatu profesional dengan layanan antar jemput.",
  url: SITE_URL,
  telephone: "+" + waNumber,
  priceRange: "Rp30.000-Rp50.000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Tanjung Duren Raya",
    addressLocality: "Jakarta Barat",
    addressRegion: "DKI Jakarta",
    addressCountry: "ID",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "22:00",
  },
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const waNumber = await getWaNumber().catch(() => WA_FALLBACK);
  return (
    <html lang="id">
      <body className={`${jakarta.variable} bg-white font-sans text-ink antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(waNumber)) }}
        />
      </body>
    </html>
  );
}
