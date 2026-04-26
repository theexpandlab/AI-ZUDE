import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F4EE",
        surface: "#FFFFFF",
        ink: "#1F2430",
        muted: "#7B7E8A",
        line: "#E8E3D9",
        sage: "#6F8B6E",
        slate: "#5A7B8E",
        clay: "#C49B7C",
        amber: "#D4A04C",
        plum: "#B07AAC",
        rose: "#C97A7A",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Inter", "sans-serif"],
        serif: ["ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31, 36, 48, 0.04), 0 4px 16px rgba(31, 36, 48, 0.04)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
