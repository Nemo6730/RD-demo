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

export const GUIDE_STEP_COUNT = 6;

const STEP_LABELS: Record<number, string> = {
  1: "点开第一篇，去发现灵感 ✨",
  2: "点亮灵感 ✨",
  3: "去查看结果",
  4: "开启 AI 整理",
  5: "点击生成",
  6: "查看详情",
};

function isStepAllowedOnPath(step: number, path: string): boolean {
  if (step === 1) return path === "/" || path === "";
  if (step === 2) return path.startsWith("/post");
  if (step === 3) return path.startsWith("/post") || path === "/" || path === "/me";
  if (step === 4) return path === "/me";
  if (step === 5) return path === "/heart-board";
  if (step === 6) return path === "/heart-board";
  return false;
}

type StepGuideContextValue = {
  /** 当前要完成的步骤 1–6；0 表示未开始或未 hydrate */
  step: number;
  hydrated: boolean;
  finished: boolean;
  /** 帖子页且为 Step≥3 时（待点「我」）为 BottomNav 腾出底部空间 */
  reserveBottomNavOnPost: boolean;
  /** Step 2：仅在用户成功点亮时调用（避免点按取消也推进） */
  notifyHeartLitForGuide: () => void;
  /** Step 5：「用 AI 生成」请求开始时显示等待气泡 */
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

    const el = document.querySelector(`[data-step-guide="${step}"]`);
    if (!el || !(el instanceof HTMLElement)) {
      setRect(null);
      return;
    }

    const update = () => {
      const r = el.getBoundingClientRect();
      setRect(r);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [mounted, finished, step, pathname, aiGuideGenerating]);

  if (!mounted || finished || step < 1 || !rect || rect.width === 0) return null;
  if (!isStepAllowedOnPath(step, pathname)) return null;

  const label =
    step === 5 && aiGuideGenerating
      ? "AI 正在整理，请稍候…"
      : STEP_LABELS[step];
  if (!label) return null;

  const bubbleWidth = 168;
  const bubbleApproxHeight = 52;
  const gap = 10;
  /** Step 5（含生成中）：气泡在按钮下方；Step 1：气泡下移到卡片内（封面偏下） */
  const belowAnchor = step === 5;
  const step1InCard = step === 1;

  const left = rect.left + rect.width / 2 - bubbleWidth / 2;
  let top: number;
  if (belowAnchor) {
    top = rect.bottom + gap;
  } else if (step1InCard) {
    top = rect.top + 52;
  } else {
    top = rect.top - 44;
  }
  const clampedLeft = Math.max(12, Math.min(left, window.innerWidth - bubbleWidth - 12));
  let clampedTop = Math.max(12, top);
  if (belowAnchor) {
    clampedTop = Math.min(clampedTop, window.innerHeight - bubbleApproxHeight - 12);
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
        className={`${motionClass} pointer-events-none absolute max-w-[168px] rounded-2xl border border-white/90 bg-white/80 px-3 py-2 text-center text-xs font-medium leading-snug text-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm`}
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
