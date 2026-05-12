import dataset2Raw from "@/data/mock/dataset_2_all_travel_no_tags.json";
import dataset3Raw from "@/data/mock/dataset_3_open_topics_no_tags.json";
import dataset6Raw from "@/data/mock/dataset_6_noise_fragments_no_tags.json";
import { getCurrentWeekId as getWeekIdFromDate, mockPosts, type MockComment, type MockPost } from "@/data/mockPosts";

export type ActiveTestDataset =
  | "original"
  | "dataset_2_all_travel"
  | "dataset_3_open_topics"
  | "dataset_6_noise_fragments";

// Test-only dataset switch for evaluating Heartboard behavior across different inputs.
// Keep "original" for normal demo experience.
export const ACTIVE_TEST_DATASET: ActiveTestDataset = "dataset_3_open_topics";

type RawDatasetPost = {
  id: string;
  dataset: string;
  title: string;
  content: string;
  comments: string[];
  expected_test_focus: string;
  confidence_hint: string;
};

const TEST_DATASET_COVER_IMAGES = [
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1000&q=80",
];

const TEST_DATASET_AUTHORS = ["测试用户A", "测试用户B", "测试用户C", "测试用户D", "测试用户E"];
const TEST_COMMENT_USERS = [
  "北北",
  "Mia",
  "Lynn",
  "阿梨",
  "Suki",
  "Yoyo",
  "Kiko",
  "Rita",
  "Penny",
  "Nora",
  "June",
  "Iris",
];
const COMMENT_OPENERS = [
  "我也试过类似情况，",
  "这个点很有共鸣，",
  "补一个实测细节，",
  "反向反馈一下，",
  "我这边踩过同样的坑，",
  "这个结论我认同，",
  "你这条记录很实用，",
  "想问个细节，",
];
const COMMENT_MIDDLES = [
  "如果把节奏放慢一点，体验会稳定很多。",
  "我这边在周末时段操作，结果会更可控。",
  "同样流程下，提前做准备会少很多返工。",
  "这个步骤建议先小范围试一次，再决定要不要继续。",
  "我上次也是因为时机没选好，结果和预期差很大。",
  "用你这个思路做取舍，后面就不容易纠结。",
  "重点不是做得多，而是把关键步骤做对。",
  "第一次不顺很正常，第二次通常会明显好很多。",
];
const COMMENT_ENDINGS = [
  "你后续如果更新我还想继续看。",
  "这个细节对我帮助很大。",
  "我准备这周按你这个方案再跑一遍。",
  "感觉这条比很多攻略都更真实。",
  "谢谢你把优缺点都写出来了。",
  "这种记录方式很适合复盘。",
];
const EVALUATION_HINTS = ["适合", "不适合", "优点", "缺点", "建议", "提醒", "踩坑", "稳定", "效率", "体验"];

