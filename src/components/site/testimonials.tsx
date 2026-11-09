import { SectionHeading } from "./bits";

// GANTI dengan ulasan asli pelanggan (dengan izin mereka), atau hapus bagian ini
const QUOTES = [
  {
    text: "Sepatu putih saya yang sudah kuning parah jadi kinclong. Prosesnya cepat dan antar jemputnya gratis.",
    author: "Arief Rahman · Deep Clean",
  },
  {
    text: "Express 1 hari benar-benar selesai. Pagi dijemput, sore sudah dikirim balik dengan kemasan rapi.",
    author: "Sari Novita · Express",
  },
  {
    text: "Paket bulanannya worth it. 4x cuci Rp110 ribu, dapat gratis Express sekali. Admin responsif.",
    author: "Dimas Wahyu · Paket Aktif",
  },
];

export default function Testimonials() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-255 px-5">
        <SectionHeading title="Kata pelanggan" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4.5">
          {QUOTES.map((q) => (
            <blockquote
              key={q.author}
              className="rounded-[14px] border border-line bg-white p-5"
            >
              <p className="mb-3">{q.text}</p>
              <footer className="text-[0.88rem] text-mute">{q.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
