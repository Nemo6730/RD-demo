import Link from "next/link";
import { foundationDetail } from "@/data/mockHeartBoard";

export function HeartBoardDetail() {
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
            style={{ backgroundImage: `url(${foundationDetail.heroImage})` }}
          />
          <div className="space-y-3 p-4">
            <h1 className="text-4xl font-black text-zinc-900">{foundationDetail.title}</h1>
            <p className="text-sm text-zinc-500">本周心动 {foundationDetail.weekCount} 篇</p>
            <div className="rounded-2xl border border-[#f0d8cc] bg-white p-3">
              <p className="text-sm text-zinc-700">{foundationDetail.insight}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 px-4 pt-4">
        <h2 className="text-lg font-semibold text-zinc-900">高频产品</h2>
        {foundationDetail.products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="flex gap-3 p-3">
              <div
                className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-base font-semibold text-zinc-900">{product.name}</p>
                <p className="text-xs text-zinc-500">被提到 {product.mentions} 次</p>
                <div className="flex flex-wrap gap-1">
                  {product.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2 border-t border-zinc-100 px-3 py-3 text-sm">
              <p className="text-zinc-700">
                <span className="font-semibold">优点摘要：</span>
                {product.pros}
              </p>
              <p className="text-zinc-700">
                <span className="font-semibold">真实提醒：</span>
                {product.reminder}
              </p>
              <Link href={product.sourceLink} className="inline-flex text-sm text-[var(--xhs-red)]">
                相关原帖
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="px-4 pt-5">
        <h2 className="text-lg font-semibold text-zinc-900">评论摘要</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {foundationDetail.commentSummary.map((item) => (
            <span key={item} className="rounded-full bg-white px-3 py-1 text-sm text-zinc-700 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="px-4 pt-5">
        <h2 className="text-lg font-semibold text-zinc-900">原帖来源</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {foundationDetail.sourcePosts.map((post) => (
            <Link key={post.id} href={post.href} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div
                className="h-24 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${post.cover})` }}
              />
              <div className="space-y-1 p-2">
                <p className="line-clamp-2 text-xs text-zinc-800">{post.title}</p>
                <p className="text-[11px] text-zinc-500">@{post.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
