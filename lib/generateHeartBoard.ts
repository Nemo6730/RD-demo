import { getHeartedPostsByWeek, type MockPost } from "@/data/mockPosts";
import type { HeartBoard, HeartBoardCategory, HeartBoardItem } from "@/data/mockHeartBoard";

type BaseCategory = "beauty" | "restaurant" | "travel" | "study" | "lifestyle" | "misc";
type HiddenCategory = NonNullable<MockPost["hiddenCategory"]>;
type EntityRole = "primary" | "secondary" | "mentioned";

export type ExtractedEntity = {
  name: string;
  type: "product" | "restaurant" | "destination" | "tool" | "style" | "lifestyle" | "theme" | "other";
  postId: string;
  role: EntityRole;
  positiveSignals: string[];
  riskSignals: string[];
  scenes: string[];
  evidence: string;
  canSupportItem: boolean;
};

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
    title: "想试的轻薄底妆",
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
    title: "海边和短途旅行",
    type: "destination",
    insight: "这周你的灵感路线以周末短途和风景点位为主。",
    fallbackKeyword: "周末短途",
  },
  study: {
    id: "cat_study",
    slug: "study",
    title: "AI Demo 与求职准备",
    type: "tool",
    insight: "你在学习和求职上更关注可快速落地的工具与方法。",
    fallbackKeyword: "学习效率",
  },
  lifestyle: {
    id: "cat_lifestyle",
    slug: "lifestyle",
    title: "通勤穿搭与生活状态",
    type: "style",
    insight: "你本周的灵感内容聚焦在穿搭舒适度、恢复状态和轻量生活调整。",
    fallbackKeyword: "状态恢复",
  },
  misc: {
    id: "cat_misc",
    slug: "misc",
    title: "零碎灵感收藏",
    type: "other",
    insight: "这些零碎收藏记录了你当周的即时兴趣和灵感。",
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

const EVALUATION_KEYWORDS: Record<BaseCategory, string[]> = {
  beauty: ["轻薄", "持妆", "不卡粉", "暗沉", "遮瑕", "干皮", "混油", "妆感", "色号"],
  restaurant: ["好吃", "环境", "排队", "预约", "停车", "人均", "服务", "氛围", "聊天"],
  travel: ["日落", "停车", "路线", "拍照", "天气", "短途", "徒步", "拥挤"],
  study: ["好用", "效率", "部署", "prompt", "面试", "简历", "作品集", "报错", "上手"],
  lifestyle: ["版型", "材质", "显瘦", "舒服", "耐穿", "整理", "健身", "恢复"],
  misc: ["喜欢", "细节", "节奏", "体验", "感受", "后劲"],
};

const POSITIVE_SIGNAL_KEYWORDS: Record<BaseCategory, string[]> = {
  beauty: ["轻薄", "持妆", "不卡粉", "自然", "服帖", "通勤"],
  restaurant: ["好吃", "环境", "服务", "氛围", "聊天", "稳定"],
  travel: ["日落", "拍照", "短途", "放空", "风景", "周末"],
  study: ["效率", "上手", "demo", "部署", "简历", "面试"],
  lifestyle: ["舒服", "耐穿", "整理", "健身", "恢复", "通勤"],
  misc: ["喜欢", "细节", "节奏", "放松", "后劲"],
};

const RISK_SIGNAL_KEYWORDS: Record<BaseCategory, string[]> = {
  beauty: ["暗沉", "卡粉", "斑驳", "偏黄", "起皮"],
  restaurant: ["排队", "预约", "拥挤", "停车难", "偏贵"],
  travel: ["拥挤", "堵车", "天气", "停车难", "排队"],
  study: ["报错", "混乱", "不稳定", "卡住", "返工"],
  lifestyle: ["不耐皱", "变形", "偏松", "偏紧", "不耐穿"],
  misc: ["拖沓", "踩坑", "一般", "失望"],
};

const SCENE_KEYWORDS: Record<BaseCategory, string[]> = {
  beauty: ["通勤", "约会", "开会", "空调房", "赶时间"],
  restaurant: ["周末", "晚餐", "brunch", "聚餐", "约会"],
  travel: ["周末", "短途", "日落", "自驾", "徒步"],
  study: ["面试", "简历", "demo", "作品集", "coffee chat"],
  lifestyle: ["通勤", "健身", "学习", "收纳", "周日"],
  misc: ["下班后", "周末", "睡前", "通勤路上", "展览日"],
};

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
const ENTITY_NAME_SET = new Set(
  Object.values(KEYWORD_CANDIDATES)
    .flat()
    .map((entry) => entry.toLowerCase()),
);

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

function pickCategoryKeywords(posts: MockPost[], categoryKey: BaseCategory): string[] {
  const entities = posts.flatMap((post) => extractEntitiesFromPost(post));
  const signalPool = [
    ...entities.flatMap((entry) => entry.positiveSignals),
    ...entities.flatMap((entry) => entry.scenes),
  ];
  const topSignals = pickTopByFrequency(signalPool, 4).slice(0, 3);
  if (topSignals.length > 0) return topSignals;

  const filteredTags = pickTopSpecificTags(posts, 6).filter((tag) => !ENTITY_NAME_SET.has(tag.toLowerCase()));
  if (filteredTags.length > 0) return filteredTags.slice(0, 3);
  return [CATEGORY_META[categoryKey].fallbackKeyword];
}

function pickSignals(text: string, signalPool: string[]): string[] {
  const lowerText = text.toLowerCase();
  return signalPool.filter((entry) => lowerText.includes(entry.toLowerCase()));
}

function inferEntityType(category: BaseCategory): ExtractedEntity["type"] {
  if (category === "beauty") return "product";
  if (category === "restaurant") return "restaurant";
  if (category === "travel") return "destination";
  if (category === "study") return "tool";
  if (category === "lifestyle") return "lifestyle";
  if (category === "misc") return "theme";
  return "other";
}

function inferEntityRole(post: MockPost, entityName: string, category: BaseCategory): EntityRole {
  const title = post.title.toLowerCase();
  const tags = post.tags.join(" ").toLowerCase();
  const body = `${post.content} ${post.comments.map((entry) => entry.content).join(" ")}`.toLowerCase();
  const entityLower = entityName.toLowerCase();

  if (title.includes(entityLower) || tags.includes(entityLower)) {
    return "primary";
  }

  if (!body.includes(entityLower)) {
    return "mentioned";
  }

  const hasEvaluationSignals = EVALUATION_KEYWORDS[category].some((keyword) =>
    body.includes(keyword.toLowerCase()),
  );
  return hasEvaluationSignals ? "secondary" : "mentioned";
}

export function extractEntitiesFromPost(post: MockPost): ExtractedEntity[] {
  const baseCategory = MERGED_CATEGORY_MAP[post.hiddenCategory ?? "misc"];
  const candidates = KEYWORD_CANDIDATES[baseCategory];
  const textCorpus = getPostCorpus(post);
  const entities: ExtractedEntity[] = [];

  candidates.forEach((candidate) => {
    if (!matchesKeyword(post, candidate)) return;
    const role = inferEntityRole(post, candidate, baseCategory);
    const positiveSignals = pickSignals(textCorpus, POSITIVE_SIGNAL_KEYWORDS[baseCategory]);
    const riskSignals = pickSignals(textCorpus, RISK_SIGNAL_KEYWORDS[baseCategory]);
    const scenes = pickSignals(textCorpus, SCENE_KEYWORDS[baseCategory]);

    entities.push({
      name: candidate,
      type: inferEntityType(baseCategory),
      postId: post.id,
      role,
      positiveSignals,
      riskSignals,
      scenes,
      evidence: `${post.title}｜${post.content.slice(0, 56)}`,
      canSupportItem: role === "primary" || role === "secondary",
    });
  });

  return entities;
}

function pickTopByFrequency(entries: string[], limit: number): string[] {
  const counter = new Map<string, number>();
  entries.forEach((entry) => {
    const key = entry.trim();
    if (!key) return;
    counter.set(key, (counter.get(key) ?? 0) + 1);
  });
  return [...counter.entries()]
    .sort((a, b) => (b[1] === a[1] ? a[0].localeCompare(b[0], "zh-CN") : b[1] - a[1]))
    .slice(0, limit)
    .map(([entry]) => entry);
}

function getHeartedTime(post: MockPost): number {
  return post.heartedAt ? new Date(post.heartedAt).getTime() : 0;
}

function getEngagementValue(post: MockPost): number {
  return post.likeCount * 0.45 + post.collectCount * 0.35 + (post.comments.length || post.commentCount) * 18;
}

function normalizeScore(rawValue: number, maxValue: number): number {
  if (maxValue <= 0) return 0;
  return Math.min(100, (rawValue / maxValue) * 100);
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

/** 本地 fallback：比单句「主要集中在…」信息更完整的要点总结 */
function buildMockItemSummary(
  postCount: number,
  focusLabel: string,
  keywords: string[],
  meta: { positiveSignals: Set<string>; riskSignals: Set<string>; scenes: Set<string> } | undefined,
): string {
  const kw = keywords.map((k) => k.trim()).filter(Boolean);
  const pos = meta ? [...meta.positiveSignals].filter((s) => !kw.includes(s)).slice(0, 4) : [];
  const kwShow = kw.slice(0, 3);
  const posShow = pos.slice(0, 3);
  const scn = meta ? [...meta.scenes].slice(0, 2) : [];
  const risks = meta ? [...meta.riskSignals].slice(0, 2) : [];

  const breadth = postCount > 1 ? "几条点亮内容从不同侧面给了可对照的评价" : "点亮内容里对这一点有直接可读的描述";
  let text = `围绕「${focusLabel}」，${breadth}，能拼出更完整的印象。`;
  const detailBits: string[] = [];
  if (kwShow.length > 0) {
    detailBits.push(`讨论里最常串起来的角度是「${kwShow.join("」「")}」`);
  }
  if (posShow.length > 0) {
    detailBits.push(`大家更常强调的感受是「${posShow.join("」「")}」`);
  }
  if (detailBits.length > 0) {
    text += ` ${detailBits.join("；")}。`;
  }
  if (scn.length > 0) {
    text += ` 这些内容多出现在「${scn.join("、")}」一类场景里，方便你对照自己的需求。`;
  }
  if (risks.length > 0) {
    text += ` 也有人提醒要留意：${risks.join("、")}。`;
  }
  return text;
}

function generateItemsFromCategoryPosts(
  categoryPosts: MockPost[],
  category: HeartBoardCategory,
  categoryKey: BaseCategory,
): HeartBoardItem[] {
  const entities = categoryPosts.flatMap((post) => extractEntitiesFromPost(post));
  const supportEntities = entities.filter((entity) => entity.canSupportItem && entity.role !== "mentioned");
  const grouped = new Map<string, ExtractedEntity[]>();

  supportEntities.forEach((entity) => {
    const current = grouped.get(entity.name) ?? [];
    grouped.set(entity.name, [...current, entity]);
  });

  const rawItemCandidates: Array<HeartBoardItem | null> = [...grouped.entries()]
    .map(([entityName, relatedEntities], index) => {
      const sourcePostIds = [...new Set(relatedEntities.map((entry) => entry.postId))];
      if (sourcePostIds.length === 0) return null;

      const sourcePosts = categoryPosts.filter((post) => sourcePostIds.includes(post.id));
      const sortedByHeartedAt = [...sourcePosts].sort((a, b) => {
        const aTime = a.heartedAt ? new Date(a.heartedAt).getTime() : 0;
        const bTime = b.heartedAt ? new Date(b.heartedAt).getTime() : 0;
        return bTime - aTime;
      });
      const image = sortedByHeartedAt[0]?.coverImage ?? category.coverImage;
      const positiveSignals = pickTopByFrequency(
        relatedEntities.flatMap((entry) => entry.positiveSignals),
        3,
      );
      const sceneSignals = pickTopByFrequency(
        relatedEntities.flatMap((entry) => entry.scenes),
        3,
      );
      const riskSignals = pickTopByFrequency(
        relatedEntities.flatMap((entry) => entry.riskSignals),
        2,
      );
      const mergedKeywords = [...new Set([...positiveSignals, ...sceneSignals])].slice(0, 3);
      const itemTitle = buildItemTitle(categoryKey, entityName);
      const itemId = toItemId(`${category.slug}-${itemTitle || entityName}`) || `${category.slug}-item-${index + 1}`;

      return {
        id: itemId,
        title: itemTitle || entityName,
        type: category.type,
        image,
        mentionCount: sourcePostIds.length,
        keywords: mergedKeywords.length > 0 ? mergedKeywords : [entityName],
        summary: "",
        reminder: riskSignals.length > 0 ? `注意：${riskSignals.join("、")}` : undefined,
        sourcePostIds,
      };
    })
    .filter((item) => Boolean(item));

  const itemCandidates = rawItemCandidates.filter((item): item is HeartBoardItem => item !== null);
  const dedupedById = new Map<string, HeartBoardItem>();
  const supportMetaById = new Map<
    string,
    { positiveSignals: Set<string>; riskSignals: Set<string>; scenes: Set<string> }
  >();

  itemCandidates.forEach((item) => {
    const sourcePosts = categoryPosts.filter((post) => item.sourcePostIds.includes(post.id));
    const baseEvidenceText = sourcePosts.map((post) => getPostCorpus(post)).join(" ");
    const positiveSignals = new Set(pickSignals(baseEvidenceText, POSITIVE_SIGNAL_KEYWORDS[categoryKey]));
    const riskSignals = new Set(pickSignals(baseEvidenceText, RISK_SIGNAL_KEYWORDS[categoryKey]));
    const scenes = new Set(pickSignals(baseEvidenceText, SCENE_KEYWORDS[categoryKey]));

    const existing = dedupedById.get(item.id);
    if (!existing) {
      dedupedById.set(item.id, item);
      supportMetaById.set(item.id, { positiveSignals, riskSignals, scenes });
      return;
    }

    const mergedSourcePostIds = [...new Set([...existing.sourcePostIds, ...item.sourcePostIds])];
    const mergedKeywords = [...new Set([...existing.keywords, ...item.keywords])].slice(0, 3);
    const existingMeta = supportMetaById.get(item.id);
    const mergedMeta = {
      positiveSignals: new Set([
        ...(existingMeta ? [...existingMeta.positiveSignals] : []),
        ...[...positiveSignals],
      ]),
      riskSignals: new Set([
        ...(existingMeta ? [...existingMeta.riskSignals] : []),
        ...[...riskSignals],
      ]),
      scenes: new Set([...(existingMeta ? [...existingMeta.scenes] : []), ...[...scenes]]),
    };
    supportMetaById.set(item.id, mergedMeta);
    dedupedById.set(item.id, {
      ...existing,
      mentionCount: mergedSourcePostIds.length,
      sourcePostIds: mergedSourcePostIds,
      keywords: mergedKeywords.length > 0 ? mergedKeywords : existing.keywords,
    });
  });

  const dedupedItemCandidates = [...dedupedById.values()].map((item) => {
    const meta = supportMetaById.get(item.id);
    return {
      ...item,
      summary: buildMockItemSummary(item.sourcePostIds.length, item.title, item.keywords, meta),
    };
  });

  if (dedupedItemCandidates.length > 0) {
    const postIndex = new Map(categoryPosts.map((post) => [post.id, post]));
    const maxSourcePostCount = Math.max(...dedupedItemCandidates.map((item) => item.sourcePostIds.length), 1);
    const itemLatestTimes = dedupedItemCandidates.map((item) => {
      const latest = Math.max(
        ...item.sourcePostIds.map((postId) => {
          const post = postIndex.get(postId);
          return post ? getHeartedTime(post) : 0;
        }),
        0,
      );
      return latest;
    });
    const maxLatestTime = Math.max(...itemLatestTimes, 0);
    const minLatestTime = Math.min(...itemLatestTimes, 0);
    const rawEngagementScores = dedupedItemCandidates.map((item) => {
      const sourcePosts = item.sourcePostIds.map((postId) => postIndex.get(postId)).filter((post): post is MockPost => Boolean(post));
      if (sourcePosts.length === 0) return 0;
      const total = sourcePosts.reduce((acc, post) => acc + getEngagementValue(post), 0);
      return total / sourcePosts.length;
    });
    const maxEngagementScore = Math.max(...rawEngagementScores, 1);

    const scoredItems = dedupedItemCandidates.map((item, index) => {
      const latestTime = itemLatestTimes[index] ?? 0;
      const latestHeartedAt = latestTime > 0 ? new Date(latestTime).toISOString() : undefined;
      const sourcePostCount = item.sourcePostIds.length;
      const sourcePostCountScore = normalizeScore(sourcePostCount, maxSourcePostCount);
      const recencyScore =
        maxLatestTime === minLatestTime
          ? 100
          : normalizeScore(latestTime - minLatestTime, maxLatestTime - minLatestTime);
      const engagementScore = normalizeScore(rawEngagementScores[index] ?? 0, maxEngagementScore);
      const meta = supportMetaById.get(item.id);
      const evidenceQualityRaw =
        (meta?.positiveSignals.size ?? 0) * 28 + (meta?.riskSignals.size ?? 0) * 22 + (meta?.scenes.size ?? 0) * 18;
      const evidenceQualityScore = Math.min(100, evidenceQualityRaw);
      const priorityScore =
        sourcePostCountScore * 0.5 +
        recencyScore * 0.15 +
        engagementScore * 0.2 +
        evidenceQualityScore * 0.15;

      return {
        ...item,
        sourcePostCount,
        latestHeartedAt,
        priorityScore: Number(priorityScore.toFixed(2)),
      };
    });

    return scoredItems
      .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
      .slice(0, 3);
  }

  return [
    {
      id: `${category.slug}-focus`,
      title: `${category.title}本周重点`,
      type: category.type,
      image: category.coverImage,
      mentionCount: categoryPosts.length,
      sourcePostCount: categoryPosts.length,
      latestHeartedAt: categoryPosts[0]?.heartedAt,
      priorityScore: 60,
      keywords: category.keywords,
      summary: "AI 根据这些笔记整理出本类灵感内容。",
      reminder: "建议先从最容易落地的一篇开始。",
      sourcePostIds: categoryPosts.map((post) => post.id),
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
      const resolvedKeywords = pickCategoryKeywords(sortedByHeartedTime, categoryKey);
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
        representativeItems: [],
        commentSummary: [],
        items: [],
        sourcePostIds,
      };

      category.items = generateItemsFromCategoryPosts(sortedByHeartedTime, category, categoryKey)
        .filter((item) => item.sourcePostIds.length > 0)
        .slice(0, 3);
      if (category.items.length === 0 && category.sourcePostIds.length > 0) {
        category.items = [
          {
            id: `${category.slug}-collection`,
            title: "本类灵感合集",
            type: category.type,
            image: category.coverImage,
            mentionCount: category.sourcePostIds.length,
            keywords: category.keywords,
            summary: "AI 根据这些笔记整理出本类灵感内容。",
            sourcePostIds: category.sourcePostIds,
          },
        ];
      }
      category.representativeItems = category.items.slice(0, 3).map((item) => item.title);

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
        : "本周还没有灵感内容，去发现页点亮几篇后再回来看看。",
    categories,
  };
}

export function buildEntityExtractionPrompt(posts: MockPost[]): string {
  return `
你需要逐篇分析用户本周点亮的帖子。
同一篇帖子可以提到多个对象。
请为每个对象判断 role：
- primary：主要讨论对象
- secondary：有实质评价的对比对象
- mentioned：只是顺带提到

只有 primary 和 secondary 能支持灵感要点。
每个对象需要返回 positiveSignals、riskSignals、scenes、evidence、sourcePostIds。
不要把只是出现名字但没有评价的对象当作灵感要点。

当前分析帖子数：${posts.length}
`;
}

export async function generateHeartBoardFromPosts(
  posts: MockPost[],
  weekId: string,
): Promise<HeartBoard> {
  return generateMockHeartBoardFromPosts(posts, weekId);
}
