"use client";

import { useEffect, useRef } from "react";

type Shape = "petal" | "leaf" | "sparkle";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  angle: number;
  spin: number;
  phase: number;
  alpha: number;
  color: string;
  shape: Shape;
};

/**
 * Осенняя палитра: тёплые приглушённые тона, которые держатся
 * за руку с зелёной гаммой сайта, но читаются как листопад.
 */
const COLORS = [
  "#d9a05b", // мягкий янтарь
  "#c98a4e", // охра
  "#b56b45", // пыльная ржавчина
  "#a85c3c", // терракота
  "#8f6a3e", // бронза
  "#dbb168", // мёд
  "#c07a52", // карамель
  "#9e7a4a", // каштан
  "#cf8b3f", // золото
  "#a9713f", // кора
];

/** Формы: листьев больше всего — за ними и листопад */
const SHAPES: Shape[] = [
  "leaf",
  "leaf",
  "leaf",
  "leaf",
  "petal",
  "petal",
  "sparkle",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticle(width: number, height: number, initial: boolean): Particle {
  return {
    x: rand(0, width),
    y: initial ? rand(-height, height) : rand(-140, -20),
    size: rand(5, 15),
    speed: rand(0.18, 0.72),
    drift: rand(0.2, 0.8),
    angle: rand(0, Math.PI * 2),
    spin: rand(-0.011, 0.011),
    phase: rand(0, Math.PI * 2),
    alpha: rand(0.45, 0.95),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.scale(1, 0.62);
  ctx.beginPath();
  ctx.arc(0, 0, p.size, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.globalAlpha = p.alpha;
  ctx.fill();
  ctx.globalAlpha = p.alpha * 0.5;
  ctx.strokeStyle = "rgba(47,74,56,0.25)";
  ctx.lineWidth = 0.6;
  ctx.stroke();
  ctx.restore();
}

/** На маленьких частицах рисуем упрощённый лист — ради производительности */
function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle, detailed: boolean) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);

  // Силуэт листа
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.98, -s * 0.35, s * 0.8, s * 0.65, 0, s);
  ctx.bezierCurveTo(-s * 0.8, s * 0.65, -s * 0.98, -s * 0.35, 0, -s);
  ctx.fillStyle = p.color;
  ctx.globalAlpha = p.alpha;
  ctx.fill();

  // Прожилки придают объём, но на мелких частицах и на телефонах
  // они дороги — там рисуем только центральную жилку
  ctx.globalAlpha = p.alpha * 0.45;
  ctx.strokeStyle = "rgba(47,74,56,0.55)";
  ctx.lineWidth = Math.max(0.5, s * 0.055);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.92);
  ctx.lineTo(0, s * 0.92);
  ctx.stroke();

  if (detailed) {
    ctx.lineWidth = Math.max(0.35, s * 0.035);
    for (const dir of [-1, 1]) {
      for (const k of [0.25, 0.55, 0.82]) {
        ctx.beginPath();
        ctx.moveTo(0, -s * (0.75 - k * 0.75));
        ctx.quadraticCurveTo(
          dir * s * 0.42,
          -s * (0.75 - k * 0.75) + dir * s * 0.06,
          dir * s * 0.6,
          -s * (0.75 - k * 0.75) + dir * s * 0.3,
        );
        ctx.stroke();
      }
    }
  }

  // Черешок
  ctx.globalAlpha = p.alpha * 0.7;
  ctx.lineWidth = Math.max(0.5, s * 0.06);
  ctx.beginPath();
  ctx.moveTo(0, s * 0.95);
  ctx.lineTo(0, s * 1.28);
  ctx.stroke();

  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size * 0.8;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s, 0);
  ctx.quadraticCurveTo(s * 0.18, s * 0.18, 0, s);
  ctx.quadraticCurveTo(-s * 0.18, s * 0.18, -s, 0);
  ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s);
  ctx.fillStyle = p.color;
  ctx.globalAlpha = p.alpha;
  ctx.fill();
  ctx.restore();
}

/**
 * Живой фон: падающие лепестки, листочки и искры.
 * Полностью декоративный, не перехватывает события мыши.
 */
export default function PetalField({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    const isNarrow = window.innerWidth < 700;
    // Последняя известная ширина: на телефоне адресная строка меняет
    // только высоту, и пересоздание частиц на такое событие выглядело
    // как прыжок всех лепестков разом. Стартуем с -1, иначе первый же
    // вызов resize() принял бы текущую ширину за «не изменилась»
    // и частицы не создались бы вовсе.
    let lastWidth = -1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Высота изменилась, а ширина нет — это адресная строка.
      // Размер холста пересчитали, частицы оставляем на местах.
      if (width === lastWidth) return;
      lastWidth = width;

      // На узких экранах частиц сильно меньше — иначе прокрутка лагает
      const budget = width < 700 ? 16000 : 46000;
      const target = Math.round(
        Math.min(38, Math.max(10, (width * height) / budget)) * density,
      );
      particles = Array.from({ length: target }, () =>
        createParticle(width, height, true),
      );
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame += 1;

      for (const p of particles) {
        p.y += p.speed;
        p.angle += p.spin;
        p.x += Math.sin((frame + p.phase * 60) / 150) * 0.45 * p.drift;

        if (p.y - p.size > height) {
          Object.assign(p, createParticle(width, height, false));
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;

        if (p.shape === "petal") drawPetal(ctx, p);
        else if (p.shape === "leaf") drawLeaf(ctx, p, !isNarrow);
        else drawSparkle(ctx, p);
      }

      requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Статичная картинка без анимации
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (p.shape === "petal") drawPetal(ctx, p);
        else if (p.shape === "leaf") drawLeaf(ctx, p, !isNarrow);
        else drawSparkle(ctx, p);
      }
    } else {
      requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="petal-field"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
