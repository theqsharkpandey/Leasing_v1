import { StaggerChildren, StaggerItem } from "@/components/Motion";

const STATS = [
  { value: "17+", label: "Years of Experience" },
  { value: "300+", label: "Cities Covered" },
  { value: "70+", label: "Trusted Brands" },
  { value: "500+", label: "Projects Completed" },
];

export default function Stats() {
  return (
    <StaggerChildren className="max-w-[1280px] mx-auto px-4 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {STATS.map((s) => (
        <StaggerItem key={s.label}>
          <div className="bg-white/5 border border-white/10 rounded-xl py-6 px-4">
            <p className="text-4xl font-bold text-blue-400">{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
