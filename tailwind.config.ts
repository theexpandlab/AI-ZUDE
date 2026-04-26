import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic page background and deeper void
        canvas: "#070A18",
        void: "#03050E",
        // Glass surface (used via opacity utilities; this is a fallback solid)
        surface: "#0E1326",
        // Text
        ink: "#EDEFF7",
        muted: "#8B95B0",
        line: "rgba(255,255,255,0.08)",
        // Brand accent — Expand Lab blue
        expand: "#3F77C2",
        expandSoft: "#6F9DD8",
        expandDeep: "#2A5A99",
        // Pillar / category palette tuned for dark backgrounds
        sage: "#8FCAA9",
        slate: "#76A8D6",
        clay: "#E2A87E",
        amber: "#E5C26B",
        plum: "#BCA1E8",
        rose: "#E07A8A",
        gold: "#C9A55C",
        // Subtle nebula tints used in radial gradients
        nebulaA: "#1A2466",
        nebulaB: "#2B1A55",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Inter", "sans-serif"],
        serif: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.25), 0 8px 32px rgba(10,18,40,0.45)",
        glow: "0 0 0 1px rgba(111,157,216,0.22), 0 0 32px rgba(63,119,194,0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-6px,0)" },
        },
        nebulaShift: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 9s ease-in-out infinite",
        nebula: "nebulaShift 240s linear infinite",
        shimmer: "shimmer 6s ease-in-out infinite",
        fadeIn: "fadeIn 600ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
