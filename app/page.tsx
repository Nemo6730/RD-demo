import { BottomNav } from "@/app/components/BottomNav";
import { FeedHeader } from "@/app/components/FeedHeader";
import { PostCard } from "@/app/components/PostCard";
import { getActiveHeartboardPosts } from "@/data/testDatasets";

export default function Home() {
  const posts = getActiveHeartboardPosts();

  return (
    <main className="min-h-screen bg-[#fafafa] pb-28">
      <FeedHeader />

      <section className="columns-2 gap-3 px-3 pt-3">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} guideStepAnchor={index === 0 ? 1 : undefined} />
        ))}
      </section>

      <BottomNav active="home" />
    </main>
  );
}
