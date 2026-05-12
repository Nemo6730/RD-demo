export type AIHeartBoard = {
  id: string;
  weekId: string;
  weekRange: string;
  totalHeartCount: number;
  summary: string;
  categories: AIHeartBoardCategory[];
};

export type AIHeartBoardCategory = {
  id: string;
  slug: string;
  title: string;
  categoryType?: string;
  coverPostId: string;
  insight: string;
  keywords: string[];
  representativeItems: string[];
  sourcePostIds: string[];
  items: AIHeartBoardItem[];
};

export type AIHeartBoardItem = {
  id: string;
  title: string;
  itemType?: string;
  summary: string;
  keywords: string[];
  positiveSignals: string[];
  riskSignals: string[];
  bestFor?: string;
  sourcePostIds: string[];
};

export const heartBoardResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    weekId: { type: "string" },
    weekRange: { type: "string" },
    totalHeartCount: { type: "integer" },
    summary: { type: "string" },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          title: { type: "string" },
          categoryType: { type: "string" },
          coverPostId: { type: "string" },
          insight: { type: "string" },
          keywords: {
            type: "array",
            items: { type: "string" },
          },
          representativeItems: {
            type: "array",
            items: { type: "string" },
          },
          sourcePostIds: {
            type: "array",
            items: { type: "string" },
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                itemType: { type: "string" },
                summary: { type: "string" },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                },
                positiveSignals: {
                  type: "array",
                  items: { type: "string" },
                },
                riskSignals: {
                  type: "array",
                  items: { type: "string" },
                },
                bestFor: { type: "string" },
                sourcePostIds: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: [
                "id",
                "title",
                "itemType",
                "summary",
                "keywords",
                "positiveSignals",
                "riskSignals",
                "sourcePostIds",
              ],
            },
          },
        },
        required: [
          "id",
          "slug",
          "title",
          "categoryType",
          "coverPostId",
          "insight",
          "keywords",
          "representativeItems",
          "sourcePostIds",
          "items",
        ],
      },
    },
  },
  required: ["id", "weekId", "weekRange", "totalHeartCount", "summary", "categories"],
} as const;
