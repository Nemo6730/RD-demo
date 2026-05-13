"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const STORAGE_FINISHED = "guide_finished";
const STORAGE_STEP = "guide_step";

export const GUIDE_STEP_COUNT = 7;

const STEP_LABELS: Record<number, string> = {
  1: "点开第一篇，去留个爪 ✨",
  2: "留个爪 ✨",
  3: "查看爪印记录",
  4: "开启爪印整理",
  5: "整理本周爪印",
  6: "查看详情",
  7: "查看要点总结、回顾原帖",
};

/** `/heart-board/[categoryId]`，不含列表页与 sources 子页 */
function isHeartBoardCategoryDetailPath(path: string): boolean {
  const parts = path.split("/").filter(Boolean);
  return parts.length === 2 && parts[0] === "heart-board";
}

function isStepAllowedOnPath(step: number, path: string): boolean {
  if (step === 1) return path === "/" || path === "";
  if (step === 2) return path.startsWith("/post");
  if (step === 3) return path.startsWith("/post") || path === "/" || path === "/me";
  if (step === 4) return path === "/me";
  if (step === 5) return path === "/heart-board";
  if (step === 6) return path === "/heart-board";
  if (step === 7) return isHeartBoardCategoryDetailPath(path);
  return false;
}

type StepGuideContextValue = {
  /** 当前要完成的步骤 1–7；0 表示未开始或未 hydrate */
  step: number;
  hydrated: boolean;
  finished: boolean;
  /** 帖子页且为 Step≥3 时（待点「我」）为 BottomNav 腾出底部空间 */
  reserveBottomNavOnPost: boolean;
  /** Step 2：仅在用户成功点亮时调用（避免点按取消也推进） */
  notifyHeartLitForGuide: () => void;
  /** Step 5：「整理本周爪印」请求开始时显示等待气泡 */
  notifyAiGenerateStartedForGuide: () => void;
  /** Step 5：请求结束后清除等待并进入 Step 6 */
  notifyAiGenerateFinishedForGuide: () => void;
};

const StepGuideContext = createContext<StepGuideContextValue | null>(null);

export function useStepGuide() {
  const ctx = useContext(StepGuideContext);
  if (!ctx) {
    return {
      step: 0,
      hydrated: false,
      finished: true,
      reserveBottomNavOnPost: false,
      notifyHeartLitForGuide: () => {},
      notifyAiGenerateStartedForGuide: () => {},
      notifyAiGenerateFinishedForGuide: () => {},
    };
  }
  return ctx;
}

function readFinished(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_FINISHED) === "true";
}

function readStep(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(STORAGE_STEP);
  const n = raw ? parseInt(raw, 10) : 1;
  if (Number.isNaN(n) || n < 1 || n > GUIDE_STEP_COUNT) return 1;
  return n;
}

