import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeartBoardItem } from "@/data/mockHeartBoard";
import { getPostExcerpt, getPostsByIds } from "@/data/mockPosts";

type SourcesPageProps = {
  params: Promise<{ categoryId: string; itemId: string }>;
};

export default async function ItemSourcesPage({ params }: SourcesPageProps) {
  const { categoryId, itemId } = await params;
  const found = getHeartBoardItem(categoryId, itemId);

  if (!found) notFound();

  const { category, item } = found;
  const sourcePath = `/heart-board/${category.slug}/sources/${item.id}`;
  const sourcePosts = getPostsByIds(item.sourcePostIds);

  return (
    <main className="min-h-screen bg-[#f8f5f3] pb-8">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#f0dfd6] bg-[#f8f5f3]/95 px-4 py-3 backdrop-blur">
        <Link href={`/heart-board/${category.slug}`} className="text-2xl text-zinc-800">
          ←
        </Link>
        <h1 className="text-lg font-semibold text-zinc-900">相关帖子</h1>
        <button type="button" className="text-lg text-zinc-600">
          ...
        </button>
      </header>

      <section className="px-4 pt-4">
        <div className="rounded-2xl border border-[#efddd4] bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-700">
            AI 根据这些心动笔记，总结出「{item.title}」这个心动要点。
          </p>
          <p className="mt-2 text-xs text-zinc-500">关联笔记 {sourcePosts.length} 篇</p>
        </div>
      </section>

      <section className="space-y-3 px-4 pt-4">
        {sourcePosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}?from=${encodeURIComponent(sourcePath)}`}
            className="block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="flex">
              <div
                className="h-28 w-28 shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.coverImage})` }}
              />
              <div className="min-w-0 flex-1 space-y-2 p-3">
                <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{post.title}</p>
                <p className="line-clamp-2 text-xs text-zinc-600">{getPostExcerpt(post)}</p>
                <p className="text-xs text-zinc-500">@{post.authorName}</p>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>♡ {post.likeCount}</span>
                  <span>☆ {post.collectCount}</span>
                  <span>💬 {post.comments.length || post.commentCount}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
