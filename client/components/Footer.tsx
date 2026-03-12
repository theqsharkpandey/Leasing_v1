"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  return (
    <footer className="bg-[#0a0a0f] text-gray-400 pt-12 pb-6 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="The Leasing World"
                width={36}
                height={36}
                className="object-contain"
              />
              <h3 className="text-lg font-bold text-white">
                The Leasing World
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Unlocking Real Estate Value Across India Since 2007
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                <span>
                  Bhiwadi Alwar Bypass Rd, adjoining Kajaria Greens, Bhiwadi,
                  Rajasthan 301019
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                <a
                  href="tel:+919116052405"
                  className="hover:text-white transition-colors"
                >
                  +91 91160 52405
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <a
                  href="mailto:info@theleasingworld.com"
                  className="hover:text-white transition-colors"
                >
                  info@theleasingworld.com
                </a>
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-4">
              {[
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/theleasingworld",
                  label: "Facebook",
                },
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/theleasingworld",
                  label: "Instagram",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/the-leasing-world",
                  label: "LinkedIn",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-500 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Properties", href: "/properties" },
                { label: "Post Property", href: "/post-property" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                isAuthenticated
                  ? { label: "My Account", href: "/profile" }
                  : { label: "Login", href: "/login" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Retail Leasing",
                "Commercial Leasing",
                "PMC",
                "Sales & Purchase",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Location</h4>
            <div className="rounded-xl overflow-hidden border border-white/10 h-44">
              <iframe
                src="https://maps.google.com/maps?ll=28.198443,76.810403&z=16&t=m&hl=en&gl=IN&mapclient=embed&cid=15792768173380966308&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Leasing World Location"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-600">
          <p>&copy; 2025 The Leasing World. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
