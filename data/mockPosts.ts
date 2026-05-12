export type MockComment = {
  id: string;
  userName: string;
  content: string;
  likeCount: number;
};

export type MockPost = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  coverImage: string;
  images?: string[];
  tags: string[];
  likeCount: number;
  collectCount: number;
  commentCount: number;
  comments: MockComment[];
  isHearted: boolean;
  createdAt: string;
  heartedAt?: string;
  weekId?: string;
  hiddenCategory?: "beauty" | "restaurant" | "travel" | "study" | "fashion" | "lifestyle" | "misc";
};

export type FeedPost = MockPost;

function makeComments(postId: string, entries: Array<[string, string, number]>): MockComment[] {
  return entries.map(([userName, content, likeCount], index) => ({
    id: `${postId}_comment_${String(index + 1).padStart(2, "0")}`,
    userName,
    content,
    likeCount,
  }));
}

const baseMockPosts: MockPost[] = [
  {
    id: "post_beauty_01",
    title: "Dior Forever 混干皮通勤实测：遮瑕够用但要分区上",
    content:
      "我一开始以为这支会偏厚，结果薄涂一层其实很轻。重点是别全脸一口气推开，我改成两颊先拍开、T 区最后补，整体会更贴。持妆到下午六点还在线，鼻翼有一点点起皮但不斑驳。适合通勤和会议日，想拍很强轮廓感妆面可能要再叠遮瑕。",
    authorName: "莓莓同学",
    authorAvatar: "/images/mock/avatar-beauty-01.jpg",
    coverImage: "/images/mock/beauty-01.jpg",
    images: ["/images/mock/beauty-01.jpg", "/images/mock/beauty-02.jpg"],
    tags: ["Dior Forever", "混干皮", "分区上妆", "通勤底妆"],
    likeCount: 864,
    collectCount: 1320,
    commentCount: 3,
    comments: makeComments("post_beauty_01", [
      ["阿圆", "你是配什么妆前？我鼻翼总是两小时就卡纹。", 22],
      ["Lin", "我也用这支，按压半泵真的够全脸，厚涂反而不好看。", 17],
      ["momo", "提醒一下深一点色号会偏黄，线下试色更稳。", 14],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T08:20:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_02",
    title: "NARS Light Reflecting 三天记录：镜头友好但要控油",
    content:
      "这支在室内灯下真的很漂亮，肤质会被柔焦掉一点。我连续三天通勤用下来，早上九点到下午五点状态都不错，但如果中午吃了辣，鼻翼会先冒油。建议午后补一次散粉就够，不要叠太多层，不然边界会发灰。整体更适合追求自然奶油感的人。",
    authorName: "Kora",
    authorAvatar: "/images/mock/avatar-beauty-02.jpg",
    coverImage: "/images/mock/beauty-02.jpg",
    tags: ["NARS Light Reflecting", "奶油肌", "镜头妆效", "午后补妆"],
    likeCount: 902,
    collectCount: 1471,
    commentCount: 3,
    comments: makeComments("post_beauty_02", [
      ["Cici", "你有试过和定妆喷雾搭吗？我单用会有点移位。", 19],
      ["Rita", "油皮友情提醒，粉扑按压比刷子更稳。", 13],
      ["白桃", "这支拍照确实很顶，我婚宴也用过。", 11],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T11:10:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_03",
    title: "口罩天气的遮瑕组合：黑眼圈和鼻翼泛红分开处理",
    content:
      "我最近不再追求一支遮瑕打天下，改成黑眼圈用偏橘、鼻翼用偏黄，整体更干净。步骤是先薄铺底妆，再局部点涂、海绵轻拍，最后小范围按散粉。三天都没出现明显积线。这个方法时间会多两分钟，但出门后基本不用补太多，尤其戴口罩也不糊。",
    authorName: "阿鹿",
    authorAvatar: "/images/mock/avatar-beauty-03.jpg",
    coverImage: "/images/mock/beauty-03.jpg",
    tags: ["遮瑕分区", "黑眼圈校色", "鼻翼泛红", "口罩妆"],
    likeCount: 601,
    collectCount: 990,
    commentCount: 3,
    comments: makeComments("post_beauty_03", [
      ["Jojo", "求问你用哪块海绵？我拍完总是把底妆带走。", 16],
      ["June", "分区这个思路太有用了，今天试完明显自然。", 21],
      ["Sasa", "干皮记得先补水，不然眼下会更明显。", 9],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T18:00:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_04",
    title: "散粉不翻车技巧：只按压会出油的区域",
    content:
      "以前我习惯全脸扫一层散粉，结果下午就发干。现在只在鼻翼、额头和下巴按压，脸颊保留一点光泽，妆面反而更贵气。重点是粉量一定要少，粉扑先在手背拍掉多余再上脸。这个方法拍照和日常都能兼顾，尤其下午三点以后不会出现面具感。",
    authorName: "Miya",
    authorAvatar: "/images/mock/avatar-beauty-04.jpg",
    coverImage: "/images/mock/beauty-04.jpg",
    tags: ["散粉按压", "局部定妆", "下午不暗沉", "妆面平衡"],
    likeCount: 588,
    collectCount: 876,
    commentCount: 3,
    comments: makeComments("post_beauty_04", [
      ["南希", "我就是全脸扫粉派，难怪总觉得脸发灰。", 12],
      ["M", "只定 T 区真的有差，脸颊看起来更有弹性。", 15],
      ["佩佩", "油皮也可以这样吗？我怕下午直接出油。", 10],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T09:40:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_05",
    title: "妆前防晒二选一踩坑：搓泥不是你手法慢",
    content:
      "我连续两周测试后发现，很多搓泥并不是手法问题，而是成膜时间没给够。现在我的做法是防晒后等三分钟，再上妆前，粉底服帖度明显提升。通勤赶时间时我会直接跳过妆前，改用保湿喷雾。这样步骤更少，反而更稳定，尤其在空调房里不会起屑。",
    authorName: "楠楠",
    authorAvatar: "/images/mock/avatar-beauty-05.jpg",
    coverImage: "/images/mock/beauty-05.jpg",
    tags: ["防晒成膜", "妆前打底", "搓泥排查", "空调房底妆"],
    likeCount: 744,
    collectCount: 1188,
    commentCount: 3,
    comments: makeComments("post_beauty_05", [
      ["77", "三分钟这条太关键，我之前都是立刻叠。", 20],
      ["阿珂", "我试过喷雾替代妆前，确实省时还不打架。", 13],
      ["Niko", "求你常用的防晒名单，油皮想抄作业。", 11],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T13:15:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_06",
    title: "办公室补妆包精简到 4 样：真的够用",
    content:
      "我把补妆包从十几样减到四样：吸油纸、迷你散粉、唇膏、棉签。流程是先压油，再点压散粉，最后修边界。以前我总想着带一堆产品，结果越补越厚。现在补妆三分钟完成，镜子里状态比上午还整洁。建议大家先把流程简化，别被工具数量绑架。",
    authorName: "Yoyo",
    authorAvatar: "/images/mock/avatar-beauty-06.jpg",
    coverImage: "/images/mock/beauty-06.jpg",
    tags: ["补妆包", "吸油纸", "迷你散粉", "办公室妆容"],
    likeCount: 507,
    collectCount: 771,
    commentCount: 3,
    comments: makeComments("post_beauty_06", [
      ["雨晴", "棉签修边界这个我第一次听，立刻学。", 9],
      ["Pei", "我也是带太多反而不会补，谢谢你这套流程。", 14],
      ["猫猫", "中午补一次到下班够吗？", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T17:50:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_07",
    title: "三支日常口红试色：会议、约会、素颜分别怎么选",
    content:
      "最近常用三支色：偏豆沙的开会不突兀，偏砖红的晚饭显气色，偏玫瑰的素颜也不脏。关键是别只看手臂试色，嘴唇底色会改变很多。我的经验是先薄涂一层再叠，边界更自然。预算有限的话先买一支“上班不出错色”，实用性真的最高。",
    authorName: "嘉妮",
    authorAvatar: "/images/mock/avatar-beauty-07.jpg",
    coverImage: "/images/mock/beauty-07.jpg",
    tags: ["豆沙口红", "砖红调", "素颜友好", "通勤妆容"],
    likeCount: 479,
    collectCount: 689,
    commentCount: 3,
    comments: makeComments("post_beauty_07", [
      ["Olivia", "同意嘴唇底色影响很大，柜台灯太骗人了。", 8],
      ["Suki", "先薄涂再叠这个方法很有用，不会一上来过重。", 12],
      ["禾禾", "求开会那支具体色号！", 10],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T08:30:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_08",
    title: "防晒补涂真实测试：喷雾和乳液哪个更靠谱",
    content:
      "我把同一周通勤分成两组测试，喷雾补涂速度快但覆盖容易不均，乳液慢一点却更安心。最后折中方案是：上午乳液打底，下午用喷雾补一次，再轻压散粉。这样不会破坏底妆太多，也能维持防晒。户外停留时间长的话，还是建议补乳液更稳。",
    authorName: "白桃冻",
    authorAvatar: "/images/mock/avatar-beauty-08.jpg",
    coverImage: "/images/mock/beauty-08.jpg",
    tags: ["防晒补涂", "喷雾防晒", "通勤日晒", "底妆兼容"],
    likeCount: 531,
    collectCount: 812,
    commentCount: 3,
    comments: makeComments("post_beauty_08", [
      ["Yun", "喷雾确实容易漏，尤其发际线。", 6],
      ["Luna", "你这个折中方案我明天就试。", 9],
      ["Mia", "户外暴晒那天我会直接卸妆重上。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T12:20:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_09",
    title: "遮瑕刷和手指对比：哪种更适合眼下细纹",
    content:
      "我一直以为刷子更专业，但眼下细纹其实手指温度更好融合。现在做法是先用小刷子点位，再用无名指轻拍过渡，边界会柔和很多。注意不要来回蹭，越蹭越起皮。这个方法在早八赶时间也可行，动作少但效果比“全刷到底”更自然。",
    authorName: "可可糖",
    authorAvatar: "/images/mock/avatar-beauty-09.jpg",
    coverImage: "/images/mock/beauty-09.jpg",
    tags: ["遮瑕刷", "眼下细纹", "手指融合", "自然边界"],
    likeCount: 467,
    collectCount: 745,
    commentCount: 3,
    comments: makeComments("post_beauty_09", [
      ["Yuki", "我就是越刷越干，原来问题在手法。", 11],
      ["千夏", "先刷后拍真的很像你说的“柔焦”。", 8],
      ["Ari", "干皮建议前一晚眼周多做保湿，会好很多。", 9],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T18:40:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_beauty_10",
    title: "通勤底妆一周复盘：比产品更重要的是顺序",
    content:
      "我把一周出门妆容拍照复盘后发现，同样产品换一个顺序差别巨大。先底妆后遮瑕比先遮瑕后底妆更干净；定妆喷雾放在最后一步，整体会更贴。以前我总怪产品不行，其实是流程不稳定。建议大家固定一套顺序连续试三天，再判断要不要换单品。",
    authorName: "小妙妙",
    authorAvatar: "/images/mock/avatar-beauty-10.jpg",
    coverImage: "/images/mock/beauty-10.jpg",
    tags: ["通勤底妆", "上妆顺序", "妆面复盘", "定妆喷雾"],
    likeCount: 690,
    collectCount: 1012,
    commentCount: 3,
    comments: makeComments("post_beauty_10", [
      ["Emma", "固定流程这个思路太实用了，减少变量。", 15],
      ["Nan", "我先遮瑕真的会灰，换顺序后好多了。", 12],
      ["花卷", "复盘拍照这个习惯我要学起来。", 10],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T09:10:00.000Z",
    hiddenCategory: "beauty",
  },
  {
    id: "post_restaurant_01",
    title: "West Hollywood 这家意面店，适合慢慢聊到关门",
    content:
      "周六晚上临时约饭去的，环境比我预想安静很多，音乐音量不会盖过聊天。番茄海鲜意面偏清爽，不会吃到后面腻。唯一要注意的是停车位紧张，我们绕了两圈才停好。想去的话建议工作日晚上或提前订位，周末临时去基本都要等。",
    authorName: "姜饼",
    authorAvatar: "/images/mock/avatar-restaurant-01.jpg",
    coverImage: "/images/mock/restaurant-01.jpg",
    tags: ["West Hollywood", "意面", "约会感", "提前订位"],
    likeCount: 382,
    collectCount: 640,
    commentCount: 3,
    comments: makeComments("post_restaurant_01", [
      ["Lily", "这家停车确实难，我后来直接打车去了。", 7],
      ["Q", "海鲜意面是辣口吗？我朋友不太吃辣。", 5],
      ["Momo", "工作日六点去基本不用等，亲测。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T19:30:00.000Z",
    hiddenCategory: "restaurant",
  },
  {
    id: "post_restaurant_02",
    title: "Silver Lake brunch 清单更新：法式吐司这家最稳",
    content:
      "我这月连着试了三家 brunch，最后留下这家是因为出品稳定。法式吐司外脆里软，不会甜到齁；咖啡偏坚果调，和蛋料理搭配刚好。周日十点后排队明显变长，我们十一点到等了四十分钟。建议九点半前到，或者直接线上先挂号。",
    authorName: "Riko",
    authorAvatar: "/images/mock/avatar-restaurant-02.jpg",
    coverImage: "/images/mock/restaurant-02.jpg",
    tags: ["Silver Lake", "brunch", "法式吐司", "线上排号"],
    likeCount: 356,
    collectCount: 588,
    commentCount: 3,
    comments: makeComments("post_restaurant_02", [
      ["阿秋", "这家咖啡我也喜欢，酸度不会太高。", 6],
      ["Nora", "九点四十到还来得及吗？", 4],
      ["Mika", "周三去过，体感很舒服，几乎不用等。", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T10:25:00.000Z",
    hiddenCategory: "restaurant",
  },
  {
    id: "post_restaurant_03",
    title: "小型日料吧台体验：不是网红店但很适合聊天",
    content:
      "这家不是那种打卡感很重的店，但我反而更喜欢。吧台师傅会根据当天鱼料给建议，不会强推高价套餐。我们两个人点了握寿司和热菜，人均在合理区间。缺点是座位少，临时去很容易满。适合想好好吃饭聊天，不适合赶时间的人。",
    authorName: "阿晴",
    authorAvatar: "/images/mock/avatar-restaurant-03.jpg",
    coverImage: "/images/mock/restaurant-03.jpg",
    tags: ["吧台日料", "握寿司", "安静氛围", "小众店"],
    likeCount: 244,
    collectCount: 401,
    commentCount: 3,
    comments: makeComments("post_restaurant_03", [
      ["Hana", "这种店最怕被拍成网红，希望别太火。", 9],
      ["kk", "请问人均大概多少？", 4],
      ["阿川", "师傅会根据预算推荐，这点确实加分。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T20:10:00.000Z",
    hiddenCategory: "restaurant",
  },
  {
    id: "post_restaurant_04",
    title: "Downtown 咖啡店工作日探店：插座和网络都在线",
    content:
      "这家咖啡店很适合需要带电脑的人，桌距够开，不会一直被打断。网络速度稳定，上午处理文档和开会都没掉线。餐点不算惊艳，但贝果和拿铁组合够日常。中午十二点后会突然满座，想坐久一点建议十点前到，下午高峰确实吵。",
    authorName: "雨桐",
    authorAvatar: "/images/mock/avatar-restaurant-04.jpg",
    coverImage: "/images/mock/restaurant-04.jpg",
    tags: ["Downtown", "咖啡店办公", "插座友好", "工作日"],
    likeCount: 299,
    collectCount: 510,
    commentCount: 3,
    comments: makeComments("post_restaurant_04", [
      ["Polly", "感谢！我就需要这种能开会的店。", 7],
      ["舟舟", "有时间限制吗？", 3],
      ["Lena", "下午两点后会安静一点，亲测。", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T11:05:00.000Z",
    hiddenCategory: "restaurant",
  },
  {
    id: "post_restaurant_05",
    title: "约会餐厅避雷清单：好看不一定好吃，先看菜单结构",
    content:
      "最近踩了两家“拍照很美但吃完空虚”的店，复盘后发现问题在菜单：几乎都是冷菜和甜口，主菜选择太少。后来我筛店会先看热菜比例和评价里“复购率”关键词。这样筛出来的店虽然没那么网红，但用餐体验稳定得多。周末约会建议留一点余量，别卡点到店。",
    authorName: "阿眠",
    authorAvatar: "/images/mock/avatar-restaurant-05.jpg",
    coverImage: "/images/mock/restaurant-05.jpg",
    tags: ["约会氛围", "菜单结构", "复购率", "周末订位"],
    likeCount: 341,
    collectCount: 579,
    commentCount: 3,
    comments: makeComments("post_restaurant_05", [
      ["Rin", "看菜单结构这招太实用了，之前真没想到。", 11],
      ["凯西", "我也遇过好看难吃，约会真的很尴尬。", 9],
      ["Jess", "提前半小时到店这个建议同意，周末很容易排。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T18:45:00.000Z",
    hiddenCategory: "restaurant",
  },
  {
    id: "post_travel_01",
    title: "Santa Barbara 周末短途：不赶行程反而更值",
    content:
      "这次只排了三个点：海边散步、码头吃饭、傍晚看日落。以前我总想把景点塞满，最后拍了很多照却很疲惫。现在留白后体验更好，路上还有时间临时进一家小书店。建议住一晚靠近海边的位置，第二天早起散步很舒服，整体节奏会完全不一样。",
    authorName: "林北北",
    authorAvatar: "/images/mock/avatar-travel-01.jpg",
    coverImage: "/images/mock/travel-01.jpg",
    tags: ["Santa Barbara", "周末短途", "海边散步", "日落时刻"],
    likeCount: 620,
    collectCount: 999,
    commentCount: 3,
    comments: makeComments("post_travel_01", [
      ["Nia", "想问你住的是哪一片？停车方便吗？", 10],
      ["阿璃", "留白行程真的更有度假感。", 12],
      ["Yin", "码头那家海鲜我也吃过，分量很实在。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T07:55:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_02",
    title: "Malibu 海边公路拍照点：下午四点光线最友好",
    content:
      "我踩了三个观景点，发现下午四点到六点的光线最平衡，不会正午那种刺眼阴影。穿浅色衣服在逆光下更有层次，手机也能拍出通透感。路边停车位不多，节假日建议提前到。想拍“海边公路”画面的话，记得留一点远景，不然会显得很挤。",
    authorName: "橙子",
    authorAvatar: "/images/mock/avatar-travel-02.jpg",
    coverImage: "/images/mock/travel-02.jpg",
    tags: ["Malibu", "海边公路", "拍照光线", "观景点"],
    likeCount: 544,
    collectCount: 842,
    commentCount: 3,
    comments: makeComments("post_travel_02", [
      ["咪粒", "四点这个时间点很准，亲测不会脸黑。", 9],
      ["Anya", "求三个点位坐标，我总找不到好角度。", 7],
      ["韩韩", "逆光拍人像时可以稍微降曝光，细节会更好。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T16:40:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_03",
    title: "San Diego 两日路线：海边+博物馆这样排不赶",
    content:
      "我把第一天留给海边和老城区，第二天才去博物馆区，体感比“每天都跑点”轻松很多。博物馆区步行距离其实不短，穿舒服鞋很关键。午后太阳强的时候进室内看展，傍晚再出门拍街景会更舒服。预算上交通和停车要提前算进去，临时找位会很焦虑。",
    authorName: "迟迟",
    authorAvatar: "/images/mock/avatar-travel-03.jpg",
    coverImage: "/images/mock/travel-03.jpg",
    tags: ["San Diego", "两日路线", "博物馆区", "老城区"],
    likeCount: 489,
    collectCount: 760,
    commentCount: 3,
    comments: makeComments("post_travel_03", [
      ["K", "舒服鞋这条太真实，我上次脚直接废了。", 8],
      ["Roro", "请问博物馆区附近吃饭方便吗？", 5],
      ["Penny", "我也是先海边后看展，节奏会顺很多。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T09:05:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_04",
    title: "Joshua Tree 一日徒步新手建议：别低估补水",
    content:
      "我原本以为春天不热，结果走两个小时就明显脱水。后来调整成轻量徒步+高频补水，状态立刻好很多。路线尽量选标识清楚的短线，第一次去不要挑战太偏的点。日落前半小时光线很美，但温差会突然降，薄外套一定要带。安全感比出片更重要。",
    authorName: "平平",
    authorAvatar: "/images/mock/avatar-travel-04.jpg",
    coverImage: "/images/mock/travel-04.jpg",
    tags: ["Joshua Tree", "徒步新手", "补水提醒", "日落温差"],
    likeCount: 571,
    collectCount: 910,
    commentCount: 3,
    comments: makeComments("post_travel_04", [
      ["Kai", "温差这点我也吃过亏，晚上真的冷。", 10],
      ["Eve", "请问你走的是哪条短线？", 5],
      ["Ming", "补水电解质一起带会更稳。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T15:25:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_05",
    title: "LA 周边海边小镇比较：想放空选哪一个",
    content:
      "我最近连续去了三个小镇，最明显差异不是风景，而是人流密度和停车压力。想纯放空的话选人少一点的点位，虽然餐饮选择少，但整体体验更安静。想边逛边吃就选商业区完整的海边镇。建议出发前先看停车场实时情况，不然会把好心情都耗在绕路上。",
    authorName: "阿休",
    authorAvatar: "/images/mock/avatar-travel-05.jpg",
    coverImage: "/images/mock/travel-05.jpg",
    tags: ["海边小镇", "周末放空", "停车压力", "人流密度"],
    likeCount: 438,
    collectCount: 699,
    commentCount: 3,
    comments: makeComments("post_travel_05", [
      ["Yana", "停车场实时这个信息在哪看呀？", 4],
      ["舟", "人少但安静这点我太懂了，宁愿少吃几家。", 6],
      ["Luna", "商业区完整的那种确实更适合带爸妈。", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T07:50:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_06",
    title: "周末看展路线：把交通时间当成行程一部分",
    content:
      "我以前总把展览按“场馆数量”排，结果一天跑到崩。后来改成只看两个展，中间留出咖啡和通勤时间，反而记住了更多内容。建议提前下载场馆地图，重点展区先看，闭馆前留半小时逛周边文创。这样不会被时间追着跑，体验会完整很多。",
    authorName: "柚子茶",
    authorAvatar: "/images/mock/avatar-travel-06.jpg",
    coverImage: "/images/mock/travel-06.jpg",
    tags: ["周末看展", "场馆地图", "路线规划", "闭馆前打卡"],
    likeCount: 366,
    collectCount: 587,
    commentCount: 3,
    comments: makeComments("post_travel_06", [
      ["M", "只看两个展这个思路太正确了。", 7],
      ["阿年", "场馆地图提前看真的省脚力。", 8],
      ["Holly", "我每次都贪多，下次照你这个排。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T14:35:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_07",
    title: "海边日落拍摄实测：手机参数这样调更稳定",
    content:
      "这次完全用手机拍，重点是提前锁曝光，再微降一点亮度，天空层次会更干净。人物背光时别硬拉脸部，宁可让人物成剪影，整体会更有氛围。风大时开实况再选帧，能救回很多抖动。拍完记得立刻简单筛选，不然回家会被几百张图压垮。",
    authorName: "Nia",
    authorAvatar: "/images/mock/avatar-travel-07.jpg",
    coverImage: "/images/mock/travel-07.jpg",
    tags: ["海边日落", "手机拍摄", "锁曝光", "实况选帧"],
    likeCount: 712,
    collectCount: 1058,
    commentCount: 3,
    comments: makeComments("post_travel_07", [
      ["Jade", "剪影建议太实用，真的比硬拉亮好看。", 13],
      ["Rin", "实况选帧是我每次都忘记开的功能。", 9],
      ["AK", "你这个参数在安卓也适用吗？", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T06:40:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_travel_08",
    title: "短途火车出行记录：不租车也能玩得顺",
    content:
      "这次特意没租车，改用火车+步行+短打车，整个周末反而轻松。火车沿海那段风景很值，适合慢慢看。要注意的是回程班次别卡最后一班，一旦延误会很被动。我会把关键换乘点提前写进备忘录，断网时也能看。预算上比租车更可控，适合轻旅行。",
    authorName: "曼曼",
    authorAvatar: "/images/mock/avatar-travel-08.jpg",
    coverImage: "/images/mock/travel-08.jpg",
    tags: ["Amtrak", "短途火车", "不租车出行", "沿海线路"],
    likeCount: 428,
    collectCount: 701,
    commentCount: 3,
    comments: makeComments("post_travel_08", [
      ["Ivy", "感谢！我一直担心不租车会不方便。", 8],
      ["Nono", "回程不卡最后一班这条太关键。", 11],
      ["YJ", "你这个方案带长辈也挺友好。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T12:15:00.000Z",
    hiddenCategory: "travel",
  },
  {
    id: "post_study_01",
    title: "AI Coding 面试准备清单：先把展示路径走通",
    content:
      "我最近被问到最多的不是算法，而是“你如何把需求拆成可交付 demo”。我现在会提前准备一条 5 分钟演示路径：场景、关键功能、技术取舍和下一步计划。面试官更关心你的思路是否清晰。建议先做最小可运行版本，再补细节，不要一上来就追求复杂架构。",
    authorName: "孜然味中翅",
    authorAvatar: "/images/mock/avatar-study-01.jpg",
    coverImage: "/images/mock/study-01.jpg",
    tags: ["AI Coding", "面试准备", "demo路径", "最小可运行"],
    likeCount: 980,
    collectCount: 1680,
    commentCount: 3,
    comments: makeComments("post_study_01", [
      ["Ray", "5 分钟路径这个思路救我了，下周就要面。", 24],
      ["Lynn", "你会把失败方案也讲出来吗？", 13],
      ["Coco", "我补充一个：演示时一定要有 fallback。", 10],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T09:00:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_02",
    title: "Cursor 做实习作品集：我用一周做完一个可演示项目",
    content:
      "我把作品集目标拆成四件事：能跑、能讲、能扩展、能留证据。前两天搭页面和路由，第三天补交互，后两天补文档和演示视频。这样即使功能没做满，也能讲清楚判断过程。建议每晚写 10 分钟复盘，第二天会少走很多弯路，进度也更可控。",
    authorName: "阿澄",
    authorAvatar: "/images/mock/avatar-study-02.jpg",
    coverImage: "/images/mock/study-02.jpg",
    tags: ["Cursor", "作品集", "一周计划", "演示视频"],
    likeCount: 721,
    collectCount: 1189,
    commentCount: 3,
    comments: makeComments("post_study_02", [
      ["Mina", "能讲清楚比做满功能更重要，太认同。", 18],
      ["大明", "你复盘是写在 Notion 还是文档里？", 7],
      ["Qin", "建议加一页风险清单，面试里很好用。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T14:30:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_03",
    title: "简历改版后投递命中率提升：经历写法别太平铺",
    content:
      "我以前把项目经历写成“做了什么”，后来改成“解决了什么问题 + 用什么方法 + 最终结果”，面试邀约明显增多。尤其是实习不足的人，更要把判断过程写出来。建议每条经历都能回答“为什么这么做”。描述少一点形容词，多一点可验证结果，会更有说服力。",
    authorName: "阿梨",
    authorAvatar: "/images/mock/avatar-study-03.jpg",
    coverImage: "/images/mock/study-03.jpg",
    tags: ["简历优化", "项目描述", "投递命中率", "结果导向"],
    likeCount: 638,
    collectCount: 1015,
    commentCount: 3,
    comments: makeComments("post_study_03", [
      ["Leo", "“为什么这么做”这个问题真的一针见血。", 14],
      ["Momo", "可验证结果是写数字还是范围？", 6],
      ["晴天", "我改完一周就收到两个约面。", 9],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T10:40:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_04",
    title: "实习申请时间线：别等准备完再投",
    content:
      "我以前总想“再完善一下就投”，结果错过了很多早批机会。现在做法是分两批：第一批先投匹配度高的岗位拿反馈，第二批根据反馈再优化。这样不会把所有压力堆到最后。建议建立一个投递表，记录岗位状态和下一步动作，不然很容易乱掉。",
    authorName: "小唐",
    authorAvatar: "/images/mock/avatar-study-04.jpg",
    coverImage: "/images/mock/study-04.jpg",
    tags: ["实习申请", "时间线", "早批投递", "反馈迭代"],
    likeCount: 553,
    collectCount: 889,
    commentCount: 3,
    comments: makeComments("post_study_04", [
      ["阿笙", "投递表太有必要了，我之前全靠脑子记。", 11],
      ["Kiki", "第一批拿反馈这个思路真的好用。", 8],
      ["Tom", "请问你会同时投多少家？", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T16:15:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_05",
    title: "英语面试表达卡壳？先准备 12 句高频转场",
    content:
      "我以前英文面试经常不是不会说，而是卡在转场。后来准备了 12 句固定句型，比如“先给结论，再展开两点原因”，整个表达稳定很多。关键不是背高级词，而是让结构清楚。建议先用中文列提纲，再翻成自己顺手的英语，不要硬套太复杂的模板。",
    authorName: "Sophie",
    authorAvatar: "/images/mock/avatar-study-05.jpg",
    coverImage: "/images/mock/study-05.jpg",
    tags: ["英语表达", "面试转场", "结论先行", "结构化回答"],
    likeCount: 477,
    collectCount: 780,
    commentCount: 3,
    comments: makeComments("post_study_05", [
      ["Amy", "我也是卡转场，句型准备太救命了。", 9],
      ["Ray", "可以分享其中几句吗？", 6],
      ["J", "结论先行对中文面试也同样有用。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T08:45:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_06",
    title: "数据分析作品集：别只放图，过程要能复现",
    content:
      "很多作品集图做得很好看，但面试官追问“你怎么得到这个结论”就容易断。我的做法是每个结论都配一个最简流程：数据来源、清洗规则、指标定义、验证方式。这样即使图不华丽，也能证明你真的做过。建议把关键 SQL 或 notebook 链接放在附录里。",
    authorName: "阿越",
    authorAvatar: "/images/mock/avatar-study-06.jpg",
    coverImage: "/images/mock/study-06.jpg",
    tags: ["数据分析", "作品集", "可复现流程", "指标定义"],
    likeCount: 512,
    collectCount: 834,
    commentCount: 3,
    comments: makeComments("post_study_06", [
      ["Iris", "这条太真实，图好看不代表可用。", 10],
      ["木木", "附录放链接这个建议很实操。", 7],
      ["Noah", "面试官最常问清洗规则，我也被问过。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T12:00:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_07",
    title: "我用 Gemini AI Studio 验证需求，减少返工",
    content:
      "以前我习惯先写很多代码，后来发现需求理解偏了会整段重来。现在先用 Gemini AI Studio 把关键交互跑小样，确认流程再实现，返工率明显下降。这个阶段不用追求完美 UI，只要验证“用户会不会按这条路径走”就够。先验证，再投入开发时间。",
    authorName: "阿澄",
    authorAvatar: "/images/mock/avatar-study-07.jpg",
    coverImage: "/images/mock/study-07.jpg",
    tags: ["Gemini AI Studio", "需求验证", "减少返工", "交互小样"],
    likeCount: 436,
    collectCount: 702,
    commentCount: 3,
    comments: makeComments("post_study_07", [
      ["Lio", "先验证路径真的省很多时间。", 8],
      ["KK", "你会把小样给同学先试吗？", 5],
      ["Mita", "我也建议先测流程，再卷 UI。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T18:20:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_08",
    title: "面试前 48 小时复盘法：只看高频场景",
    content:
      "我以前会在面试前疯狂补新题，结果越看越乱。现在改成 48 小时复盘：只看自己常错的三类场景，配两次口述演练。重点是把已有内容讲顺，而不是再塞新知识。这样状态更稳，临场也不容易慌。建议前一晚留出睡眠，不要熬夜硬撑。",
    authorName: "阿禾",
    authorAvatar: "/images/mock/avatar-study-08.jpg",
    coverImage: "/images/mock/study-08.jpg",
    tags: ["面试复盘", "口述演练", "高频场景", "睡眠管理"],
    likeCount: 664,
    collectCount: 1098,
    commentCount: 3,
    comments: makeComments("post_study_08", [
      ["R", "睡眠这条太重要，熬夜面试状态会崩。", 15],
      ["小K", "只看高频错题我明天就执行。", 9],
      ["M", "口述演练最好录音，能听出逻辑断点。", 12],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T07:30:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_09",
    title: "实习作品演示稿模板：三段式就够",
    content:
      "我的演示稿固定三段：问题背景、方案选择、结果与下一步。每段只放一个重点，避免讲成流水账。尤其是“为什么选这个方案”要说清楚，这里最能体现判断力。建议演示前找朋友听一遍，哪里听不懂就说明你那段需要重写，而不是继续加页数。",
    authorName: "南南",
    authorAvatar: "/images/mock/avatar-study-09.jpg",
    coverImage: "/images/mock/study-09.jpg",
    tags: ["演示稿", "三段式表达", "方案选择", "判断力"],
    likeCount: 541,
    collectCount: 872,
    commentCount: 3,
    comments: makeComments("post_study_09", [
      ["Pia", "找朋友试听这条太对了，自己很难发现盲点。", 11],
      ["Allen", "我总在背景部分讲太久，受教了。", 8],
      ["cc", "三段式对毕业答辩也适用。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T11:55:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_study_10",
    title: "进修计划不焦虑版：每周一个可交付小成果",
    content:
      "我给自己定计划时不再写“系统学完某领域”，而是每周产出一个可见成果，比如一页总结、一段演示或一个小工具。这样既能持续积累，也不会因为目标太大而拖延。关键是周期要短，反馈要快。先把节奏跑起来，长期进步自然会出现。",
    authorName: "知知",
    authorAvatar: "/images/mock/avatar-study-10.jpg",
    coverImage: "/images/mock/study-10.jpg",
    tags: ["进修计划", "可交付成果", "反馈闭环", "长期积累"],
    likeCount: 403,
    collectCount: 690,
    commentCount: 3,
    comments: makeComments("post_study_10", [
      ["Ivy", "每周一个成果这个目标感很清晰。", 9],
      ["jo", "我以前目标太大所以总放弃。", 6],
      ["阿芙", "反馈快才有动力，这句扎心。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T19:05:00.000Z",
    hiddenCategory: "study",
  },
  {
    id: "post_fashion_01",
    title: "低饱和通勤穿搭：三件单品循环一周不无聊",
    content:
      "我最近把衣柜简化成灰针织、米白衬衫、深蓝牛仔裤，靠配饰和鞋子做变化，意外地省心。早上不用纠结搭配，拍照也不会显得太重复。关键是版型要干净，颜色别太跳。适合上班和面试前准备期，稳定又不出错。预算有限时先买高频基础款最值。",
    authorName: "Ava",
    authorAvatar: "/images/mock/avatar-fashion-01.jpg",
    coverImage: "/images/mock/fashion-01.jpg",
    tags: ["低饱和", "通勤搭配", "基础款", "一周穿搭"],
    likeCount: 510,
    collectCount: 821,
    commentCount: 3,
    comments: makeComments("post_fashion_01", [
      ["Rina", "基础款循环这套我也在做，真的省脑子。", 10],
      ["Mia", "请问灰针织是什么版型？", 5],
      ["安安", "配饰换一换确实就像新衣服。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T08:50:00.000Z",
    hiddenCategory: "fashion",
  },
  {
    id: "post_fashion_02",
    title: "面试日穿搭避坑：别用太硬挺的全新西装",
    content:
      "我第一次面试穿了刚买的新西装，肩线太硬，整个人看起来很紧张。后来换成有一点垂感的外套和深色直筒裤，状态自然很多。建议面试前至少试穿半天，坐下和起身都要看一遍。衣服的舒适度会直接影响表达节奏，别只看镜子里的静态效果。",
    authorName: "露露",
    authorAvatar: "/images/mock/avatar-fashion-02.jpg",
    coverImage: "/images/mock/fashion-02.jpg",
    tags: ["面试穿搭", "垂感外套", "直筒裤", "试穿复盘"],
    likeCount: 469,
    collectCount: 758,
    commentCount: 3,
    comments: makeComments("post_fashion_02", [
      ["Q", "静态好看和动态舒服真的是两回事。", 8],
      ["Vera", "我也是新衣服面试翻车，太紧绷了。", 9],
      ["Tina", "试穿半天这个建议太实操。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T09:55:00.000Z",
    hiddenCategory: "fashion",
  },
  {
    id: "post_fashion_03",
    title: "春末毛衣+牛仔裤比例调整：显高关键在腰线",
    content:
      "同样是毛衣配牛仔裤，塞不塞前摆差别很大。我现在会只塞前面一小段，侧面看腿更长，整体也不会过于拘谨。鞋子选低调一点的浅色系，视觉会更轻。这个搭法适合周五下班直接去吃饭，不用回家换。简单但照片里看着很有精神。",
    authorName: "安禾",
    authorAvatar: "/images/mock/avatar-fashion-03.jpg",
    coverImage: "/images/mock/fashion-03.jpg",
    tags: ["毛衣牛仔裤", "腰线比例", "显高穿法", "下班约饭"],
    likeCount: 428,
    collectCount: 699,
    commentCount: 3,
    comments: makeComments("post_fashion_03", [
      ["L", "只塞前摆这个方法真的很友好。", 7],
      ["Momo", "浅色鞋会不会显脚大？", 4],
      ["Jia", "比例一调整，整个人会精神很多。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T18:10:00.000Z",
    hiddenCategory: "fashion",
  },
  {
    id: "post_fashion_04",
    title: "秋冬外套挑选笔记：先看肩线再看颜色",
    content:
      "我以前选外套总先看颜色，结果上身后总觉得“哪里不对”。后来发现肩线和袖长才是第一优先。肩线合适，深色浅色都能穿出质感；肩线不对，再高级的颜色也显拖沓。建议试穿时拍正面和侧面，走两步看看活动空间，别只在镜子前站着看。",
    authorName: "乃乃",
    authorAvatar: "/images/mock/avatar-fashion-04.jpg",
    coverImage: "/images/mock/fashion-04.jpg",
    tags: ["秋冬外套", "肩线", "试穿技巧", "活动空间"],
    likeCount: 507,
    collectCount: 840,
    commentCount: 3,
    comments: makeComments("post_fashion_04", [
      ["Iris", "肩线这条真的太关键，我每次都忽略。", 11],
      ["喵喵", "拍侧面这个提醒超实用。", 6],
      ["Elli", "活动空间不够的话冬天里面根本加不了层。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T10:30:00.000Z",
    hiddenCategory: "fashion",
  },
  {
    id: "post_fashion_05",
    title: "低预算也能有质感：优先升级鞋和包",
    content:
      "我试过在同一套基础穿搭里换不同鞋包，整体质感变化非常明显。预算有限时，先把高频使用的鞋和包升级，衣服反而可以先不动。颜色上尽量保持两到三种主色，画面会更干净。这个策略适合想慢慢搭建衣橱的人，不需要一次性大采购。",
    authorName: "Cherry",
    authorAvatar: "/images/mock/avatar-fashion-05.jpg",
    coverImage: "/images/mock/fashion-05.jpg",
    tags: ["低预算穿搭", "鞋包升级", "主色控制", "衣橱搭建"],
    likeCount: 385,
    collectCount: 620,
    commentCount: 3,
    comments: makeComments("post_fashion_05", [
      ["Aki", "同意先鞋包，回报率最高。", 8],
      ["肉肉", "两到三种主色这个策略很适合我。", 5],
      ["Joy", "慢慢搭衣橱比冲动购物舒服太多。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T08:05:00.000Z",
    hiddenCategory: "fashion",
  },
  {
    id: "post_lifestyle_01",
    title: "周末整理房间 90 分钟版本：先地面再桌面",
    content:
      "我给自己设了 90 分钟整理时段，顺序固定为地面、桌面、收纳盒。先处理最显眼区域会更有成就感，也更容易坚持下去。每轮结束只保留“今天就会用”的东西在外面，其余全部归位。做完后整个人会轻很多，周一上班前心态也更稳。",
    authorName: "小鲸鱼",
    authorAvatar: "/images/mock/avatar-lifestyle-01.jpg",
    coverImage: "/images/mock/lifestyle-01.jpg",
    tags: ["周末整理", "90分钟计划", "收纳顺序", "空间复位"],
    likeCount: 448,
    collectCount: 731,
    commentCount: 3,
    comments: makeComments("post_lifestyle_01", [
      ["阿芮", "先地面这个顺序真的很有成就感。", 9],
      ["M", "我每次都从抽屉开始，难怪容易放弃。", 7],
      ["若若", "90 分钟这个时间刚好，不会太累。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T10:20:00.000Z",
    hiddenCategory: "lifestyle",
  },
  {
    id: "post_lifestyle_02",
    title: "咖啡店学习效率复盘：任务要切小才坐得住",
    content:
      "我以前去咖啡店总想做难任务，结果半小时后就走神。现在把任务拆成 25 分钟小块，比如“写提纲”“改一页简历”，完成率高很多。环境噪音反而成了节奏器。建议去之前先写好三件具体小事，到店直接开做，不要把时间花在决定做什么上。",
    authorName: "阿野",
    authorAvatar: "/images/mock/avatar-lifestyle-02.jpg",
    coverImage: "/images/mock/lifestyle-02.jpg",
    tags: ["咖啡馆专注", "25分钟任务块", "效率复盘", "任务拆分"],
    likeCount: 392,
    collectCount: 640,
    commentCount: 3,
    comments: makeComments("post_lifestyle_02", [
      ["Kira", "先写三件小事这条太关键了。", 8],
      ["冬冬", "我总把难任务带去店里然后发呆。", 6],
      ["Miko", "噪音当节奏器这个描述好准确。", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T11:35:00.000Z",
    hiddenCategory: "lifestyle",
  },
  {
    id: "post_lifestyle_03",
    title: "低成本放松计划：周中也能做的小恢复",
    content:
      "我最近把“放松”改成可执行动作：散步 20 分钟、热水澡、关通知 1 小时。不花太多钱，但对状态恢复很有帮助。重点不是一次做很多，而是连续做几天。以前我总等到很累才休息，现在提前做小恢复，工作和学习的波动都变小了。",
    authorName: "芋泥",
    authorAvatar: "/images/mock/avatar-lifestyle-03.jpg",
    coverImage: "/images/mock/lifestyle-03.jpg",
    tags: ["低成本放松", "状态恢复", "关通知", "周中调整"],
    likeCount: 421,
    collectCount: 703,
    commentCount: 3,
    comments: makeComments("post_lifestyle_03", [
      ["Nina", "提前恢复这个思路比硬扛强太多。", 9],
      ["阿吉", "我从关通知一小时开始，确实有效。", 7],
      ["Rae", "散步 20 分钟真的能清空脑子。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T09:25:00.000Z",
    hiddenCategory: "lifestyle",
  },
  {
    id: "post_lifestyle_04",
    title: "早起计划失败后复盘：先固定起床时间",
    content:
      "我试过很多“完美晨间计划”，最后都坚持不到一周。后来只保留一个目标：固定起床时间，不要求早上做满流程。先稳定起床，再慢慢加阅读或运动，反而能持续。建议把闹钟放远一点，起床后立刻开窗喝水，这两个动作能快速把人拉回清醒。",
    authorName: "小早",
    authorAvatar: "/images/mock/avatar-lifestyle-04.jpg",
    coverImage: "/images/mock/lifestyle-04.jpg",
    tags: ["早起计划", "固定起床", "晨间习惯", "复盘调整"],
    likeCount: 377,
    collectCount: 621,
    commentCount: 3,
    comments: makeComments("post_lifestyle_04", [
      ["Moe", "只固定起床这个目标太友好了。", 8],
      ["白白", "开窗喝水真的比刷手机有用。", 6],
      ["L", "我也是流程太复杂才失败的。", 7],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T20:30:00.000Z",
    hiddenCategory: "lifestyle",
  },
  {
    id: "post_lifestyle_05",
    title: "情绪恢复周末版：把社交和独处都留一点",
    content:
      "我以前周末不是全社交就是全宅，周一都很疲惫。最近尝试一半时间见朋友，一半时间独处，反而更平衡。周六安排外出，周日留给家务和阅读，情绪波动明显变小。建议周末前先写下“这两天最想保留的两件事”，避免被临时安排带着走。",
    authorName: "木木子",
    authorAvatar: "/images/mock/avatar-lifestyle-05.jpg",
    coverImage: "/images/mock/lifestyle-05.jpg",
    tags: ["情绪恢复", "周末节奏", "社交平衡", "独处时间"],
    likeCount: 468,
    collectCount: 755,
    commentCount: 3,
    comments: makeComments("post_lifestyle_05", [
      ["Ruru", "一半社交一半独处这个分配很舒服。", 9],
      ["阿白", "我周末总被临时约打乱，先写两件事很有用。", 8],
      ["K", "周日留给家务真的能减轻周一焦虑。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T10:45:00.000Z",
    hiddenCategory: "lifestyle",
  },
  {
    id: "post_misc_01",
    title: "最近三部片子观后感：最意外的是节奏最慢那部",
    content:
      "我本来以为会喜欢剧情反转多的那部，结果最后最回味的是节奏慢、对白克制的作品。它没有强行煽情，但很多细节会在看完后慢慢浮出来。建议看之前别刷太多解读，先保留自己的第一反应。看完再回头读影评，会更有对照感。",
    authorName: "阿泽",
    authorAvatar: "/images/mock/avatar-misc-01.jpg",
    coverImage: "/images/mock/misc-01.jpg",
    tags: ["观影记录", "节奏感", "对白细节", "影评对照"],
    likeCount: 265,
    collectCount: 412,
    commentCount: 3,
    comments: makeComments("post_misc_01", [
      ["Lia", "不先刷解读这条我太同意了。", 6],
      ["阿南", "慢节奏那部是不是最近新上的那部？", 4],
      ["QY", "看完再读影评会有二次惊喜。", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-06T22:10:00.000Z",
    hiddenCategory: "misc",
  },
  {
    id: "post_misc_02",
    title: "本月读书清单里最实用的一本：把抽象方法写清楚了",
    content:
      "这本书最打动我的不是观点新，而是把执行步骤写得很具体。比如“如何开始一项长期任务”，它给了可以当天就做的小动作。我边读边照着做，三天后就有反馈。建议别追求一次读完，按章节实践更有价值。书签和笔记要跟着场景走，才不会读完就忘。",
    authorName: "Celia",
    authorAvatar: "/images/mock/avatar-misc-02.jpg",
    coverImage: "/images/mock/misc-02.jpg",
    tags: ["读书清单", "执行步骤", "长期任务", "实践笔记"],
    likeCount: 302,
    collectCount: 498,
    commentCount: 3,
    comments: makeComments("post_misc_02", [
      ["M", "按章节实践这个方法太有用了。", 7],
      ["七七", "可以分享书名吗？", 5],
      ["Yoyo", "场景化笔记会比摘抄有效很多。", 6],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T07:35:00.000Z",
    hiddenCategory: "misc",
  },
  {
    id: "post_misc_03",
    title: "新手养猫三个月复盘：别被花哨用品吸引",
    content:
      "刚开始我买了很多看起来很高级的猫用品，结果真正高频用到的只有猫砂盆、抓板和稳定粮。猫咪最在意的是环境稳定和作息规律，不是玩具数量。建议预算优先放在基础健康和清洁用品。多观察猫的行为变化，比盲目买买买更靠谱。",
    authorName: "芋圆",
    authorAvatar: "/images/mock/avatar-misc-03.jpg",
    coverImage: "/images/mock/misc-03.jpg",
    tags: ["养猫复盘", "基础用品", "行为观察", "预算分配"],
    likeCount: 410,
    collectCount: 689,
    commentCount: 3,
    comments: makeComments("post_misc_03", [
      ["猫猫", "我也买了好多无用玩具，太真实。", 10],
      ["Bella", "抓板一定要多放几个点位。", 7],
      ["阿布", "环境稳定这条真的最重要。", 8],
    ]),
    isHearted: true,
    createdAt: "2026-05-07T21:20:00.000Z",
    hiddenCategory: "misc",
  },
  {
    id: "post_misc_04",
    title: "厨房小白的一周做饭记录：先学三道万能菜",
    content:
      "我以前每次做饭都找新菜谱，结果准备复杂、清理也累。现在先固定三道万能菜：番茄蛋、蒜香鸡腿、清炒时蔬，轮换着做就够一周。调味先轻后补，失败率低很多。建议把切菜顺序和火候写在便签上，做两次就能形成自己的流程。",
    authorName: "豆豆",
    authorAvatar: "/images/mock/avatar-misc-04.jpg",
    coverImage: "/images/mock/misc-04.jpg",
    tags: ["做饭记录", "万能菜", "调味顺序", "厨房流程"],
    likeCount: 286,
    collectCount: 470,
    commentCount: 3,
    comments: makeComments("post_misc_04", [
      ["Roro", "先轻后补这个调味逻辑很实用。", 6],
      ["阿卷", "三道菜轮换真的省脑子。", 5],
      ["Mina", "可以分享蒜香鸡腿具体步骤吗？", 4],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T06:50:00.000Z",
    hiddenCategory: "misc",
  },
  {
    id: "post_misc_05",
    title: "家居小物改造：50 块以内提升桌面幸福感",
    content:
      "我这次没有换大件，只加了桌面灯、线材收纳和杯垫，整个工作区的整洁度就提升很多。重点是减少视觉噪音，而不是堆更多摆件。预算控制在 50 块以内也能做出变化。建议先拍一张“改造前”照片，改完对比会很直观，也更有动力保持。",
    authorName: "Kiwi",
    authorAvatar: "/images/mock/avatar-misc-05.jpg",
    coverImage: "/images/mock/misc-05.jpg",
    tags: ["家居小物", "桌面改造", "线材收纳", "低预算"],
    likeCount: 333,
    collectCount: 560,
    commentCount: 3,
    comments: makeComments("post_misc_05", [
      ["Y", "拍改造前后这个建议太有仪式感了。", 7],
      ["Vivi", "线材收纳真的是提升幸福感第一名。", 8],
      ["阿喵", "求桌面灯链接，光线看起来很舒服。", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-08T15:00:00.000Z",
    hiddenCategory: "misc",
  },
  {
    id: "post_misc_06",
    title: "周末小展览记录：人少时段体验会差很多",
    content:
      "这次挑了下午四点后去看小展，人流比中午少很多，能慢慢看作品细节。展厅里最怕的是匆匆拍照就走，其实读完作品说明会更有收获。建议提前查闭馆时间，给最后一小时留给喜欢的区域二刷。小展览不一定“出片”，但很适合放慢节奏。",
    authorName: "木夏",
    authorAvatar: "/images/mock/avatar-misc-06.jpg",
    coverImage: "/images/mock/misc-06.jpg",
    tags: ["周末展览", "人少时段", "作品说明", "二刷路线"],
    likeCount: 277,
    collectCount: 439,
    commentCount: 3,
    comments: makeComments("post_misc_06", [
      ["Lynn", "二刷喜欢区域这个建议很棒。", 6],
      ["阿毛", "四点后去确实舒服很多。", 5],
      ["Nana", "我总是赶着拍照，下次要改。", 4],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T09:15:00.000Z",
    hiddenCategory: "misc",
  },
  {
    id: "post_misc_07",
    title: "最近循环的三首歌：通勤路上情绪会慢慢变好",
    content:
      "我给自己做了一个“下班回家歌单”，只放三首节奏稳定的歌。听久了会形成条件反射，通勤路上的紧绷感会慢慢松开。这个方法很简单，但对情绪切换很有效。建议歌单别太长，固定几首更容易建立节奏，回到家也不会把工作情绪带进夜晚。",
    authorName: "森森",
    authorAvatar: "/images/mock/avatar-misc-07.jpg",
    coverImage: "/images/mock/misc-07.jpg",
    tags: ["通勤歌单", "情绪切换", "固定节奏", "下班放松"],
    likeCount: 241,
    collectCount: 398,
    commentCount: 3,
    comments: makeComments("post_misc_07", [
      ["Anne", "三首歌这个长度刚好，不会选择困难。", 6],
      ["Rita", "音乐做情绪切换工具真的很有效。", 7],
      ["M", "求你的歌单！", 5],
    ]),
    isHearted: true,
    createdAt: "2026-05-09T22:05:00.000Z",
    hiddenCategory: "misc",
  },
];

export const CURRENT_WEEK_ID = "2026-W20";

const CURRENT_WEEK_DATES = [
  "2026-05-06T09:20:00.000Z",
  "2026-05-06T14:10:00.000Z",
  "2026-05-07T08:45:00.000Z",
  "2026-05-07T18:22:00.000Z",
  "2026-05-08T07:35:00.000Z",
  "2026-05-08T15:40:00.000Z",
  "2026-05-09T10:50:00.000Z",
  "2026-05-09T21:05:00.000Z",
  "2026-05-10T11:30:00.000Z",
  "2026-05-10T19:20:00.000Z",
  "2026-05-11T08:55:00.000Z",
  "2026-05-11T13:45:00.000Z",
  "2026-05-12T09:05:00.000Z",
  "2026-05-12T18:12:00.000Z",
];

const PREVIOUS_WEEK_DATES = [
  "2026-04-30T10:20:00.000Z",
  "2026-05-01T12:05:00.000Z",
  "2026-05-02T16:30:00.000Z",
  "2026-05-03T09:50:00.000Z",
  "2026-05-04T20:10:00.000Z",
];

const HOT_LIKE_OVERRIDES: Record<string, number> = {
  post_beauty_02: 1688,
  post_travel_01: 1542,
  post_study_01: 1860,
};

const LEGACY_CREATED_AT_OVERRIDES: Record<string, string> = {
  post_travel_03: "2024-08-12T18:30:00.000Z",
  post_study_06: "2025-01-19T09:15:00.000Z",
  post_restaurant_05: "2024-11-03T12:50:00.000Z",
  post_lifestyle_04: "2025-02-26T20:40:00.000Z",
  post_misc_02: "2024-06-07T07:10:00.000Z",
};

const COMMENT_USER_NAMES = [
  "阿圆",
  "Lynn",
  "Momo",
  "Kiki",
  "Nana",
  "Iris",
  "白桃",
  "Rita",
  "Yuki",
  "阿芙",
  "Mia",
  "Penny",
];

function hashString(input: string): number {
  return [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getTargetCommentCount(likeCount: number, postId: string): number {
  const seed = hashString(postId);
  if (likeCount < 300) return 1 + (seed % 3);
  if (likeCount < 1500) return 5 + (seed % 6);
  return 20 + (seed % 9);
}

function getPostPrefix(postId: string): string {
  return postId.replace(/^post_/, "");
}

type PostContext = {
  objectName: string;
  scenario: string;
  judgment: string;
};

const CATEGORY_OBJECTS: Record<NonNullable<MockPost["hiddenCategory"]>, string[]> = {
  beauty: [
    "Dior Forever",
    "Chanel Les Beiges",
    "NARS Light Reflecting",
    "Armani Luminous Silk",
    "YSL All Hours",
    "Make Up For Ever HD Skin",
    "Laura Mercier 散粉",
    "Givenchy 四宫格散粉",
    "Romand 唇釉",
    "Clio 遮瑕",
    "Lunea Velvet Tint",
    "Mirose Skin Veil",
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
    "Notion",
    "Google AI Studio",
    "Vercel",
    "Figma",
    "Perplexity",
    "ChatGPT",
    "Claude",
    "LinkedIn",
    "Overleaf",
    "LeetCode",
    "Tableau",
    "SQL",
    "Python",
    "ApplyMate",
    "ResumeDock",
    "InterviewNest",
  ],
  fashion: [
    "Uniqlo",
    "COS",
    "Aritzia",
    "Everlane",
    "Zara",
    "Mango",
    "Muji",
    "New Balance",
    "Adidas Samba",
    "Lema Studio",
    "Norra Basics",
    "Vale Knitwear",
  ],
  lifestyle: [
    "Planet Fitness",
    "Equinox",
    "Blue Bottle",
    "Philz Coffee",
    "Muji 收纳盒",
    "IKEA 小推车",
    "Apple Reminders",
    "Notion habit tracker",
    "CalmNest Planner",
    "Loop Bottle",
  ],
  misc: [
    "Past Lives",
    "Poor Things",
    "Before Sunrise",
    "The Design of Everyday Things",
    "IKEA lamp",
    "Getty exhibition",
    "Moon Archive 展览",
    "Sunday Radio 歌单",
  ],
};

const CATEGORY_SCENARIOS: Record<NonNullable<MockPost["hiddenCategory"]>, string[]> = {
  beauty: ["早八通勤", "赶时间出门", "开会前补妆", "晚饭前约会", "空调房久坐"],
  restaurant: ["周五晚餐", "周末 brunch", "朋友聊天", "下班后小聚", "带爸妈吃饭"],
  travel: ["周末短途", "自驾一日往返", "傍晚看日落", "阴天轻徒步", "带相机拍照"],
  study: ["改简历", "准备面试", "写 demo", "整理 coffee chat 记录", "作品集复盘"],
  fashion: ["通勤上班", "周末散步", "面试前试衣", "拍照出门", "长时间走路"],
  lifestyle: ["周日重启", "工作日晨间", "健身后恢复", "咖啡店学习", "晚间收纳"],
  misc: ["下班后放空", "周末宅家", "地铁通勤", "睡前半小时", "展览日小记"],
};

const CATEGORY_JUDGMENTS: Record<NonNullable<MockPost["hiddenCategory"]>, string[]> = {
  beauty: [
    "它不是一秒磨皮型，优点是肤色会更均匀",
    "混干皮会觉得舒服，但油皮中午前后要补一次",
    "镜头里很好看，不过近看遮瑕力度一般",
    "适合淡妆通勤，不太适合追求高遮盖",
  ],
  restaurant: [
    "环境比味道更突出，适合聊天不适合赶时间",
    "甜点比主菜更稳，主菜发挥有点看当天状态",
    "价格不算便宜，但服务节奏比较舒服",
    "适合两三个人慢吃，不适合快速打卡",
  ],
  travel: [
    "天气好时体验加分，阴天会打折扣",
    "风景没有网图夸张，但放空非常够用",
    "停车和步行时间要预留，不然会很赶",
    "适合周末慢节奏，不适合高密度打卡",
  ],
  study: [
    "第一次做得很乱，第二次把文件结构写清楚就顺很多",
    "适合先搭骨架，不适合一次要它给完整终稿",
    "省时间是真的，但前提是任务拆得足够具体",
    "对准备面试有帮助，不过最后还是要自己复盘",
  ],
  fashion: [
    "版型还可以，但腰线对我来说略松",
    "上身拍照好看，不过面料不算特别耐皱",
    "通勤够用，正式面试场景就偏随意",
    "不一定显瘦，但穿一整天确实舒服",
  ],
  lifestyle: [
    "不是效率神器，但能让我少一点临时慌乱",
    "执行门槛低，连续一周比我预期稳定",
    "提升不算立竿见影，但生活节奏更可控",
    "适合慢慢养成，不适合指望一夜翻盘",
  ],
  misc: [
    "没有想象中惊艳，但后劲很足",
    "不是所有人都会喜欢，不过我会二刷",
    "细节比主线更打动我，适合慢慢看",
    "当下不觉得特别，过两天反而会回想",
  ],
};

const GENERIC_TAGS = new Set(["美妆", "餐厅", "旅行", "学习", "穿搭", "生活方式"]);

const ALL_OBJECT_NAMES = Object.values(CATEGORY_OBJECTS).flat();

function getPostContext(post: MockPost, index: number): PostContext {
  const category = post.hiddenCategory ?? "misc";
  const seed = hashString(post.id) + index * 7;
  const objects = CATEGORY_OBJECTS[category];
  const scenarios = CATEGORY_SCENARIOS[category];
  const judgments = CATEGORY_JUDGMENTS[category];

  return {
    objectName: objects[seed % objects.length],
    scenario: scenarios[(seed * 3) % scenarios.length],
    judgment: judgments[(seed * 5) % judgments.length],
  };
}

function includesSpecificName(text: string): boolean {
  return ALL_OBJECT_NAMES.some((name) => text.includes(name));
}

function enrichPostContent(content: string, context: PostContext): string {
  if (includesSpecificName(content)) return content;
  return `${content} 这次在${context.scenario}我顺手测了 ${context.objectName}，整体感受是 ${context.judgment}。`;
}

function enrichTags(tags: string[], context: PostContext): string[] {
  const filtered = tags.filter((tag) => !GENERIC_TAGS.has(tag.trim()));
  const hasSpecificTag = filtered.some((tag) => includesSpecificName(tag));
  const withObject = hasSpecificTag ? filtered : [context.objectName, ...filtered];
  const withScenario = withObject.some((tag) => tag.includes(context.scenario)) ? withObject : [...withObject, context.scenario];
  return withScenario.slice(0, 6);
}

function enrichSeedComment(post: MockPost, comment: Omit<MockComment, "id">, index: number): Omit<MockComment, "id"> {
  if (includesSpecificName(comment.content)) return comment;
  const injectSeed = hashString(`${post.id}-${comment.userName}-${index}`);
  const shouldInjectSpecificName = injectSeed % 100 < 42;
  if (!shouldInjectSpecificName) return comment;
  const context = getPostContext(post, index + 31);
  return {
    ...comment,
    content: `${comment.content} 我这边用 ${context.objectName} 的体验是 ${context.judgment}。`,
  };
}

export function createComments(
  postPrefix: string,
  comments: Omit<MockComment, "id">[],
): MockComment[] {
  return comments.map((comment, index) => ({
    id: `comment_${postPrefix}_${String(index + 1).padStart(2, "0")}`,
    ...comment,
  }));
}

function buildCommentDraft(post: MockPost, index: number): Omit<MockComment, "id"> {
  const tagA = post.tags[0] ?? "这条内容";
  const tagB = post.tags[1] ?? "这个方向";
  const categoryFacts: Record<NonNullable<MockPost["hiddenCategory"]>, string[]> = {
    beauty: [
      "油皮在空调房里 6 小时后才开始出油",
      "通勤妆前先薄涂保湿，卡粉明显少了",
      "同款产品在自然光下更容易看出差异",
      "混干在鼻翼位置容易起皮，需要分区上妆",
      "黄调肤色选偏中性色会更稳",
      "定妆喷雾放在最后一步，持妆更久",
    ],
    restaurant: [
      "工作日晚上七点后基本要等位",
      "人均在 90-130 之间更稳妥",
      "热门菜建议第一轮就点，后面可能售罄",
      "附近停车位少，地铁出行更省心",
      "两人桌翻台快，四人以上建议提前预约",
      "店里音乐偏大声，不太适合谈事",
    ],
    travel: [
      "清晨和傍晚两个时段的景色差别很大",
      "热门点位中午前后容易排队拍照",
      "自驾更自由，但周末停车时间要预留",
      "山里温差明显，薄外套基本是刚需",
      "轻装徒步会比背大包轻松很多",
      "部分路段信号不稳，离线地图很有用",
    ],
    study: [
      "拆成 30 分钟的小任务更容易推进",
      "先做能跑通的版本，再补细节效率更高",
      "面试讲项目时先说结果会更抓人",
      "作品集里加失败复盘，追问时更有说服力",
      "题库刷两轮比一次刷太多更稳",
      "把关键术语写成卡片，临场不容易忘词",
    ],
    fashion: [
      "同色系叠穿会比强对比更日常",
      "上短下长对小个子更友好",
      "肩线合适后，整体精气神会明显提升",
      "配饰控制在一到两个重点更耐看",
      "通勤鞋尽量选软底，久走脚感更舒服",
      "包的材质和鞋子呼应会更完整",
    ],
    lifestyle: [
      "目标拆小后连续打卡更容易坚持",
      "固定一个触发动作会减少拖延",
      "把任务写到前一天晚上，执行成本更低",
      "周中复盘一次比周末一次性总结更有效",
      "先做 70 分版本，完成率反而更高",
      "和朋友互相监督时放弃率会下降",
    ],
    misc: [
      "先做最小可用版本能更快拿到反馈",
      "关键步骤写成清单后，返工会少很多",
      "版本更新前先备份，心态会更稳",
      "流程里增加一个检查点能减少低级错误",
      "分批次推进比一次性做完更可控",
      "先确定优先级，效率会明显提高",
    ],
  };
  const intentOpeners = [
    "请教下",
    "补充一个实测",
    "我有个反向反馈",
    "这个点我也踩过",
    "蹲后续",
    "想问个细节",
  ];
  const intentClosers = [
    "你有空可以再展开讲讲。",
    "我这周准备按你这个方案试一次。",
    "这个细节真的很有参考价值。",
    "欢迎你后面继续更新进度。",
    "我先收藏，等你下一篇。",
    "感觉这个对新手很友好。",
  ];
  const questionSuffixes = [
    "是先做 A 再做 B 吗？",
    "你一般会在什么时间段做？",
    "预算大概控制在多少更合适？",
    "这个步骤你会重复几次？",
    "第一次尝试要避开什么坑？",
    "有没有更省时的版本？",
  ];
  const focus = [tagA, tagB, post.title.slice(0, 8)][(hashString(post.id) + index * 3) % 3];

  const category = post.hiddenCategory ?? "misc";
  const pool = categoryFacts[category];
  const seed = hashString(post.id) + index;
  const fact = pool[(seed * 5 + index) % pool.length];
  const opener = intentOpeners[(seed + index) % intentOpeners.length];
  const closer = intentClosers[(seed * 2 + index) % intentClosers.length];
  const question = questionSuffixes[(seed * 3 + index) % questionSuffixes.length];
  const mode = index % 6;

  let content = "";
  if (mode === 0) {
    content = `${opener}，${focus} 这块你是怎么判断的，${question}`;
  } else if (mode === 1) {
    content = `${opener}：我这边的情况是 ${fact}，和你说的 ${focus} 基本对上了。`;
  } else if (mode === 2) {
    content = `${opener}，${focus} 这里我试下来和你不太一样，我更偏向先做基础步骤再叠加。`;
  } else if (mode === 3) {
    content = `${opener}，之前我在 ${focus} 这个环节吃过亏，后来按“先小步试错”就顺很多。`;
  } else if (mode === 4) {
    content = `${opener}，尤其是你提到的 ${focus}，${closer}`;
  } else {
    content = `${opener}：${fact}。另外关于 ${focus}，${question}`;
  }

  const userName = COMMENT_USER_NAMES[seed % COMMENT_USER_NAMES.length];
  const likeCount = 2 + (seed % 28);
  return { userName, content, likeCount };
}

function buildTieredComments(post: MockPost, targetCount: number): MockComment[] {
  const fallbackTag = post.tags[0] ?? "这个主题";
  const trimmedDrafts: Omit<MockComment, "id">[] = [];
  const usedContents = new Set<string>();

  for (const [index, sourceComment] of post.comments.entries()) {
    const comment = enrichSeedComment(post, sourceComment, index);
    if (trimmedDrafts.length >= targetCount) break;
    if (usedContents.has(comment.content)) continue;
    usedContents.add(comment.content);
    trimmedDrafts.push({
      userName: comment.userName,
      content: comment.content,
      likeCount: comment.likeCount,
    });
  }

  let candidateIndex = 0;
  while (trimmedDrafts.length < targetCount && candidateIndex < targetCount * 12) {
    const draft = buildCommentDraft(post, candidateIndex);
    candidateIndex += 1;
    if (usedContents.has(draft.content)) continue;
    usedContents.add(draft.content);
    trimmedDrafts.push(draft);
  }

  while (trimmedDrafts.length < targetCount) {
    const fallbackIndex = trimmedDrafts.length + 1;
    trimmedDrafts.push({
      userName: COMMENT_USER_NAMES[(hashString(post.id) + fallbackIndex) % COMMENT_USER_NAMES.length],
      content: `补一个实践细节：我在「${fallbackTag}」上按你思路试了第 ${fallbackIndex} 次，体验比之前稳定。`,
      likeCount: 3 + (fallbackIndex % 20),
    });
  }

  return createComments(getPostPrefix(post.id), trimmedDrafts.slice(0, targetCount));
}

export const mockPosts: MockPost[] = baseMockPosts.map((post, index) => {
  const likeCount = HOT_LIKE_OVERRIDES[post.id] ?? post.likeCount;
  const createdAt = LEGACY_CREATED_AT_OVERRIDES[post.id] ?? post.createdAt;
  const isPreviousWeek = index >= baseMockPosts.length - 5;
  const heartedAt = isPreviousWeek
    ? PREVIOUS_WEEK_DATES[index % PREVIOUS_WEEK_DATES.length]
    : CURRENT_WEEK_DATES[index % CURRENT_WEEK_DATES.length];
  const weekId = isPreviousWeek ? "2026-W19" : CURRENT_WEEK_ID;
  const context = getPostContext(post, index);
  const content = enrichPostContent(post.content, context);
  const tags = enrichTags(post.tags, context);
  const postForComments = { ...post, content, tags };
  const comments = buildTieredComments(postForComments, getTargetCommentCount(likeCount, post.id));

  return {
    ...post,
    content,
    tags,
    likeCount,
    comments,
    commentCount: comments.length,
    createdAt,
    isHearted: true,
    heartedAt,
    weekId,
  };
});

export function getPostExcerpt(post: MockPost): string {
  if (post.content.length <= 70) return post.content;
  return `${post.content.slice(0, 70)}...`;
}

export function getPostParagraphs(post: MockPost): string[] {
  const chunks = post.content
    .split(/(?<=[。！？])/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return chunks.length > 0 ? chunks : [post.content];
}

const legacyIdAlias: Record<string, string> = {
  "1": "post_beauty_01",
  post_001: "post_study_01",
  post_002: "post_study_02",
  post_003: "post_restaurant_01",
  post_004: "post_beauty_04",
  post_005: "post_travel_01",
  post_006: "post_lifestyle_01",
};

export function getPostById(postId: string): MockPost | undefined {
  const normalized = legacyIdAlias[postId] ?? postId;
  return mockPosts.find((post) => post.id === normalized);
}

export function getPostsByIds(postIds: string[]): MockPost[] {
  return postIds.map((postId) => getPostById(postId)).filter((post): post is MockPost => Boolean(post));
}

export function getCurrentWeekId(date = new Date()): string {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function getHeartedPostsByWeek(posts: MockPost[], weekId: string): MockPost[] {
  return posts.filter((post) => {
    if (!post.isHearted) return false;
    if (!post.heartedAt) return false;
    const heartedWeekId = post.weekId ?? getCurrentWeekId(new Date(post.heartedAt));
    return heartedWeekId === weekId;
  });
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
