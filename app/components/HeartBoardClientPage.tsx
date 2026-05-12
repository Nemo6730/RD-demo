"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeartBoardCard } from "@/app/components/HeartBoardCard";
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
          <div className="relative h-[520px] overflow-visible pl-1 pb-8 pr-4 pt-1">
            {orderedCategories.map((category, index) => {
              const isActive = index === 0;
              const isVisible = index <= 3;
              const cardWidthClass = "w-[70%]";
              const stackedTransforms = [
                "translateX(-28px) translateY(8px) rotate(1deg) scale(1)",
                "translateX(calc(14% - 5px)) translateY(8px) rotate(1deg) scale(1)",
                "translateX(calc(28% + 14px)) translateY(8px) rotate(1deg) scale(1)",
                "translateX(calc(42% + 33px)) translateY(8px) rotate(1deg) scale(1)",
              ];
              const activeTransform = `translateX(${dragX - 28}px) translateY(8px) rotate(1deg) scale(1)`;
              const transform = isActive ? activeTransform : stackedTransforms[index] ?? stackedTransforms[3];

              return (
                <div
                  key={category.id}
                  className={`absolute left-1 top-1 ${cardWidthClass} touch-pan-y select-none ${
                    isDragging && isActive ? "" : "transition-all duration-300 ease-out"
                  } ${
                    isVisible ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  style={{
                    transform,
                    transformOrigin: "center center",
                    zIndex: isActive ? 40 : index === 1 ? 30 : index === 2 ? 20 : index === 3 ? 10 : 1,
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  onPointerDown={isActive ? handlePointerDown : undefined}
                  onPointerMove={isActive ? handlePointerMove : undefined}
                  onPointerUp={isActive ? handlePointerEnd : undefined}
                  onPointerCancel={isActive ? handlePointerEnd : undefined}
                >
                  <HeartBoardCard
                    category={category}
                    isInsightExpanded={isActive && expandedInsightCardId === category.id}
                    themeIndex={heartBoard.categories.findIndex((entry) => entry.id === category.id)}
                    onToggleInsight={() =>
                      setExpandedInsightCardId((current) => (current === category.id ? null : category.id))
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {heartBoard.categories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  aria-label={`切换到${category.title}`}
                  onClick={() => rotateToCategory(category.id)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeOriginalIndex ? "w-5 bg-[var(--xhs-red)]" : "w-2 bg-[#e8d8d1]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => completeSwipe(-1)}
              className="rounded-full border border-[#ead7cf] bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm"
            >
              左滑翻看下一张
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
