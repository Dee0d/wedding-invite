"use client";

import { useEffect, useState } from "react";

/**
 * Экран загрузки.
 *
 * До тех пор пока не загружены шрифты и ключевые картинки, страница
 * скрыта — иначе на телефонах всё «скачет» и моргает при перерисовке.
 * Когда всё готово, заглушка плавно тает, и main проявляется.
 */
export default function Boot() {
  const [hidden, setHidden] = useState(false);

  // Проверка, что стили действительно применились. На телефонах
  // случалось, что CSS не загружался (кэш или блокировщик) — страница
  // показывалась вообще без оформления: без анимаций, фото видны сразу.
  // В таком случае перезагружаем один раз со сбросом кэша.
  useEffect(() => {
    const probe = document.createElement("div");
    probe.className = "css-probe";
    probe.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(probe);
    const color = window.getComputedStyle(probe).color;
    probe.remove();

    if (color !== "rgb(1, 2, 3)") {
      if (!window.sessionStorage.getItem("wedding-css-retry")) {
        window.sessionStorage.setItem("wedding-css-retry", "1");
        const sep = window.location.search ? "&" : "?";
        window.location.replace(
          `${window.location.pathname}${window.location.search}${sep}r=${Date.now()}`,
        );
      }
      return;
    }
    window.sessionStorage.removeItem("wedding-css-retry");
  }, []);

  useEffect(() => {
    let alive = true;

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      window.addEventListener("load", () => resolve(), { once: true });
    });
    // Небольшая минимальная задержка, чтобы экран не мигал слишком быстро
    const minDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 280);
    });

    Promise.all([fontsReady, pageLoaded, minDelay]).then(() => {
      if (!alive) return;
      document.documentElement.classList.add("is-ready");
      setHidden(true);
    });

    return () => {
      alive = false;
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="boot"
      aria-hidden="true"
      data-testid="boot-screen"
    >
      <span className="flex flex-col items-center gap-4">
        <span className="h-2 w-2 animate-pulse rounded-full bg-sage-400" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-sage-600">
          Подождите, мы вас приглашаем...
        </span>
      </span>
    </div>
  );
}
