import Link from "next/link";
import type { HeartBoardCategory } from "@/data/mockHeartBoard";

type HeartBoardCardProps = {
  category: HeartBoardCategory;
};

export function HeartBoardCard({ category }: HeartBoardCardProps) {
  const representativeItems =
    category.representativeItems && category.representativeItems.length > 0
      ? category.representativeItems
      : category.items.slice(0, 3).map((item) => item.title);

  return (
    <article className="flex h-[480px] w-[84%] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-[#f2ddd3] bg-[#fffaf7] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      <div
        className="h-44 w-full rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${category.coverImage})` }}
      />
      <div className="flex flex-1 flex-col gap-3 px-1 pb-1 pt-3">
        <div className="text-left">
          <p className="min-h-[56px] text-xl font-black leading-7 text-zinc-900 line-clamp-2">
            {category.title}
          </p>
          <p className="text-xs text-zinc-500">本周心动 {category.postCount} 篇</p>
        </div>

        <div className="space-y-1 text-left">
          <p className="text-xs font-medium text-zinc-600">AI 洞察：</p>
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-sm text-zinc-700">{category.insight}</p>
          </div>
        </div>

        <div className="space-y-2 text-left">
          <p className="text-xs font-medium text-zinc-600">心动关键词：</p>
          <div className="flex flex-wrap gap-2">
            {category.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[#f3d5d0] bg-white px-2 py-1 text-xs text-zinc-700"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-left">
          <p className="text-xs font-medium text-zinc-600">代表内容：</p>
          <p className="text-xs text-zinc-600">{representativeItems.join(" · ")}</p>
        </div>

        <div className="mt-auto">
          <Link
            href={`/heart-board/${category.slug}`}
            className="inline-flex rounded-full bg-[var(--xhs-red)] px-4 py-2 text-sm font-medium text-white"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
