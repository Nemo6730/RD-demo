import { BottomNav } from "@/app/components/BottomNav";
import { FeedHeader } from "@/app/components/FeedHeader";
import { PostCard } from "@/app/components/PostCard";
import { mockPosts } from "@/data/mockPosts";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-28">
      <FeedHeader />

      <section className="columns-2 gap-3 px-3 pt-3">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <BottomNav active="home" />
    </main>
  );
}
