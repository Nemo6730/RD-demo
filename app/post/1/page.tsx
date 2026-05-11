import { PostDetail } from "@/app/components/PostDetail";
import { getPostById } from "@/data/mockPosts";
import { notFound } from "next/navigation";

export default function PostDetailPage() {
  const post = getPostById("post_001");
  if (!post) notFound();
  return <PostDetail post={post} backHref="/" />;
}
