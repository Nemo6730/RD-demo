import Link from "next/link";

export function HeartBoardEntry() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,#fff7f8_0%,#fff_46%,#ffecef_100%)] px-4 pb-4 pt-3 shadow-[0_10px_28px_rgba(255,36,66,0.10)]">
      <span className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[rgba(255,36,66,0.14)] blur-2xl" />
      <span className="pointer-events-none absolute bottom-0 left-8 h-10 w-24 rounded-full bg-white/70 blur-xl" />

      <div className="relative">
        <div className="inline-flex -translate-x-0.5 items-center gap-1 rounded-full bg-white/75 px-2 py-0.5 text-[9px] font-semibold text-[var(--xhs-red)] shadow-sm">
            <span>✦</span>
            <span>AI 回顾</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <p className="heartboard-subtitle min-w-0 text-[13px] font-medium leading-5 text-zinc-700">
            本周留下的爪印已帮你整理好
            <span className="ml-1 align-[1px] text-[10px] text-[var(--xhs-red)]">✦</span>
          </p>
          <Link
            href="/heart-board"
            className="shrink-0 rounded-full bg-[var(--xhs-red)] px-4 py-2 text-xs font-semibold text-white shadow-[0_6px_14px_rgba(255,36,66,0.24)] transition active:scale-95"
            data-step-guide="4"
          >
            查看本周爪印
          </Link>
        </div>
      </div>
    </div>
  );
}
