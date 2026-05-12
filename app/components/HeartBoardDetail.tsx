import Link from "next/link";
import type { HeartBoardCategory } from "@/data/mockHeartBoard";

type HeartBoardDetailProps = {
  category: HeartBoardCategory;
};

export function HeartBoardDetail({ category }: HeartBoardDetailProps) {
  const visibleItems = category.items.filter((item) => item.sourcePostIds.length > 0);

  return (
    <main className="min-h-screen bg-[#f8f5f3] pb-8">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#f8f5f3]/95 px-4 py-3 backdrop-blur">
        <Link href="/heart-board" className="text-2xl text-zinc-800">
          ←
        </Link>
        <div className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-sm">心动板</div>
        <button type="button" className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-sm">
          ...
        </button>
      </header>

      <section className="px-4">
        <div className="overflow-hidden rounded-3xl border border-[#f2ddd3] bg-[#fffaf7] shadow-[0_10px_26px_rgba(0,0,0,0.08)]">
          <div
            className="h-60 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${category.coverImage})` }}
          />
          <div className="space-y-3 p-4">
            <h1 className="text-4xl font-black text-zinc-900">{category.title}</h1>
            <p className="text-sm text-zinc-500">本周心动 {category.postCount} 篇</p>
            <div className="rounded-2xl border border-[#f0d8cc] bg-white p-3">
              <p className="text-sm text-zinc-700">{category.insight}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 px-4 pt-4">
        <h2 className="text-lg font-semibold text-zinc-900">心动要点</h2>
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="flex gap-3 p-3">
              <div
                className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-base font-semibold text-zinc-900">{item.title}</p>
                <p className="text-xs text-zinc-500">被提到 {item.mentionCount} 次</p>
                <div className="flex flex-wrap gap-1">
                  {item.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2 border-t border-zinc-100 px-3 py-3 text-sm">
              <p className="text-zinc-700">
                <span className="font-semibold">要点总结：</span>
                {item.summary}
              </p>
              <Link
                href={`/heart-board/${category.slug}/sources/${item.id}`}
                className="inline-flex text-sm text-[var(--xhs-red)]"
              >
                相关原帖 {item.sourcePostIds.length} 篇
              </Link>
            </div>
          </article>
        ))}
        {visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            暂时没有找到相关原帖
          </div>
        ) : null}
      </section>

    </main>
  );
}
