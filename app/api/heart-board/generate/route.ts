import type { MockPost } from "@/data/mockPosts";
import { NextResponse } from "next/server";
import { adaptHeartBoardForUI } from "@/lib/ai/adaptHeartBoardForUI";
import { generateHeartBoardWithGemini, generateHeartBoardWithGeminiStream } from "@/lib/ai/generateHeartBoardWithGemini";
import { generateMockHeartBoardFromPosts } from "@/lib/generateHeartBoard";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      posts?: MockPost[];
      weekId?: string;
      stream?: boolean;
    };
    const { posts, weekId, stream: wantStream } = body;

    if (!weekId || !posts || !Array.isArray(posts)) {
      return NextResponse.json({ error: "weekId and posts are required" }, { status: 400 });
    }

    if (wantStream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          const writeLine = (payload: object) => {
            controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
          };

          try {
            for await (const event of generateHeartBoardWithGeminiStream(posts, weekId)) {
              const heartBoard = adaptHeartBoardForUI(event.board, posts, weekId);
              if (event.kind === "partial") {
                writeLine({ type: "partial", heartBoard });
              } else {
                writeLine({
                  type: "done",
                  heartBoard,
                  usedFallback: false,
                });
              }
            }
          } catch (error) {
            console.error("Gemini heart board stream failed:", error);
            const fallback = generateMockHeartBoardFromPosts(posts, weekId);
            writeLine({
              type: "done",
              heartBoard: fallback,
              usedFallback: true,
              error: error instanceof Error ? error.message : "Unknown Gemini error",
            });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
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
