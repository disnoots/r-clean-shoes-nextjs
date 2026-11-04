export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy pt-10 pb-[calc(90px+env(safe-area-inset-bottom))] text-[0.94rem] text-haze">
      <div className="mx-auto grid max-w-255 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 px-5">
        <div>
          <h3 className="mb-1.5 text-base font-extrabold text-white">
            R Clean Shoes
          </h3>
          <p>Laundry sepatu profesional dengan antar jemput gratis.</p>
        </div>
        <div>
          <h3 className="mb-1.5 text-base font-extrabold text-white">Alamat</h3>
          <p>
            Jl. Tanjung Duren Raya, Jakarta Barat
            <br />
            <a
              className="text-white underline"
              href="https://www.google.com/maps/search/?api=1&query=R+Clean+Shoes+Tanjung+Duren+Jakarta+Barat"
              target="_blank"
              rel="noopener"
            >
              Buka di Google Maps
            </a>
          </p>
        </div>
        <div>
          <h3 className="mb-1.5 text-base font-extrabold text-white">
            Jam buka
          </h3>
          <p>
            Senin–Minggu
            <br />
            09.00–22.00 WIB
          </p>
        </div>
        <div>
          <h3 className="mb-1.5 text-base font-extrabold text-white">Kontak</h3>
          <p>
            <a className="text-white underline" href="https://wa.me/6285218221931" target="_blank" rel="noopener">
              +62 852 1822 1931
            </a>
            <br />© 2026 R Clean Shoes
          </p>
        </div>
      </div>
    </footer>
  );
}
