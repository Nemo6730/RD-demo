import { GoogleGenAI } from "@google/genai";
import type { MockPost } from "@/data/mockPosts";
import { buildHeartBoardPrompt } from "@/lib/ai/buildHeartBoardPrompt";
import {
  appendStreamText,
  extractCompleteCategoryObjects,
} from "@/lib/ai/extractPartialCategoriesFromJsonBuffer";
import { heartBoardResponseSchema, type AIHeartBoard } from "@/lib/ai/heartBoardSchema";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "");
}

function getResponseText(response: unknown): string {
  if (!response || typeof response !== "object") return "";
  const maybeText = (response as { text?: string | (() => string) }).text;
  if (typeof maybeText === "function") return maybeText();
  if (typeof maybeText === "string") return maybeText;
  return "";
}

function sanitizeAIHeartBoard(board: AIHeartBoard, inputPosts: MockPost[], weekId: string): AIHeartBoard {
  const validPostIds = new Set(inputPosts.map((post) => post.id));

  const categories = (board.categories ?? [])
    .map((category, categoryIndex) => {
      const categorySourcePostIds = Array.from(
        new Set((category.sourcePostIds ?? []).filter((id) => validPostIds.has(id))),
      );

      const items = (category.items ?? [])
        .map((item, itemIndex) => {
          const itemSourcePostIds = Array.from(
            new Set((item.sourcePostIds ?? []).filter((id) => validPostIds.has(id))),
          );

          return {
            ...item,
            id: item.id || `${slugify(item.title || "item")}-${itemIndex}`,
            itemType: item.itemType || "灵感要点",
            sourcePostIds: itemSourcePostIds,
            keywords: (item.keywords ?? []).slice(0, 4),
            positiveSignals: item.positiveSignals ?? [],
            riskSignals: item.riskSignals ?? [],
          };
        })
        .filter((item) => item.sourcePostIds.length > 0)
        .slice(0, 3);

      const fallbackCoverPostId =
        category.coverPostId && validPostIds.has(category.coverPostId)
          ? category.coverPostId
          : categorySourcePostIds[0] ?? "";

      return {
        ...category,
        id: category.id || `category-${categoryIndex}`,
        slug: category.slug || slugify(category.title || `category-${categoryIndex}`),
        categoryType: category.categoryType || "灵感主题",
        coverPostId: fallbackCoverPostId,
        sourcePostIds: categorySourcePostIds,
        keywords: (category.keywords ?? []).slice(0, 3),
        representativeItems: (category.representativeItems ?? []).slice(0, 3),
        items,
      };
    })
    .filter((category) => category.sourcePostIds.length > 0 && category.items.length > 0)
    .slice(0, 4);

  return {
    ...board,
    id: board.id || `heart-board-${weekId}`,
    weekId,
    totalHeartCount: inputPosts.length,
    categories,
  };
}

function getGeminiClientAndModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }
  const model = process.env.GEMINI_HEART_BOARD_MODEL?.trim() || "gemini-2.5-flash";
  return { ai: new GoogleGenAI({ apiKey }), model };
}

const heartBoardGeminiConfig = {
  responseMimeType: "application/json" as const,
  responseSchema: heartBoardResponseSchema,
  temperature: 0.2,
  maxOutputTokens: 8192,
  thinkingConfig: { thinkingBudget: 0 },
};

export async function generateHeartBoardWithGemini(posts: MockPost[], weekId: string): Promise<AIHeartBoard> {
  const { ai, model } = getGeminiClientAndModel();
  const prompt = buildHeartBoardPrompt(posts, weekId);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: heartBoardGeminiConfig,
  });

  const text = getResponseText(response);
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(text) as AIHeartBoard;
  return sanitizeAIHeartBoard(parsed, posts, weekId);
}

export type HeartBoardGeminiStreamEvent =
  | { kind: "partial"; board: AIHeartBoard }
  | { kind: "final"; board: AIHeartBoard };

export async function* generateHeartBoardWithGeminiStream(
  posts: MockPost[],
  weekId: string,
): AsyncGenerator<HeartBoardGeminiStreamEvent> {
  const { ai, model } = getGeminiClientAndModel();
  const prompt = buildHeartBoardPrompt(posts, weekId);

  const stream = await ai.models.generateContentStream({
    model,
    contents: prompt,
    config: heartBoardGeminiConfig,
  });

  let accumulated = "";
  let lastEmittedCategoryCount = 0;

  for await (const chunk of stream) {
    const piece = chunk.text ?? "";
    accumulated = appendStreamText(accumulated, piece);

    const cats = extractCompleteCategoryObjects(accumulated);
    if (cats.length > lastEmittedCategoryCount) {
      lastEmittedCategoryCount = cats.length;
      const provisional: AIHeartBoard = {
        id: `heart-board-${weekId}`,
        weekId,
        weekRange: weekId,
        totalHeartCount: posts.length,
        summary: "正在整理…",
        categories: cats,
      };
      yield { kind: "partial", board: sanitizeAIHeartBoard(provisional, posts, weekId) };
    }
  }

  let finalParsed: AIHeartBoard;
  try {
    finalParsed = JSON.parse(accumulated.trim()) as AIHeartBoard;
  } catch {
    const cats = extractCompleteCategoryObjects(accumulated);
    finalParsed = {
      id: `heart-board-${weekId}`,
      weekId,
      weekRange: weekId,
      totalHeartCount: posts.length,
      summary: "",
      categories: cats,
    };
  }

  yield { kind: "final", board: sanitizeAIHeartBoard(finalParsed, posts, weekId) };
}
