"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface CompareContextType {
  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType>({
  compareIds: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
  compareCount: 0,
});

const STORAGE_KEY = "compare_ids";
const MAX_COMPARE = 3;

function getStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompareIds(getStored());
    setMounted(true);
  }, []);

  const addToCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX_COMPARE) return prev;
      const next = [...prev, id];
      save(next);
      return next;
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      const next = prev.filter((i) => i !== id);
      save(next);
      return next;
    });
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds],
  );

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    save([]);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareIds.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
