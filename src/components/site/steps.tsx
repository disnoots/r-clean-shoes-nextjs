import { SectionHeading } from "./bits";

const STEPS = [
  { title: "Pesan", desc: "Isi form di bawah atau chat WhatsApp." },
  {
    title: "Kurir menjemput",
    desc: "Kami cek kondisi sepatu sebelum dicuci.",
  },
  {
    title: "Dicuci dan dikeringkan",
    desc: "Memakai sabun khusus dan sikat lembut.",
  },
  { title: "Diantar kembali", desc: "Sepatu bersih sampai di rumahmu." },
];

export default function Steps() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1020px] px-5">
        <SectionHeading title="Cara kerja" sub="Kamu cukup pesan, sisanya kami urus." />
        <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px] p-0 [counter-reset:s]">
          {STEPS.map((s) => (
            <li
              key={s.title}
              className="border-t-[3px] border-navy pt-3.5 [counter-increment:s] before:block before:text-[1.6rem] before:font-extrabold before:text-gold-dark before:content-[counter(s)]"
            >
              <b className="block font-extrabold">{s.title}</b>
              <span className="text-[0.94rem] text-mute">{s.desc}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
