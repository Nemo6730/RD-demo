"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-5 z-50 w-[86%] max-w-[360px] -translate-x-1/2 rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm text-white shadow-xl">
      {message}
    </div>
  );
}
