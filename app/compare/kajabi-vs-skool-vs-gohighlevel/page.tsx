"use client";

import { ComparePage } from "@/components/expandlab/ComparePage";
import { CMP_PLATFORMS } from "@/content/compare";

export default function Page() {
  return <ComparePage data={CMP_PLATFORMS} />;
}
