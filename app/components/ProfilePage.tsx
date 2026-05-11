import Link from "next/link";
import { profileNotes } from "@/data/mockPosts";
import { BottomNav } from "@/app/components/BottomNav";
import { HeartBoardEntry } from "@/app/components/HeartBoardEntry";

export function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] pb-24">
      <section className="rounded-b-3xl bg-[linear-gradient(180deg,#4d5b7f_0%,#6c5e69_55%,#7d6f79_100%)] px-4 pb-4 pt-3 text-white">
        <div className="mb-4 flex items-center justify-between text-xl">
          <button type="button" aria-label="菜单">
            ☰
          </button>
          <div className="flex items-center gap-4">
            <button type="button" aria-label="扫描">
              ◌
            </button>
            <button type="button" aria-label="分享">
              ↗
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div
            className="h-20 w-20 shrink-0 rounded-full border-2 border-white/80 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80)",
            }}
          />
          <div className="flex-1">
            <p className="text-[34px] font-bold leading-none">何意味</p>
            <p className="mt-2 text-sm text-white/80">小红书号: 339472261</p>
            <p className="text-sm text-white/80">IP 属地: 美国</p>
          </div>
        </div>

        <p className="mt-4 text-[15px] text-white/85">点击这里，填写简介</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <p>
              <span className="mr-1 text-2xl font-semibold">0</span>关注
            </p>
            <p>
              <span className="mr-1 text-2xl font-semibold">1</span>粉丝
            </p>
            <p>
              <span className="mr-1 text-2xl font-semibold">76</span>获赞与收藏
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-white/50 px-4 py-1 text-sm font-medium"
            >
              编辑资料
            </button>
            <button type="button" className="rounded-full border border-white/50 px-3 py-1 text-sm">
              ⚙
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4 py-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[15px] font-semibold text-zinc-900">创作灵感</p>
          <p className="mt-1 text-xs text-zinc-500">学创作找灵感</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[15px] font-semibold text-zinc-900">浏览记录</p>
          <p className="mt-1 text-xs text-zinc-500">看过的笔记</p>
        </div>
      </section>

      <section className="px-4">
        <HeartBoardEntry />
      </section>

      <section className="mt-4 border-y border-zinc-200 bg-white px-4">
        <div className="flex items-center justify-between py-3 text-[15px]">
          {["笔记", "收藏", "赞过"].map((tab, idx) => (
            <button key={tab} type="button" className={`relative ${idx === 0 ? "font-semibold" : ""}`}>
              {tab}
              {idx === 0 ? (
                <span className="absolute -bottom-2 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded bg-[var(--xhs-red)]" />
              ) : null}
            </button>
          ))}
          <button type="button" aria-label="搜索">
            ⌕
          </button>
        </div>
      </section>

      <section className="columns-2 gap-3 px-3 pt-3">
        {profileNotes.map((note) => (
          <Link
            href="/post/1"
            key={note.id}
            className="mb-3 block break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div
              className="h-52 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${note.cover})` }}
            />
            <div className="space-y-1 px-3 pb-3 pt-2">
              <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{note.title}</p>
              <p className="text-xs text-zinc-500">{note.subtitle}</p>
              <p className="text-xs text-zinc-500">◉ {note.views}</p>
            </div>
          </Link>
        ))}
      </section>

      <BottomNav active="me" />
    </main>
  );
}
