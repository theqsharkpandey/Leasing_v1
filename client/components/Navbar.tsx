"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Menu, X, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "@/components/Motion";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchBarPassed, setSearchBarPassed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIntent, setActiveIntent] = useState<"buy" | "rent">("buy");
  const [suggestions, setSuggestions] = useState<
    Array<{ type: string; label: string; sublabel?: string; id?: string }>
  >([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";

  // Watch the hero search panel via IntersectionObserver (homepage only)
  useEffect(() => {
    if (!isHome) {
      setSearchBarPassed(false);
      return;
    }
    const observe = () => {
      const el = document.getElementById("hero-search");
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => setSearchBarPassed(!entry.isIntersecting),
        { root: null, rootMargin: "-64px 0px 0px 0px", threshold: 0 },
      );
      observer.observe(el);
      return observer;
    };
    let observer = observe();
    if (!observer) {
      const t = setTimeout(() => {
        observer = observe();
      }, 200);
      return () => clearTimeout(t);
    }
    return () => observer?.disconnect();
  }, [isHome, pathname]);

  // Close suggestion dropdown on outside click
  useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (
        suggestRef.current &&
        !suggestRef.current.contains(e.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  // Debounced autocomplete
  useEffect(() => {
    if (!searchBarPassed || searchQuery.trim().length < 1) {
      setSuggestions([]);
      setSuggestOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const qs = new URLSearchParams({
          q: searchQuery.trim(),
          listingIntent: activeIntent,
        });
        const res = await api.get(`/properties/suggest?${qs.toString()}`);
        const list = res.data.suggestions || [];
        setSuggestions(list);
        setSuggestOpen(list.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery, activeIntent, searchBarPassed]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSuggestOpen(false);
    const p = new URLSearchParams({
      q: searchQuery.trim(),
      listingIntent: activeIntent,
    });
    router.push(`/properties?${p.toString()}`);
  };

  const handleSuggestionClick = (s: {
    type: string;
    label: string;
    sublabel?: string;
    id?: string;
  }) => {
    setSuggestOpen(false);
    if (s.type === "property") {
      router.push(`/properties/${s.id}`);
    } else {
      const key = s.type === "city" ? "city" : "area";
      const p = new URLSearchParams({
        [key]: s.label,
        listingIntent: activeIntent,
      });
      router.push(`/properties?${p.toString()}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const showInlineSearch = isHome && searchBarPassed;

  return (
    <nav className="bg-[#0a0a0f] sticky top-0 z-50 border-b border-white/5 shadow-[0_0_30px_rgba(30,64,175,0.15)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 shrink-0">
            <NextImage
              src="/logo.png"
              alt="The Leasing World"
              width={36}
              height={36}
              className="object-contain h-9 w-9 invert"
              priority
            />
            <span className="text-2xl font-bold text-white tracking-tight hidden sm:block">
              The Leasing World
            </span>
          </a>

          {/* Desktop center */}
          <div className="hidden lg:flex flex-1 justify-center items-center relative">
            <AnimatePresence mode="wait">
              {showInlineSearch ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative w-full max-w-[540px]"
                  ref={suggestRef}
                >
                  {/* Dark pill search bar */}
                  <div className="flex items-center h-10 rounded-full bg-white/8 border border-white/12 focus-within:border-blue-500/60 focus-within:bg-white/10 transition-all duration-200">
                    {/* Buy / Rent toggle */}
                    <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10 shrink-0">
                      {(["buy", "rent"] as const).map((intent) => (
                        <button
                          key={intent}
                          onClick={() => setActiveIntent(intent)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-150 ${
                            activeIntent === intent
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {intent}
                        </button>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex items-center flex-1 gap-2 px-3 min-w-0">
                      <Search className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() =>
                          suggestions.length > 0 && setSuggestOpen(true)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearch();
                          if (e.key === "Escape") setSuggestOpen(false);
                        }}
                        placeholder="City, area or property..."
                        className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none min-w-0"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSuggestions([]);
                            setSuggestOpen(false);
                          }}
                          className="text-gray-500 hover:text-gray-300 shrink-0 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Search icon button */}
                    <button
                      onClick={handleSearch}
                      className="h-7 w-7 mx-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center shrink-0"
                    >
                      <Search className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Autocomplete dropdown */}
                  {suggestOpen && suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(s);
                          }}
                          className={`w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors text-left${
                            i < suggestions.length - 1
                              ? " border-b border-white/5"
                              : ""
                          }`}
                        >
                          <span className="text-sm text-gray-200">
                            {s.label}
                            {s.sublabel && (
                              <span className="text-gray-500">
                                , {s.sublabel}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-gray-500 shrink-0 ml-4">
                            {s.type === "city"
                              ? "City"
                              : s.type === "area"
                                ? "Locality"
                                : "Property"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="flex items-center gap-6"
                >
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/post-property"
              className="text-sm font-semibold text-white border border-white/20 hover:border-blue-400 hover:text-blue-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              Post Property
              <span className="bg-green-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                FREE
              </span>
            </Link>

            {isAuthenticated && user ? (
              <Link
                href="/dashboard"
                className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors overflow-hidden"
                title="Dashboard"
              >
                {user.avatar ? (
                  <NextImage
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:hidden bg-[#0a0a0f] border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-2.5 text-gray-300 hover:text-white text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <Link
                  href="/post-property"
                  className="block text-center border border-white/20 text-white text-sm font-semibold py-2.5 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Post Property FREE
                </Link>
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-center text-gray-300 hover:text-white text-sm py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>{" "}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center text-red-400 text-sm py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block text-center bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
