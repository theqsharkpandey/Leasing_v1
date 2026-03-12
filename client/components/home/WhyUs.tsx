import { Globe, Lightbulb, Layers } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/Motion";

const WHY_US = [
  {
    icon: Globe,
    title: "Extensive Network",
    desc: "Operating across 300+ cities in India with strong relationships across the real estate ecosystem.",
  },
  {
    icon: Lightbulb,
    title: "Industry Expertise",
    desc: "Deep understanding of the Indian real estate market with 17+ years of advisory experience.",
  },
  {
    icon: Layers,
    title: "End-to-End Solutions",
    desc: "Comprehensive services from initial market analysis and location intelligence to lease execution.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-[#0d0d18] border-y border-white/5 py-20">
      <div className="max-w-[1280px] mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Why Choose The Leasing World?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            With 17+ years of experience, we deliver exceptional real estate
            advisory services across India
          </p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_US.map((w) => {
            const Icon = w.icon;
            return (
              <StaggerItem key={w.title}>
                <div className="border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-colors h-full">
                  <div className="h-10 w-10 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">
                    {w.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
