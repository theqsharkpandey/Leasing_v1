import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, ShoppingBag, Star } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

export const metadata: Metadata = {
  title: "Partners | The Leasing World",
  description:
    "Trusted by 70+ leading brands and developers across India — Fashion Retail, Jewelry, Electronics, Food & Beverage, and more.",
};

const BRAND_PARTNERS = [
  {
    name: "Metro Shoes",
    category: "Fashion Retail",
    logo: "/logos/Metro Shoes.png",
  },
  { name: "Bata", category: "Fashion Retail", logo: "/logos/bata.png" },
  { name: "Biba", category: "Fashion Retail", logo: "/logos/biba.png" },
  { name: "Calcetto", category: "Fashion Retail", logo: "/logos/calcetto.png" },
  {
    name: "Van Heusen",
    category: "Fashion Retail",
    logo: "/logos/van heusen.png",
  },
  { name: "Jockey", category: "Fashion Retail", logo: "/logos/jockey.png" },
  { name: "Puma", category: "Fashion Retail", logo: "/logos/puma.png" },
  { name: "Reebok", category: "Fashion Retail", logo: "/logos/reebok.png" },
  { name: "Raymond", category: "Fashion Retail", logo: "/logos/raymond.png" },
  { name: "Campus", category: "Fashion Retail", logo: "/logos/campus.png" },
  { name: "Tasva", category: "Fashion Retail", logo: "/logos/tasva.png" },
  {
    name: "W for Women",
    category: "Fashion Retail",
    logo: "/logos/w for women.png",
  },
  { name: "Zudio", category: "Fashion Retail", logo: "/logos/zudio.png" },
  {
    name: "Aditya Birla's Indriya",
    category: "Jewelry Retail",
    logo: "/logos/indriya.png",
  },
  { name: "Cantabil", category: "Fashion Retail", logo: "/logos/cantabil.png" },
  { name: "Enamor", category: "Fashion Retail", logo: "/logos/enamor.png" },
  { name: "Kiaasa", category: "Fashion Retail", logo: "/logos/kiaasa.png" },
  { name: "Manyavar", category: "Fashion Retail", logo: "/logos/manyavar.png" },
  { name: "Mochi", category: "Fashion Retail", logo: "/logos/mochi.png" },
  { name: "Mufti", category: "Fashion Retail", logo: "/logos/mufti.png" },
  { name: "Octave", category: "Fashion Retail", logo: "/logos/octave.png" },
];

const DEVELOPER_PARTNERS = [
  {
    icon: ShoppingBag,
    title: "Mall Developers",
    desc: "We work with premium mall developers across India to create vibrant retail destinations. Our mall management and leasing services help developers achieve optimal tenant mix, drive foot traffic, and maximise rental yields.",
    services: [
      "Tenant mix strategy",
      "Anchor brand acquisition",
      "Lease management",
      "Footfall optimization",
    ],
  },
  {
    icon: Building2,
    title: "Commercial Developers",
    desc: "For commercial property developers, we provide end-to-end leasing services that ensure optimal occupancy rates and rental yields. Our understanding of corporate requirements helps match the right tenants with the right spaces.",
    services: [
      "Corporate tenant sourcing",
      "Lease structuring",
      "Market positioning",
      "Asset management advisory",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The Leasing World's understanding of retail dynamics and mall operations is exceptional. They helped us secure premium locations for our brand expansion across Tier 2 cities.",
    name: "Marketing Director",
    company: "Fashion Retail Brand",
    rating: 5,
  },
  {
    quote:
      "Their network across India is unmatched. The Leasing World helped us fill key anchor positions in our mall with top national brands within record time.",
    name: "CEO",
    company: "Mall Development Company",
    rating: 5,
  },
  {
    quote:
      "The team's market intelligence and negotiation skills saved us significant costs while securing ideal locations for our expansion into the Indian market.",
    name: "Expansion Manager",
    company: "International Electronics Brand",
    rating: 5,
  },
];

export default function PartnersPage() {
  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(BRAND_PARTNERS.map((b) => b.category))),
  ];

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-blue-900/30 pointer-events-none" />
        <FadeIn>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Our Partners
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Working with Leading Brands
              <br className="hidden md:block" /> Across India
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Trusted by 70+ national and international brands — from fashion
              retail giants to hypermarkets, jewelry houses, and electronics
              chains.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-[1280px] mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-400">70+</p>
            <p className="text-gray-400 text-sm mt-1">Brand Partners</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-400">200+</p>
            <p className="text-gray-400 text-sm mt-1">Cities Covered</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-400">19+</p>
            <p className="text-gray-400 text-sm mt-1">Years of Trust</p>
          </div>
        </div>
      </section>

      {/* Brand Partners Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Brand Partners
            </p>
            <h2 className="text-3xl font-bold text-white">
              Brands That Trust Us
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          staggerDelay={0.05}
        >
          {BRAND_PARTNERS.map((brand) => (
            <StaggerItem key={brand.name}>
              <div className="h-full bg-[#111118] border border-white/10 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-blue-500/40 hover:bg-white/5 transition-all group">
                <div className="h-16 w-full flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={100}
                    height={60}
                    className="object-contain max-h-14 w-auto"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white text-xs font-semibold">
                    {brand.name}
                  </p>
                  <p className="text-gray-500 text-[10px] mt-0.5">
                    {brand.category}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Developer Partners */}
      <section className="bg-[#0d0d18] border-y border-white/5 py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
                Developer Partners
              </p>
              <h2 className="text-3xl font-bold text-white">
                Collaborating with Leading Developers
              </h2>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEVELOPER_PARTNERS.map((dp) => {
              const Icon = dp.icon;
              return (
                <StaggerItem key={dp.title}>
                  <div className="h-full border border-white/10 rounded-xl p-7 hover:border-blue-500/40 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3">
                      {dp.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {dp.desc}
                    </p>
                    <ul className="space-y-2">
                      {dp.services.map((s) => (
                        <li
                          key={s}
                          className="flex items-center gap-2 text-gray-400 text-sm"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              What They Say
            </p>
            <h2 className="text-3xl font-bold text-white">
              Partner Testimonials
            </h2>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i}>
              <div className="bg-[#111118] border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-colors flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 italic">
                  "{t.quote}"
                </p>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.company}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d18] border-t border-white/5 py-16 text-center">
        <FadeIn>
          <div className="max-w-[600px] mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-3">
              Become a Partner
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Whether you're a brand looking for premium spaces or a developer
              seeking the right tenants — let's work together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              Get In Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
