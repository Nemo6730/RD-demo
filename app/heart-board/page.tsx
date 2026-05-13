import { Suspense } from "react";
import { HeartBoardClientPage } from "@/app/components/HeartBoardClientPage";

function HeartBoardPageFallback() {
  return <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#fff5f7_48%,#fffaf6_100%)]" />;
}

export default function HeartBoardPage() {
  return (
    <Suspense fallback={<HeartBoardPageFallback />}>
      <HeartBoardClientPage />
    </Suspense>
  );
}
