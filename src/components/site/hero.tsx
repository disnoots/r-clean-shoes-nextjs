export default function Hero() {
  return (
    <div className="bg-navy px-0 pt-16 pb-14 text-white">
      <div className="mx-auto max-w-255 px-5">
        <h1 className="max-w-[14ch] text-[clamp(2.2rem,7vw,3.8rem)] leading-[1.2] font-extrabold tracking-[-0.01em]">
          Sepatu kinclong seperti baru.
        </h1>
        <p className="mt-4.5 mb-6.5 max-w-[46ch] text-[1.08rem] text-haze">
          Cuci sepatu profesional di Jakarta Barat. Kurir jemput dan antar
          kembali ke rumahmu tanpa biaya.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-gold px-5.5 py-3.25 font-bold text-navy no-underline"
            href="#pesan"
          >
            Pesan jemput sekarang
          </a>
          <a
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border-2 border-white/50 px-5.5 py-3.25 font-bold text-white no-underline"
            href="#harga"
          >
            Lihat harga
          </a>
        </div>

        <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2.5 border-t border-white/18 pt-5.5 text-[0.95rem] text-haze">
          <span>
            <b className="font-bold text-white">Antar jemput gratis</b> area
            Jakarta Barat
          </span>
          <span>
            <b className="font-bold text-white">Express</b> selesai 1 hari
          </span>
          <span>
            <b className="font-bold text-white">Buka</b> setiap hari 09.00–22.00
            WIB
          </span>
          {/* VERIFIKASI: pastikan angka & rating di bawah sesuai kenyataan, atau hapus baris ini */}
          <span>
            <b className="font-bold text-white">5.0</b> rating ·{" "}
            <b className="font-bold text-white">4.500+</b> pelanggan
          </span>
        </div>
      </div>
    </div>
  );
}
