"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/goals", label: "Quarter" },
  { href: "/weekly", label: "Weekly" },
  { href: "/daily", label: "Daily" },
  { href: "/pillars", label: "Pillars" },
  { href: "/energy", label: "Energy" },
  { href: "/ideal-week", label: "Ideal Week" },
  { href: "/fun", label: "Fun" },
  { href: "/relationships", label: "People" },
  { href: "/business", label: "Business" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(96vw,720px)]">
      <div className="bg-surface/90 backdrop-blur border border-line rounded-full shadow-soft px-2 py-1.5 overflow-x-auto">
        <ul className="flex items-center gap-1 whitespace-nowrap">
          {items.map((it) => {
            const active =
              it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={
                    "inline-flex items-center px-3 py-1.5 rounded-full text-sm transition " +
                    (active
                      ? "bg-ink text-canvas"
                      : "text-ink/80 hover:bg-canvas")
                  }
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
