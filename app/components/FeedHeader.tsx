export function FeedHeader() {
  const channels = ["推荐", "视频", "直播", "穿搭", "职场", "美妆", "美食", "旅行"];

  return (
    <header className="sticky top-0 z-20 bg-white/95 px-4 pt-3 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className="text-xl text-zinc-700" aria-label="菜单">
          ☰
        </button>
        <div className="flex items-center justify-center gap-8 text-[16px] font-medium">
          <button type="button" className="text-zinc-400">
            关注
          </button>
          <button type="button" className="relative text-zinc-900">
            发现
            <span className="absolute -bottom-[6px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded bg-[var(--xhs-red)]" />
          </button>
          <button type="button" className="text-zinc-400">
            同城
          </button>
        </div>
        <button type="button" aria-label="搜索" className="text-xl text-zinc-700">
          ⌕
        </button>
      </div>

      <div className="hide-scrollbar flex gap-5 overflow-x-auto whitespace-nowrap pb-3 text-sm font-medium text-zinc-500">
        {channels.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`shrink-0 ${tab === "推荐" ? "font-semibold text-zinc-900" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}