export function StepGuideProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [finished, setFinished] = useState(false);
  const [step, setStep] = useState(1);
  const [aiGuideGenerating, setAiGuideGenerating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const done = readFinished();
    setFinished(done);
    if (!done) {
      setStep(readStep());
    }
    setHydrated(true);
  }, []);

  const persistStep = useCallback((next: number) => {
    if (next > GUIDE_STEP_COUNT) {
      window.localStorage.setItem(STORAGE_FINISHED, "true");
      window.localStorage.removeItem(STORAGE_STEP);
      setFinished(true);
      setStep(0);
      return;
    }
    window.localStorage.setItem(STORAGE_STEP, String(next));
    setStep(next);
  }, []);

  const tryCompleteStep = useCallback(
    (clickedStep: number) => {
      if (!hydrated || finished || clickedStep !== step) return;
      if (clickedStep === GUIDE_STEP_COUNT) {
        window.localStorage.setItem(STORAGE_FINISHED, "true");
        window.localStorage.removeItem(STORAGE_STEP);
        setFinished(true);
        setStep(0);
        return;
      }
      persistStep(clickedStep + 1);
    },
    [hydrated, finished, step, persistStep],
  );

  const notifyHeartLitForGuide = useCallback(() => {
    if (!hydrated || finished || step !== 2) return;
    persistStep(3);
  }, [hydrated, finished, step, persistStep]);

  const notifyAiGenerateStartedForGuide = useCallback(() => {
    if (!hydrated || finished || step !== 5) return;
    setAiGuideGenerating(true);
  }, [hydrated, finished, step]);

  const notifyAiGenerateFinishedForGuide = useCallback(() => {
    setAiGuideGenerating(false);
    if (!hydrated || finished || step !== 5) return;
    persistStep(6);
  }, [hydrated, finished, step, persistStep]);

  useEffect(() => {
    if (!hydrated || finished || step !== 6) return;
    if (isHeartBoardCategoryDetailPath(pathname)) {
      persistStep(7);
    }
  }, [hydrated, finished, step, pathname, persistStep]);

  useEffect(() => {
    if (!hydrated || finished) return;

    const onPointerDown = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest("[data-step-guide]");
      if (!el) return;
      const raw = el.getAttribute("data-step-guide");
      const n = raw ? parseInt(raw, 10) : NaN;
      if (Number.isNaN(n)) return;
      if (n === 2 || n === 5) return;
      tryCompleteStep(n);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [hydrated, finished, step, tryCompleteStep]);

  const reserveBottomNavOnPost =
    hydrated && !finished && step >= 3 && pathname.startsWith("/post");

  const value = useMemo(
    () => ({
      step: finished ? 0 : step,
      hydrated,
      finished,
      reserveBottomNavOnPost,
      notifyHeartLitForGuide,
      notifyAiGenerateStartedForGuide,
      notifyAiGenerateFinishedForGuide,
    }),
    [
      step,
      hydrated,
      finished,
      reserveBottomNavOnPost,
      notifyHeartLitForGuide,
      notifyAiGenerateStartedForGuide,
      notifyAiGenerateFinishedForGuide,
    ],
  );

  return (
    <StepGuideContext.Provider value={value}>
      {children}
      {hydrated ? (
        <StepGuideBubble
          step={finished ? 0 : step}
          finished={finished}
          pathname={pathname}
          aiGuideGenerating={aiGuideGenerating}
        />
      ) : null}
    </StepGuideContext.Provider>
  );
}

