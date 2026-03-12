import Link from "next/link";
import Image from "next/image";

const BRANDS = [
  "Pantaloons",
  "Croma",
  "V Mart",
  "Pizza Hut",
  "Van Heusen",
  "Jockey",
  "Blackberrys",
];

const LOGO_BRANDS = [
  { name: "Bata", src: "/logos/bata.png", url: "https://www.bata.in" },
  { name: "Biba", src: "/logos/biba.png", url: "https://www.biba.in" },
  {
    name: "Calcetto",
    src: "/logos/calcetto.png",
    url: "https://www.calcetto.in",
  },
  {
    name: "Campus",
    src: "/logos/campus.png",
    url: "https://www.campusshoes.com",
  },
  {
    name: "Cantabil",
    src: "/logos/cantabil.png",
    url: "https://www.cantabilretail.com",
  },
  { name: "Enamor", src: "/logos/enamor.png", url: "https://www.enamor.co.in" },
  {
    name: "Indriya",
    src: "/logos/indriya.png",
    url: "https://www.indriya.com",
  },
  {
    name: "Jockey",
    src: "/logos/jockey.png",
    url: "https://www.jockeyindia.com",
  },
  { name: "Kiaasa", src: "/logos/kiaasa.png", url: "https://www.kiaasa.com" },
  {
    name: "Manyavar",
    src: "/logos/manyavar.png",
    url: "https://www.manyavar.com",
  },
  {
    name: "Metro Shoes",
    src: "/logos/Metro Shoes.png",
    url: "https://www.metroshoes.com",
  },
  { name: "Mochi", src: "/logos/mochi.png", url: "https://www.mochishoes.com" },
  {
    name: "Mufti",
    src: "/logos/mufti.png",
    url: "https://www.mufticlothing.com",
  },
  {
    name: "Octave",
    src: "/logos/octave.png",
    url: "https://www.octaveclothing.com",
  },
  { name: "Puma", src: "/logos/puma.png", url: "https://in.puma.com" },
  { name: "Raymond", src: "/logos/raymond.png", url: "https://www.raymond.in" },
  { name: "Reebok", src: "/logos/reebok.png", url: "https://www.reebok.in" },
  { name: "Tasva", src: "/logos/tasva.png", url: "https://www.tasva.com" },
  {
    name: "Van Heusen",
    src: "/logos/van heusen.png",
    url: "https://www.vanheusenindia.com",
  },
  { name: "Zudio", src: "/logos/zudio.png", url: "https://www.zudio.com" },
];

export default function TrustedBrands() {
  return (
    <section className="bg-[#0d0d18] border-t border-white/5 py-14">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 text-center mb-10">
        <p className="text-gray-300 text-2xl font-semibold uppercase tracking-widest">
          Trusted by leading brands
        </p>
      </div>

      {/* Infinite logo loop */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-8 items-center">
          {[...LOGO_BRANDS, ...LOGO_BRANDS].map((brand, i) => (
            <Link
              key={`${brand.name}-${i}`}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              title={brand.name}
              className="flex items-center justify-center h-16 w-36 shrink-0 rounded-xl border border-white/8 bg-white/[0.04] px-4 hover:border-white/25 hover:bg-white/10 transition-all duration-300 group"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={120}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { BRANDS };
