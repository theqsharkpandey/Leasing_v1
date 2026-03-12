import {
  Users,
  MapPin,
  Trophy,
  Building2,
  TrendingUp,
  Heart,
} from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

export const metadata: Metadata = {
  title: "About Us | The Leasing World",
  description:
    "Leading real estate advisory firm in India since 2007. Trusted by 70+ national and international brands across 200+ cities.",
};

const STATS = [
  { value: "200+", label: "Cities" },
  { value: "70+", label: "Brand Partners" },
  { value: "19+", label: "Years of Excellence" },
];

const IMPACT = [
  { value: "95%", label: "Client Retention" },
  { value: "25%", label: "Average ROI" },
  { value: "500+", label: "Successful Deals" },
];

const VALUES = [
  {
    icon: Trophy,
    title: "Excellence",
    desc: "We consistently deliver superior results by combining market intelligence with deep industry expertise.",
  },
  {
    icon: Heart,
    title: "Integrity",
    desc: "Transparency and honesty are at the core of every client relationship and transaction we conduct.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    desc: "We leverage data-driven insights and cutting-edge tools to stay ahead of market trends.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-blue-900/30 pointer-events-none" />
        <FadeIn>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              About Us
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Leading Real Estate Advisory
              <br className="hidden md:block" /> Since 2007
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Founded in Bhiwadi, Rajasthan, The Leasing World has grown into
              one of India's most trusted real estate advisory firms — serving
              70+ national and international brands across 200+ cities.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-[1280px] mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-blue-400">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <FadeIn direction="left">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="text-3xl font-bold text-white mb-5">
                Unlocking Real Estate Value Across India
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Founded in 2007 in Bhiwadi, Rajasthan, The Leasing World began
                  with a singular vision — to transform how premium brands
                  discover, evaluate, and secure real estate across India.
                </p>
                <p>
                  Over the past 17+ years, we have expanded our footprint to
                  200+ cities, building deep relationships with landlords, mall
                  operators, and brand decision-makers alike. Our data-driven
                  approach, combining market analysis, consumer behaviour
                  research, and location intelligence, has helped 70+ national
                  and international brands find the perfect space.
                </p>
                <p>
                  From flagship retail outlets in high streets to corporate
                  office parks and mixed-use developments, we handle every
                  category with the same level of precision and care.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="relative rounded-2xl overflow-hidden h-80 lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
                alt="The Leasing World Office"
                fill
                className="object-cover opacity-80"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-[#0d0d18] border-y border-white/5 py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Photo */}
            <FadeIn direction="left">
              <div className="relative rounded-2xl overflow-hidden order-2 lg:order-1 flex justify-center">
                <Image
                  src="/founder.png"
                  alt="Rajesh Sharma - Founder & CEO"
                  width={460}
                  height={480}
                  className="object-cover rounded-2xl w-full max-w-sm lg:max-w-full scale-110"
                />
              </div>
            </FadeIn>
            {/* Text */}
            <FadeIn direction="right">
              <div className="order-1 lg:order-2">
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
                  Meet Our Founder
                </p>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Rajesh Sharma
                </h2>
                <p className="text-blue-400 font-medium mb-5">
                  Founder &amp; CEO
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  With over 17 years of experience in the real estate sector,
                  Rajesh Sharma founded The Leasing World in 2007 with a vision
                  to transform the real estate advisory landscape in India. His
                  expertise spans retail leasing, commercial property
                  management, and strategic mall development.
                </p>
                {/* Badge */}
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-8">
                  <span className="text-yellow-400">☆</span>
                  <span>17+ years in Real Estate Advisory</span>
                </div>
                {/* CTA */}
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Connect with Us →
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Our Impact
            </p>
            <h2 className="text-3xl font-bold text-white">
              Numbers That Speak
            </h2>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {IMPACT.map((item) => (
            <StaggerItem key={item.label}>
              <div className="bg-white/5 border border-white/10 rounded-xl py-10 px-6 text-center hover:border-blue-500/40 transition-colors">
                <p className="text-5xl font-bold text-blue-400 mb-2">
                  {item.value}
                </p>
                <p className="text-gray-300 font-medium">{item.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Values */}
      <section className="bg-[#0d0d18] border-t border-white/5 py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
                Our Values
              </p>
              <h2 className="text-3xl font-bold text-white">What Drives Us</h2>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <div className="border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-colors h-full">
                    <div className="h-10 w-10 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">
                      {v.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>
    </div>
  );
}
