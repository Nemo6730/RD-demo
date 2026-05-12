import Link from "next/link";
import type { HeartBoardCategory } from "@/data/mockHeartBoard";

type HeartBoardCardProps = {
  category: HeartBoardCategory;
  isInsightExpanded: boolean;
  onToggleInsight: () => void;
  themeIndex: number;
};

const cardThemes = [
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
  const representativeItems =
    category.representativeItems && category.representativeItems.length > 0
      ? category.representativeItems
      : category.items.slice(0, 3).map((item) => item.title);
  const visibleKeywords = category.keywords.slice(0, 3);
  const visibleItems = representativeItems.slice(0, 3);
  const shouldShowInsightToggle = category.insight.trim().length > 52;
  const theme = cardThemes[themeIndex % cardThemes.length];

  return (
    <article className="flex h-[470px] w-full flex-col overflow-hidden rounded-[26px] border border-white/80 bg-[#fffdfb] p-2 pb-3 shadow-[0_18px_36px_rgba(95,53,44,0.16)]">
      <div
        className="mx-auto h-[138px] w-[92%] shrink-0 rounded-[20px] bg-cover bg-center"
        style={{ backgroundImage: `url(${category.coverImage})` }}
      />
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-2 pt-1.5">
        <div className="shrink-0 text-left">
          <div className="space-y-1">
            <p className="line-clamp-2 text-[16px] font-black leading-5 text-zinc-950">{category.title}</p>
            <span
              className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              本周心动 {category.postCount} 篇
            </span>
          </div>
        </div>

        <div className="hide-scrollbar mt-1 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          <div className="rounded-2xl p-2 text-left" style={{ backgroundColor: theme.accentSofter }}>
            <p className="mb-1 text-[10px] font-semibold" style={{ color: theme.accent }}>
              AI 洞察
            </p>
            <p
              className={`text-[10px] leading-4 text-zinc-700 ${
                isInsightExpanded ? "max-h-[82px] overflow-y-auto pr-1" : "line-clamp-3"
              }`}
            >
              {category.insight}
            </p>
            {shouldShowInsightToggle ? (
              <button
                type="button"
                onClick={onToggleInsight}
                className="mt-1 text-[10px] font-medium"
                style={{ color: theme.accent }}
              >
                {isInsightExpanded ? "收起" : "展开"}
              </button>
            ) : null}
          </div>

          {visibleKeywords.length > 0 ? (
            <div className="space-y-0.5 text-left">
              <p className="text-[10px] font-medium text-zinc-500">心动关键词</p>
              <div className="flex flex-wrap gap-1">
                {visibleKeywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-[#f7f0ec] px-2 py-0.5 text-[10px] text-zinc-700">
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-0.5 text-left">
            <p className="text-[10px] font-medium text-zinc-500">代表内容</p>
            <p className="line-clamp-2 text-[10px] leading-[15px] text-zinc-700">{visibleItems.join(" ｜ ")}</p>
          </div>
        </div>

        <div className="relative z-50 mt-1 flex shrink-0 justify-end pb-0.5 pt-1">
          <Link
            href={`/heart-board/${category.slug}`}
            className="relative z-50 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
            style={{ backgroundColor: theme.accent, boxShadow: `0 8px 18px ${theme.shadow}` }}
          >
            查看详情 <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
