"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building,
  Users,
  UserCog,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (!["admin", "super_admin"].includes(user.role)) {
        router.push("/");
        return;
      }
      setUserRole(user.role);
    } catch {
      router.push("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!authorized) return null;

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["admin", "super_admin"],
    },
    {
      name: "Properties",
      href: "/admin/properties",
      icon: Building,
      roles: ["admin", "super_admin"],
    },
    {
      name: "Leads",
      href: "/admin/leads",
      icon: Users,
      roles: ["admin", "super_admin"],
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: UserCog,
      roles: ["super_admin"],
    },
  ].filter((item) => item.roles.includes(userRole));

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#111118] border-r border-white/10 hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="text-lg font-bold text-white tracking-tight">
            Leasing<span className="text-blue-500">World</span>
          </span>
          <span className="ml-2 text-[10px] font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
            ADMIN
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#111118] border-b border-white/10 flex items-center justify-between px-4 md:hidden">
        <span className="text-base font-bold text-white">
          Leasing<span className="text-blue-500">World</span>
          <span className="ml-2 text-[10px] font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
            ADMIN
          </span>
        </span>
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg transition-colors ${isActive ? "text-blue-400 bg-blue-500/10" : "text-gray-500 hover:text-white"}`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
