import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  ShoppingBag,
  ClipboardList,
  BadgeDollarSign,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

const SERVICES = [
  {
    icon: ShoppingBag,
    title: "Retail Leasing",
    subtitle: "Strategic retail space solutions for brands across India.",
    desc: "Our retail leasing services connect premium brands with high-value retail spaces across malls and high streets.",
    href: "/services",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Building2,
    title: "Commercial Leasing",
    subtitle: "Premium office and commercial space solutions.",
    desc: "We provide end-to-end commercial leasing services for office spaces, business centers, and corporate HQs.",
    href: "/services",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: ClipboardList,
    title: "Project Management Consultancy",
    subtitle: "Expert guidance for real estate development projects.",
    desc: "Our PMC services provide comprehensive project oversight from conceptualization to handover.",
    href: "/services",
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: BadgeDollarSign,
    title: "Sales & Purchase",
    subtitle: "Expert real estate transaction advisory services.",
    desc: "We facilitate property sales and purchases across residential, commercial, and retail segments.",
    href: "/services",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Services() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-20">
      <FadeIn className="text-center mb-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">
          What We Do
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Our Core Services
        </h2>
      </FadeIn>
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((svc) => {
          const Icon = svc.icon;
          return (
            <StaggerItem key={svc.title}>
              <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(30,64,175,0.2)] transition-all group h-full">
                <div className="relative h-44 bg-gray-800 overflow-hidden">
                  <Image
                    src={svc.img}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-blue-400 shrink-0" />
                    <h3 className="font-bold text-white text-sm leading-snug">
                      {svc.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                    {svc.subtitle}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                    {svc.desc}
                  </p>
                  <Link
                    href={svc.href}
                    className="flex items-center gap-1 text-sm font-semibold text-white border border-white/20 hover:border-blue-400 hover:text-blue-400 rounded-lg py-2 justify-center transition-colors"
                  >
                    Learn More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
      <FadeIn className="text-center mt-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 border border-white/20 hover:border-blue-400 text-white hover:text-blue-400 font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
        >
          View All Services <ArrowRight className="h-4 w-4" />
        </Link>
      </FadeIn>
    </section>
  );
}
