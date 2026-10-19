"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export type DropPhoto = { src: string };

/**
 * Геометрия кадра — те же константы, что были в рабочей версии.
 */
const ASPECT = 1.25;
const NARROW_ASPECT = 1.4;
const MAX_WIDTH_VW = 0.522;
const MAX_WIDTH_PX = 747;
const NARROW_VW = 700;
const NARROW_WIDTH_VW = 0.792;
const NARROW_WIDTH_PX = 558;
const EDGE_MARGIN = 0.38;
const LEFT_SHIFT = 0.4;
const RIGHT_SHIFT = -0.34;
const FIRST_PHOTO_OFFSET = 0.7;
const EXCURSION = 0.26;
const BOTTOM_MARGIN = 22;

/**
 * Вертикальный сдвиг кадров, доли высоты фото.
 * Кадры 1–5 подняты выше на 25% высоты фото, 6-й опущен ниже на 20%.
 */
const PHOTO_UP = 0.25;
const PHOTO_DOWN = 0.2;


const ANCHOR_Y = 0.5;
const MAX_ANCHOR_Y = 0.58;
const TILT = 16;
/** Мягкое сглаживание */
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Кривая проявления с пологим пиком скорости */
const ease = (t: number) => 0.3 * t + 0.7 * smooth(t);

/** Прозрачность: появляется на первой половине окна, гаснет на второй */
function ramp(x: number) {
  if (x <= 0 || x >= 1) return 0;
  return x < 0.5 ? ease(x / 0.5) : ease((1 - x) / 0.5);
}

/**
 * Фотографии на фоне: выезжают из-за края экрана и уезжают обратно.
 * Кадр привязан к экрану (position: fixed), а не к позиции на странице.
 *
 * Окна показа задаются равномерными долями прокрутки — это та схема,
 * которая работала стабильно. От привязки к «тихим» зонам отказались:
 * на телефоне зоны могли схлопнуться в одну точку, и тогда все фото
 * открывались разом.
 */
