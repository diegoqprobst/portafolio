/** @jsxImportSource react */

import type { PictureBox } from './crosshair';
import { rect, type Pt } from './lib/measure';
import type { Tool } from './lib/mode';

/**
 * Drafting marks over the picture: point A for comparisons, a dimension line for the ruler,
 * a dashed frame for an area. Drawn in an SVG the size of the picture box.
 */
export function MeasureOverlay({
  box,
  tool,
  anchor,
  from,
  to,
  label,
}: {
  box: PictureBox;
  tool: Tool;
  anchor: Pt | null;
  from: Pt | null;
  to: Pt | null;
  /** Text centred on the ruler's dimension line. */
  label?: string;
}) {
  const x = (u: number) => u * box.width;
  const y = (v: number) => v * box.height;
  const line = tool === 'ruler' && from && to;
  const area = tool === 'area' && from && to ? rect(from, to) : null;
  const angle = line ? Math.atan2(y(to.v) - y(from.v), x(to.u) - x(from.u)) : 0;
  const tick = 7;
  const nx = -Math.sin(angle) * tick;
  const ny = Math.cos(angle) * tick;

  return (
    <svg className="kv-measure" style={box} viewBox={`0 0 ${box.width} ${box.height}`} aria-hidden="true">
      {tool === 'compare' && anchor ? (
        <g className="kv-measure-anchor" transform={`translate(${x(anchor.u)} ${y(anchor.v)})`}>
          <circle r="11" className="kv-measure-edge" />
          <circle r="11" />
          <text y="-17" textAnchor="middle">
            A
          </text>
        </g>
      ) : null}

      {line ? (
        <g className="kv-measure-ruler">
          {[0, 1].map((layer) => (
            <g key={layer} className={layer === 0 ? 'kv-measure-edge' : undefined}>
              <line x1={x(from.u)} y1={y(from.v)} x2={x(to.u)} y2={y(to.v)} />
              <line x1={x(from.u) - nx} y1={y(from.v) - ny} x2={x(from.u) + nx} y2={y(from.v) + ny} />
              <line x1={x(to.u) - nx} y1={y(to.v) - ny} x2={x(to.u) + nx} y2={y(to.v) + ny} />
            </g>
          ))}
          {label ? (
            <text
              className="kv-measure-label"
              x={(x(from.u) + x(to.u)) / 2 + nx * 2.4}
              y={(y(from.v) + y(to.v)) / 2 + ny * 2.4}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          ) : null}
        </g>
      ) : null}

      {area ? (
        <g className="kv-measure-area">
          <rect className="kv-measure-edge" x={x(area.u)} y={y(area.v)} width={x(area.w)} height={y(area.h)} />
          <rect x={x(area.u)} y={y(area.v)} width={x(area.w)} height={y(area.h)} />
        </g>
      ) : null}
    </svg>
  );
}
