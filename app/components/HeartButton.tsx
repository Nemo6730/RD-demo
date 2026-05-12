"use client";

import { useEffect, useMemo, useState } from "react";
import { isPostHearted, removeHeartAction, saveHeartAction } from "@/lib/heartStorage";

type HeartButtonProps = {
  postId: string;
  defaultHearted?: boolean;
  onStateChange?: (hearted: boolean) => void;
};

export function HeartButton({ postId, defaultHearted = false, onStateChange }: HeartButtonProps) {
  const initialHearted = useMemo(() => isPostHearted(postId, defaultHearted), [postId, defaultHearted]);
  const [hearted, setHearted] = useState(initialHearted);

  useEffect(() => {
    setHearted(isPostHearted(postId, defaultHearted));
  }, [postId, defaultHearted]);

  const handleClick = () => {
    const next = !hearted;
    if (next) {
      saveHeartAction(postId);
    } else {
      removeHeartAction(postId);
    }
    setHearted(next);
    onStateChange?.(next);
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
      <span className="text-base leading-none">✨</span>
      <span className="text-xs">{hearted ? "已心动" : "心动"}</span>
    </button>
  );
}
