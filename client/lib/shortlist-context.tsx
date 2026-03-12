"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

interface ShortlistContextType {
  shortlistedIds: Set<string>;
  toggleShortlist: (propertyId: string) => void;
  isShortlisted: (propertyId: string) => boolean;
  shortlistCount: number;
}

const ShortlistContext = createContext<ShortlistContextType>({
  shortlistedIds: new Set(),
  toggleShortlist: () => {},
  isShortlisted: () => false,
  shortlistCount: 0,
});

const LOCAL_KEY = "shortlist_ids";

function getLocalShortlist(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLocalShortlist(ids: Set<string>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify([...ids]));
}

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) {
      // Fetch from backend
      api
        .get("/shortlist")
        .then((res) => {
          const ids = (res.data || []).map((p: { _id: string }) => p._id);
          // Merge with local
          const local = getLocalShortlist();
          const merged = new Set([...ids, ...local]);
          setShortlistedIds(merged);
          // Sync local items to backend
          local.forEach((id) => {
            if (!ids.includes(id)) {
              api.post("/shortlist", { propertyId: id }).catch(() => {});
            }
          });
          localStorage.removeItem(LOCAL_KEY);
        })
        .catch(() => {
          setShortlistedIds(getLocalShortlist());
        });
    } else {
      setShortlistedIds(getLocalShortlist());
    }
  }, [token]);

  const toggleShortlist = useCallback(
    (propertyId: string) => {
      setShortlistedIds((prev) => {
        const next = new Set(prev);
        if (next.has(propertyId)) {
          next.delete(propertyId);
          if (token) {
            api.delete(`/shortlist/${propertyId}`).catch(() => {});
          } else {
            saveLocalShortlist(next);
          }
        } else {
          next.add(propertyId);
          if (token) {
            api.post("/shortlist", { propertyId }).catch(() => {});
          } else {
            saveLocalShortlist(next);
          }
        }
        return next;
      });
    },
    [token],
  );

  const isShortlisted = useCallback(
    (propertyId: string) => shortlistedIds.has(propertyId),
    [shortlistedIds],
  );

  if (!mounted) return <>{children}</>;

  return (
    <ShortlistContext.Provider
      value={{
        shortlistedIds,
        toggleShortlist,
        isShortlisted,
        shortlistCount: shortlistedIds.size,
      }}
    >
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  return useContext(ShortlistContext);
}
