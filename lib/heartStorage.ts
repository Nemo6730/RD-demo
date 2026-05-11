const HEART_STORAGE_KEY = "heart-board-posts";

function readStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HEART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HEART_STORAGE_KEY, JSON.stringify(ids));
}

export function getHeartedPostIds(): string[] {
  return readStoredIds();
}

export function isPostHearted(postId: string): boolean {
  return readStoredIds().includes(postId);
}

export function setPostHearted(postId: string, value: boolean): boolean {
  const ids = readStoredIds();
  const hasId = ids.includes(postId);

  if (value && !hasId) {
    writeStoredIds([...ids, postId]);
    return true;
  }

  if (!value && hasId) {
    writeStoredIds(ids.filter((id) => id !== postId));
    return false;
  }

  return value ? hasId : false;
}
