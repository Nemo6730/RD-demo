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
  const itemColumnClass = ["col-start-1", "col-start-2", "col-start-4", "col-start-5"] as const;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-4 pb-[calc(env(safe-area-inset-bottom)+8px)]">
      <div className="grid h-12 grid-cols-5 items-center overflow-hidden rounded-3xl border border-white/80 bg-white/95 px-1 text-[13px] text-zinc-500 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur">
        {navItems.map((item, index) => (
          <Link
            key={item.key}
            href={item.href}
            data-step-guide={item.key === "me" ? "3" : undefined}
            className={`${itemColumnClass[index]} flex h-12 items-center justify-center leading-none ${
              active === item.key ? "font-semibold text-zinc-900" : ""
            }`}
          >
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          type="button"
          className="col-start-3 row-start-1 h-10 w-14 justify-self-center rounded-2xl bg-[var(--xhs-red)] text-xl font-semibold text-white shadow-md"
          aria-label="发布"
        >
          +
        </button>
      </div>
    </div>
  );
}
