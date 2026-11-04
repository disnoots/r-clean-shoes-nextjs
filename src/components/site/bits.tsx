export function Ticker() {
  return (
    <div className="bg-gold px-4 py-2.25 text-center text-[0.92rem] font-bold text-navy">
      Pelanggan baru diskon 10% dengan kode NEWCLEAN10 · berlaku sampai 31
      Desember 2026
    </div>
  );
}

export function SectionHeading({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <>
      <h2 className="mb-2 text-[clamp(1.6rem,4vw,2.1rem)] leading-[1.2] font-extrabold tracking-[-0.01em]">
        {title}
      </h2>
      {sub ? <p className="mb-7 max-w-[60ch] text-mute">{sub}</p> : null}
    </>
  );
}
