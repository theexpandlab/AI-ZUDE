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
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(96vw,760px)]">
      <div className="glass-nav rounded-full px-2 py-1.5 overflow-x-auto shadow-[0_8px_40px_rgba(3,5,14,0.6)]">
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
                      ? "bg-gradient-to-b from-expandSoft/90 to-expand text-white shadow-[0_0_18px_rgba(61,165,255,0.35)]"
                      : "text-ink/80 hover:text-ink hover:bg-white/[.06]")
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
