"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  ClipboardList,
  Mail,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

const CORE_SERVICES = [
  {
    id: "retail",
    icon: ShoppingBag,
    title: "Retail Leasing",
    subtitle: "Strategic retail space solutions for brands across India.",
    description:
      "We connect premium brands with high-value retail spaces across malls and high streets. From location analysis to lease negotiation, we handle the entire process.",
    highlights: [
      "Location analysis & tenant mix planning",
      "Lease negotiation & documentation",
      "Mall & high street placements",
      "Pan-India coverage across 300+ cities",
    ],
  },
  {
    id: "commercial",
    icon: Building2,
    title: "Commercial Leasing",
    subtitle: "Premium office and commercial space solutions.",
    description:
      "End-to-end commercial leasing for office spaces, business centers, and commercial complexes. We match the right tenants with the right spaces.",
    highlights: [
      "Office & business center leasing",
      "Market trend analysis & shortlisting",
      "Negotiation for favorable terms",
      "Corporate tenant sourcing",
    ],
  },
  {
    id: "pmc",
    icon: ClipboardList,
    title: "Project Management Consultancy",
    subtitle: "Expert guidance for real estate development projects.",
    description:
      "Comprehensive project oversight from conceptualization to completion — managing timelines, budgets, quality, and vendor coordination.",
    highlights: [
      "Timeline & budget management",
      "Quality control & governance",
      "Vendor & execution coordination",
      "Concept-to-handover delivery",
    ],
  },
  {
    id: "sales",
    icon: BadgeDollarSign,
    title: "Sales & Purchase",
    subtitle: "Expert real estate transaction advisory services.",
    description:
      "We facilitate property transactions across residential, commercial, and retail segments with valuation, sourcing, and negotiation support.",
    highlights: [
      "Property valuation & advisory",
      "Buyer/seller sourcing & matching",
      "Transaction closure support",
      "Due diligence & documentation",
    ],
  },
];

const STATS = [
  { value: "17+", label: "Years of Experience" },
  { value: "300+", label: "Cities Covered" },
  { value: "70+", label: "Trusted Brands" },
  { value: "500+", label: "Projects Completed" },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Consultation",
    description:
      "We understand your requirements, goals, and constraints through an in-depth discussion.",
  },
  {
    step: 2,
    title: "Market Analysis",
    description:
      "Our team conducts thorough research on locations, pricing, and market trends.",
  },
  {
    step: 3,
    title: "Execution",
    description:
      "From shortlisting to negotiation and documentation, we manage every detail.",
  },
  {
    step: 4,
    title: "Ongoing Support",
    description:
      "Post-closure support including tenant management, compliance, and advisory.",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-blue-900/30 pointer-events-none" />
        <FadeIn className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Our Services
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Comprehensive Real Estate Solutions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tailored advisory services for property owners, brands, and
            developers across India — backed by 17+ years of expertise.
          </p>
        </FadeIn>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-white/5">
        <StaggerChildren className="max-w-[1280px] mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <StaggerItem key={s.label}>
              <div>
                <p className="text-4xl font-bold text-blue-400">{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Services Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our Core Services
          </h2>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CORE_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.id}>
                <article className="border border-white/10 rounded-xl p-7 hover:border-blue-500/40 transition-all duration-300 h-full flex flex-col">
                  <div className="h-11 w-11 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-blue-400 text-sm font-medium mb-3">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <ul className="space-y-2.5 mt-auto">
                    {service.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </section>

      {/* How We Work */}
      <section className="bg-[#0d0d18] border-y border-white/5 py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Our Approach
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How We Work
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
              <StaggerItem key={step.step}>
                <div className="border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-colors text-center h-full">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30">
                    <span className="text-lg font-bold text-blue-400">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d18] border-t border-white/5 py-16 text-center">
        <FadeIn className="max-w-[600px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Share your requirements and our team will craft a customized real
            estate solution for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            Get In Touch <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <a
              href="tel:+919116052405"
              className="inline-flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              +91 91160 52405
            </a>
            <a
              href="mailto:info@theleasingworld.com"
              className="inline-flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              info@theleasingworld.com
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
