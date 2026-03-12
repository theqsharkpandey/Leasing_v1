const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 20;

export function addToRecentlyViewed(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const list: string[] = stored ? JSON.parse(stored) : [];
    const filtered = list.filter((item) => item !== id);
    filtered.unshift(id);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered.slice(0, MAX_ITEMS)),
    );
  } catch {
    // ignore
  }
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
