"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeartBoardCard, HEART_BOARD_CARD_THEMES } from "@/app/components/HeartBoardCard";
import { getHeartedPostsByWeek } from "@/data/mockPosts";
import { getActiveHeartboardPosts } from "@/data/testDatasets";
import type { HeartBoard, HeartBoardCategory } from "@/data/mockHeartBoard";
import type { AIHeartBoard } from "@/lib/ai/heartBoardSchema";
import { adaptHeartBoardForUI } from "@/lib/ai/adaptHeartBoardForUI";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";
import { clearGeneratedHeartBoard, loadGeneratedHeartBoard, saveGeneratedHeartBoard } from "@/lib/heartBoardCache";
import { getCurrentWeekId, getMergedHeartedPosts } from "@/lib/heartStorage";

const SWIPE_THRESHOLD = 80;
const SWIPE_OUT_DISTANCE = 360;
const SWIPE_ANIMATION_MS = 320;

export function HeartBoardClientPage() {
  const activePosts = useMemo(() => getActiveHeartboardPosts(), []);
  const weekId = useMemo(() => getCurrentWeekId(new Date()), []);
  const [hydrated, setHydrated] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipingOut, setIsSwipingOut] = useState(false);
  const [expandedInsightCardId, setExpandedInsightCardId] = useState<string | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const swipeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const categoryIds = heartBoard.categories.map((category) => category.id);
  const categoryById = new Map(heartBoard.categories.map((category) => [category.id, category]));
  const normalizedCardOrder = [
    ...cardOrder.filter((id) => categoryById.has(id)),
    ...categoryIds.filter((id) => !cardOrder.includes(id)),
  ];
  const orderedCategories = normalizedCardOrder
    .map((id) => categoryById.get(id))
    .filter((category): category is HeartBoardCategory => Boolean(category));
  const activeCategory = orderedCategories[0];
  const activeOriginalIndex = activeCategory
    ? heartBoard.categories.findIndex((category) => category.id === activeCategory.id)
    : 0;

  useEffect(() => {
    return () => {
      if (swipeTimeoutRef.current) {
        clearTimeout(swipeTimeoutRef.current);
      }
    };
  }, []);

  const rotateDeck = () => {
    setExpandedInsightCardId(null);
    setCardOrder((currentOrder) => {
      const normalizedOrder = [
        ...currentOrder.filter((id) => categoryById.has(id)),
        ...categoryIds.filter((id) => !currentOrder.includes(id)),
      ];
      if (normalizedOrder.length <= 1) return normalizedOrder;
      return [...normalizedOrder.slice(1), normalizedOrder[0]];
    });
  };

  const rotateToCategory = (categoryId: string) => {
    setExpandedInsightCardId(null);
    setCardOrder((currentOrder) => {
      const normalizedOrder = [
        ...currentOrder.filter((id) => categoryById.has(id)),
        ...categoryIds.filter((id) => !currentOrder.includes(id)),
      ];
      const targetIndex = normalizedOrder.indexOf(categoryId);
      if (targetIndex <= 0) return normalizedOrder;
      return [...normalizedOrder.slice(targetIndex), ...normalizedOrder.slice(0, targetIndex)];
    });
  };

  const completeSwipe = (direction: 1 | -1) => {
    if (isSwipingOut) return;
    setIsDragging(false);
    setIsSwipingOut(true);
    setDragX(direction * SWIPE_OUT_DISTANCE);
    if (swipeTimeoutRef.current) {
      clearTimeout(swipeTimeoutRef.current);
    }
    swipeTimeoutRef.current = setTimeout(() => {
      rotateDeck();
      setDragX(0);
      setIsSwipingOut(false);
      dragStartXRef.current = null;
    }, SWIPE_ANIMATION_MS);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("a,button") || isSwipingOut) return;
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setDragX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null || isSwipingOut) return;
    setDragX(event.clientX - dragStartXRef.current);
  };

  const handlePointerEnd = () => {
    if (dragStartXRef.current === null || isSwipingOut) return;
    const direction = dragX >= 0 ? 1 : -1;
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      completeSwipe(direction);
      return;
    }
    dragStartXRef.current = null;
    setIsDragging(false);
    setDragX(0);
  };

  const activeDeckTheme = HEART_BOARD_CARD_THEMES[activeOriginalIndex % HEART_BOARD_CARD_THEMES.length];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fff8f4_0%,#fff5f7_48%,#fffaf6_100%)] pb-8">
      <header className="relative border-b border-[#f0e6e0]/90 bg-gradient-to-b from-[#fffbf9] to-[#fff8f6] px-6 pb-8 pt-4">
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/me"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/65 text-lg text-[#6d4f45] shadow-sm backdrop-blur"
          >
            ←
          </Link>
          <span className="pointer-events-none h-7 w-7" />
          <div className="flex items-center gap-2 text-[#6d4f45]">
            <button
              type="button"
              aria-label="更多"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-xs shadow-sm backdrop-blur"
            >
              ...
            </button>
            <button
              type="button"
              aria-label="分享"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-sm shadow-sm backdrop-blur"
            >
              ↗
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-7 max-w-md text-center">
          <h1 className="text-[1.375rem] font-semibold leading-snug tracking-tight text-[var(--xhs-red)] [text-shadow:0_1px_1px_rgba(255,255,255,0.92),0_2px_10px_rgba(255,36,66,0.32),0_5px_28px_rgba(255,36,66,0.42)] sm:text-2xl sm:leading-tight">
            本周心动
          </h1>
          <p className="mx-auto mt-2.5 max-w-[18rem] text-[13px] font-normal leading-relaxed text-zinc-600">
            根据你本周点亮的内容生成
          </p>
        </div>
      </header>

      <section className="px-5 pb-3 pt-2">
        <div className="relative overflow-hidden rounded-[28px] border border-white/75 bg-[linear-gradient(135deg,#fff7f8_0%,#fff_52%,#fff1f3_100%)] px-5 py-3 shadow-[0_14px_32px_rgba(242,85,75,0.10)]">
          <span className="pointer-events-none absolute -right-8 top-2 h-28 w-28 rounded-full bg-[#ffd6dc]/55 blur-3xl" />
          <span className="pointer-events-none absolute right-8 top-8 text-4xl text-[#f2554b]/16">♡</span>
          <span className="pointer-events-none absolute right-20 bottom-5 h-1.5 w-20 -rotate-6 rounded-full bg-[#f2554b]/20" />
          <span className="relative inline-flex items-center gap-1 rounded-full bg-[#f2554b] px-2 py-0.5 text-[9px] font-semibold text-white shadow-[0_6px_14px_rgba(242,85,75,0.18)]">
            ❤ AI 回顾
          </span>

          <p className="relative mt-3 text-[15px] font-semibold leading-none text-[#3f302c]">
            本周你点亮了 <span className="text-[19px] font-black text-[#f2554b]">{heartedPosts.length}</span> 次心动
          </p>
          <p className="relative mt-1.5 text-[11px] text-[#6d5a52]">
            AI 整理出 <span className="font-bold text-[#f2554b]">{directionCount}</span> 个兴趣方向
          </p>
          <button
            type="button"
            onClick={handleRegenerateWithGemini}
            disabled={isRegenerating || heartedPosts.length === 0}
            className="relative mt-3 inline-flex items-center gap-1 rounded-full border border-[#f3c8c9] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#f2554b] shadow-[0_8px_18px_rgba(242,85,75,0.10)] disabled:opacity-60"
          >
            <span>↻</span>
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
        <section className="px-5 pt-3">
          <div
            className={`mx-auto w-full touch-pan-y select-none ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{ transform: `translateX(${dragX}px)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <HeartBoardCard
              category={activeCategory}
              isInsightExpanded={expandedInsightCardId === activeCategory.id}
              themeIndex={heartBoard.categories.findIndex((entry) => entry.id === activeCategory.id)}
              onToggleInsight={() =>
                setExpandedInsightCardId((current) => (current === activeCategory.id ? null : activeCategory.id))
              }
            />
          </div>

          <div className="mt-6 flex flex-col items-center px-2 pb-1">
            <div className="mx-auto inline-flex max-w-full items-center justify-center gap-x-1 px-1 sm:gap-x-1.5">
              <span
                className="pointer-events-none shrink-0 -translate-x-1.5 -translate-y-1 transition-colors duration-300 ease-out"
                style={{ color: activeDeckTheme.accent }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-[0.9]"
                  aria-hidden="true"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <div className="min-w-0 shrink text-center">
                <p className="text-[12px] font-normal leading-relaxed tracking-[0.03em] text-[#6b5d56]">
                  左右滑动发现更多心动
                </p>
                <span
                  className="mx-auto mt-2 block h-0.5 w-10 rounded-full opacity-[0.4] transition-colors duration-300 ease-out"
                  style={{ backgroundColor: activeDeckTheme.accent }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              {heartBoard.categories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  aria-label={`切换到${category.title}`}
                  onClick={() => rotateToCategory(category.id)}
                  className={`h-2 shrink-0 rounded-full transition-[width,background-color] duration-300 ease-out ${
                    index === activeOriginalIndex
                      ? "w-[20px] sm:w-[22px]"
                      : "w-2 bg-[#D9D2CF] hover:bg-[#cec6c3]"
                  }`}
                  style={
                    index === activeOriginalIndex ? { backgroundColor: activeDeckTheme.accent } : undefined
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
