import Link from "next/link";
import type { HeartBoardCategory } from "@/data/mockHeartBoard";
import { getHeartBoardCardTheme } from "@/lib/heartBoardCardThemes";
import {
  getCategoryLiveAccumulationCount,
  getLiveItemMentionCount,
  getLiveItemSourcePostCount,
} from "@/lib/heartBoardLiveMetrics";

type HeartBoardDetailProps = {
  category: HeartBoardCategory;
  /** heartBoard.categories 中的稳定下标，与滑动排序无关 */
  themeIndex: number;
  /** 顶栏副标题，如 `5.11 - 5.17 留痕瞬间` */
  weekNavLabel: string;
  /** 与分类 `sourcePostIds` 求交，「本周积累」随点亮实时变化 */
  liveHeartedPostIds?: ReadonlySet<string>;
};

export function HeartBoardDetail({
  category,
  themeIndex,
  weekNavLabel,
  liveHeartedPostIds,
}: HeartBoardDetailProps) {
  const visibleItems = category.items.filter((item) => item.sourcePostIds.length > 0);
  const theme = getHeartBoardCardTheme(themeIndex);
  const accumulationCount = getCategoryLiveAccumulationCount(category, liveHeartedPostIds);

  const pageStyle = {
    "--theme-accent": theme.accent,
    "--theme-accent-soft": theme.accentSoft,
    "--theme-accent-softer": theme.accentSofter,
    "--theme-shadow": theme.shadow,
  } as React.CSSProperties;

  const heroBorder = `color-mix(in srgb, ${theme.accent} 26%, #ead8cf)`;
  const heroShadow = `0 10px 26px color-mix(in srgb, ${theme.accent} 12%, rgba(0,0,0,0.06))`;
  const itemBorder = `color-mix(in srgb, ${theme.accent} 20%, #e4e4e7)`;
  const insightBorder = `color-mix(in srgb, ${theme.accent} 24%, #fff)`;

  return (
    <main
      className="min-h-screen pb-8"
      style={{
        ...pageStyle,
        background: `linear-gradient(180deg, ${theme.accentSoft} 0%, #f8f5f3 38%, #f8f5f3 100%)`,
      }}
    >
      <header
        className="sticky top-0 z-20 flex h-12 items-center gap-1 border-b px-2 backdrop-blur-md sm:px-3"
        style={{
          borderColor: `color-mix(in srgb, ${theme.accent} 18%, #e7e5e4)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accentSoft} 92%, #fff) 0%, color-mix(in srgb, ${theme.accentSoft} 55%, #f8f5f3) 100%)`,
        }}
      >
        <Link
          href={`/heart-board?focus=${encodeURIComponent(category.slug)}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-zinc-800 transition hover:bg-white/80"
          style={{ color: theme.accent }}
        >
          ←
        </Link>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-medium leading-snug text-zinc-600 sm:text-[15px]">
          {weekNavLabel}
        </p>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white/90 text-lg leading-none"
          style={{
            borderColor: `color-mix(in srgb, ${theme.accent} 30%, #e4e4e7)`,
            color: theme.accent,
          }}
        >
          ...
        </button>
      </header>

      <section className="px-4 pt-3">
        <div
          className="overflow-hidden rounded-3xl"
          style={{
            border: `1px solid ${heroBorder}`,
            boxShadow: heroShadow,
            background: `linear-gradient(145deg, ${theme.accentSoft} 0%, #fffaf7 48%, #ffffff 100%)`,
          }}
        >
          <div className="relative h-60 w-full">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${theme.accentSoft} 0%, #ffffff 55%)`,
              }}
            />
            <div
              className="relative z-10 h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${category.coverImage})`,
                backgroundColor: theme.accentSoft,
              }}
            />
          </div>
          <div className="space-y-3 p-4">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.625rem] sm:leading-snug">
              {category.title}
            </h1>
            <p className="text-sm font-semibold" style={{ color: theme.accent }}>
              本周标记 {accumulationCount} 个爪印
            </p>
            <div
              className="rounded-2xl p-3"
              style={{
                backgroundColor: theme.accentSofter,
                border: `1px solid ${insightBorder}`,
              }}
            >
              <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                AI 洞察
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{category.insight}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 px-4 pt-5">
        <h2 className="text-lg font-semibold text-zinc-900">出爪要点</h2>
        {visibleItems.map((item, itemIndex) => {
          const liveSourceCount = getLiveItemSourcePostCount(item, liveHeartedPostIds);
          const liveMentionCount = getLiveItemMentionCount(item, liveHeartedPostIds);
          return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
            style={{ border: `1px solid ${itemBorder}` }}
          >
            <div className="flex gap-3 p-3">
              <div
                className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundColor: theme.accentSoft,
                }}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-base font-semibold text-zinc-900">{item.title}</p>
                <p className="text-xs text-zinc-500">
                  被提到{" "}
                  <span className="font-semibold tabular-nums" style={{ color: theme.accent }}>
                    {liveMentionCount}
                  </span>{" "}
                  次
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full px-2 py-1 text-xs text-zinc-700"
                      style={{ backgroundColor: theme.accentSoft }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="space-y-2 px-3 py-3 text-sm"
              style={{ borderTop: `1px solid color-mix(in srgb, ${theme.accent} 12%, #f4f4f5)` }}
            >
              <p className="text-zinc-700">
                <span className="font-semibold text-zinc-900">要点总结：</span>
                {item.summary}
              </p>
              <Link
                href={`/heart-board/${category.slug}/sources/${item.id}`}
                className="inline-flex text-sm font-medium transition hover:opacity-85"
                style={{ color: theme.accent }}
                {...(itemIndex === 0 ? { "data-step-guide": "7" as const } : {})}
              >
                相关原帖 {liveSourceCount} 篇
              </Link>
            </div>
          </article>
        );
        })}
        {visibleItems.length === 0 ? (
          <div
            className="rounded-2xl bg-white p-4 text-sm text-zinc-600"
            style={{ border: `1px solid ${itemBorder}` }}
          >
            暂时没有找到相关原帖
          </div>
        ) : null}
      </section>
    </main>
  );
}
