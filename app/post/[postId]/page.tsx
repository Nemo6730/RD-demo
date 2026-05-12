import { notFound } from "next/navigation";
import { PostDetail } from "@/app/components/PostDetail";
import { getActivePostById } from "@/data/testDatasets";

type PostPageProps = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ from?: string }>;
};

function normalizeFromPath(from?: string): string | undefined {
  if (!from) return undefined;
  if (!from.startsWith("/")) return undefined;
  return from;
}

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const { postId } = await params;
  const { from } = await searchParams;

  const post = getActivePostById(postId);
  if (!post) notFound();

  const backHref = normalizeFromPath(from) ?? "/";
  return <PostDetail post={post} backHref={backHref} />;
}
