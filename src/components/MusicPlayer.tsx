"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding";
import { MusicIcon, PauseIcon, PlayIcon } from "./Icons";

declare global {
  interface WindowEventMap {
    "wedding:music:autoplay": Event;
  }
}

/**
 * Фоновая музыка.
 *
 * Браузеры не дают включить звук без действия пользователя, поэтому:
 *  1. запускаем в момент нажатия «Открыть приглашение» — это и есть жест;
 *  2. если не вышло — пробуем на первом касании/скролле;
 *  3. кнопка с подписью всегда на виду и работает вручную.
 *
 * Выключение — это именно ПАУЗА: трек не сбрасывается и продолжается
 * с того же места. После ручной паузы музыка сама больше не включается.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);
  const mutedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || mutedRef.current) return false;

    try {
      audio.volume = 0.3;
      audio.loop = true;
      // Сбрасываем на начало только при самом первом запуске,
      // при повторном — продолжаем с места паузы
      if (!startedRef.current) {
        audio.currentTime = 0;
        startedRef.current = true;
      }
      await audio.play();
      setPlaying(true);
      setBlocked(false);
      return true;
    } catch (error) {
      console.warn("Автозапуск музыки заблокирован браузером:", error);
      setPlaying(false);
      setBlocked(true);
      return false;
    }
  }, []);

  // Кнопка появляется чуть позже, чтобы не спорить с приветственным экраном
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  // 1. Старт в момент открытия приглашения
  useEffect(() => {
    const onOpen = () => {
      void tryPlay();
    };
    window.addEventListener("wedding:music:autoplay", onOpen);
    return () => window.removeEventListener("wedding:music:autoplay", onOpen);
  }, [tryPlay]);

  // 2. Подстраховка: первое взаимодействие со страницей.
  //    Если гость поставил музыку на паузу — не навязываемся.
  useEffect(() => {
    if (playing || muted) return;

    const onInteract = () => {
      void tryPlay();
    };

    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("touchstart", onInteract, { passive: true });
    window.addEventListener("scroll", onInteract, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [playing, muted, tryPlay]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      // Пауза, а не полная остановка: позиция трека сохраняется
      audio.pause();
      mutedRef.current = true;
      setMuted(true);
      setPlaying(false);
      return;
    }

    // Возобновляем с того же места
    mutedRef.current = false;
    setMuted(false);
    await tryPlay();
  };

  const label = playing ? "Выключить музыку" : "Включить музыку";

  return (
    <>
      <audio
        ref={audioRef}
        src={WEDDING.music}
        preload="auto"
        loop
        data-testid="bg-audio"
      />

      <div
        className={`fixed bottom-5 left-4 z-[85] transition-all duration-700 sm:bottom-8 sm:left-8 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={label}
          title={label}
          data-playing={playing ? "true" : "false"}
          className={`group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-[0_16px_38px_-20px_rgba(47,74,56,0.95)] transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 sm:gap-2.5 sm:px-4 sm:py-3 sm:text-sm ${
            playing
              ? "border-sage-400/60 bg-white/95 text-forest"
              : "border-white/50 bg-forest/85 text-white hover:bg-forest"
          }`}
        >
          <span className="relative grid h-5 w-5 shrink-0 place-items-center sm:h-6 sm:w-6">
            {playing ? (
              <>
                <PauseIcon className="h-3.5 w-3.5" />
                {/* три «столбика» эквалайзера — видно, что музыка играет */}
                <span className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-3 items-end gap-[2px]">
                  <span
                    className="w-[2px] animate-eq rounded-full bg-sage-500"
                    style={{ height: 6 }}
                  />
                  <span
                    className="w-[2px] animate-eq rounded-full bg-sage-500"
                    style={{ height: 10, animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-[2px] animate-eq rounded-full bg-sage-500"
                    style={{ height: 4, animationDelay: "0.4s" }}
                  />
                </span>
              </>
            ) : (
              <PlayIcon className="h-3.5 w-3.5 translate-x-[1px]" />
            )}
          </span>

          <span className="whitespace-nowrap">
            {playing ? "Музыка включена" : "Включить музыку"}
          </span>

          {!playing && (
            <MusicIcon className="h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>
    </>
  );
}
