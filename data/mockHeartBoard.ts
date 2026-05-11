export type HeartBoardCategory = {
  id: string;
  title: string;
  weekCount: number;
  insight: string;
  keywords: string[];
  highlights: string[];
  image: string;
  detailPath: string;
};

export type HeartBoardData = {
  period: string;
  totalHearted: number;
  totalDirections: number;
  oneLineInsight: string;
  categories: HeartBoardCategory[];
};

export type FoundationProduct = {
  id: string;
  name: string;
  mentions: number;
  keywords: string[];
  pros: string;
  reminder: string;
  image: string;
  sourceLink: string;
};

export const mockHeartBoard: HeartBoardData = {
  period: "5.6 - 5.12",
  totalHearted: 100,
  totalDirections: 5,
  oneLineInsight: "你这周最心动的是底妆、餐厅、旅行和 AI 工具。",
  categories: [
    {
      id: "foundation",
      title: "想试的底妆",
      weekCount: 20,
      insight: "你最近偏好清透、低饱和、通勤感的底妆。",
      keywords: ["清透", "不卡粉", "自然妆感"],
      highlights: ["Dior", "Chanel", "NARS"],
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80",
      detailPath: "/heart-board/foundation",
    },
    {
      id: "restaurant",
      title: "周末想去的餐厅",
      weekCount: 30,
      insight: "你偏好氛围感强、适合约会和朋友聚餐的餐厅。",
      keywords: ["约会", "意餐", "提前预约"],
      highlights: ["Trattoria", "Brunch", "日料"],
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80",
      detailPath: "/heart-board/foundation",
    },
    {
      id: "travel",
      title: "旅行目的地",
      weekCount: 15,
      insight: "更偏向短途、自然风景和拍照友好的目的地。",
      keywords: ["短途", "海边", "拍照"],
      highlights: ["Santa Barbara", "Malibu", "San Diego"],
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
      detailPath: "/heart-board/foundation",
    },
    {
      id: "ai-tools",
      title: "AI 工具灵感",
      weekCount: 19,
      insight: "你关注从灵感到落地的生产力工作流。",
      keywords: ["自动化", "工作流", "提效"],
      highlights: ["Cursor", "Codex", "MCP"],
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80",
      detailPath: "/heart-board/foundation",
    },
    {
      id: "lifestyle",
      title: "生活方式灵感",
      weekCount: 16,
      insight: "你在建立更可持续的日常节奏与空间感。",
      keywords: ["慢生活", "整理", "健康"],
      highlights: ["早起", "饮食", "空间布置"],
      image:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1000&q=80",
      detailPath: "/heart-board/foundation",
    },
  ],
};

export const foundationDetail = {
  title: "想试的底妆",
  weekCount: 20,
  heroImage:
    "https://images.unsplash.com/photo-1607602132700-06825864fe0f?auto=format&fit=crop&w=1200&q=80",
  insight:
    "你收藏的底妆内容更偏向清透、自然、通勤友好路线。高频心动点集中在轻薄延展、不卡粉和贴肤度。",
  products: [
    {
      id: "dior-forever",
      name: "Dior Forever",
      mentions: 17,
      keywords: ["持妆", "细腻", "通勤"],
      pros: "妆面稳定、遮瑕适中，全天勤通勤不易暗沉。",
      reminder: "干皮在秋冬需加强保湿，否则鼻翼略卡纹。",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      sourceLink: "/post/1",
    },
    {
      id: "chanel-les-beiges",
      name: "Chanel Les Beiges",
      mentions: 12,
      keywords: ["自然", "轻透", "光泽"],
      pros: "妆感非常自然，适合想要原生好皮肤效果。",
      reminder: "遮瑕偏弱，瑕疵多时建议搭配局部遮瑕。",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      sourceLink: "/post/1",
    },
    {
      id: "nars-light-reflecting",
      name: "NARS Light Reflecting",
      mentions: 21,
      keywords: ["清透", "贴肤", "奶油肌"],
      pros: "上脸服帖快，镜头下肤质表现很稳。",
      reminder: "夏季出油后建议补压散粉，避免光泽过强。",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      sourceLink: "/post/1",
    },
  ] as FoundationProduct[],
  commentSummary: ["不卡粉", "自然妆感", "干皮需要做好保湿"],
  sourcePosts: [
    {
      id: 1,
      title: "混油皮夏季底妆测评：轻薄和遮瑕怎么平衡",
      author: "莓莓",
      cover:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
      href: "/post/1",
    },
    {
      id: 2,
      title: "通勤 10 小时不暗沉底妆清单",
      author: "KK",
      cover:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
      href: "/post/1",
    },
    {
      id: 3,
      title: "妆前打底和定妆喷雾的组合实验",
      author: "阿柚",
      cover:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
      href: "/post/1",
    },
  ],
};

export async function generateHeartBoard(userId: string): Promise<HeartBoardData> {
  void userId;
  return Promise.resolve(mockHeartBoard);
}
