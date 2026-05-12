import type { HeartBoard } from "@/data/mockHeartBoard";

type CachedHeartBoardPayload = {
  weekId: string;
  postIds: string[];
  heartBoard: HeartBoard;
};

function getCacheKey(weekId: string): string {
  return `heart-board-generated-${weekId}`;
}

export function saveGeneratedHeartBoard(weekId: string, postIds: string[], heartBoard: HeartBoard) {
  if (typeof window === "undefined") return;
  const payload: CachedHeartBoardPayload = {
    weekId,
    postIds: [...new Set(postIds)].sort(),
    heartBoard,
  };
  window.localStorage.setItem(getCacheKey(weekId), JSON.stringify(payload));
}

/**
 * 读取本周已生成的灵感板缓存。
 * - 不传 `postIds`：不校验帖子列表，点亮/取消后仍沿用上次生成结果，直至再次「用 AI 生成」。
 * - 传入 `postIds`：仅在列表与缓存写入时一致时返回（旧行为，供需要严格对齐的场景）。
 */
export function loadGeneratedHeartBoard(weekId: string, postIds?: string[]): HeartBoard | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(getCacheKey(weekId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachedHeartBoardPayload;
    if (postIds !== undefined) {
      const expectedPostIds = [...new Set(postIds)].sort();
      const cachedPostIds = [...new Set(parsed.postIds ?? [])].sort();
      if (expectedPostIds.join(",") !== cachedPostIds.join(",")) return null;
    }
    return parsed.heartBoard;
  } catch {
    return null;
  }
}

export function clearGeneratedHeartBoard(weekId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getCacheKey(weekId));
}
