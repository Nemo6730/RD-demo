"use client";

import Link from "next/link";
import { useState } from "react";
import { postDetail } from "@/data/mockPosts";
import { HeartButton } from "@/app/components/HeartButton";
import { Toast } from "@/app/components/Toast";

export function PostDetail() {
  const [toastMessage, setToastMessage] = useState("");

  return (
    <main className="min-h-screen bg-white pb-24">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl text-zinc-800">
            ←
          </Link>
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

      <article className="space-y-4 px-5 py-4">
        <h1 className="text-[34px] font-extrabold leading-[1.15] text-zinc-900">{postDetail.title}</h1>
        {postDetail.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-8 text-zinc-800">
            {paragraph}
          </p>
        ))}
        <h2 className="pt-2 text-3xl font-black leading-tight text-zinc-900">
          一、大厂为什么要推行 AI Coding 面试
        </h2>
        <p className="text-base leading-8 text-zinc-800">
          我之前跟几个 HR 同学聊过，感觉这不是企业的临时调整，之后越来越多公司都会引入 AI
          面试流程，尤其看重你在真实问题下的工具协同能力与表达能力。
        </p>
      </article>

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
              <span className="text-xs">753</span>
            </button>
            <HeartButton
              postId="1"
              onHearted={() => setToastMessage("已加入本周心动板，AI 将自动帮你整理")}
            />
            <button type="button" className="inline-flex items-center gap-1 text-sm">
              <span className="text-lg">☆</span>
              <span className="text-xs">1110</span>
            </button>
            <button type="button" className="inline-flex items-center gap-1 text-sm">
              <span className="text-lg">💬</span>
              <span className="text-xs">13</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
