export type HeartBoardItem = {
  id: string;
  title: string;
  type: "product" | "restaurant" | "destination" | "tool" | "style" | "lifestyle" | "other";
  image: string;
  mentionCount: number;
  sourcePostCount?: number;
  latestHeartedAt?: string;
  priorityScore?: number;
  keywords: string[];
  summary: string;
  reminder?: string;
  sourcePostIds: string[];
};

export type HeartBoardCategory = {
  id: string;
  slug: string;
  title: string;
  type: HeartBoardItem["type"];
  coverImage: string;
  postCount: number;
  insight: string;
  keywords: string[]; // 灵感关键词：评价标准/场景/需求
  representativeItems?: string[]; // 代表内容：具体对象/品牌/地点/工具
  commentSummary: string[];
  items: HeartBoardItem[];
  sourcePostIds: string[];
};

export type HeartBoard = {
  id: string;
  weekRange: string;
  totalHeartCount: number;
  summary: string;
  categories: HeartBoardCategory[];
};

export const mockHeartBoard: HeartBoard = {
  id: "hb_2026_w19",
  weekRange: "5.6 - 5.12",
  totalHeartCount: 100,
  summary: "你这周最关注的是底妆、餐厅、旅行和 AI 工具。",
  categories: [
    {
      id: "cat_foundation",
      slug: "foundation",
      title: "想试的底妆",
      type: "product",
      coverImage:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80",
      postCount: 20,
      insight: "你最近偏好清透、低饱和、通勤感的底妆。",
      keywords: ["清透", "不卡粉", "自然妆感"],
      commentSummary: ["不卡粉", "自然妆感", "干皮需要做好保湿"],
      sourcePostIds: ["post_beauty_01", "post_beauty_04", "post_beauty_06"],
      items: [
        {
          id: "dior-forever",
          title: "Dior Forever",
          type: "product",
          image:
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
          mentionCount: 17,
          keywords: ["持妆", "细腻", "通勤"],
          summary: "妆面稳定、遮瑕适中，全天通勤不易暗沉。",
          reminder: "干皮在秋冬需加强保湿，否则鼻翼略卡纹。",
          sourcePostIds: ["post_beauty_04", "post_beauty_01"],
        },
        {
          id: "chanel-les-beiges",
          title: "Chanel Les Beiges",
          type: "product",
          image:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
          mentionCount: 12,
          keywords: ["自然", "轻透", "光泽"],
          summary: "妆感非常自然，适合原生好皮肤路线。",
          reminder: "遮瑕偏弱，瑕疵多时建议搭配局部遮瑕。",
          sourcePostIds: ["post_beauty_04", "post_beauty_06"],
        },
        {
          id: "nars-light-reflecting",
          title: "NARS Light Reflecting",
          type: "product",
          image:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          mentionCount: 21,
          keywords: ["清透", "贴肤", "奶油肌"],
          summary: "上脸服帖快，镜头下肤质表现很稳。",
          reminder: "夏季出油后建议补压散粉，避免光泽过强。",
          sourcePostIds: ["post_beauty_04", "post_beauty_01", "post_beauty_06"],
        },
      ],
    },
    {
      id: "cat_restaurants",
      slug: "restaurants",
      title: "周末想去的餐厅",
      type: "restaurant",
      coverImage:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80",
      postCount: 30,
      insight: "你最近更偏好氛围感强、适合约会和朋友聚餐的餐厅。",
      keywords: ["约会", "意餐", "提前预约"],
      commentSummary: ["环境好", "适合聊天", "需要提前订位"],
      sourcePostIds: ["post_restaurant_01", "post_restaurant_02", "post_restaurant_05"],
      items: [
        {
          id: "trattoria-los-angeles",
          title: "Trattoria Los Angeles",
          type: "restaurant",
          image:
            "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800&q=80",
          mentionCount: 18,
          keywords: ["约会", "氛围感", "意餐"],
          summary: "适合周末和朋友聚餐，评论多次提到环境好、出片。",
          reminder: "晚高峰排队较久，建议提前预约。",
          sourcePostIds: ["post_restaurant_01", "post_restaurant_05"],
        },
        {
          id: "brunch-garden",
          title: "Brunch Garden",
          type: "restaurant",
          image:
            "https://images.unsplash.com/photo-1457666134378-6b77915bd5f2?auto=format&fit=crop&w=800&q=80",
          mentionCount: 14,
          keywords: ["Brunch", "阳光", "周末"],
          summary: "整体节奏松弛，适合午后慢慢聊，拍照友好。",
          reminder: "热门时段等位时间长，建议错峰。",
          sourcePostIds: ["post_restaurant_02", "post_restaurant_01"],
        },
        {
          id: "sushi-bar-kumo",
          title: "Sushi Bar Kumo",
          type: "restaurant",
          image:
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
          mentionCount: 11,
          keywords: ["日料", "安静", "预约"],
          summary: "评论普遍认为食材稳定，适合小范围聚会。",
          reminder: "周末晚餐时段非常紧俏，至少提前两天预约。",
          sourcePostIds: ["post_restaurant_03", "post_restaurant_05"],
        },
      ],
    },
    {
      id: "cat_travel",
      slug: "travel",
      title: "旅行目的地",
      type: "destination",
      coverImage:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
      postCount: 15,
      insight: "你这周收藏的目的地更偏向短途、自然风景和拍照友好。",
      keywords: ["短途", "海边", "拍照"],
      commentSummary: ["海边光线好", "周末可达", "自驾更方便"],
      sourcePostIds: ["post_travel_01", "post_travel_02", "post_travel_03"],
      items: [
        {
          id: "santa-barbara",
          title: "Santa Barbara",
          type: "destination",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          mentionCount: 10,
          keywords: ["短途", "海边", "拍照"],
          summary: "本周爪印内容偏向短途放松和海岸线景色，出片率高。",
          reminder: "部分停车点紧张，建议提前规划。",
          sourcePostIds: ["post_travel_01", "post_travel_03"],
        },
        {
          id: "malibu",
          title: "Malibu",
          type: "destination",
          image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
          mentionCount: 9,
          keywords: ["海边", "日落", "公路"],
          summary: "日落时段最受欢迎，评论多提到路线体验感强。",
          reminder: "高峰路段拥堵，建议提前出发。",
          sourcePostIds: ["post_travel_02", "post_travel_01"],
        },
        {
          id: "san-diego",
          title: "San Diego",
          type: "destination",
          image:
            "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
          mentionCount: 8,
          keywords: ["自然风景", "周末", "轻旅行"],
          summary: "整体节奏轻松，适合 2-3 天恢复型周末出行。",
          reminder: "跨城移动建议提前确认交通时段。",
          sourcePostIds: ["post_travel_03", "post_travel_08"],
        },
      ],
    },
    {
      id: "cat_ai_tools",
      slug: "ai-tools",
      title: "AI 工具爪印",
      type: "tool",
      coverImage:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80",
      postCount: 19,
      insight: "你最近关注的是如何快速做出可展示的 AI 产品 demo。",
      keywords: ["自动化", "工作流", "提效"],
      commentSummary: ["先做 demo", "流程自动化", "重视交付速度"],
      sourcePostIds: ["post_study_01", "post_study_02", "post_study_07"],
      items: [
        {
          id: "cursor-agent",
          title: "Cursor Agent",
          type: "tool",
          image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
          mentionCount: 15,
          keywords: ["demo", "自动化", "AI 编程"],
          summary: "更适合快速迭代页面与结构化任务拆解。",
          reminder: "先锁定最小可运行范围，再扩展能力边界。",
          sourcePostIds: ["post_study_02", "post_study_01"],
        },
        {
          id: "gemini-ai-studio",
          title: "Gemini AI Studio",
          type: "tool",
          image:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
          mentionCount: 9,
          keywords: ["多模态", "原型", "验证"],
          summary: "被频繁用于验证 prompt 方向和交互原型。",
          reminder: "建议先跑小样本，不要直接全量接入。",
          sourcePostIds: ["post_study_07", "post_study_05"],
        },
        {
          id: "vercel-demo",
          title: "Vercel Demo",
          type: "tool",
          image:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
          mentionCount: 8,
          keywords: ["部署", "展示", "MVP"],
          summary: "用于快速完成可分享的在线演示版本。",
          reminder: "优先保证核心路径可用，再做性能打磨。",
          sourcePostIds: ["post_study_02", "post_study_09"],
        },
      ],
    },
    {
      id: "cat_lifestyle",
      slug: "lifestyle",
      title: "生活方式爪印",
      type: "lifestyle",
      coverImage:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1000&q=80",
      postCount: 16,
      insight: "本周生活类爪印更偏向恢复状态、整理生活和建立轻量计划。",
      keywords: ["松弛感", "整理", "效率"],
      commentSummary: ["先做一点点", "不要过载", "恢复优先"],
      sourcePostIds: ["post_lifestyle_01", "post_lifestyle_03", "post_lifestyle_05"],
      items: [
        {
          id: "weekend-room-reset",
          title: "周末整理房间",
          type: "lifestyle",
          image:
            "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
          mentionCount: 7,
          keywords: ["整理", "空间", "恢复"],
          summary: "通过清理桌面和衣物分区，帮助恢复日常节奏。",
          reminder: "先从一个小区域开始，不要一次铺太大。",
          sourcePostIds: ["post_lifestyle_01", "post_lifestyle_04"],
        },
        {
          id: "coffee-study",
          title: "咖啡店学习",
          type: "lifestyle",
          image:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
          mentionCount: 5,
          keywords: ["专注", "效率", "轻任务"],
          summary: "更适合处理轻任务和复盘，不适合重思考深工。",
          reminder: "提前准备任务清单，避免到店后无目标刷手机。",
          sourcePostIds: ["post_lifestyle_02", "post_lifestyle_05"],
        },
        {
          id: "low-cost-reset-plan",
          title: "低成本放松计划",
          type: "lifestyle",
          image:
            "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=800&q=80",
          mentionCount: 6,
          keywords: ["松弛感", "轻量计划", "恢复"],
          summary: "优先安排能快速恢复状态的小行动，降低执行门槛。",
          reminder: "先完成一个具体动作，不必一次改变太多。",
          sourcePostIds: ["post_lifestyle_03", "post_lifestyle_05", "post_lifestyle_01"],
        },
      ],
    },
  ],
};

export function getHeartBoardCategoryById(categoryId: string): HeartBoardCategory | undefined {
  return mockHeartBoard.categories.find(
    (category) => category.slug === categoryId || category.id === categoryId,
  );
}

export function getHeartBoardItem(
  categoryId: string,
  itemId: string,
): { category: HeartBoardCategory; item: HeartBoardItem } | undefined {
  const category = getHeartBoardCategoryById(categoryId);
  if (!category) return undefined;

  const item = category.items.find((entry) => entry.id === itemId);
  if (!item) return undefined;

  return { category, item };
}
