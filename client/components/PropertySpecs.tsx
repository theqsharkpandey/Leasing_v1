"use client";

interface Spec {
  label: string;
  value: string | number | undefined | null;
}

interface PropertySpecsProps {
  specs: Spec[];
}

export default function PropertySpecs({ specs }: PropertySpecsProps) {
  const filtered = specs.filter(
    (s) => s.value !== undefined && s.value !== null && s.value !== "",
  );

  if (filtered.length === 0) return null;

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Property Details</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {filtered.map((spec) => (
          <div
            key={spec.label}
            className="flex justify-between items-center py-2 border-b border-white/5"
          >
            <span className="text-gray-500 text-sm">{spec.label}</span>
            <span className="text-white text-sm font-medium capitalize">
              {typeof spec.value === "number"
                ? spec.value.toLocaleString("en-IN")
                : String(spec.value).replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
