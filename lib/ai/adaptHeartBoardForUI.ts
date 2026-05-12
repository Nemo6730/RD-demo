import type { MockPost } from "@/data/mockPosts";
import type { HeartBoard, HeartBoardCategory, HeartBoardItem } from "@/data/mockHeartBoard";
import type { AIHeartBoard, AIHeartBoardCategory, AIHeartBoardItem } from "@/lib/ai/heartBoardSchema";

function toItemType(itemType?: string): HeartBoardItem["type"] {
  const normalized = (itemType ?? "").toLowerCase();
  if (normalized.includes("product") || normalized.includes("粉底") || normalized.includes("美妆")) return "product";
  if (normalized.includes("restaurant") || normalized.includes("餐厅")) return "restaurant";
  if (normalized.includes("destination") || normalized.includes("旅行")) return "destination";
  if (normalized.includes("tool") || normalized.includes("工具")) return "tool";
  if (normalized.includes("style") || normalized.includes("穿搭")) return "style";
  if (normalized.includes("lifestyle") || normalized.includes("生活")) return "lifestyle";
  return "other";
}

function toCategoryType(categoryType?: string): HeartBoardItem["type"] {
  return toItemType(categoryType);
}

function normalizeSourcePostIds(ids: string[] | undefined, validIds: Set<string>): string[] {
  return Array.from(new Set((ids ?? []).filter((id) => validIds.has(id))));
}

function mapAIItemToHeartBoardItem(
  item: AIHeartBoardItem,
  category: AIHeartBoardCategory,
  postsById: Map<string, MockPost>,
  validIds: Set<string>,
): HeartBoardItem | null {
  const sourcePostIds = normalizeSourcePostIds(item.sourcePostIds, validIds);
  if (sourcePostIds.length === 0) return null;
  const coverPost = postsById.get(sourcePostIds[0]);

  return {
    id: item.id,
    title: item.title,
    type: toItemType(item.itemType),
    image: coverPost?.coverImage ?? postsById.get(category.coverPostId)?.coverImage ?? "",
    mentionCount: sourcePostIds.length,
    sourcePostCount: sourcePostIds.length,
    latestHeartedAt: coverPost?.heartedAt,
    keywords: (item.keywords ?? []).slice(0, 3),
    summary: item.summary,
    reminder: item.riskSignals?.length ? `注意：${item.riskSignals.slice(0, 2).join("、")}` : undefined,
    sourcePostIds,
  };
}

function mapAICategoryToHeartBoardCategory(
  category: AIHeartBoardCategory,
  postsById: Map<string, MockPost>,
  validIds: Set<string>,
): HeartBoardCategory | null {
  const sourcePostIds = normalizeSourcePostIds(category.sourcePostIds, validIds);
  if (sourcePostIds.length === 0) return null;

  const items = (category.items ?? [])
    .map((item) => mapAIItemToHeartBoardItem(item, category, postsById, validIds))
    .filter((item): item is HeartBoardItem => Boolean(item))
    .slice(0, 3);
  if (items.length === 0) return null;

  const coverPost =
    postsById.get(category.coverPostId) ??
    postsById.get(sourcePostIds[0]) ??
    postsById.get(items[0]?.sourcePostIds[0] ?? "");

  return {
    id: category.id,
    slug: category.slug,
    title: category.title,
    type: toCategoryType(category.categoryType),
    coverImage: coverPost?.coverImage ?? "",
    postCount: sourcePostIds.length,
    insight: category.insight,
    keywords: (category.keywords ?? []).slice(0, 3),
    representativeItems:
      category.representativeItems && category.representativeItems.length > 0
        ? category.representativeItems.slice(0, 3)
        : items.map((item) => item.title).slice(0, 3),
    commentSummary: [],
    items,
    sourcePostIds,
  };
}

function isUIHeartBoardShape(board: unknown): board is HeartBoard {
  if (!board || typeof board !== "object") return false;
  const categories = (board as { categories?: unknown }).categories;
  if (!Array.isArray(categories)) return false;
  if (categories.length === 0) return true;
  const first = categories[0] as Record<string, unknown>;
  return typeof first.coverImage === "string" && Array.isArray(first.items);
}

export function adaptHeartBoardForUI(board: HeartBoard | AIHeartBoard, posts: MockPost[], weekId: string): HeartBoard {
  if (isUIHeartBoardShape(board)) return board;

  const postsById = new Map(posts.map((post) => [post.id, post]));
  const validIds = new Set(posts.map((post) => post.id));
  const categories = (board.categories ?? [])
    .map((category) => mapAICategoryToHeartBoardCategory(category, postsById, validIds))
    .filter((category): category is HeartBoardCategory => Boolean(category))
    .slice(0, 4);

  return {
    id: board.id || `heart-board-${weekId}`,
    weekRange: board.weekRange || weekId,
    totalHeartCount: posts.length,
    summary: board.summary || "AI 已为你整理本周灵感。",
    categories,
  };
}
