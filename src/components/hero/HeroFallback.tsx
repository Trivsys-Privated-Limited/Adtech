import { cx } from "@/lib/cx";

/**
 * Static illustration of the hero scene, shown while WebGL loads and kept
 * as the visual when WebGL is unavailable. Mirrors the 3D composition: a
 * faceted core, a node shell and two tilted orbits.
 */
export function HeroFallback({ className }: { className?: string }) {
  const c = 200;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [c + Math.cos(a) * 78, c + Math.sin(a) * 78] as const;
  });
  const nodes: [number, number, boolean][] = [
    [74, 150, false], [104, 92, false], [168, 58, true], [246, 64, false], [306, 104, false],
    [334, 176, true], [322, 254, false], [276, 314, false], [204, 340, false], [130, 318, true],
    [80, 262, false], [62, 204, false],
  ];

  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden="true" className={cx("size-full", className)}>
      <defs>
        <linearGradient id="hf-core" x1="140" y1="130" x2="260" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a4a86" />
          <stop offset="0.55" stopColor="#14264a" />
          <stop offset="1" stopColor="#5a2a44" />
        </linearGradient>
      </defs>

      <g stroke="#4d78c4" strokeOpacity="0.25">
        {nodes.map(([x, y], i) => {
          const [nx, ny] = nodes[(i + 1) % nodes.length];
          const [ox, oy] = nodes[(i + 3) % nodes.length];
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={nx} y2={ny} />
              <line x1={x} y1={y} x2={ox} y2={oy} strokeOpacity="0.12" />
            </g>
          );
        })}
      </g>

      <ellipse cx={c} cy={c} rx="170" ry="56" transform={`rotate(-18 ${c} ${c})`} stroke="#F04452" strokeOpacity="0.35" />
      <ellipse cx={c} cy={c} rx="118" ry="44" transform={`rotate(28 ${c} ${c})`} stroke="#5f8be0" strokeOpacity="0.35" />

      <polygon points={hex.map((p) => p.join(",")).join(" ")} fill="url(#hf-core)" stroke="#315EAA" strokeOpacity="0.8" />
      <g stroke="#8db0ea" strokeOpacity="0.22">
        {hex.map(([x, y], i) => (
          <line key={i} x1={c} y1={c + (i % 2 === 0 ? -26 : 26)} x2={x} y2={y} />
        ))}
        <polygon points={`${c},${c - 26} ${c + 30},${c + 18} ${c - 30},${c + 18}`} />
      </g>

      {nodes.map(([x, y, accent], i) => (
        <circle key={i} cx={x} cy={y} r={accent ? 4.5 : 2.8} fill={accent ? "#F04452" : "#bcd0f2"} />
      ))}
      <circle cx="356" cy="152" r="5" fill="#F04452" />
      <circle cx="98" cy="246" r="4.5" fill="#5f8be0" />
    </svg>
  );
}
