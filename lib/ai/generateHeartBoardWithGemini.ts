import { GoogleGenAI } from "@google/genai";
import type { MockPost } from "@/data/mockPosts";
import { buildHeartBoardPrompt } from "@/lib/ai/buildHeartBoardPrompt";
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
            itemType: item.itemType || "心动要点",
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
        categoryType: category.categoryType || "心动主题",
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

export async function generateHeartBoardWithGemini(posts: MockPost[], weekId: string): Promise<AIHeartBoard> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildHeartBoardPrompt(posts, weekId);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: heartBoardResponseSchema,
      temperature: 0.2,
    },
  });

  const text = getResponseText(response);
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(text) as AIHeartBoard;
  return sanitizeAIHeartBoard(parsed, posts, weekId);
}
