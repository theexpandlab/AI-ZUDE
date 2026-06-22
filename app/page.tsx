import OfferBlueprintApp from "@/components/OfferBlueprintApp";
import { publicEnv } from "@/lib/env";

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
