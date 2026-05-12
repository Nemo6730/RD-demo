/**
 * 心动板分类卡片主题（与列表 swipe 卡一致）。
 * themeIndex = heartBoard.categories 中该分类的稳定下标（与滑动排序无关）。
 */
export const HEART_BOARD_CARD_THEMES = [
  {
    accent: "#FF5A6B",
    accentSoft: "#FFF1F3",
    accentSofter: "#FFF7F8",
    shadow: "rgba(255,90,107,0.22)",
  },
  {
    accent: "#F4A261",
    accentSoft: "#FFF5EC",
    accentSofter: "#FFF9F2",
    shadow: "rgba(244,162,97,0.22)",
  },
  {
    accent: "#7BAE7F",
    accentSoft: "#F2F8F2",
    accentSofter: "#F8FBF6",
    shadow: "rgba(123,174,127,0.22)",
  },
  {
    accent: "#9C8ACD",
    accentSoft: "#F6F2FB",
    accentSofter: "#FAF7FD",
    shadow: "rgba(156,138,205,0.22)",
  },
  {
    accent: "#6C9BCF",
    accentSoft: "#F0F6FC",
    accentSofter: "#F7FBFF",
    shadow: "rgba(108,155,207,0.2)",
  },
] as const;

export type HeartBoardCardTheme = (typeof HEART_BOARD_CARD_THEMES)[number];

export function getHeartBoardCardTheme(themeIndex: number): HeartBoardCardTheme {
  return HEART_BOARD_CARD_THEMES[themeIndex % HEART_BOARD_CARD_THEMES.length]!;
}
