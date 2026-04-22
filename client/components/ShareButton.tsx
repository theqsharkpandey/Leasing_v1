"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface ShareButtonProps {
  /** First property image URL (Cloudinary or any CDN) */
  imageUrl?: string;
  /** Property title used in the share message */
  propertyTitle?: string;
}

export default function ShareButton({ imageUrl, propertyTitle }: ShareButtonProps) {
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
  const title = propertyTitle || (typeof document !== "undefined" ? document.title : "Property");

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  // WhatsApp message: emoji + bold title + link on next line
  const waText = `🏠 *${title}*\n\n${url}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  const shareLinks = [
    {
      name: "WhatsApp",
      href: waHref,
      color: "hover:text-green-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-4 w-4 fill-current flex-shrink-0"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.737 5.476 2.027 7.785L0 32l8.435-2.007A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.741-1.831l-.483-.287-4.995 1.189 1.262-4.855-.315-.5A13.264 13.264 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.199-2.356-1.162-2.72-1.294-.364-.133-.629-.199-.894.199s-1.026 1.294-1.257 1.56c-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.976-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.81.179-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.894-2.155-1.225-2.95-.322-.775-.65-.67-.894-.682l-.762-.013c-.265 0-.696.1-1.06.497s-1.391 1.36-1.391 3.316 1.424 3.847 1.623 4.112c.199.265 2.803 4.278 6.79 5.998.949.41 1.69.654 2.268.837.953.303 1.82.26 2.505.158.763-.114 2.356-.963 2.688-1.894.332-.93.332-1.727.232-1.894-.099-.166-.364-.265-.762-.464z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-blue-500",
      icon: null,
    },
    {
      name: "Twitter / X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:text-sky-400",
      icon: null,
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
        <div className="absolute right-0 top-full mt-1 w-52 bg-[#111118] border border-white/10 rounded-lg shadow-xl z-50 py-2">
          {/* Copy link */}
          <button
            onClick={copyLink}
            className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            ) : (
              <Link2 className="h-4 w-4 flex-shrink-0" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          {/* Social share links */}
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-3 py-2 text-sm text-gray-400 ${link.color} hover:bg-white/5 transition-colors flex items-center gap-2`}
              onClick={() => setOpen(false)}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
