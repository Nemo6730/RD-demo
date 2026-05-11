import Link from "next/link";
import type { FeedPost } from "@/data/mockPosts";

type PostCardProps = {
  post: FeedPost;
  href?: string;
};

export function PostCard({ post, href }: PostCardProps) {
  return (
    <Link
      href={href ?? `/post/${post.id}`}
      className="mb-3 block break-inside-avoid overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <div
        className="h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${post.coverImage})` }}
      />
      <div className="space-y-2 px-3 pb-3 pt-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-900">{post.title}</h3>
        <p className="line-clamp-2 text-xs leading-4 text-zinc-500">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{post.author}</span>
          <span>♡ {post.likes}</span>
        </div>
      </div>
    </Link>
  );
}
