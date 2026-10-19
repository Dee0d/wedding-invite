"use client";

import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/wedding";
import { Monogram } from "./Decor";
import { EnvelopeIcon } from "./Icons";

const STORAGE_KEY = "wedding-intro-opened";

/** Тёплый «вход» в приглашение: конверт с сургучной печатью. */
export default function IntroGate() {
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) setState("open");
    } catch {
      /* приватный режим — просто покажем приветствие */
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Пока приглашение не открыто, страницу прокручивать нельзя: иначе
  // гость может уехать вниз, а после нажатия «Открыть» оказаться там же
  useEffect(() => {
    if (state === "open") {
      document.body.style.removeProperty("overflow");
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [state]);

  const open = () => {
    if (state !== "closed") return;
    setState("opening");
    // На случай если страницу всё же удалось прокрутить — начинаем сверху
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("wedding:confetti", {
        detail: { count: 120, power: 1.1, y: window.innerHeight * 0.55 },
      }),
    );
    // Это первое осознанное действие гостя — самое время включить музыку
    window.dispatchEvent(new Event("wedding:music:autoplay"));
    window.setTimeout(() => setState("open"), 900);
  };

  if (state === "open") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Приглашение на свадьбу"
      data-state={state}
      className={`fixed inset-0 z-[80] grid place-items-center overflow-hidden overscroll-none touch-none px-5 py-8 transition-all duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        state === "opening"
          ? "pointer-events-none opacity-0 blur-md scale-105"
          : "opacity-100"
      }`}
    >
      {/* фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-cream to-sage-100" />
      <div className="absolute -left-24 top-10 h-80 w-80 animate-blob rounded-full"
            style={{ background: "radial-gradient(circle, rgba(211,232,206,0.60) 0%, rgba(211,232,206,0) 70%)" }} />
      <div
        className="absolute -right-20 bottom-0 h-96 w-96 animate-blob rounded-full "
        style={{ animationDelay: "-8s", background: "radial-gradient(circle, rgba(220,205,242,0.40) 0%, rgba(220,205,242,0) 70%)" }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-72 w-72 animate-blob rounded-full "
        style={{ animationDelay: "-15s", background: "radial-gradient(circle, rgba(249,212,186,0.40) 0%, rgba(249,212,186,0) 70%)" }}
      />

      <div className="relative flex max-w-md flex-col items-center text-center">
        <div className="animate-pop scale-[0.78] sm:scale-100">
          <Monogram />
        </div>

        <p className="mt-5 animate-pop text-[10px] uppercase tracking-[0.3em] text-sage-700 sm:text-xs sm:tracking-[0.42em]">
          {WEDDING.city} · {WEDDING.dateShort}
        </p>

        <h1 className="mt-3 animate-pop whitespace-nowrap font-display text-[2.3rem] leading-tight text-forest sm:text-6xl">
          {WEDDING.groom}
          <span className="mx-1 text-sage-500 sm:mx-2">&</span>
          {WEDDING.bride}
        </h1>

        <p className="mt-4 animate-pop max-w-[19rem] text-[13px] leading-relaxed text-forest/75 sm:max-w-sm sm:text-sm">
          Приглашаем вас разделить с нами самый важный день нашей жизни.
          Внутри — все детали и пара вопросов, которые помогут нам подготовиться.
        </p>

        <button
          type="button"
          onClick={open}
          className="btn-glow group mt-7 inline-flex items-center gap-2.5 rounded-full border border-sage-300/70 bg-white/90 px-6 py-3.5 font-display text-base text-forest sm:mt-8 sm:gap-3 sm:px-8 sm:py-4 sm:text-lg shadow-[0_18px_40px_-22px_rgba(47,74,56,0.8)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(47,74,56,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
        >
          {/* Увеличение и подсветка вместо вращения */}
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-sage-500 text-white shadow-[0_0_0_0_rgba(119,169,124,0)] transition-all duration-500 group-hover:scale-[1.28] group-hover:bg-sage-600 group-hover:shadow-[0_0_22px_6px_rgba(119,169,124,0.55)]">
            <EnvelopeIcon className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </span>
          Открыть приглашение
        </button>
      </div>
    </div>
  );
}
