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
  const visibleKeywords = category.keywords.slice(0, 4);
  const visibleItems = representativeItems.slice(0, 2);

  return (
    <article className="flex h-[500px] w-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-[#fffdfb] p-3 shadow-[0_20px_42px_rgba(95,53,44,0.16)]">
      <div
        className="h-[168px] w-full shrink-0 rounded-[22px] bg-cover bg-center"
        style={{ backgroundImage: `url(${category.coverImage})` }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-1 pb-1 pt-3">
        <div className="text-left">
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-2 text-[20px] font-black leading-6 text-zinc-950">{category.title}</p>
            <span className="mt-1 shrink-0 rounded-full bg-[#fff1f2] px-2.5 py-1 text-[11px] font-medium text-[var(--xhs-red)]">
              本周心动 {category.postCount} 篇
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#fff6f4] p-3 text-left">
          <p className="mb-1 text-[11px] font-semibold text-[#d15b66]">AI 洞察</p>
          <p className="line-clamp-2 text-[13px] leading-5 text-zinc-700">{category.insight}</p>
        </div>

        {visibleKeywords.length > 0 ? (
          <div className="space-y-1.5 text-left">
            <p className="text-[11px] font-medium text-zinc-500">心动关键词</p>
            <div className="flex flex-wrap gap-1.5">
              {visibleKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-[#f7f0ec] px-2.5 py-1 text-[11px] text-zinc-700">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-1.5 text-left">
          <p className="text-[11px] font-medium text-zinc-500">代表内容</p>
          <div className="grid gap-1.5">
            {visibleItems.map((item) => (
              <p key={item} className="rounded-2xl bg-white px-3 py-1.5 text-[12px] leading-4 text-zinc-700 shadow-sm">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="relative z-50 mt-auto flex justify-end">
          <Link
            href={`/heart-board/${category.slug}`}
            className="relative z-50 inline-flex rounded-full bg-[var(--xhs-red)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(255,36,66,0.22)]"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
