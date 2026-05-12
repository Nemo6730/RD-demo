import type { HeartBoardCategory, HeartBoardItem } from "@/data/mockHeartBoard";

/** 灵感要点：当前仍点亮的、且在该要点 evidence 列表中的原帖篇数 */
export function getLiveItemSourcePostCount(
  item: HeartBoardItem,
  liveHeartedPostIds?: ReadonlySet<string>,
): number {
  if (!liveHeartedPostIds) return item.sourcePostIds.length;
  return item.sourcePostIds.filter((id) => liveHeartedPostIds.has(id)).length;
}

/**
 * 「被提到」次数字：在缓存的 mentionCount 与 evidence 帖数之间按比例缩放，
 * 避免 mock 里 mention 与帖数不一致时切换点亮后数字脱节。
 */
export function getLiveItemMentionCount(
  item: HeartBoardItem,
  liveHeartedPostIds?: ReadonlySet<string>,
): number {
  if (!liveHeartedPostIds) return item.mentionCount;
  const baseLen = item.sourcePostIds.length;
  if (baseLen === 0) return 0;
  const liveLen = getLiveItemSourcePostCount(item, liveHeartedPostIds);
  return Math.max(0, Math.round((item.mentionCount * liveLen) / baseLen));
}

export function getCategoryLiveAccumulationCount(
  category: HeartBoardCategory,
  liveHeartedPostIds?: ReadonlySet<string>,
): number {
  if (!liveHeartedPostIds) return category.postCount;
  return category.sourcePostIds.filter((id) => liveHeartedPostIds.has(id)).length;
}
