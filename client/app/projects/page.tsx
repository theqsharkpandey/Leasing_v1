import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, BarChart3 } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

export const metadata: Metadata = {
  title: "Projects | The Leasing World",
  description:
    "Explore our featured real estate projects — Retail Leasing, Commercial, and PMC work across 200+ cities in India.",
};

const STATS = [
  { value: "50+", label: "Retail Stores" },
  { value: "25+", label: "Commercial Projects" },
  { value: "15+", label: "Mall Managements" },
  { value: "10+", label: "Cinema Complexes" },
];

const PROJECTS = [
  {
    name: "Indriya Jewelry (Aditya Birla)",
    city: "Jaipur, Rajasthan",
    type: "Retail Leasing",
    note: "Best Store of the Year 2023",
    img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    name: "Vishal Mega Mart",
    city: "Fatehabad, Haryana",
    type: "Retail Leasing",
    note: "Grand opening April 2025",
    img: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    name: "Vishal Mega Mart",
    city: "Tohana, Haryana",
    type: "Retail Leasing",
    note: "",
    img: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    name: "Lakshita",
    city: "Bathinda, Punjab",
    type: "Retail Leasing",
    note: "",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    name: "Octave",
    city: "Faridabad, Haryana",
    type: "Retail Leasing",
    note: "",
    img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    name: "Octave",
    city: "Varanasi, Uttar Pradesh",
    type: "Retail Leasing",
    note: "",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    name: "Van Heusen",
    city: "Lakhimpur, Uttar Pradesh",
    type: "Retail Leasing",
    note: "",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
  {
    name: "Jockey",
    city: "Greater Noida, Uttar Pradesh",
    type: "Retail Leasing",
    note: "",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-blue-900/30 pointer-events-none" />
        <FadeIn>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Our Portfolio
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Featured Projects
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              A showcase of our most impactful real estate advisory work across
              India — from retail brand placements to commercial leasing.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-[1280px] mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-blue-400">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-8">
            Featured Projects
          </h2>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {PROJECTS.filter((p) => p.featured).map((p) => (
            <StaggerItem key={p.name + p.city}>
              <div className="h-full bg-[#111118] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all group">
                <div className="relative h-64">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {p.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    {p.note && (
                      <p className="text-blue-400 text-xs font-semibold mb-1">
                        🏆 {p.note}
                      </p>
                    )}
                    <h3 className="text-white font-bold text-xl">{p.name}</h3>
                    <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                      <MapPin className="h-3 w-3" /> {p.city}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* All projects grid */}
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-8">All Projects</h2>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROJECTS.filter((p) => !p.featured).map((p) => (
            <StaggerItem key={p.name + p.city}>
              <div className="h-full bg-[#111118] border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all group">
                <div className="relative h-44">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {p.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm">{p.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <MapPin className="h-3 w-3" /> {p.city}
                  </div>
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
            <BarChart3 className="h-10 w-10 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Have a Project in Mind?
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Share your requirements and we'll identify the perfect space or
              advisor for your needs.
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
