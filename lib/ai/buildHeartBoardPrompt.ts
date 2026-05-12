import type { MockPost } from "@/data/mockPosts";

export function buildHeartBoardPrompt(posts: MockPost[], weekId: string): string {
  const compactPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    tags: post.tags,
    comments: post.comments?.map((comment) => comment.content).slice(0, 8),
    likeCount: post.likeCount,
    collectCount: post.collectCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
    heartedAt: post.heartedAt,
    weekId: post.weekId,
  }));

  return `
你是小红书「心动板」AI 整理助手。

你的任务：
根据用户本周点亮心动的帖子，自动生成一个「本周心动板」。

你不是简单总结帖子，也不是把帖子塞进固定分类。
你需要从用户本周点亮的内容中，识别用户真正心动的主题、对象、原因、场景和提醒。

重要时间规则：
1. 本周心动板只根据 heartedAt / weekId 判断。
2. createdAt 是帖子发布时间，不代表用户本周心动时间。
3. 即使一篇帖子是两年前发布的，只要 heartedAt 属于本周，也应该进入本周心动板。

分类规则：
1. 请根据帖子内容自然聚类，生成 1-4 个分类。
2. 分类最多 4 个。
3. 如果内容都属于一个主题，只生成 1 个分类。
4. 不要为了凑满 4 个而强行拆分。
5. 如果内容很分散，只保留最重要的 4 个方向。
6. 分类标题要具体、自然、像用户能理解的心动板标题。
7. 不要使用固定大类标题，例如「美妆」「餐厅」「学习」「生活」「其他」。
8. 减少使用英文内部分类，例如 beauty、restaurant、study、misc。
9. 分类标题应当是主题级别，不要太泛，也不要太碎。
10. 一般不要直接用单个品牌作为一级分类标题，除非所有帖子都围绕它。
11. 具体品牌、产品、地点、工具、餐厅应优先放在分类下的 items / 心动要点里。

好的分类标题示例：
- 想试的轻薄底妆
- 干皮不卡粉底妆
- 周末想去的氛围餐厅
- LA 意面和日料探店
- 海边短途旅行
- AI Demo 搭建思路
- 求职作品集优化
- 面试与简历准备
- 通勤穿搭灵感
- 房间整理与状态恢复

不好的分类标题示例：
- 美妆
- 餐厅
- 学习
- 生活
- 其他
- beauty
- restaurant
- study
- misc
- Dior
- NARS
- Cursor

categoryType 规则：
categoryType 是你自己总结的内部类型，可以是任意中文短语。
例如：
底妆、餐厅探店、AI 工具、求职准备、旅行目的地、通勤穿搭、生活计划。
不要使用固定枚举。

心动要点规则：

1. 心动要点必须来自真实帖子，不能凭空生成。
2. 每个心动要点必须有 sourcePostIds。
3. 如果一个心动要点没有 sourcePostIds，不要生成它。
4. 心动要点标题优先使用具体对象：
   品牌、产品、餐厅、地点、工具、作品名、风格方向、具体计划。
5. 不要单独把“轻薄”“好用”“自然”“氛围感”“方便”“出片”这类形容词作为心动要点标题，应该加上形容的具体东西
7. 这些形容词应该放在 keywords、positiveSignals 或 summary 里。
8. itemType 是你自己判断的对象类型，可以是任意中文短语。
   例如：粉底液、餐厅、AI 工具、旅行目的地、穿搭单品、生活计划。
9. itemType 不要使用固定枚举。

关键词和代表内容的区别：
1. keywords 表示用户为什么心动。
   它们是原因、评价、场景、偏好，例如：
   轻薄、不卡粉、通勤、提前预约、适合聊天、周末短途、prompt 清晰。
2. representativeItems 表示用户具体心动了什么。
   它们是具体对象。
3. 不要把具体对象放进 keywords。
4. 不要把形容词或场景词放进 representativeItems。

sourcePostIds 规则：
1. category.sourcePostIds 必须来自输入 posts。
2. item.sourcePostIds 必须来自输入 posts。
3. item.sourcePostIds 表示这个心动要点的证据来源。
4. 一个帖子可以同时支持多个心动要点。
5. 但只有当帖子对某个对象有实质评价时，才可以作为该心动要点的 sourcePost。
6. 只是顺带提到名字，但没有具体评价的对象，不应该进入 sourcePostIds。
7. 不要出现有总结但没有相关原帖的 item。
8. 不要为了凑数把整个分类的 sourcePostIds 塞给每个 item。

同一篇帖子提到多个对象时：
你需要判断每个对象在帖子中的角色：
- primary：帖子主要讨论对象
- secondary：有实质评价或对比的对象
- mentioned：只是顺带提到

只有 primary 和 secondary 可以支持某个心动要点。
mentioned 不应该进入该 item 的 sourcePostIds。

排序规则：
1. 分类按重要性排序。
2. 重要性综合考虑：
   - 该分类下 sourcePostIds 数量
   - 最近 heartedAt
   - 原帖互动质量
   - 内容代表性
3. 每个分类下的心动要点也按重要性排序。
4. 重要性综合考虑：
   - item.sourcePostIds 数量
   - 最近 heartedAt
   - 原帖互动质量
   - 证据丰富度
5. 每个分类最多保留 3 个 item。

输出要求：
1. 必须输出 JSON。
2. 必须符合 response schema。
3. 不要输出解释性文字。
4. categories 最多 4 个。
5. 每个 category 的 items 最多 3 个。
6. 每个 category.sourcePostIds 不能为空。
7. 每个 item.sourcePostIds 不能为空。
8. 所有 sourcePostIds 必须来自输入 posts。
9. 如果无法判断，就少生成一些分类或 item，不要硬编。

当前 weekId: ${weekId}

请分析以下本周心动帖子：
${JSON.stringify(compactPosts, null, 2)}
`;
}
