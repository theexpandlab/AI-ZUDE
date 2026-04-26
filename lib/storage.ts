"use client";

import { useEffect, useState, useCallback } from "react";

const PREFIX = "lod:v1:";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("lod:change", { detail: { key } }));
  } catch {
    // ignore quota errors silently for MVP
  }
}

export function useLocal<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, initial));
    setHydrated(true);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string } | undefined;
      if (!detail || detail.key === key) {
        setValue(read<T>(key, initial));
      }
    };
    window.addEventListener("lod:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("lod:change", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, set, hydrated];
}

export const STORAGE_KEYS = {
  weeklyAudits: "weekly-audits",
  daily: "daily-entries",
  energy: "energy-entries",
  idealWeek: "ideal-week",
  fun: "fun-entries",
  relationships: "relationship-entries",
  business: "business-ideas",
  pillarItems: "pillar-items",
  commitments: "weekly-commitments",
  quarterConfig: "quarter-config",
  quarterGoals: "quarter-goals",
  profile: "profile",
} as const;