export default function PhotoDrop({ photos }: { photos: DropPhoto[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || photos.length === 0) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let raf = 0;
    let viewW = 0;
    let viewH = 0;
    let photoW = 0;
    let photoH = 0;
    let maxScroll = 1;
    let sizeApplied = false;
    // Последняя известная ширина: на телефоне адресная строка меняет
    // только высоту, и пересчёт на такое событие сдвигал фото.
    let lastWidth = 0;

    const measure = () => {
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      photoW =
        viewW < NARROW_VW
          ? Math.min(viewW * NARROW_WIDTH_VW, NARROW_WIDTH_PX)
          : Math.min(viewW * MAX_WIDTH_VW, MAX_WIDTH_PX);
      photoH = photoW * (viewW < NARROW_VW ? NARROW_ASPECT : ASPECT);
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewH);

      // Размер задаём всем кадрам сразу
      for (const el of itemsRef.current) {
        if (!el) continue;
        el.style.width = `${photoW}px`;
        el.style.height = `${photoH}px`;
      }
    };

    /**
     * Ставит кадр. `settle` — насколько он «доехал» до места покоя:
     * 0 — полностью за своим краем, 1 — на месте.
     */
    const placeAt = (
      el: HTMLDivElement,
      side: -1 | 1,
      settle: number,
      sizeShift: number,
      yOffset: number,
    ) => {
      const W = viewW;
      const H = viewH;

      // Геометрия повёрнутого кадра
      const rad = (TILT * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const halfW = photoW / 2;
      const halfH = photoH / 2;

      const cornerOut = halfW * cos - halfH * sin; // угол торчит вбок
      const farX = halfW * cos + halfH * sin; // дальний угол по x
      const nearY = halfH * cos - halfW * sin; // ближний низ по y
      const farY = halfW * sin + halfH * cos; // дальний низ по y

      // --- Горизонталь: край кадра уходит за боковую кромку так,
      //     чтобы даже повёрнутый угол не выглядывал ---
      const margin = EDGE_MARGIN * photoW;
      const baseLeft =
        side < 0
          ? cornerOut - photoW / 2 - margin
          : W - cornerOut - photoW / 2 + margin;

      const extraShift = (side < 0 ? LEFT_SHIFT : RIGHT_SHIFT) * photoW;
      const restLeft = baseLeft + extraShift;

      // --- Выезд: процент от ширины, но не больше половины диагонали ---
      const maxExcursion = Math.hypot(photoW, photoH) / 2;
      const excursion = Math.min(EXCURSION * photoW, maxExcursion);
      const dx = side * excursion * (1 - settle);

      const x = restLeft + dx;

      // --- Вертикаль ---
      // Ориентир считаем так, чтобы нижний край уходил за нижнюю кромку
      // экрана. Из-за наклона край идёт по диагонали, поэтому важна точка,
      // где он пересекает внешнюю кромку экрана (x=0 слева, x=W справа).
      const cxBase = side < 0 ? cornerOut - margin : W - cornerOut + margin;
      const cross =
        side < 0
          ? (farX - cxBase) / (farX + cornerOut)
          : (W - cxBase + cornerOut) / (farX + cornerOut);
      const drop =
        side < 0
          ? nearY + cross * (farY - nearY)
          : farY + cross * (nearY - farY);

      const anchor = H * ANCHOR_Y;
      const needed = H + BOTTOM_MARGIN - drop;
      // yOffset — вертикальный сдвиг в долях высоты фото:
      // отрицательный поднимает кадок, положительный опускает.
      // Сдвиг ограничен, чтобы кадок не уехал за верхний край экрана:
      // центр не может подняться выше 30% его высоты.
      const minCenter = H * 0.3;
      // Итоговый центр ограничен сверху и снизу, чтобы кадок не уезжал
      // ни за верхний, ни за нижний край экрана
      const centerY =
        Math.max(
          Math.max(anchor, minCenter),
          Math.min(needed, H * MAX_ANCHOR_Y),
        ) + yOffset * photoH;
      const y = Math.min(Math.max(centerY, halfH), H + BOTTOM_MARGIN - halfH) + sizeShift;

      if (!sizeApplied) {
        el.style.width = `${photoW}px`;
        el.style.height = `${photoH}px`;
        sizeApplied = true;
      }

      // Без округления — иначе позиция скачет по 0.1 px
      el.style.transform = `translate3d(${x}px, ${y - photoH / 2}px, 0) rotate(${
        side < 0 ? TILT : -TILT
      }deg)`;
    };

    const render = () => {
      raf = 0;

      const n = photos.length;

      // Окна строго смежные, без перекрытия: пока один кадр полностью
      // гаснет, следующий ещё не начинает проявляться. От кроссфейда
      // отказались, потому что он выглядел как два фото одновременно.
      // Раскладываем окна на ПОЛНОМ диапазоне прокрутки: делим его на
      // n равных окон и внутри каждого центрируем кадр. Так все фото
      // гарантированно показываются, а длительность каждого кадра —
      // 1/n всей прокрутки, независимо от размера исходной раскладки.
      // Окна строго смежные, без перекрытия: делим весь диапазон
      // прокрутки на n равных частей, по одной на кадр. Так все фото
      // гарантированно показываются, каждый — на своей части страницы.
      const windowH = maxScroll / n;

      const starts: number[] = [];
      for (let i = 0; i < n; i += 1) {
        starts.push(i * windowH);
      }

      for (let i = 0; i < n; i += 1) {
        const el = itemsRef.current[i];
        if (!el) continue;

        const raw = (window.scrollY - starts[i]) / windowH;

        if (raw <= 0 || raw >= 1) {
          // Неактивный кадок убираем со слоя совсем: иначе шесть
          // больших элементов висят в GPU памяти и прокрутка дёргается
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          el.style.willChange = "auto";
          continue;
        }

        el.style.visibility = "visible";
        el.style.willChange = "transform, opacity";

        // Поправка на размер. Все кадры одного размера, поэтому она
        // равна нулю; формула оставляем на случай разных размеров.
        const sizeShift = -((photoH - photoH * ASPECT) / 2) * (2 / 3);

        // Одна и та же величина управляет и прозрачностью, и смещением
        const a = ramp(raw);
        // Кадры 1–5 сдвинуты выше на 1/3 высоты фото, 6-й — ниже на 1/2
        placeAt(
          el,
          i % 2 === 0 ? -1 : 1,
          a,
          sizeShift,
          i < 5 ? -PHOTO_UP : PHOTO_DOWN,
        );
        el.style.opacity = `${0.97 * a}`;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onResize = () => {
      // На телефонах адресная строка появляется и скрывается при
      // прокрутке, меняя только высоту окна. Пересчёт геометрии на
      // каждое такое событие сдвигал фото. Поворот экрана обрабатываем.
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      measure();
      schedule();
    };

    measure();
    lastWidth = viewW;
    sizeApplied = false;

    const n = photos.length;

    if (reduceMotion) {
      // Без анимации — кадры просто стоят на своих местах
      photos.forEach((_, i) => {
        const el = itemsRef.current[i];
        if (!el) return;
        placeAt(
          el,
          i % 2 === 0 ? -1 : 1,
          1,
          0,
          i < 5 ? -PHOTO_UP : PHOTO_DOWN,
        );
        el.style.opacity = "0.9";
      });
      return;
    }

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    // Высота страницы меняется, пока грузятся шрифты и картинки, —
    // пересчитываем, когда всё устоялось
    let settleTimer = 0;
    const onSettled = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        measure();
        schedule();
      }, 120);
    };
    window.addEventListener("load", onSettled);
    if (document.fonts?.ready) {
      document.fonts.ready.then(onSettled).catch(() => undefined);
    }

    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onSettled);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [photos]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="photo-drop"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          ref={(node) => {
            itemsRef.current[i] = node;
          }}
          className="photo-arc"
          style={{ opacity: 0 }}
        >
          <div className="photo-arc__frame">
            <Image
              src={photo.src}
              alt=""
              width={1000}
              height={1400}
              sizes="(max-width: 699px) 79vw, 52vw"
              className="block h-auto w-full"
              loading="lazy"
              decoding="async"
            />
            <span aria-hidden="true" className="photo-arc__veil" />
            <span aria-hidden="true" className="photo-arc__edge" />
          </div>
        </div>
      ))}
    </div>
  );
}
