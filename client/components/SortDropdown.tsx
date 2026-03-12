"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "latest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "area_asc", label: "Area: Low to High" },
  { value: "area_desc", label: "Area: High to Low" },
];

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label || "Sort By";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-white/10 rounded-lg text-gray-300 hover:border-white/20 hover:text-white transition-colors bg-[#111118]"
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
        {currentLabel}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#111118] border border-white/10 rounded-lg shadow-xl z-50 py-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === option.value
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
