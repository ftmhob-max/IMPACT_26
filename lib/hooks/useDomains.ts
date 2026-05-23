"use client";

import { useState, useEffect } from "react";
import { DOMAINS } from "@/lib/utils";

let cachedDomains: string[] | null = null;

/** Loads the full domain list (hardcoded + custom) from the server and caches it in memory. */
export function useDomains() {
  const [domains, setDomains] = useState<string[]>(
    cachedDomains ?? Object.keys(DOMAINS)
  );

  useEffect(() => {
    if (cachedDomains) {
      setDomains(cachedDomains);
      return;
    }
    fetch("/api/admin/domains", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { domains?: string[] }) => {
        const list = data.domains ?? Object.keys(DOMAINS);
        cachedDomains = list;
        setDomains(list);
      })
      .catch(() => {
        const fallback = Object.keys(DOMAINS);
        cachedDomains = fallback;
        setDomains(fallback);
      });
  }, []);

  async function addDomain(name: string): Promise<boolean> {
    try {
      const res = await fetch("/api/admin/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        // Update local state immediately and bust cache for other mounts
        const next = Array.from(new Set([...domains, name])).sort();
        cachedDomains = next;
        setDomains(next);
        return true;
      }
    } catch {
      // swallow — caller handles false
    }
    return false;
  }

  return { domains, addDomain };
}
