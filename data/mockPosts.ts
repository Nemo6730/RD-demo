export type FeedPost = {
  id: number;
  title: string;
  author: string;
  likes: number;
  coverImage: string;
  excerpt: string;
  link: string;
};

export const mockPosts: FeedPost[] = [
  {
    id: 1,
    title: "27 届暑期，对于 AI Coding 面试的一些经验",
    author: "孜然味中翅",
    likes: 753,
    coverImage:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1e3?auto=format&fit=crop&w=900&q=80",
    excerpt: "最近参加了几家大厂面试，整理了 AI Coding 面试变化与实战建议。",
    link: "/post/1",
  },
  {
    id: 2,
    title: "Claude Code、Codex、Cursor 组合拳到底怎么用",
    author: "阿澄",
    likes: 214,
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    excerpt: "从任务拆解到交付的完整协同流程，一篇看懂。",
    link: "/post/1",
  },
  {
    id: 3,
    title: "周末想去的约会餐厅清单，预算友好版",
    author: "姜饼",
    likes: 188,
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    excerpt: "安静、好拍、好吃，适合两人约会和朋友小聚。",
    link: "/post/1",
  },
  {
    id: 4,
    title: "混油皮底妆测评：轻薄、持妆、自然光泽怎么平衡",
    author: "莓莓",
    likes: 426,
    coverImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    excerpt: "通勤 10 小时妆效记录，附产品组合和踩坑点。",
    link: "/post/1",
  },
  {
    id: 5,
    title: "预算 5k 的海边短途旅行，拍照机位全整理",
    author: "林北北",
    likes: 532,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    excerpt: "从交通、住宿、穿搭到构图，一篇搞定。",
    link: "/post/1",
  },
  {
    id: 6,
    title: "有控力不强的宝子，大学拖延怎么自救",
    author: "小鲸鱼",
    likes: 97,
    coverImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    excerpt: "不是懒，是执行系统出了问题，分享可执行方案。",
    link: "/post/1",
  },
];

export const postDetail = {
  id: 1,
  title: "27 届暑期，对于 AI Coding 面试的一些经验",
  author: "孜然味中翅",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  paragraphs: [
    "主包作为一个 27 届正在艰苦找暑期的牛马，在经历了 n 次面试和拷打了之后感觉今年的暑期实习面试已经发生了显著的变化。",
    "随着 agent 的流行，现在的面试，尤其是一面已经越来越喜欢考察现场 AI Coding，这也意味着已经不能按传统节奏埋头刷 LeetCode 了。",
    "今天结合我近期参与几家大厂的面试，整理了一些内容，供大家参考，避免踩坑。",
  ],
};

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
