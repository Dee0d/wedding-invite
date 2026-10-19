"use client";

import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  color: string;
  shape: "rect" | "circle" | "heart" | "petal";
  life: number;
  ttl: number;
};

const COLORS = [
  "#588b62",
  "#77a97c",
  "#98c596",
  "#b7d9b2",
  "#f7c8d3",
  "#f8e7a8",
  "#dccdf2",
  "#f9d4ba",
  "#c9e5f3",
  "#ffffff",
];

const SHAPES: Piece["shape"][] = ["rect", "circle", "petal", "heart", "rect", "petal"];

declare global {
  interface WindowEventMap {
    "wedding:confetti": CustomEvent<{
      x?: number;
      y?: number;
      count?: number;
      power?: number;
    }>;
  }
}

/** Праздничный салют из конфетти — вызывается событием wedding:confetti. */
export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let pieces: Piece[] = [];
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const spawn = (detail: {
      x?: number;
      y?: number;
      count?: number;
      power?: number;
    }) => {
      const count = detail.count ?? 90;
      const power = detail.power ?? 1;
      const originX = detail.x ?? width / 2;
      const originY = detail.y ?? height * 0.35;

      for (let i = 0; i < count; i += 1) {
        const angle = rand(-Math.PI, 0) + rand(-0.4, 0.4);
        const speed = rand(4, 13) * power;
        pieces.push({
          x: originX + rand(-40, 40),
          y: originY + rand(-20, 20),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(5, 12),
          angle: rand(0, Math.PI * 2),
          spin: rand(-0.25, 0.25),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          life: 0,
          ttl: rand(90, 170),
        });
      }
      if (pieces.length > 500) pieces = pieces.slice(-500);
    };

    const drawHeart = (p: Piece) => {
      const s = p.size / 2;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.6);
      ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.45, -s * 1.1, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.45, -s * 1.1, s, -s * 0.4, 0, s * 0.6);
      ctx.fill();
    };

    const drawPetal = (p: Piece) => {
      const s = p.size / 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      pieces = pieces.filter((p) => p.life < p.ttl && p.y < height + 60);

      for (const p of pieces) {
        p.life += 1;
        p.vy += 0.22;
        p.vx *= 0.992;
        p.vy *= 0.994;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        const fade = 1 - p.life / p.ttl;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, fade);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "heart") {
          drawHeart(p);
        } else {
          drawPetal(p);
        }
        ctx.restore();
      }

      if (pieces.length > 0) {
        raf = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        raf = 0;
      }
    };

    const onConfetti = (event: Event) => {
      const detail = (event as CustomEvent).detail ?? {};
      spawn(detail);
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener("wedding:confetti", onConfetti);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("wedding:confetti", onConfetti);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="confetti-canvas"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
    />
  );
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
