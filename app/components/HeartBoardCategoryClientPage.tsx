"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartBoardDetail } from "@/app/components/HeartBoardDetail";
import type { HeartBoard } from "@/data/mockHeartBoard";
import { getActiveHeartboardPosts } from "@/data/testDatasets";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";
import { loadGeneratedHeartBoard } from "@/lib/heartBoardCache";
import { getCurrentWeekId, getMergedHeartedPosts } from "@/lib/heartStorage";

type HeartBoardCategoryClientPageProps = {
  categoryId: string;
};

export function HeartBoardCategoryClientPage({ categoryId }: HeartBoardCategoryClientPageProps) {
  const activePosts = getActiveHeartboardPosts();
  const weekId = getCurrentWeekId(new Date());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#f8f5f3] p-4">
        <div className="rounded-3xl border border-[#f1dfd7] bg-white px-5 py-7 text-center">
          <p className="text-sm text-zinc-600">正在同步本周灵感内容...</p>
        </div>
      </main>
    );
  }

  const heartedPosts = getMergedHeartedPosts(activePosts, weekId);
  const fallbackHeartBoard = generateMockHeartBoardFromPosts(heartedPosts, weekId);
  const cachedHeartBoard =
    loadGeneratedHeartBoard(
      weekId,
      heartedPosts.map((post) => post.id),
    ) ?? null;
  const heartBoard: HeartBoard = cachedHeartBoard ?? fallbackHeartBoard;
  const category = heartBoard.categories.find((entry) => entry.slug === categoryId || entry.id === categoryId);

  if (!category) {
    return (
      <main className="min-h-screen bg-[#f8f5f3] p-4">
        <div className="rounded-3xl border border-[#f1dfd7] bg-white px-5 py-7 text-center">
          <h1 className="text-lg font-semibold text-zinc-900">本周暂无该分类灵感内容</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">去点亮更多内容后，这里会自动更新分类详情。</p>
          <Link
            href="/heart-board"
            className="mt-5 inline-flex rounded-full bg-[var(--xhs-red)] px-4 py-2 text-sm font-medium text-white"
          >
            返回本周灵感
          </Link>
        </div>
      </main>
    );
  }

  const categoryThemeIndex = Math.max(
    0,
    heartBoard.categories.findIndex((entry) => entry.id === category.id),
  );

  return <HeartBoardDetail category={category} themeIndex={categoryThemeIndex} />;
}
