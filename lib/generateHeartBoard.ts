import { getHeartedPostsByWeek, type MockPost } from "@/data/mockPosts";
import { mockHeartBoard, type HeartBoard } from "@/data/mockHeartBoard";

export async function generateHeartBoardFromPosts(
  posts: MockPost[],
  weekId: string,
): Promise<HeartBoard> {
  const heartedPostsThisWeek = getHeartedPostsByWeek(posts, weekId);
  void heartedPostsThisWeek;
  // TODO: 后续接 OpenAI / Gemini API，基于 posts 聚类生成 HeartBoard。
  return Promise.resolve(mockHeartBoard);
}