function StepGuideBubble({
  step,
  finished,
  pathname,
  aiGuideGenerating,
}: {
  step: number;
  finished: boolean;
  pathname: string;
  aiGuideGenerating: boolean;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || finished || step < 1 || step > GUIDE_STEP_COUNT) {
      setRect(null);
      return;
    }
    if (!isStepAllowedOnPath(step, pathname)) {
      setRect(null);
      return;
    }

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    const cleanups: Array<() => void> = [];

    const cleanupMeasurement = () => {
      ro?.disconnect();
      ro = null;
      while (cleanups.length) {
        cleanups.pop()?.();
      }
    };

    const attach = (target: HTMLElement) => {
      cleanupMeasurement();
      const update = () => {
        if (cancelled) return;
        const r = target.getBoundingClientRect();
        setRect(r.width > 0 || r.height > 0 ? r : null);
      };
      update();
      ro = new ResizeObserver(update);
      ro.observe(target);
      const onWin = () => update();
      window.addEventListener("scroll", onWin, true);
      window.addEventListener("resize", onWin);
      cleanups.push(() => {
        window.removeEventListener("scroll", onWin, true);
        window.removeEventListener("resize", onWin);
      });
    };

    const findAnchor = (): HTMLElement | null => {
      const el = document.querySelector(`[data-step-guide="${step}"]`);
      return el instanceof HTMLElement ? el : null;
    };

    const tryAttach = (): boolean => {
      const target = findAnchor();
      if (!target) return false;
      const r = target.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      attach(target);
      return true;
    };

    if (tryAttach()) {
      return () => {
        cancelled = true;
        cleanupMeasurement();
      };
    }

    setRect(null);

    let retryTimer: ReturnType<typeof setInterval> | undefined;
    const mo = new MutationObserver(() => {
      if (cancelled) return;
      if (tryAttach()) {
        mo.disconnect();
        if (retryTimer != null) window.clearInterval(retryTimer);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    retryTimer = window.setInterval(() => {
      if (cancelled) return;
      if (tryAttach()) {
        mo.disconnect();
        if (retryTimer != null) window.clearInterval(retryTimer);
      }
    }, 100);
    const stopTimer = window.setTimeout(() => {
      if (retryTimer != null) window.clearInterval(retryTimer);
    }, 4000);

    return () => {
      cancelled = true;
      mo.disconnect();
      if (retryTimer != null) window.clearInterval(retryTimer);
      window.clearTimeout(stopTimer);
      cleanupMeasurement();
    };
  }, [mounted, finished, step, pathname, aiGuideGenerating]);

  if (!mounted || finished || step < 1 || !rect || (rect.width === 0 && rect.height === 0)) return null;
  if (!isStepAllowedOnPath(step, pathname)) return null;

  const label =
    step === 5 && aiGuideGenerating
      ? "整理中，请稍等"
      : STEP_LABELS[step];
  if (!label) return null;

  const bubbleWidth = step === 7 ? 192 : 168;
  const bubbleApproxHeight = 52;
  const gap = 10;
  /** Step 5（含生成中）：气泡在锚点下方 */
  const belowAnchor = step === 5;
  /** Step 7：气泡在「相关原帖」链接右侧 */
  const rightOfAnchor = step === 7;
  const step1InCard = step === 1;

  let left: number;
  let top: number;
  if (rightOfAnchor) {
    left = rect.right + gap;
    top = rect.top + rect.height / 2 - bubbleApproxHeight / 2;
  } else if (belowAnchor) {
    left = rect.left + rect.width / 2 - bubbleWidth / 2;
    top = rect.bottom + gap;
  } else if (step1InCard) {
    left = rect.left + rect.width / 2 - bubbleWidth / 2;
    top = rect.top + 52;
  } else {
    left = rect.left + rect.width / 2 - bubbleWidth / 2;
    top = rect.top - 44;
  }

  let clampedLeft = Math.max(12, Math.min(left, window.innerWidth - bubbleWidth - 12));
  let clampedTop = Math.max(12, top);
  if (belowAnchor) {
    clampedTop = Math.min(clampedTop, window.innerHeight - bubbleApproxHeight - 12);
  } else if (rightOfAnchor) {
    clampedTop = Math.min(
      Math.max(12, clampedTop),
      window.innerHeight - bubbleApproxHeight - 12,
    );
  }

  const arrowLeft = rect.left + rect.width / 2 - clampedLeft;

  const motionClass =
    step === 5 && aiGuideGenerating ? "animate-pulse" : "animate-bounce";

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-live="polite"
      aria-label="新手引导"
    >
      <div
        className={`${motionClass} pointer-events-none absolute rounded-2xl border border-white/90 bg-white/80 px-3 py-2 text-center text-xs font-medium leading-snug text-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm`}
        style={{
          left: clampedLeft,
          top: clampedTop,
          width: bubbleWidth,
        }}
      >
        {label}
        {belowAnchor ? (
          <span
            className="absolute bottom-full h-0 w-0 border-x-[7px] border-b-[8px] border-x-transparent border-b-white/80"
            style={{
              left: Math.min(Math.max(arrowLeft, 20), bubbleWidth - 20),
              transform: "translateX(-50%)",
            }}
          />
        ) : rightOfAnchor ? (
          <span
            className="absolute top-1/2 h-0 w-0 -translate-y-1/2 border-y-[7px] border-r-[8px] border-y-transparent border-r-white/80"
            style={{ left: -7 }}
          />
        ) : (
          <span
            className="absolute top-full h-0 w-0 border-x-[7px] border-t-[8px] border-x-transparent border-t-white/80"
            style={{
              left: Math.min(Math.max(arrowLeft, 20), bubbleWidth - 20),
              transform: "translateX(-50%)",
            }}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
