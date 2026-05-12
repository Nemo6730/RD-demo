"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeartBoard } from "@/data/mockHeartBoard";
import { getPostExcerpt } from "@/data/mockPosts";
import { getActiveHeartboardPosts } from "@/data/testDatasets";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";
import { loadGeneratedHeartBoard } from "@/lib/heartBoardCache";
import { getCurrentWeekId, getMergedHeartedPosts } from "@/lib/heartStorage";

type HeartBoardSourcesClientPageProps = {
  categoryId: string;
  itemId: string;
};

function normalizeItemId(id: string): string {
  return decodeURIComponent(id).trim().toLowerCase();
}

export function HeartBoardSourcesClientPage({ categoryId, itemId }: HeartBoardSourcesClientPageProps) {
  const activePosts = getActiveHeartboardPosts();
  const weekId = getCurrentWeekId(new Date());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#f8f5f3] p-4">
        <div className="rounded-3xl border border-[#f1dfd7] bg-white px-5 py-7 text-center">
          <p className="text-sm text-zinc-600">正在同步本周灵感内容...</p>
        </div>
      </main>
    );
  }

  const heartedPosts = getMergedHeartedPosts(activePosts, weekId);
  const fallbackHeartBoard = generateMockHeartBoardFromPosts(heartedPosts, weekId);
  const cachedHeartBoard = loadGeneratedHeartBoard(weekId) ?? null;
  const heartBoard: HeartBoard = cachedHeartBoard ?? fallbackHeartBoard;
  const category = heartBoard.categories.find((entry) => entry.slug === categoryId || entry.id === categoryId);
  const normalizedItemId = normalizeItemId(itemId);
  const item = category?.items.find((entry) => normalizeItemId(entry.id) === normalizedItemId);

  if (!category || !item) {
    return (
      <main className="min-h-screen bg-[#f8f5f3] p-4">
        <div className="rounded-3xl border border-[#f1dfd7] bg-white px-5 py-7 text-center">
          <h1 className="text-lg font-semibold text-zinc-900">当前要点暂无相关帖子</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">点亮更多内容后，这里会自动补充本周相关原帖。</p>
          <Link
            href="/heart-board"
            className="mt-5 inline-flex rounded-full bg-[var(--xhs-red)] px-4 py-2 text-sm font-medium text-white"
          >
            返回本周灵感
          </Link>
        </div>
      </main>
    );
  }

  const sourcePath = `/heart-board/${category.slug}/sources/${item.id}`;
  const sourcePostIdSet = new Set(item.sourcePostIds);
  const sourcePosts = heartedPosts.filter((post) => sourcePostIdSet.has(post.id));

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
          <p className="text-sm text-zinc-700">AI 根据这些灵感笔记，总结出「{item.title}」这个灵感要点。</p>
          <p className="mt-2 text-xs text-zinc-500">关联笔记 {sourcePosts.length} 篇</p>
        </div>
      </section>

      <section className="space-y-3 px-4 pt-4">
        {sourcePosts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            暂时没有找到相关原帖
          </div>
        ) : null}
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
