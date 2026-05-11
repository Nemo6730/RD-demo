"use client";

import { useMemo, useState } from "react";
import { isPostHearted, setPostHearted } from "@/lib/heartStorage";

type HeartButtonProps = {
  postId: string;
  onHearted?: () => void;
};

export function HeartButton({ postId, onHearted }: HeartButtonProps) {
  const initialHearted = useMemo(() => isPostHearted(postId), [postId]);
  const [hearted, setHearted] = useState(initialHearted);

  const handleClick = () => {
    if (hearted) return;
    const next = true;
    setHearted(next);
    setPostHearted(postId, next);
    onHearted?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 text-sm transition-transform active:scale-95 ${
        hearted ? "text-[var(--xhs-red)]" : "text-zinc-400"
      }`}
      aria-label="心动"
    >
      <span className="text-lg leading-none">{hearted ? "♥" : "♡"}</span>
      <span className="text-xs">{hearted ? "已心动" : "心动"}</span>
    </button>
  );
}
