"use client";

import { useEffect, useMemo, useState } from "react";
import {
  isPostEligibleForWeeklyInspiration,
  isPostHearted,
  removeHeartAction,
  saveHeartAction,
} from "@/lib/heartStorage";

type HeartButtonProps = {
  postId: string;
  defaultHearted?: boolean;
  onStateChange?: (hearted: boolean) => void;
};

export function HeartButton({ postId, defaultHearted = false, onStateChange }: HeartButtonProps) {
  const eligible = useMemo(() => isPostEligibleForWeeklyInspiration(postId), [postId]);
  const initialHearted = useMemo(() => isPostHearted(postId, defaultHearted), [postId, defaultHearted]);
  const [hearted, setHearted] = useState(initialHearted);

  useEffect(() => {
    setHearted(isPostHearted(postId, defaultHearted));
  }, [postId, defaultHearted]);

  const handleClick = () => {
    if (!eligible) return;
    const next = !hearted;
    if (next) {
      const saved = saveHeartAction(postId);
      if (!saved) return;
    } else {
      removeHeartAction(postId);
    }
    setHearted(next);
    onStateChange?.(next);
  };

  if (!eligible) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center gap-1 text-sm text-zinc-300"
        aria-label="该笔记不参与本周灵感"
      >
        <span className="text-base leading-none">✨</span>
        <span className="text-xs">灵感</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 text-sm transition-transform active:scale-95 ${
        hearted ? "text-[var(--xhs-red)]" : "text-zinc-400"
      }`}
      aria-label={hearted ? "已加灵感" : "加灵感"}
    >
      <span className="text-base leading-none">✨</span>
      <span className="text-xs">{hearted ? "已加灵感" : "加灵感"}</span>
    </button>
  );
}
