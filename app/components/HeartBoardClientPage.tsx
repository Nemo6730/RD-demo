"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HeartBoardCard } from "@/app/components/HeartBoardCard";
import { getHeartedPostsByWeek, mockPosts } from "@/data/mockPosts";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";
import { getCurrentWeekId, getMergedHeartedPosts } from "@/lib/heartStorage";

export function HeartBoardClientPage() {
  const weekId = useMemo(() => getCurrentWeekId(new Date()), []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const heartedPosts = useMemo(
    () => (hydrated ? getMergedHeartedPosts(mockPosts, weekId) : getHeartedPostsByWeek(mockPosts, weekId)),
    [hydrated, weekId],
  );
  const heartBoard = useMemo(() => generateMockHeartBoardFromPosts(heartedPosts, weekId), [heartedPosts, weekId]);
  const directionCount = heartBoard.categories.length;

  return (
    <main className="min-h-screen bg-[#f9f5f1] pb-8">
      <header className="sticky top-0 z-20 border-b border-[#f1dfd7] bg-[#f9f5f1]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/me" className="text-2xl text-zinc-800">
            ←
          </Link>
          <div className="text-center">
            <h1 className="text-[24px] font-black text-zinc-900">本周心动板</h1>
            <p className="text-xs text-zinc-500">根据你本周点亮的内容生成</p>
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
        <p className="text-[15px] text-zinc-700">本周你点亮了 {heartedPosts.length} 次心动</p>
        <p className="mt-1 text-[15px] text-zinc-700">AI 为你整理出 {directionCount} 个兴趣方向</p>
        <p className="mt-2 text-sm text-zinc-500">{heartBoard.summary}</p>
      </section>

      {heartedPosts.length === 0 ? (
        <section className="px-4 pt-2">
          <div className="rounded-3xl border border-[#f1dfd7] bg-white px-5 py-7 text-center">
            <h2 className="text-lg font-semibold text-zinc-900">本周还没有心动内容</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              去发现页点亮几篇让你心动的笔记，AI 会在这里帮你整理成本周心动板。
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-full bg-[var(--xhs-red)] px-4 py-2 text-sm font-medium text-white"
            >
              去发现看看
            </Link>
          </div>
        </section>
      ) : (
        <section className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4">
          {heartBoard.categories.map((category) => (
            <HeartBoardCard key={category.id} category={category} />
          ))}
        </section>
      )}
    </main>
  );
}
