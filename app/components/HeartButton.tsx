"use client";

import { useEffect, useMemo, useState } from "react";
import { PawPrint } from "lucide-react";
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
        aria-label="该笔记不参与本周爪印"
      >
        <PawPrint className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        <span className="text-xs">留个爪</span>
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
      aria-label={hearted ? "已留爪" : "留个爪"}
    >
      <PawPrint
        className={`h-4 w-4 shrink-0 transition-transform duration-150 ease-out ${hearted ? "scale-[1.05]" : ""}`}
        strokeWidth={2}
        fill={hearted ? "currentColor" : "none"}
        aria-hidden
      />
      <span className="text-xs">{hearted ? "已留爪" : "留个爪"}</span>
    </button>
  );
}
