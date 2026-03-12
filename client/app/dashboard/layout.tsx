"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  CalendarCheck,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const SIDEBAR_LINKS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Properties", href: "/dashboard/properties", icon: Building2 },
  { label: "My Shortlist", href: "/dashboard/shortlist", icon: Heart },
  { label: "My Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { label: "Visits", href: "/dashboard/visits", icon: CalendarCheck },
  {
    label: "Saved Searches",
    href: "/dashboard/saved-searches",
    icon: Bookmark,
  },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <>
      {/* User info */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user?.name}
            </p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}

        {user && ["admin", "super_admin"].includes(user.role) && (
          <Link
            href="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Admin Panel
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#111118] border-r border-white/10 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#111118] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <span className="text-white font-semibold text-sm">Dashboard</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-white font-semibold text-sm">Dashboard</span>
        </div>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
