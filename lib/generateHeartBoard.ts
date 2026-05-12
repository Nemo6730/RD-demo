import { getHeartedPostsByWeek, type MockPost } from "@/data/mockPosts";
import type { HeartBoard, HeartBoardCategory, HeartBoardItem } from "@/data/mockHeartBoard";

type BaseCategory = "beauty" | "restaurant" | "travel" | "study" | "lifestyle" | "misc";
type HiddenCategory = NonNullable<MockPost["hiddenCategory"]>;

const MERGED_CATEGORY_MAP: Record<HiddenCategory, BaseCategory> = {
  beauty: "beauty",
  restaurant: "restaurant",
  travel: "travel",
  study: "study",
  fashion: "lifestyle",
  lifestyle: "lifestyle",
  misc: "misc",
};

const CATEGORY_PRIORITY: BaseCategory[] = ["beauty", "restaurant", "travel", "study", "lifestyle", "misc"];

const CATEGORY_META: Record<
  BaseCategory,
  {
    id: string;
    slug: string;
    title: string;
    type: HeartBoardItem["type"];
    insight: string;
    fallbackKeyword: string;
  }
> = {
  beauty: {
    id: "cat_beauty",
    slug: "foundation",
    title: "美妆种草",
    type: "product",
    insight: "你本周偏好通勤友好、自然妆感的底妆和修容路线。",
    fallbackKeyword: "底妆",
  },
  restaurant: {
    id: "cat_restaurants",
    slug: "restaurants",
    title: "周末想去的餐厅",
    type: "restaurant",
    insight: "你收藏的餐厅更偏向适合慢聊和周末聚会的类型。",
    fallbackKeyword: "周末探店",
  },
  travel: {
    id: "cat_travel",
    slug: "travel",
    title: "旅行目的地",
    type: "destination",
    insight: "这周你心动的路线以周末短途和风景点位为主。",
    fallbackKeyword: "周末短途",
  },
  study: {
    id: "cat_study",
    slug: "study",
    title: "学习与求职灵感",
    type: "tool",
    insight: "你在学习和求职上更关注可快速落地的工具与方法。",
    fallbackKeyword: "学习效率",
  },
  lifestyle: {
    id: "cat_lifestyle",
    slug: "lifestyle",
    title: "生活方式灵感",
    type: "style",
    insight: "你本周的心动内容聚焦在穿搭舒适度、恢复状态和轻量生活调整。",
    fallbackKeyword: "状态恢复",
  },
  misc: {
    id: "cat_misc",
    slug: "misc",
    title: "其他零碎心动",
    type: "other",
    insight: "这些零碎心动记录了你当周的即时兴趣和灵感。",
    fallbackKeyword: "灵感碎片",
  },
};

const GENERIC_TERMS = new Set([
  "通勤",
  "分享",
  "周末",
  "推荐",
  "体验",
  "日常",
  "收藏",
  "攻略",
  "心得",
  "记录",
  "总结",
  "生活",
  "灵感",
]);

