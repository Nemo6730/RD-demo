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

export function loadGeneratedHeartBoard(weekId: string, postIds: string[]): HeartBoard | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(getCacheKey(weekId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachedHeartBoardPayload;
    const expectedPostIds = [...new Set(postIds)].sort();
    const cachedPostIds = [...new Set(parsed.postIds ?? [])].sort();
    if (expectedPostIds.join(",") !== cachedPostIds.join(",")) return null;
    return parsed.heartBoard;
  } catch {
    return null;
  }
}

export function clearGeneratedHeartBoard(weekId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getCacheKey(weekId));
}
