"use client";

import { useEffect, useState } from "react";
import { EnvelopeIcon } from "./Icons";

/**
 * Плавающая кнопка «Ответить».
 *
 * Показывается только когда одновременно:
 *  1. анкета вне зоны видимости (рядом с ней и так есть своя кнопка
 *     «Отправить ответ» — дублировать не нужно);
 *  2. ответ ещё не отправлен — после отправки кнопка не нужна вовсе.
 */
export default function FloatingCta() {
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);

  /**
   * Слежу за двумя элементами: анкетой (#rsvp) и кнопкой
   * «Заполнить анкету» на первом экране (#hero-cta).
   * Кнопка «Ответить» появляется только когда ни одна из них не видна.
   */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // Запасной вариант — по прокрутке
      const threshold = window.innerHeight * 0.7;
      const onScroll = () => setShow(window.scrollY > threshold);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Всё, что заслоняет кнопку «Ответить»
    const targets = [
      document.getElementById("rsvp"),
      document.getElementById("hero-cta"),
    ].filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        setShow(visible.size === 0);
      },
      // Отрицательные отступы сверху и снизу: элемент считается
      // перекрывающим кнопку, когда он вплотную подошёл к краям экрана
      { threshold: 0, rootMargin: "-12% 0px -12% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // После отправки ответа кнопка больше не показывается
  useEffect(() => {
    const onSent = () => setSent(true);
    window.addEventListener("wedding:rsvp-sent", onSent);
    return () => window.removeEventListener("wedding:rsvp-sent", onSent);
  }, []);

  const visible = show && !sent;

  return (
    <a
      href="#rsvp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sage-600 to-forest px-5 py-3.5 font-display text-base text-white shadow-[0_18px_40px_-18px_rgba(47,74,56,0.95)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(47,74,56,0.95)] focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <EnvelopeIcon className="h-4 w-4 animate-bob" />
      Ответить
    </a>
  );
}
