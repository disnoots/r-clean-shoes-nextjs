import { SectionHeading } from "./bits";
import { useWaNumber } from "./wa-context"

export default function Faq() {
  const wa = useWaNumber();
  return (
    <section id="faq" className="py-14">
      <div className="mx-auto max-w-255 px-5">
        <SectionHeading title="Pertanyaan umum" />
        <details className="border-b border-line py-3.5">
          <summary className="cursor-pointer font-bold">
            Berapa lama pengerjaannya?
          </summary>
          <p className="mt-2 text-mute">
            Fast Clean dan Deep Clean 2–3 hari. Express selesai dalam 1 hari.
          </p>
        </details>
        <details className="border-b border-line py-3.5">
          <summary className="cursor-pointer font-bold">
            Antar jemput benar-benar gratis?
          </summary>
          <p className="mt-2 text-mute">
            Ya, gratis untuk area yang kami layani. Chat admin untuk memastikan
            alamatmu masuk jangkauan.
          </p>
        </details>
        <details className="border-b border-line py-3.5">
          <summary className="cursor-pointer font-bold">
            Bagaimana cara pembayarannya?
          </summary>
          <p className="mt-2 text-mute">
            Metode pembayaran dikonfirmasi admin via WhatsApp saat pesananmu
            diproses.
          </p>
        </details>
        <details className="border-b border-line py-3.5">
          <summary className="cursor-pointer font-bold">
            Bisakah mencuci sepatu kulit atau suede?
          </summary>
          <p className="mt-2 text-mute">
            Bisa lewat layanan Premium. Kami cek kondisi sepatu dulu, lalu
            memberi tahu harganya sebelum dikerjakan.
          </p>
        </details>
        <details className="border-b border-line py-3.5">
          <summary className="cursor-pointer font-bold">
            Bagaimana cek status pesanan?
          </summary>
          <p className="mt-2 text-mute">
            Chat admin lewat WhatsApp dengan menyebutkan nama dan tanggal
            jemput.{" "}
            <a
              className="underline"
              href={`https://wa.me/${wa}?text=Halo%20R%20Clean%20Shoes%2C%20saya%20mau%20cek%20status%20pesanan.`}
              target="_blank"
              rel="noopener"
            >
              Tanya status sekarang
            </a>
          </p>
        </details>
        {/* TAMBAHKAN sendiri: kebijakan garansi/re-clean dan tanggung jawab kerusakan, sesuai aturan usahamu */}
      </div>
    </section>
  );
}
