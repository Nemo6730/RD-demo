import Link from "next/link";
import { profileNotes } from "@/data/mockPosts";
import { BottomNav } from "@/app/components/BottomNav";
import { HeartBoardEntry } from "@/app/components/HeartBoardEntry";

export function ProfilePage() {
  const visibleProfileNotes = profileNotes.filter((note) => note.title !== "燕云男女主之争");

  return (
    <main className="min-h-screen bg-[#FFFBF8] pb-24 font-sans">
      <section className="mx-4 mt-3 rounded-3xl bg-[linear-gradient(to_bottom_left,#ffffff_0%,#fff9fb_42%,#fdeef2_100%)] px-4 pb-4 pt-3 text-zinc-900 shadow-[0_8px_30px_rgba(225,190,200,0.12)]">
        <div className="mb-4 flex items-center justify-between text-lg text-zinc-800">
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

        <div className="flex items-center gap-3">
          <div
            className="h-20 w-20 shrink-0 rounded-full border-2 border-white bg-cover bg-center shadow-[0_4px_14px_rgba(225,190,200,0.22)]"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=300&q=80)",
            }}
          />
          <div className="flex-1">
            <p className="text-[21px] font-semibold leading-snug tracking-tight text-zinc-900">momo</p>
            <p className="mt-2 text-xs leading-5 text-zinc-500">小红书号: 2333333</p>
            <p className="text-xs leading-5 text-zinc-500">IP 属地: 美国</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-zinc-500">点击这里，填写简介</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-4 text-[13px] leading-none text-zinc-600">
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-base font-semibold text-zinc-900">0</span>关注
            </p>
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-base font-semibold text-zinc-900">1</span>粉丝
            </p>
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-base font-semibold text-zinc-900">76</span>获赞与收藏
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="h-8 whitespace-nowrap rounded-full border border-zinc-200/90 bg-white/70 px-4 text-xs font-medium text-zinc-800 backdrop-blur-sm"
            >
              编辑资料
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/90 bg-white/70 text-base text-zinc-800 backdrop-blur-sm"
            >
              ⚙
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/70 bg-white/45 p-4 backdrop-blur-sm">
            <p className="text-[15px] font-semibold text-zinc-900">创作灵感</p>
            <p className="mt-1 text-xs text-zinc-500">学创作找灵感</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/45 p-4 backdrop-blur-sm">
            <p className="text-[15px] font-semibold text-zinc-900">浏览记录</p>
            <p className="mt-1 text-xs text-zinc-500">看过的笔记</p>
          </div>
        </div>
      </section>

      <section className="px-4">
        <HeartBoardEntry />
      </section>

      <section className="mx-4 mt-4 overflow-hidden rounded-3xl bg-white px-4 shadow-sm">
        <div className="flex items-center justify-between py-3 text-[13px]">
          {["笔记", "收藏", "赞过"].map((tab, idx) => (
            <button key={tab} type="button" className={`relative ${idx === 0 ? "font-semibold" : ""}`}>
              {tab}
              {idx === 0 ? (
                <span className="absolute -bottom-2 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded bg-[var(--xhs-red)]" />
              ) : null}
            </button>
          ))}
          <button type="button" aria-label="搜索" className="text-xl leading-none">
            ⌕
          </button>
        </div>
      </section>

      <section className="columns-2 gap-3 px-3 pt-3">
        {visibleProfileNotes.map((note) => (
          <Link
            href={`/post/post_00${note.id - 10}?from=${encodeURIComponent("/me")}`}
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
