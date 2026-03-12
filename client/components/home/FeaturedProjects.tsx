import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

const PROJECTS = [
  {
    name: "Aditya Birla's Indriya Jewelry",
    city: "Jaipur",
    type: "Retail Leasing",
    img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vishal Mega Mart",
    city: "Fatehabad",
    type: "Retail Leasing",
    img: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&w=800&q=80",
    featured: true,
    featuredDesc:
      "We at The Leasing World are delighted to announce the grand opening of Vishal Mega Mart in Fatehabad, Haryana, on 25th April 2025! 🎉",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-20">
      <FadeIn className="text-center mb-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">
          Our Work
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Featured Projects
        </h2>
      </FadeIn>
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((p) => (
          <StaggerItem key={p.name}>
            <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/40 transition-all h-full">
              <div className="relative h-56">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                {p.featured && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <div className="flex items-center gap-1 text-xs text-gray-300 mb-1">
                      <MapPin className="h-3 w-3" /> {p.city}
                    </div>
                    <h3 className="text-white font-bold text-xl">{p.name}</h3>
                    <p className="text-gray-300 text-xs mt-1">
                      {p.featuredDesc}
                    </p>
                  </div>
                )}
                {!p.featured && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                )}
              </div>
              {!p.featured && (
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    <MapPin className="h-3 w-3" /> {p.city}
                  </div>
                  <h3 className="font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-blue-400 mt-0.5">{p.type}</p>
                </div>
              )}
              <div className="px-4 pb-4">
                <Link
                  href="/projects"
                  className="flex items-center gap-1 text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
      <FadeIn className="text-center mt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 border border-white/20 hover:border-blue-400 text-white hover:text-blue-400 font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
        >
          View All Projects <ArrowRight className="h-4 w-4" />
        </Link>
      </FadeIn>
    </section>
  );
}
