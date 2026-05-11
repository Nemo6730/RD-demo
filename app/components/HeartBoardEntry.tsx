import Link from "next/link";

export function HeartBoardEntry() {
  return (
    <Link
      href="/heart-board"
      className="block rounded-2xl border border-[rgba(255,36,66,0.2)] bg-[rgba(255,36,66,0.06)] p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-zinc-900">本周心动板</p>
          <p className="mt-1 text-xs text-zinc-600">AI 已整理你本周点亮的内容</p>
        </div>
        <span className="rounded-full bg-[var(--xhs-red)] px-3 py-1 text-xs text-white">查看</span>
      </div>
    </Link>
  );
}
