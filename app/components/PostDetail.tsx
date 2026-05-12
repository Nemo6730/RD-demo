"use client";

import Link from "next/link";
import { useState } from "react";
import { getPostParagraphs, type MockPost } from "@/data/mockPosts";
import { HeartButton } from "@/app/components/HeartButton";
import { Toast } from "@/app/components/Toast";

type PostDetailProps = {
  post: MockPost;
  backHref: string;
};

export function PostDetail({ post, backHref }: PostDetailProps) {
  const [toastMessage, setToastMessage] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const imageList = post.images && post.images.length > 0 ? post.images : [post.coverImage];
  const totalCommentCount = post.comments.length > 0 ? post.comments.length : post.commentCount;
  const visibleComments = showAllComments ? post.comments : post.comments.slice(0, 5);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <main className="min-h-screen bg-white pb-24">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-[430px] border-b border-zinc-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Link href={backHref} className="text-2xl text-zinc-800">
              ←
            </Link>
            <div
              className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${post.authorAvatar})` }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">{post.authorName}</p>
              <p className="text-xs text-zinc-500">小红书号 · 已更新</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-[var(--xhs-red)] px-4 py-1 text-sm font-medium text-[var(--xhs-red)]"
            >
              关注
            </button>
            <button type="button" className="text-xl text-zinc-700" aria-label="分享">
              ↗
            </button>
          </div>
        </div>
      </header>

      <div className="pt-[62px]">
        <section className="w-full">
          <div
            className="h-[420px] w-full bg-zinc-100 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageList[0]})` }}
          />
          {imageList.length > 1 ? (
            <div className="flex items-center justify-center gap-1 py-2">
              {imageList.map((img, index) => (
                <span
                  key={`${img}-${index}`}
                  className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-[var(--xhs-red)]" : "bg-zinc-300"}`}
                />
              ))}
            </div>
          ) : null}
        </section>

        <article className="space-y-4 px-4 pb-8 pt-3">
          <h1 className="text-[20px] font-bold leading-7 text-zinc-900">{post.title}</h1>
          <div className="space-y-3">
            {getPostParagraphs(post).map((paragraph, index) => (
              <p key={`${post.id}-${index}`} className="text-[16px] leading-7 text-zinc-800">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-sm text-[#5d7292]">
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-xs text-zinc-500">{formattedDate} · Los Angeles</p>

          <section className="border-t border-zinc-100 pt-4">
            <h2 className="text-sm font-semibold text-zinc-900">共 {totalCommentCount} 条评论</h2>
            {post.comments.length > 0 ? (
              <div className="mt-3 space-y-3">
                {visibleComments.map((comment, index) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-zinc-200" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-zinc-700">{comment.userName}</p>
                        <p className="text-xs text-zinc-400">♡ {comment.likeCount}</p>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-zinc-800">{comment.content}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">第 {index + 1} 条</p>
                    </div>
                  </div>
                ))}
                {post.comments.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllComments((prev) => !prev)}
                    className="text-sm text-[#5d7292]"
                  >
                    {showAllComments ? "收起评论" : `展开全部 ${post.comments.length} 条评论`}
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">还没有评论，来说点什么吧。</p>
            )}
          </section>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] border-t border-zinc-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 flex-1 items-center rounded-full bg-zinc-100 px-3 text-sm text-zinc-500"
          >
            说点什么...
          </button>
          <div className="flex items-center gap-3 text-zinc-500">
            <button type="button" className="inline-flex items-center gap-1 text-sm">
              <span className="text-lg">♡</span>
              <span className="text-xs">{post.likeCount}</span>
            </button>
            <HeartButton
              postId={post.id}
              defaultHearted={post.isHearted}
              onStateChange={(next) => {
                if (next) {
                  setToastMessage("已加入本周心动板，AI 将自动帮你整理");
                }
              }}
            />
            <button type="button" className="inline-flex items-center gap-1 text-sm">
              <span className="text-lg">☆</span>
              <span className="text-xs">{post.collectCount}</span>
            </button>
            <button type="button" className="inline-flex items-center gap-1 text-sm">
              <span className="text-lg">💬</span>
              <span className="text-xs">{totalCommentCount}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
