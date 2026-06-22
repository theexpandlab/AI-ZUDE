import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Offer Blueprint · The Expand Lab",
  description:
    "Answer five short questions and we'll architect 2–3 offers built from your expertise — the transformation, the audience, the shape. By The Expand Lab.",
  openGraph: {
    title: "The Offer Blueprint · The Expand Lab",
    description:
      "The offer is already in your expertise. Answer five questions and we'll draw it out.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4EFE4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
