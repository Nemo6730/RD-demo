import type { MockPost } from "@/data/mockPosts";

const HEART_STORAGE_KEY = "heart-board-actions";
const UNHEART_STORAGE_KEY = "heart-board-unhearted-overrides";

export type HeartAction = {
  postId: string;
  heartedAt: string;
  weekId: string;
};

/** 不参与「本周灵感」的帖子（不可点亮、不计入统计与 AI 素材）。 */
const INSPIRATION_EXCLUDED_POST_IDS = new Set<string>(["post_profile_guess_01"]);

export function isPostEligibleForWeeklyInspiration(postId: string): boolean {
  return !INSPIRATION_EXCLUDED_POST_IDS.has(postId);
}

function inspirationEligibleActions(actions: HeartAction[]): HeartAction[] {
  return actions.filter((a) => isPostEligibleForWeeklyInspiration(a.postId));
}

function readActions(): HeartAction[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HEART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as HeartAction[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (action) =>
        Boolean(action) &&
        typeof action.postId === "string" &&
        typeof action.heartedAt === "string" &&
        typeof action.weekId === "string",
    );
  } catch {
    return [];
  }
}

function writeActions(actions: HeartAction[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HEART_STORAGE_KEY, JSON.stringify(actions));
}

function readUnheartedOverrides(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(UNHEART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeUnheartedOverrides(postIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNHEART_STORAGE_KEY, JSON.stringify(postIds));
}

export function getCurrentWeekId(date = new Date()): string {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatLocalYmd(d: Date): string {
  return `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;
}

/**
 * 导航等展示：`2026/05/04-2026/05/10 灵感积累`。
 * 按 `getCurrentWeekId` 遍历本地日历日，取同属该 weekId 的最小、最大日期。
 */
export function formatWeekRangeNavLabel(weekId: string): string {
  const m = /^(\d{4})-W(\d{1,2})$/.exec(weekId.trim());
  if (!m) return "本周 灵感积累";

  const y = parseInt(m[1], 10);
  if (!Number.isFinite(y)) return "本周 灵感积累";

  let minD: Date | null = null;
  let maxD: Date | null = null;

  const considerYear = (year: number) => {
    for (let i = 0; i < 400; i++) {
      const d = new Date(year, 0, 1 + i);
      if (d.getFullYear() !== year) break;
      if (getCurrentWeekId(d) !== weekId) continue;
      if (!minD || d.getTime() < minD.getTime()) minD = d;
      if (!maxD || d.getTime() > maxD.getTime()) maxD = d;
    }
  };

  considerYear(y - 1);
  considerYear(y);
  considerYear(y + 1);

  if (!minD || !maxD) return "本周 灵感积累";
  return `${formatLocalYmd(minD)}-${formatLocalYmd(maxD)} 灵感积累`;
}

export function getHeartActions(): HeartAction[] {
  return inspirationEligibleActions(readActions());
}

export function getStoredHeartActions(): HeartAction[] {
  return inspirationEligibleActions(readActions());
}

export function getHeartedPostIds(): string[] {
  return inspirationEligibleActions(readActions()).map((action) => action.postId);
}

export function isPostHearted(postId: string, defaultHearted = false): boolean {
  if (!isPostEligibleForWeeklyInspiration(postId)) return false;
  const unheartedOverrides = readUnheartedOverrides();
  if (unheartedOverrides.includes(postId)) return false;
  const actions = readActions();
  if (actions.some((action) => action.postId === postId)) return true;
  return defaultHearted;
}

export function getHeartedPostIdsByWeek(weekId: string): string[] {
  return inspirationEligibleActions(readActions())
    .filter((action) => {
      const resolvedWeekId = action.weekId || getCurrentWeekId(new Date(action.heartedAt));
      return resolvedWeekId === weekId;
    })
    .map((action) => action.postId);
}

export function setPostHearted(postId: string, value: boolean, date = new Date()): boolean {
  if (!isPostEligibleForWeeklyInspiration(postId)) {
    if (value) return false;
    const actions = readActions().filter((action) => action.postId !== postId);
    writeActions(actions);
    return false;
  }

  const actions = readActions();
  const actionWeekId = getCurrentWeekId(date);
  const existingIndex = actions.findIndex((action) => action.postId === postId);
  const unheartedOverrides = readUnheartedOverrides();

  if (value) {
    const nextActions =
      existingIndex >= 0
        ? actions.map((action, index) =>
            index === existingIndex
              ? { ...action, heartedAt: date.toISOString(), weekId: actionWeekId }
              : action,
          )
        : [...actions, { postId, heartedAt: date.toISOString(), weekId: actionWeekId }];
    writeActions(nextActions);
    writeUnheartedOverrides(unheartedOverrides.filter((id) => id !== postId));
    return true;
  }

  const nextActions = actions.filter((action) => action.postId !== postId);
  writeActions(nextActions);
  if (!unheartedOverrides.includes(postId)) {
    writeUnheartedOverrides([...unheartedOverrides, postId]);
  }
  return false;
}

export function saveHeartAction(postId: string): HeartAction | null {
  if (!isPostEligibleForWeeklyInspiration(postId)) return null;

  const now = new Date();
  const action: HeartAction = {
    postId,
    heartedAt: now.toISOString(),
    weekId: getCurrentWeekId(now),
  };
  const actions = readActions();
  const existingIndex = actions.findIndex((entry) => entry.postId === postId);
  const nextActions =
    existingIndex >= 0
      ? actions.map((entry, index) => (index === existingIndex ? action : entry))
      : [...actions, action];
  writeActions(nextActions);

  const unheartedOverrides = readUnheartedOverrides();
  if (unheartedOverrides.includes(postId)) {
    writeUnheartedOverrides(unheartedOverrides.filter((id) => id !== postId));
  }
  return action;
}

export function removeHeartAction(postId: string): void {
  const nextActions = readActions().filter((action) => action.postId !== postId);
  writeActions(nextActions);
  const unheartedOverrides = readUnheartedOverrides();
  if (!unheartedOverrides.includes(postId)) {
    writeUnheartedOverrides([...unheartedOverrides, postId]);
  }
}

export function getMergedHeartedPosts(posts: MockPost[], weekId: string): MockPost[] {
  const actionMap = new Map(
    inspirationEligibleActions(readActions()).map((action) => [action.postId, action]),
  );
  const unheartedOverrides = new Set(readUnheartedOverrides());

  const mergedPosts: MockPost[] = posts.map((post) => {
      if (!isPostEligibleForWeeklyInspiration(post.id)) {
        return {
          ...post,
          isHearted: false,
          heartedAt: undefined,
          weekId: undefined,
        };
      }

      const action = actionMap.get(post.id);
      if (action) {
        return {
          ...post,
          isHearted: true,
          heartedAt: action.heartedAt,
          weekId: action.weekId || getCurrentWeekId(new Date(action.heartedAt)),
        };
      }

      if (unheartedOverrides.has(post.id)) {
        return {
          ...post,
          isHearted: false,
          heartedAt: undefined,
          weekId: undefined,
        };
      }

      if (!post.isHearted || !post.heartedAt) {
        return {
          ...post,
          isHearted: false,
          heartedAt: undefined,
          weekId: undefined,
        };
      }

      return {
        ...post,
        isHearted: true,
        weekId: post.weekId ?? getCurrentWeekId(new Date(post.heartedAt)),
      };
    });

  return mergedPosts.filter((post) => {
    const heartedAt = post.heartedAt;
    if (!post.isHearted || !heartedAt) return false;
    const resolvedWeekId = post.weekId ?? getCurrentWeekId(new Date(heartedAt));
    return resolvedWeekId === weekId;
  });
}
