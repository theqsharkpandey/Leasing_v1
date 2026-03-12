"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = typeof document !== "undefined" ? document.title : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      color: "hover:text-green-400",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-blue-500",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:text-sky-400",
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#111118] border border-white/10 rounded-lg shadow-xl z-50 py-2">
          <button
            onClick={copyLink}
            className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-3 py-2 text-sm text-gray-400 ${link.color} hover:bg-white/5 transition-colors`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