const KEYWORD_CANDIDATES: Record<BaseCategory, string[]> = {
  beauty: [
    "Dior Forever",
    "NARS Light Reflecting",
    "Chanel Les Beiges",
    "Armani Luminous Silk",
    "YSL All Hours",
    "Make Up For Ever HD Skin",
    "Laura Mercier",
    "Givenchy 四宫格散粉",
    "Romand",
    "Clio",
  ],
  restaurant: [
    "Osteria Mamma",
    "Republique",
    "Bottega Louie",
    "Marugame Monzo",
    "Little Sister DTLA",
    "Trattoria Luma",
    "Garden & Grain",
    "Kumo Sushi Bar",
    "Sunday Table",
    "Milo Pasta House",
  ],
  travel: [
    "Santa Barbara",
    "Malibu",
    "San Diego",
    "Joshua Tree",
    "Griffith Observatory",
    "Getty Center",
    "Laguna Beach",
    "Solvang",
    "Palm Springs",
    "Sunset Cove Trail",
  ],
  study: [
    "Cursor",
    "Vercel",
    "Notion",
    "Google AI Studio",
    "ChatGPT",
    "Claude",
    "LinkedIn",
    "LeetCode",
    "Tableau",
    "SQL",
    "Python",
    "简历",
    "面试",
  ],
  lifestyle: [
    "COS",
    "Aritzia",
    "Uniqlo",
    "New Balance",
    "Adidas Samba",
    "Planet Fitness",
    "Equinox",
    "Blue Bottle",
    "Philz Coffee",
    "Muji",
    "IKEA",
  ],
  misc: ["Past Lives", "Poor Things", "Before Sunrise", "Moon Archive 展览", "Sunday Radio 歌单"],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashText(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
}

function toUrlSafeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toItemId(seed: string): string {
  const safeSlug = toUrlSafeSlug(seed);
  const shortSlug = safeSlug.length > 0 ? safeSlug.slice(0, 28) : "item";
  return `${shortSlug}-${hashText(seed)}`;
}

function getPostCorpus(post: MockPost): string {
  const comments = post.comments.map((entry) => entry.content).join(" ");
  return `${post.title} ${post.content} ${post.tags.join(" ")} ${comments}`;
}

function matchesKeyword(post: MockPost, keyword: string): boolean {
  const corpus = getPostCorpus(post).toLowerCase();
  return corpus.includes(keyword.toLowerCase());
}

function pickTopSpecificTags(posts: MockPost[], limit: number): string[] {
  const counter = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const key = tag.trim();
      if (!key) return;
      if (GENERIC_TERMS.has(key)) return;
      if (key.length <= 1) return;
      counter.set(key, (counter.get(key) ?? 0) + 1);
    });
  });
  return [...counter.entries()]
    .sort((a, b) => (b[1] === a[1] ? a[0].localeCompare(b[0], "zh-CN") : b[1] - a[1]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function buildStudyItemTitle(keyword: string): string {
  const lower = keyword.toLowerCase();
  if (lower.includes("cursor")) return "Cursor 做 demo";
  if (lower.includes("vercel")) return "Vercel 部署";
  if (keyword.includes("简历") || keyword.includes("面试")) return "简历与面试准备";
  return keyword;
}

function buildLifestyleItemTitle(keyword: string): string {
  const lower = keyword.toLowerCase();
  if (["cos", "aritzia", "uniqlo", "new balance", "adidas samba"].some((name) => lower.includes(name))) {
    return "通勤穿搭";
  }
  if (["planet fitness", "equinox"].some((name) => lower.includes(name))) {
    return "健身恢复计划";
  }
  if (["blue bottle", "philz coffee"].some((name) => lower.includes(name))) {
    return "咖啡店学习";
  }
  return keyword;
}

function buildItemTitle(category: BaseCategory, keyword: string): string {
  if (category === "study") return buildStudyItemTitle(keyword);
  if (category === "lifestyle") return buildLifestyleItemTitle(keyword);
  return keyword;
}

function extractItemKeywords(posts: MockPost[], category: BaseCategory): string[] {
  const candidateCounts = new Map<string, number>();
  KEYWORD_CANDIDATES[category].forEach((keyword) => {
    const count = posts.filter((post) => matchesKeyword(post, keyword)).length;
    if (count > 0) candidateCounts.set(keyword, count);
  });

  const rankedCandidates = [...candidateCounts.entries()]
    .sort((a, b) => (b[1] === a[1] ? a[0].localeCompare(b[0], "zh-CN") : b[1] - a[1]))
    .map(([keyword]) => keyword);

  if (rankedCandidates.length > 0) return rankedCandidates.slice(0, 3);

  return pickTopSpecificTags(posts, 3);
}

function buildCategoryItems(posts: MockPost[], category: HeartBoardCategory, categoryKey: BaseCategory): HeartBoardItem[] {
  const candidateKeywords = extractItemKeywords(posts, categoryKey);
  const itemMap = new Map<string, HeartBoardItem>();

  candidateKeywords.forEach((keyword, index) => {
    const sourcePosts = posts.filter((post) => matchesKeyword(post, keyword));
    const sourcePostIds = [...new Set(sourcePosts.map((post) => post.id))];
    if (sourcePostIds.length === 0) return;

    const itemTitle = buildItemTitle(categoryKey, keyword);
    const dedupeSeed = itemTitle || keyword;
    const itemId = toItemId(`${category.slug}-${dedupeSeed}`) || `${category.slug}-item-${index + 1}`;
    const itemKeywords = pickTopSpecificTags(sourcePosts, 3);
    const existing = itemMap.get(itemId);

    if (existing) {
      const mergedIds = [...new Set([...existing.sourcePostIds, ...sourcePostIds])];
      const mergedKeywords = [...new Set([...existing.keywords, ...itemKeywords])].slice(0, 3);
      itemMap.set(itemId, {
        ...existing,
        mentionCount: mergedIds.length,
        sourcePostIds: mergedIds,
        keywords: mergedKeywords.length > 0 ? mergedKeywords : existing.keywords,
      });
      return;
    }

    itemMap.set(itemId, {
      id: itemId,
      title: itemTitle || keyword,
      type: category.type,
      image: sourcePosts[0]?.coverImage ?? category.coverImage,
      mentionCount: sourcePostIds.length,
      keywords: itemKeywords.length > 0 ? itemKeywords : [keyword],
      summary: `本周有 ${sourcePostIds.length} 篇心动笔记围绕「${itemTitle || keyword}」，可作为你下一步重点关注方向。`,
      reminder: sourcePostIds.length >= 2 ? "先看最相关的 1-2 篇，执行会更快。" : undefined,
      sourcePostIds,
    });
  });

  const items = [...itemMap.values()];
  if (items.length > 0) return items.slice(0, 3);

  return [
    {
      id: `${category.slug}-focus`,
      title: `${category.title}本周重点`,
      type: category.type,
      image: category.coverImage,
      mentionCount: posts.length,
      keywords: category.keywords,
      summary: "AI 根据这些笔记整理出本类心动内容。",
      reminder: "建议先从最容易落地的一篇开始。",
      sourcePostIds: posts.map((post) => post.id),
    },
  ];
}

export function generateMockHeartBoardFromPosts(posts: MockPost[], weekId: string): HeartBoard {
  // 当前使用 hiddenCategory + tags 模拟 AI 聚类。
  // 未来接入 OpenAI / Gemini 后，会把 heartedPosts 的 title/content/tags/comments 传入模型，
  // 由模型返回 categories、items、sourcePostIds 和 summaries。
  const heartedPostsThisWeek = getHeartedPostsByWeek(posts, weekId);
  const grouped = new Map<BaseCategory, MockPost[]>();

  heartedPostsThisWeek.forEach((post) => {
    const category = MERGED_CATEGORY_MAP[post.hiddenCategory ?? "misc"];
    const current = grouped.get(category) ?? [];
    grouped.set(category, [...current, post]);
  });

  const categories: HeartBoardCategory[] = [...grouped.entries()]
    .map(([categoryKey, categoryPosts]) => {
      const meta = CATEGORY_META[categoryKey];
      const sortedByHeartedTime = [...categoryPosts].sort((a, b) => {
        const aTime = a.heartedAt ? new Date(a.heartedAt).getTime() : 0;
        const bTime = b.heartedAt ? new Date(b.heartedAt).getTime() : 0;
        return bTime - aTime;
      });
      const keywords = pickTopSpecificTags(sortedByHeartedTime, 3);
      const resolvedKeywords = keywords.length > 0 ? keywords : [meta.fallbackKeyword];
      const coverImage = sortedByHeartedTime[0]?.coverImage ?? categoryPosts[0]?.coverImage ?? "";
      const sourcePostIds = [...new Set(categoryPosts.map((post) => post.id))];
      const latestHeartedAt = sortedByHeartedTime[0]?.heartedAt
        ? new Date(sortedByHeartedTime[0].heartedAt as string).getTime()
        : 0;

      const category: HeartBoardCategory = {
        id: meta.id,
        slug: meta.slug,
        title: meta.title,
        type: meta.type,
        coverImage,
        postCount: sourcePostIds.length,
        insight: meta.insight,
        keywords: resolvedKeywords,
        commentSummary: [],
        items: [],
        sourcePostIds,
      };

      category.items = buildCategoryItems(sortedByHeartedTime, category, categoryKey)
        .filter((item) => item.sourcePostIds.length > 0)
        .slice(0, 3);
      if (category.items.length === 0 && category.sourcePostIds.length > 0) {
        category.items = [
          {
            id: `${category.slug}-collection`,
            title: "本类心动合集",
            type: category.type,
            image: category.coverImage,
            mentionCount: category.sourcePostIds.length,
            keywords: category.keywords,
            summary: "AI 根据这些笔记整理出本类心动内容。",
            sourcePostIds: category.sourcePostIds,
          },
        ];
      }

      return { category, latestHeartedAt, priority: CATEGORY_PRIORITY.indexOf(categoryKey) };
    })
    .filter(({ category }) => category.sourcePostIds.length > 0)
    .sort((a, b) => {
      if (b.category.postCount !== a.category.postCount) return b.category.postCount - a.category.postCount;
      if (b.latestHeartedAt !== a.latestHeartedAt) return b.latestHeartedAt - a.latestHeartedAt;
      return a.priority - b.priority;
    })
    .slice(0, 4)
    .map(({ category }) => category);

  return {
    id: `hb_${weekId.toLowerCase().replace("-", "_")}`,
    weekRange: weekId,
    totalHeartCount: heartedPostsThisWeek.length,
    summary:
      heartedPostsThisWeek.length > 0
        ? "这里汇总了你本周点亮的内容，后续会升级为 AI 自动聚类与总结。"
        : "本周还没有心动内容，去发现页点亮几篇后再回来看看。",
    categories,
  };
}

export async function generateHeartBoardFromPosts(
  posts: MockPost[],
  weekId: string,
): Promise<HeartBoard> {
  return generateMockHeartBoardFromPosts(posts, weekId);
}
