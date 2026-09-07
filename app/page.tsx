import type { Metadata } from "next";

import OfferBlueprintApp from "@/components/OfferBlueprintApp";
import { publicEnv } from "@/lib/env";
import { baseOpenGraph } from "@/content/og";

// The Offer Blueprint tool owns "/" on its own host (the sales page only takes
// over "/" on the sales host via a host-scoped rewrite). Keep its own title and
// description here so the root layout's 100-Day Build defaults don't clobber the
// tool's identity. No canonical is set: the tool's host differs from
// metadataBase, so a canonical here would point at the wrong host.
export const metadata: Metadata = {
  title: { absolute: "The Offer Blueprint · The Expand Lab" },
  description:
    "Answer five short questions and we'll architect 2–3 offers built from your expertise — the transformation, the audience, the shape. By The Expand Lab.",
  openGraph: {
    ...baseOpenGraph,
    title: "The Offer Blueprint · The Expand Lab",
    description:
      "The offer is already in your expertise. Answer five questions and we'll draw it out.",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  // Read public config server-side and pass to the client app, so server-only
  // env reads never enter the client bundle (PRD §8).
  return (
    <OfferBlueprintApp
      config={{
        calBookingUrl: publicEnv.calBookingUrl,
        privacyPolicyUrl: publicEnv.privacyPolicyUrl,
      }}
    />
  );
}