function hashText(input: string): number {
  return [...input].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getTargetCommentCount(likeCount: number, seed: number): number {
  if (likeCount < 300) return 1 + (seed % 3);
  if (likeCount < 1500) return 5 + (seed % 6);
  return 20 + (seed % 9);
}

function shouldHeartPost(entry: RawDatasetPost, index: number): boolean {
  const seed = hashText(`${entry.id}-${entry.dataset}-${index}`) % 100;
  if (entry.dataset === "dataset_2_all_travel") return seed < 72;
  if (entry.dataset === "dataset_3_open_topics") return seed < 58;
  if (entry.dataset === "dataset_6_noise_fragments") return seed < 45;
  return true;
}

function extractCommentTokens(entry: RawDatasetPost): string[] {
  const text = `${entry.title} ${entry.content}`.replace(/[｜|]/g, " ");
  const englishTokens = text.match(/[A-Za-z][A-Za-z0-9&-]{2,}/g) ?? [];
  const chineseTokens = text.match(/[\u4e00-\u9fa5]{2,8}/g) ?? [];
  const merged = [...englishTokens, ...chineseTokens].filter(
    (token) => token.length >= 2 && !["记录", "小记录", "今天", "这次"].includes(token),
  );
  return Array.from(new Set(merged)).slice(0, 10);
}

function buildGeneratedComment(entry: RawDatasetPost, index: number, seed: number, tokens: string[]): string {
  const opener = COMMENT_OPENERS[(seed + index) % COMMENT_OPENERS.length];
  const middle = COMMENT_MIDDLES[(seed * 3 + index) % COMMENT_MIDDLES.length];
  const ending = COMMENT_ENDINGS[(seed * 5 + index) % COMMENT_ENDINGS.length];
  const focus = tokens.length > 0 ? tokens[(seed + index * 2) % tokens.length] : "这个主题";
  const evalHint = EVALUATION_HINTS[(seed + index * 7) % EVALUATION_HINTS.length];
  if (index % 4 === 0) {
    return `${opener}${focus} 这块我觉得${evalHint}要更具体一点，${middle}${ending}`;
  }
  if (index % 4 === 1) {
    return `${opener}我在 ${focus} 这个环节做了微调，${middle}`;
  }
  if (index % 4 === 2) {
    return `${opener}${focus} 的结论挺真实，${ending}`;
  }
  return `${opener}${focus} 这里如果先做小样本验证，后面会更稳。${ending}`;
}

function toMockComments(postId: string, entry: RawDatasetPost, likeCount: number): MockComment[] {
  const seed = hashText(postId);
  const targetCount = getTargetCommentCount(likeCount, seed);
  const usedContents = new Set<string>();
  const drafts: string[] = [];

  (entry.comments ?? []).forEach((comment) => {
    if (drafts.length >= targetCount) return;
    const normalized = comment.trim();
    if (!normalized || usedContents.has(normalized)) return;
    usedContents.add(normalized);
    drafts.push(normalized);
  });

  const tokens = extractCommentTokens(entry);
  let cursor = 0;
  while (drafts.length < targetCount && cursor < targetCount * 10) {
    const generated = buildGeneratedComment(entry, cursor, seed, tokens);
    const normalized = generated.trim();
    cursor += 1;
    if (!normalized || usedContents.has(normalized)) continue;
    usedContents.add(normalized);
    drafts.push(normalized);
  }

  while (drafts.length < targetCount) {
    const fallback = `补一个细节：第 ${drafts.length + 1} 次看这个主题，感受比第一次更稳定。`;
    drafts.push(fallback);
  }

  return drafts.map((content, index) => ({
    id: `comment_${postId.toLowerCase()}_${String(index + 1).padStart(2, "0")}`,
    userName: TEST_COMMENT_USERS[(seed + index) % TEST_COMMENT_USERS.length],
    content,
    likeCount: 1 + ((hashText(content) + likeCount + index) % 48),
  }));
}

function toMockPosts(rawPosts: RawDatasetPost[]): MockPost[] {
  const now = new Date();
  const weekId = getWeekIdFromDate(now);
  const baseTime = now.getTime();

  return rawPosts.map((entry, index) => {
    const postHash = hashText(entry.id);
    const likeCount = 180 + (postHash % 2200);
    const comments = toMockComments(entry.id, entry, likeCount);
    const coverImage = TEST_DATASET_COVER_IMAGES[index % TEST_DATASET_COVER_IMAGES.length];
    const authorName = TEST_DATASET_AUTHORS[index % TEST_DATASET_AUTHORS.length];
    const heartedDate = new Date(baseTime - index * 1000 * 60 * 12);
    const isHearted = shouldHeartPost(entry, index);
    const resolvedHeartedAt = isHearted ? heartedDate.toISOString() : undefined;
    const resolvedWeekId = isHearted ? weekId : undefined;

    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      authorName,
      authorAvatar: "/images/mock/avatar-default.jpg",
      coverImage,
      images: [coverImage],
      tags: [],
      likeCount,
      collectCount: 90 + (postHash % 600),
      commentCount: comments.length,
      comments,
      isHearted,
      createdAt: new Date(baseTime - (index + 30) * 1000 * 60 * 60 * 24).toISOString(),
      heartedAt: resolvedHeartedAt,
      weekId: resolvedWeekId,
      hiddenCategory: "misc",
    };
  });
}

const testDataset2Posts = toMockPosts(dataset2Raw as RawDatasetPost[]);
const testDataset3Posts = toMockPosts(dataset3Raw as RawDatasetPost[]);
const testDataset6Posts = toMockPosts(dataset6Raw as RawDatasetPost[]);

function getActivePostsInternal(): MockPost[] {
  if (ACTIVE_TEST_DATASET === "dataset_2_all_travel") return testDataset2Posts;
  if (ACTIVE_TEST_DATASET === "dataset_3_open_topics") return testDataset3Posts;
  if (ACTIVE_TEST_DATASET === "dataset_6_noise_fragments") return testDataset6Posts;
  return mockPosts;
}

export function getActiveHeartboardPosts(): MockPost[] {
  return getActivePostsInternal();
}

export function getActivePostById(postId: string): MockPost | undefined {
  const activePosts = getActivePostsInternal();
  const normalized = postId === "1" ? activePosts[0]?.id : postId;
  return activePosts.find((post) => post.id === normalized);
}

export function getActivePostsByIds(postIds: string[]): MockPost[] {
  const activePosts = getActivePostsInternal();
  const postIdSet = new Set(postIds);
  return activePosts.filter((post) => postIdSet.has(post.id));
}
