export type MockPost = {
  id: string;
  title: string;
  author: string;
  likes: number;
  favorites: number;
  comments: number;
  coverImage: string;
  excerpt: string;
  paragraphs: string[];
};

export type FeedPost = MockPost;

export const mockPosts: MockPost[] = [
  {
    id: "post_001",
    title: "27 届暑期，对于 AI Coding 面试的一些经验",
    author: "孜然味中翅",
    likes: 753,
    favorites: 1110,
    comments: 13,
    coverImage:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1e3?auto=format&fit=crop&w=900&q=80",
    excerpt: "最近参加了几家大厂面试，整理了 AI Coding 面试变化与实战建议。",
    paragraphs: [
      "主包作为一个 27 届正在艰苦找暑期的牛马，在经历了 n 次面试和拷打了之后感觉今年的暑期实习面试已经发生了显著的变化。",
      "随着 agent 的流行，现在的面试，尤其是一面已经越来越喜欢考察现场 AI Coding，这也意味着已经不能按传统节奏埋头刷 LeetCode 了。",
      "今天结合我近期参与几家大厂的面试，整理了一些内容，供大家参考，避免踩坑。",
    ],
  },
  {
    id: "post_002",
    title: "Claude Code、Codex、Cursor 组合拳到底怎么用",
    author: "阿澄",
    likes: 214,
    favorites: 596,
    comments: 42,
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    excerpt: "从任务拆解到交付的完整协同流程，一篇看懂。",
    paragraphs: [
      "很多人觉得工具越多越乱，但只要先定义目标，再按阶段分工，效率会提升很多。",
      "我把一周内的 demo 任务拆成需求澄清、页面搭建、接口封装和验收四步，分别给不同工具处理。",
      "最终上线前只保留最少依赖，重点是让演示路径顺滑。",
    ],
  },
  {
    id: "post_003",
    title: "周末想去的约会餐厅清单，预算友好版",
    author: "姜饼",
    likes: 188,
    favorites: 502,
    comments: 25,
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    excerpt: "安静、好拍、好吃，适合两人约会和朋友小聚。",
    paragraphs: [
      "我把收藏夹里最常被问到的 6 家店整理在一起，按地铁和预约难度排序。",
      "如果是周五晚餐，建议提前 2-3 天订位，否则热门时段基本都满。",
      "整体人均在 120-220 之间，适合周末轻松吃一顿。",
    ],
  },
  {
    id: "post_004",
    title: "混油皮底妆测评：轻薄、持妆、自然光泽怎么平衡",
    author: "莓莓",
    likes: 426,
    favorites: 803,
    comments: 71,
    coverImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    excerpt: "通勤 10 小时妆效记录，附产品组合和踩坑点。",
    paragraphs: [
      "测试从早上 8 点上妆到晚上 7 点，重点看鼻翼和下巴的脱妆情况。",
      "轻薄并不等于不遮瑕，关键是分区处理：底妆薄涂，局部再点遮瑕。",
      "定妆喷雾放在散粉后，持妆会更稳定。",
    ],
  },
  {
    id: "post_005",
    title: "预算 5k 的海边短途旅行，拍照机位全整理",
    author: "林北北",
    likes: 532,
    favorites: 920,
    comments: 55,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    excerpt: "从交通、住宿、穿搭到构图，一篇搞定。",
    paragraphs: [
      "周末 3 天 2 夜真的够用，核心是别把行程排太满。",
      "清晨和傍晚的海边光线最友好，手机也能拍出电影感。",
      "建议租车前先看停车评价，临海热门点位停车压力很大。",
    ],
  },
  {
    id: "post_006",
    title: "有控力不强的宝子，大学拖延怎么自救",
    author: "小鲸鱼",
    likes: 97,
    favorites: 340,
    comments: 19,
    coverImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    excerpt: "不是懒，是执行系统出了问题，分享可执行方案。",
    paragraphs: [
      "先接受自己当前状态，不需要一上来就制定超大计划。",
      "我用 25 分钟任务块 + 5 分钟站起来活动的方法，执行率明显提高。",
      "先完成一个最小动作，再慢慢加码，会比一次性冲刺更稳定。",
    ],
  },
];

export function getPostById(postId: string): MockPost | undefined {
  if (postId === "1") return mockPosts[0];
  return mockPosts.find((post) => post.id === postId);
}

export function getPostsByIds(postIds: string[]): MockPost[] {
  return postIds
    .map((postId) => getPostById(postId))
    .filter((post): post is MockPost => Boolean(post));
}

export const profileNotes = [
  {
    id: 11,
    title: "这个点我猜过",
    subtitle: "快来参与猜题吧",
    views: 916,
    cover:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 12,
    title: "燕云男女主之争",
    subtitle: "今天你站哪一边",
    views: 1265,
    cover:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
  },
];
