"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeartBoardCard } from "@/app/components/HeartBoardCard";
import { getHeartedPostsByWeek } from "@/data/mockPosts";
import { getActiveHeartboardPosts } from "@/data/testDatasets";
import type { HeartBoard } from "@/data/mockHeartBoard";
import type { AIHeartBoard } from "@/lib/ai/heartBoardSchema";
import { adaptHeartBoardForUI } from "@/lib/ai/adaptHeartBoardForUI";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";
import { clearGeneratedHeartBoard, loadGeneratedHeartBoard, saveGeneratedHeartBoard } from "@/lib/heartBoardCache";
import { getCurrentWeekId, getMergedHeartedPosts } from "@/lib/heartStorage";

export function HeartBoardClientPage() {
  const activePosts = useMemo(() => getActiveHeartboardPosts(), []);
  const weekId = useMemo(() => getCurrentWeekId(new Date()), []);
  const [hydrated, setHydrated] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const heartedPosts = useMemo(
    () => (hydrated ? getMergedHeartedPosts(activePosts, weekId) : getHeartedPostsByWeek(activePosts, weekId)),
    [activePosts, hydrated, weekId],
  );
  const fallbackHeartBoard = useMemo(() => generateMockHeartBoardFromPosts(heartedPosts, weekId), [heartedPosts, weekId]);
  const [heartBoard, setHeartBoard] = useState<HeartBoard>(fallbackHeartBoard);

  useEffect(() => {
    if (!hydrated) return;
    if (heartedPosts.length === 0) {
      clearGeneratedHeartBoard(weekId);
      setHeartBoard(fallbackHeartBoard);
      return;
    }

    const cached = loadGeneratedHeartBoard(
      weekId,
      heartedPosts.map((post) => post.id),
    );
    setHeartBoard(cached ?? fallbackHeartBoard);
  }, [hydrated, weekId, heartedPosts, fallbackHeartBoard]);

  const handleRegenerateWithGemini = async () => {
    if (heartedPosts.length === 0 || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const response = await fetch("/api/heart-board/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekId,
          posts: heartedPosts,
        }),
      });
      const data = (await response.json()) as {
        heartBoard?: HeartBoard | AIHeartBoard;
        usedFallback?: boolean;
        error?: string;
      };

      if (!response.ok || !data.heartBoard) {
        throw new Error(data.error || "Failed to regenerate with Gemini");
      }

      const nextBoard = adaptHeartBoardForUI(data.heartBoard, heartedPosts, weekId);
      setHeartBoard(nextBoard);
      saveGeneratedHeartBoard(
        weekId,
        heartedPosts.map((post) => post.id),
        nextBoard,
      );

      if (data.usedFallback) {
        console.warn("Gemini regeneration used fallback heart board.");
      }
    } catch (error) {
      console.error("Failed to regenerate heart board:", error);
      setHeartBoard(fallbackHeartBoard);
    } finally {
      setIsRegenerating(false);
    }
  };

  const directionCount = heartBoard.categories.length;
  const safeActiveCategoryIndex = Math.min(activeCategoryIndex, Math.max(directionCount - 1, 0));
  const activeCategory = heartBoard.categories[safeActiveCategoryIndex];

  const showPreviousCategory = () => {
    setActiveCategoryIndex((current) => Math.max(current - 1, 0));
  };

  const showNextCategory = () => {
    setActiveCategoryIndex((current) => Math.min(current + 1, directionCount - 1));
  };

  const handleTouchEnd = (endY: number) => {
    if (touchStartYRef.current === null) return;
    const deltaY = touchStartYRef.current - endY;
    if (Math.abs(deltaY) > 36) {
      if (deltaY > 0) showNextCategory();
      if (deltaY < 0) showPreviousCategory();
    }
    touchStartYRef.current = null;
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fff8f4_0%,#fff5f7_48%,#fffaf6_100%)] pb-8">
      <header className="sticky top-0 z-20 bg-[#fff8f4]/85 px-4 py-3 backdrop-blur">
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

      <section className="px-5 pb-3 pt-4">
        <div className="rounded-3xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-[13px] font-medium text-zinc-700">本周你点亮了 {heartedPosts.length} 次心动</p>
          <p className="mt-1 text-[13px] text-zinc-500">AI 整理出 {directionCount} 个兴趣方向</p>
          <button
            type="button"
            onClick={handleRegenerateWithGemini}
            disabled={isRegenerating || heartedPosts.length === 0}
            className="mt-3 inline-flex rounded-full border border-[#f0cdc3]/80 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-sm disabled:opacity-60"
          >
            {isRegenerating ? "AI 正在整理..." : "用ai生成"}
          </button>
        </div>
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
      ) : activeCategory ? (
        <section className="px-4 pt-2">
          <div
            className="relative h-[540px] overflow-hidden px-1 pt-1"
            onTouchStart={(event) => {
              if ((event.target as Element).closest("a,button")) return;
              touchStartYRef.current = event.touches[0]?.clientY ?? null;
            }}
            onTouchEnd={(event) => {
              if ((event.target as Element).closest("a,button")) {
                touchStartYRef.current = null;
                return;
              }
              handleTouchEnd(event.changedTouches[0]?.clientY ?? 0);
            }}
          >
            {heartBoard.categories.map((category, index) => {
              const offset = index - safeActiveCategoryIndex;
              const isVisible = offset >= 0 && offset <= 2;
              const transform =
                offset < 0
                  ? "translateY(-40px) scale(0.96)"
                  : `translate(${offset * 18}px, ${offset * 18}px) rotate(${offset * 3}deg) scale(${1 - offset * 0.06})`;

              return (
                <div
                  key={category.id}
                  className={`absolute inset-x-1 top-1 transition-all duration-300 ease-out ${
                    isVisible ? "opacity-100" : "pointer-events-none opacity-0"
                  } ${offset === 0 ? "z-30" : offset === 1 ? "z-20" : "z-10"}`}
                  style={{
                    transform,
                    transformOrigin: "center top",
                    pointerEvents: offset === 0 ? "auto" : "none",
                  }}
                >
                  <HeartBoardCard category={category} />
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={showPreviousCategory}
              disabled={safeActiveCategoryIndex === 0}
              className="rounded-full border border-[#ead7cf] bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 disabled:opacity-35"
            >
              上一张
            </button>
            <div className="flex items-center gap-2">
              {heartBoard.categories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  aria-label={`切换到${category.title}`}
                  onClick={() => setActiveCategoryIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === safeActiveCategoryIndex ? "w-5 bg-[var(--xhs-red)]" : "w-2 bg-[#e8d8d1]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={showNextCategory}
              disabled={safeActiveCategoryIndex === directionCount - 1}
              className="rounded-full border border-[#ead7cf] bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 disabled:opacity-35"
            >
              下一张
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
