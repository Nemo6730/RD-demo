import Link from "next/link";

type BottomNavProps = {
  active: "home" | "market" | "message" | "me";
};

const navItems = [
  { key: "home", label: "首页", href: "/" },
  { key: "market", label: "市集", href: "#" },
  { key: "message", label: "消息", href: "#" },
  { key: "me", label: "我", href: "/me" },
] as const;

export function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] border-t border-zinc-200 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur">
      <div className="relative flex items-end justify-between text-xs text-zinc-500">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex min-w-14 flex-col items-center gap-1 ${
              active === item.key ? "font-semibold text-zinc-900" : ""
            }`}
          >
            <span className="text-[18px] leading-none">○</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          type="button"
          className="absolute left-1/2 top-0 h-10 w-14 -translate-x-1/2 -translate-y-5 rounded-2xl bg-[var(--xhs-red)] text-xl font-semibold text-white shadow-md"
          aria-label="发布"
        >
          +
        </button>
      </div>
    </div>
  );
}
