"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { CompareProvider } from "@/lib/compare-context";
import CompareBar from "@/components/CompareBar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ShortlistProvider>
        <CompareProvider>
          {children}
          <CompareBar />
        </CompareProvider>
      </ShortlistProvider>
    </AuthProvider>
  );
}
