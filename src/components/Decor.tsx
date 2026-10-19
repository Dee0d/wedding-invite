/** Декоративные элементы: монограмма, ветки, разделители, иконки. */

import { LeafIcon } from "./Icons";

export function Monogram() {
  return (
    <div className="relative grid h-40 w-40 place-items-center sm:h-52 sm:w-52">
      {/* вращающиеся кольца */}
      <svg
        className="absolute inset-0 h-full w-full animate-spin-slow"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.2"
          strokeDasharray="3 9"
          className="text-sage-500"
        />
      </svg>
      <svg
        className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] animate-spin-slower"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeDasharray="26 14"
          className="text-sage-400"
        />
      </svg>

      {/* листочки по кругу */}
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-3 w-3"
          style={{ transform: `rotate(${i * 45}deg)` }}
        >
          <span
            className="absolute inset-0 animate-sway rounded-[60%_0_60%_0] bg-sage-400/80"
            style={{
              transform: "translateY(-72px)",
              animationDelay: `${i * 0.35}s`,
              transformOrigin: "50% 100%",
            }}
          />
        </span>
      ))}

      <div className="relative grid h-[78%] w-[78%] place-items-center rounded-full bg-gradient-to-br from-white via-sage-50 to-sage-100 shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),0_18px_40px_-24px_rgba(47,74,56,0.65)]">
        <span className="absolute -top-1 h-5 w-5 animate-bob text-sage-500">
          <LeafIcon className="h-full w-full" />
        </span>
        <span className="font-display text-5xl leading-none tracking-tight text-forest sm:text-6xl">
          К<span className="text-sage-500">&</span>Е
        </span>
      </div>
    </div>
  );
}

export function FloralBranch({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 220 120"
      className={`${className} ${flip ? "-scale-x-100" : ""}`}
      aria-hidden="true"
    >
      <g className="origin-bottom animate-sway-soft">
        <path
          d="M6 114 C 46 100, 78 74, 104 40 C 122 18, 140 8, 160 6"
          fill="none"
          stroke="#77a97c"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {[
          { x: 22, y: 106, r: -30 },
          { x: 44, y: 96, r: 25 },
          { x: 62, y: 80, r: -35 },
          { x: 80, y: 64, r: 30 },
          { x: 96, y: 46, r: -28 },
          { x: 112, y: 30, r: 34 },
          { x: 128, y: 16, r: -24 },
          { x: 146, y: 8, r: 20 },
        ].map((leaf, i) => (
          <ellipse
            key={i}
            cx={leaf.x + 12}
            cy={leaf.y - 10}
            rx="13"
            ry="6.5"
            transform={`rotate(${leaf.r} ${leaf.x + 12} ${leaf.y - 10})`}
            fill={i % 2 === 0 ? "#b7d9b2" : "#98c596"}
            opacity="0.95"
          />
        ))}
        {[
          { cx: 160, cy: 6, r: 6, fill: "#f7c8d3" },
          { cx: 132, cy: 22, r: 4.5, fill: "#f8e7a8" },
          { cx: 100, cy: 52, r: 5, fill: "#f9d4ba" },
          { cx: 66, cy: 92, r: 4, fill: "#dccdf2" },
          { cx: 34, cy: 110, r: 4.5, fill: "#c9e5f3" },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill}>
            <animate
              attributeName="opacity"
              values="0.55;1;0.55"
              dur={`${2.2 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-sage-300 sm:w-24" />
      <svg viewBox="0 0 40 40" className="h-8 w-8 animate-heartbeat text-sage-500">
        <path
          d="M20 34s-12-7.5-12-16a7 7 0 0 1 12-4.8A7 7 0 0 1 32 18c0 8.5-12 16-12 16z"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-sage-300 sm:w-24" />
    </div>
  );
}

export function Sparkle({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span
      className={`pointer-events-none absolute animate-twinkle text-sage-400 ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
        <path d="M12 0l2.2 8.4L22.6 12l-8.4 2.2L12 24l-2.2-9.8L1.4 12l8.4-3.6z" />
      </svg>
    </span>
  );
}

export function Leaf({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span
      className={`pointer-events-none absolute animate-float-slow text-sage-400/70 ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
        <path d="M12 2C7 5 3 9 3 14a7 7 0 0 0 14 0c0-5-5-9-5-12z" opacity="0.9" />
      </svg>
    </span>
  );
}
