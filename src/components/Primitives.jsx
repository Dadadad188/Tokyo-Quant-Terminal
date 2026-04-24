import { lazy, Suspense, useEffect, useRef, useState } from "react";

export const ReactECharts = lazy(() => import("echarts-for-react"));

export const upColor = "#22c55e";
export const downColor = "#ef4444";
export const gridLine = "rgba(148, 163, 184, 0.14)";

export function signed(value, digits = 2) {
  const number = Number(value);
  return `${number > 0 ? "+" : ""}${number.toFixed(digits)}`;
}

export function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function valueColor(value) {
  return Number(value) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]";
}

export function chartTextStyle(size = 14) {
  return {
    color: "#cbd5e1",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: Math.max(size, 14),
  };
}

export function Panel({ className = "", children }) {
  return <section className={`glass-panel rounded-xl ${className}`}>{children}</section>;
}

export function ChartShell({ children, className = "" }) {
  return (
    <Suspense fallback={<div className={`animate-pulse rounded-xl bg-slate-900/80 ${className}`} />}>
      {children}
    </Suspense>
  );
}

export function CountUpNumber({ value, digits = 2, className = "", showSign = false, animate = true, debounceMs = 180 }) {
  const previousValue = useRef(Number(value));
  const [displayValue, setDisplayValue] = useState(Number(value));
  const [flashTone, setFlashTone] = useState("");

  useEffect(() => {
    const endValue = Number(value);
    let frameId;
    let flashTimer;
    let debounceTimer;

    if (!animate || document.visibilityState === "hidden") {
      previousValue.current = endValue;
      setDisplayValue(endValue);
      setFlashTone("");
      return undefined;
    }

    debounceTimer = window.setTimeout(() => {
      const startValue = previousValue.current;
      const startedAt = performance.now();
      const duration = 520;

      function tick(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(startValue + (endValue - startValue) * eased);
        if (progress < 1) frameId = requestAnimationFrame(tick);
        else previousValue.current = endValue;
      }

      setFlashTone(endValue >= startValue ? "flash-up" : "flash-down");
      flashTimer = window.setTimeout(() => setFlashTone(""), 520);
      frameId = requestAnimationFrame(tick);
    }, debounceMs);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (flashTimer) window.clearTimeout(flashTimer);
      if (debounceTimer) window.clearTimeout(debounceTimer);
    };
  }, [animate, debounceMs, value]);

  const sign = showSign && displayValue > 0 ? "+" : "";
  return <span className={`rounded-md px-1 ${flashTone} ${className}`}>{sign}{formatNumber(displayValue, digits)}</span>;
}
