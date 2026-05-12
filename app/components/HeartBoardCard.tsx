import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { HeartBoardCategory } from "@/data/mockHeartBoard";
import { getHeartBoardCardTheme } from "@/lib/heartBoardCardThemes";
import { getCategoryLiveAccumulationCount } from "@/lib/heartBoardLiveMetrics";

type HeartBoardCardProps = {
  category: HeartBoardCategory;
  isInsightExpanded: boolean;
  onToggleInsight: () => void;
  themeIndex: number;
  /** 与 `category.sourcePostIds` 求交，用于「本周积累」随点亮/取消即时更新（卡片其余内容仍可来自缓存） */
  liveHeartedPostIds?: ReadonlySet<string>;
};

/** Re-export：与 `HeartBoardCard` 同路径引用时仍可使用 */
export { HEART_BOARD_CARD_THEMES } from "@/lib/heartBoardCardThemes";

export function HeartBoardCard({
  category,
  isInsightExpanded,
  onToggleInsight,
  themeIndex,
  liveHeartedPostIds,
}: HeartBoardCardProps) {
  const insightBodyRef = useRef<HTMLParagraphElement>(null);
  const [insightOverflows, setInsightOverflows] = useState(false);
  const representativeItems =
    category.representativeItems && category.representativeItems.length > 0
      ? category.representativeItems
      : category.items.slice(0, 3).map((item) => item.title);
  const visibleKeywords = category.keywords.slice(0, 3);
  const visibleItems = representativeItems.slice(0, 3);
  const theme = getHeartBoardCardTheme(themeIndex);
  const accumulationCount = getCategoryLiveAccumulationCount(category, liveHeartedPostIds);

  useLayoutEffect(() => {
    if (isInsightExpanded) return;

    const el = insightBodyRef.current;
    if (!el) return;

    const measure = () => {
      const node = insightBodyRef.current;
      if (!node || isInsightExpanded) return;
      // Collapsed uses line-clamp-3; overflow if content extends past clamped box.
      setInsightOverflows(node.scrollHeight > node.clientHeight + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [category.insight, isInsightExpanded]);

  return (
    <article className="flex h-[clamp(560px,72vh,640px)] w-full flex-col overflow-hidden rounded-[26px] border border-white/80 bg-[#fffdfb] p-3 pb-4 shadow-[0_18px_36px_rgba(95,53,44,0.16)]">
      <div
        className="mx-auto h-[142px] w-[92%] shrink-0 rounded-[20px] bg-cover bg-center"
        style={{ backgroundImage: `url(${category.coverImage})` }}
      />
      <div className="flex min-h-0 flex-1 flex-col px-3.5 pb-3 pt-2.5 sm:px-4">
        <div className="shrink-0 text-left">
          <div className="space-y-1.5">
            <p className="line-clamp-2 text-[20px] font-black leading-[1.3] tracking-tight text-zinc-950">
              {category.title}
            </p>
            <span
              className="inline-flex rounded-full px-3 py-1 text-[12px] font-medium leading-snug"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              本周积累 {accumulationCount} 篇
            </span>
          </div>
        </div>

        <div className="hide-scrollbar touch-pan-y mt-2 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-0.5">
          <div className="rounded-2xl p-3 text-left" style={{ backgroundColor: theme.accentSofter }}>
            <p className="mb-1.5 text-[12px] font-semibold leading-snug" style={{ color: theme.accent }}>
              AI 洞察
            </p>
            <p
              ref={insightBodyRef}
              className={`text-[13px] leading-[1.65] text-zinc-700 ${
                isInsightExpanded ? "max-h-[128px] overflow-y-auto pr-1" : "line-clamp-3"
              }`}
            >
              {category.insight}
            </p>
            {insightOverflows ? (
              <button
                type="button"
                onClick={onToggleInsight}
                className="mt-1.5 text-[12px] font-medium leading-snug"
                style={{ color: theme.accent }}
              >
                {isInsightExpanded ? "收起" : "展开"}
              </button>
            ) : null}
          </div>

          {visibleKeywords.length > 0 ? (
            <div className="space-y-1 text-left">
              <p className="text-[12px] font-medium leading-snug text-zinc-500">灵感关键词</p>
              <div className="flex flex-wrap gap-1.5">
                {visibleKeywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-[#f7f0ec] px-3 py-1 text-[12px] leading-snug text-zinc-700">
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-1 text-left">
            <p className="text-[12px] font-medium leading-snug text-zinc-500">代表内容</p>
            <p className="line-clamp-2 text-[13px] leading-[1.55] text-zinc-700">{visibleItems.join(" ｜ ")}</p>
          </div>
        </div>

        <div className="relative z-50 mt-1.5 flex shrink-0 justify-end pb-0.5 pt-1.5">
          <Link
            href={`/heart-board/${category.slug}`}
            data-step-guide="6"
            className="relative z-50 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold leading-snug text-white"
            style={{ backgroundColor: theme.accent, boxShadow: `0 8px 18px ${theme.shadow}` }}
          >
            查看灵感详情 <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
