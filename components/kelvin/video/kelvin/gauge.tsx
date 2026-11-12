/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { gaugeAngle } from './lib/gauge';

/** Spectra the dials are printed with. Colour lives only inside these plates. */
export const SPECTRA = {
  /** Planckian locus, 10000 K (left) to 2000 K (right): the CTB → CTO axis. */
  temperature: ['#9bb8ff', '#adc5ff', '#c4d5ff', '#dde6ff', '#f3f2ff', '#fff3ea', '#ffe4cc', '#ffd2a6', '#ffbd7c', '#ffa654', '#ff8f2e'],
  /** Hue wheel, 0° → 360°. */
  hue: ['#ff3b30', '#ff9500', '#ffd60a', '#a5e22e', '#34c759', '#2ed6b4', '#32ade6', '#2c6cf0', '#5e4ce0', '#af52de', '#ff2d92', '#ff3b30'],
  /** Relative luminance, black → white. */
  luminance: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#ffffff'],
} as const;

const R_OUT = 44;
const R_IN = 33;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)] as const;
}

/** One annular segment from angle a to b (degrees, 0 = straight up). */
function segment(a: number, b: number) {
  const [x1, y1] = polar(R_OUT, a);
  const [x2, y2] = polar(R_OUT, b);
  const [x3, y3] = polar(R_IN, b);
  const [x4, y4] = polar(R_IN, a);
  return `M${x1} ${y1}A${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${R_IN} ${R_IN} 0 0 0 ${x4} ${y4}Z`;
}

const TICKS = Array.from({ length: 21 }, (_, i) => -90 + i * 9);

/** Half-dial read-out: a printed spectrum band, a drafting tick ring and a needle. The value is always printed. */
export function Gauge({
  label,
  position,
  display,
  spectrum,
}: {
  label: string;
  /** 0–1 along the dial, or null when there is no reading. */
  position: number | null;
  display: string;
  spectrum: readonly string[];
}) {
  const angle = gaugeAngle(position ?? Number.NaN, 0, 1);
  const step = 180 / spectrum.length;
  return (
    <figure className="kv-gauge" role="img" aria-label={`${label}: ${display}`}>
      <svg viewBox="-52 -54 104 60" aria-hidden="true" focusable="false">
        {spectrum.map((color, i) => (
          <path key={i} d={segment(-90 + i * step, -90 + (i + 1) * step + 0.4)} fill={color} />
        ))}
        <path className="kv-gauge-frame" d={`M-${R_OUT} 0A${R_OUT} ${R_OUT} 0 0 1 ${R_OUT} 0M-${R_IN} 0A${R_IN} ${R_IN} 0 0 1 ${R_IN} 0`} />
        {TICKS.map((t, i) => {
          const [x1, y1] = polar(R_OUT + 1.5, t);
          const [x2, y2] = polar(R_OUT + (i % 5 === 0 ? 7 : 4), t);
          return <line key={t} className="kv-gauge-tick" x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        <line className="kv-gauge-base" x1={-50} y1={0} x2={50} y2={0} />
        {position === null ? null : (
          <g className="kv-gauge-needle" transform={`rotate(${angle})`}>
            <line className="kv-gauge-needle-edge" x1="0" y1="5" x2="0" y2="-40" />
            <line className="kv-gauge-needle-core" x1="0" y1="5" x2="0" y2="-40" />
          </g>
        )}
        <circle className="kv-gauge-hub" r="3.6" />
      </svg>
      <figcaption>
        <span className="kv-gauge-label">{label}</span>
        <span className="kv-gauge-value">{display}</span>
      </figcaption>
    </figure>
  );
}
