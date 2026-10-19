"use client";

import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/wedding";

const TARGET = new Date(WEDDING.dateISO).getTime();

type Left = { days: number; hours: number; minutes: number; seconds: number };

function calc(): Left {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-white/45 bg-gradient-to-br from-sage-400 to-sage-600 shadow-[0_16px_34px_-18px_rgba(0,0,0,0.55)] sm:h-20 sm:w-20">
        {/* мягкий блик сверху */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
        <span
          key={text}
          className="animate-pop relative font-display text-3xl font-semibold tabular-nums text-white sm:text-4xl"
        >
          {text}
        </span>
      </div>
      <span className="mt-2.5 text-[10px] uppercase tracking-[0.22em] text-sage-50/85 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/** Обратный отсчёт до торжества. */
export default function Countdown() {
  const [left, setLeft] = useState<Left>(() => calc());
  const [passed, setPassed] = useState(() => calc().days === 0 && calc().hours === 0 && calc().minutes === 0 && calc().seconds === 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeft(calc());
      setPassed(Date.now() >= TARGET);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (passed) {
    return (
      <p className="font-display text-2xl text-forest sm:text-3xl">
        Мы женаты! Спасибо, что были рядом
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-5">
      <Unit value={left.days} label="дней" />
      <Unit value={left.hours} label="часов" />
      <Unit value={left.minutes} label="минут" />
      <Unit value={left.seconds} label="секунд" />
    </div>
  );
}
