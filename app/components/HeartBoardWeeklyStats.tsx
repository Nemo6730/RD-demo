"use client";

import { useEffect, useMemo, useState } from "react";
import { CURRENT_WEEK_ID, getCurrentWeekId, getHeartedPostsByWeek, mockPosts, type MockPost } from "@/data/mockPosts";
import { getHeartActions, isPostHearted } from "@/lib/heartStorage";

type WeeklyStats = {
  heartCount: number;
  directionCount: number;
};

function computeWeeklyStats(weekId: string): WeeklyStats {
  const actionMap = new Map(getHeartActions().map((action) => [action.postId, action]));
  const mergedPosts: MockPost[] = mockPosts.map((post) => {
    const action = actionMap.get(post.id);
    const isHearted = action ? true : isPostHearted(post.id, post.isHearted);
    if (!isHearted) {
      return { ...post, isHearted: false, heartedAt: undefined, weekId: undefined };
    }

    const heartedAt = action?.heartedAt ?? post.heartedAt;
    const resolvedWeekId =
      action?.weekId ?? post.weekId ?? (heartedAt ? getCurrentWeekId(new Date(heartedAt)) : undefined);

    return {
      ...post,
      isHearted: true,
      heartedAt,
      weekId: resolvedWeekId,
    };
  });

  const heartedPostsThisWeek = getHeartedPostsByWeek(mergedPosts, weekId);
  const directionCount = new Set(heartedPostsThisWeek.map((post) => post.hiddenCategory ?? "other")).size;
  return {
    heartCount: heartedPostsThisWeek.length,
    directionCount,
  };
}

export function HeartBoardWeeklyStats() {
  const initialWeekId = useMemo(() => getCurrentWeekId(new Date()) || CURRENT_WEEK_ID, []);
  const [stats, setStats] = useState<WeeklyStats>(() => computeWeeklyStats(initialWeekId));

  useEffect(() => {
    const weekId = getCurrentWeekId(new Date()) || CURRENT_WEEK_ID;
    setStats(computeWeeklyStats(weekId));
  }, []);

  return (
    <>
      <p className="text-[15px] text-zinc-700">本周你留下了 {stats.heartCount} 个爪印</p>
      <p className="mt-1 text-[15px] text-zinc-700">AI 为你整理出 {stats.directionCount} 个兴趣方向</p>
    </>
  );
}
