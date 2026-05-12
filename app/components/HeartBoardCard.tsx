import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { HeartBoardCategory } from "@/data/mockHeartBoard";

type HeartBoardCardProps = {
  category: HeartBoardCategory;
  isInsightExpanded: boolean;
  onToggleInsight: () => void;
  themeIndex: number;
};

/** 与 swipe 卡片主题一致；供心动板页指示器、提示条等复用 */
export const HEART_BOARD_CARD_THEMES = [
  {
    accent: "#FF5A6B",
    accentSoft: "#FFF1F3",
    accentSofter: "#FFF7F8",
    shadow: "rgba(255,90,107,0.22)",
  },
  {
    accent: "#F4A261",
    accentSoft: "#FFF5EC",
    accentSofter: "#FFF9F2",
    shadow: "rgba(244,162,97,0.22)",
  },
  {
    accent: "#7BAE7F",
    accentSoft: "#F2F8F2",
    accentSofter: "#F8FBF6",
    shadow: "rgba(123,174,127,0.22)",
  },
  {
    accent: "#9C8ACD",
    accentSoft: "#F6F2FB",
    accentSofter: "#FAF7FD",
    shadow: "rgba(156,138,205,0.22)",
  },
  {
    accent: "#6C9BCF",
    accentSoft: "#F0F6FC",
    accentSofter: "#F7FBFF",
    shadow: "rgba(108,155,207,0.2)",
  },
] as const;

export function HeartBoardCard({ category, isInsightExpanded, onToggleInsight, themeIndex }: HeartBoardCardProps) {
  const insightBodyRef = useRef<HTMLParagraphElement>(null);
  const [insightOverflows, setInsightOverflows] = useState(false);
  const representativeItems =
    category.representativeItems && category.representativeItems.length > 0
      ? category.representativeItems
      : category.items.slice(0, 3).map((item) => item.title);
  const visibleKeywords = category.keywords.slice(0, 3);
  const visibleItems = representativeItems.slice(0, 3);
  const theme = HEART_BOARD_CARD_THEMES[themeIndex % HEART_BOARD_CARD_THEMES.length];

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
              本周心动 {category.postCount} 篇
            </span>
          </div>
        </div>

        <div className="hide-scrollbar mt-2 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-0.5">
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
              <p className="text-[12px] font-medium leading-snug text-zinc-500">心动关键词</p>
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
            className="relative z-50 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold leading-snug text-white"
            style={{ backgroundColor: theme.accent, boxShadow: `0 8px 18px ${theme.shadow}` }}
          >
            查看详情 <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
