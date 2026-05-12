import { PostDetail } from "@/app/components/PostDetail";
import { getActiveHeartboardPosts, getActivePostById } from "@/data/testDatasets";
import { notFound } from "next/navigation";

export default function PostDetailPage() {
  const firstActivePostId = getActiveHeartboardPosts()[0]?.id ?? "post_001";
  const post = getActivePostById(firstActivePostId);
  if (!post) notFound();
  return <PostDetail post={post} backHref="/" />;
}
