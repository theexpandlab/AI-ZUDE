import type { Config } from "tailwindcss";

/**
 * The Offer Blueprint — design language (per PRD §10):
 * warm paper background, ink text, a single deep "blueprint-blue" accent,
 * technical mono labels, confident sans headings. Architect, not hype.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm paper canvas
        paper: "#F4EFE4",
        paperDeep: "#EBE4D4",
        card: "#FBF8F1",
        // Ink
        ink: "#1F1B16",
        inkSoft: "#4A443B",
        muted: "#8A8275",
        line: "#DAD2C0",
        lineSoft: "#E6DFD0",
        // The single deep accent — blueprint blue
        blueprint: "#3F77C2",
        blueprintDeep: "#2C5894",
        blueprintSoft: "#6F9DD8",
        blueprintWash: "#E4EDF7",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        label: "0.22em",
      },
      boxShadow: {
        sheet: "0 1px 2px rgba(31,27,22,0.04), 0 12px 32px rgba(31,27,22,0.07)",
        lift: "0 2px 4px rgba(31,27,22,0.05), 0 18px 48px rgba(31,27,22,0.10)",
      },
      borderRadius: {
        sheet: "0.5rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        barPulse: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 480ms cubic-bezier(0.22,1,0.36,1) both",
        barPulse: "barPulse 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
