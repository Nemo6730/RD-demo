import { NextResponse } from "next/server";
import { generateHeartBoardWithGemini } from "@/lib/ai/generateHeartBoardWithGemini";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";

export async function POST(req: Request) {
  try {
    const { posts, weekId } = await req.json();

    if (!weekId || !posts || !Array.isArray(posts)) {
      return NextResponse.json({ error: "weekId and posts are required" }, { status: 400 });
    }

    try {
      const heartBoard = await generateHeartBoardWithGemini(posts, weekId);
      return NextResponse.json({ heartBoard, usedFallback: false });
    } catch (error) {
      console.error("Gemini heart board generation failed:", error);
      const fallback = generateMockHeartBoardFromPosts(posts, weekId);
      return NextResponse.json({
        heartBoard: fallback,
        usedFallback: true,
        error: error instanceof Error ? error.message : "Unknown Gemini error",
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate heart board",
      },
      { status: 500 },
    );
  }
}
