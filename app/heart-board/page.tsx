import Link from "next/link";
import { HeartBoardCard } from "@/app/components/HeartBoardCard";
import { mockHeartBoard } from "@/data/mockHeartBoard";

export default function HeartBoardPage() {
  return (
    <main className="min-h-screen bg-[#f9f5f1] pb-8">
      <header className="sticky top-0 z-20 border-b border-[#f1dfd7] bg-[#f9f5f1]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/me" className="text-2xl text-zinc-800">
            ←
          </Link>
          <div className="text-center">
            <h1 className="text-[24px] font-black text-zinc-900">本周心动板</h1>
            <p className="text-xs text-zinc-500">{mockHeartBoard.period}</p>
          </div>
          <div className="flex items-center gap-3 text-lg text-zinc-700">
            <button type="button" aria-label="更多">
              ...
            </button>
            <button type="button" aria-label="分享">
              ↗
            </button>
          </div>
        </div>
      </header>

      <section className="px-5 pb-3 pt-5">
        <p className="text-[15px] text-zinc-700">本周你点亮了 {mockHeartBoard.totalHearted} 次心动</p>
        <p className="mt-1 text-[15px] text-zinc-700">
          AI 为你整理出 {mockHeartBoard.totalDirections} 个兴趣方向
        </p>
        <p className="mt-2 text-sm text-zinc-500">{mockHeartBoard.oneLineInsight}</p>
      </section>

      <section className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4">
        {mockHeartBoard.categories.map((category) => (
          <HeartBoardCard key={category.id} category={category} />
        ))}
      </section>
    </main>
  );
}
