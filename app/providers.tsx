"use client";

import { StepGuideProvider } from "@/components/StepGuide";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StepGuideProvider>{children}</StepGuideProvider>;
}
