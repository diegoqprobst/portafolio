/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import type { Tool } from './lib/mode';
import { useKelvin } from './state';

const ORDER: Tool[] = ['point', 'compare', 'area', 'ruler'];

/** Paused-only tool selector (1–4) and exposure switch (E), set in the header band. */
export function ToolBar() {
  const { mode, dispatch, labels } = useKelvin();
  const names: Record<Tool, string> = {
    point: labels.toolPoint,
    compare: labels.toolCompare,
    area: labels.toolArea,
    ruler: labels.toolRuler,
  };
  const next = ORDER[(ORDER.indexOf(mode.tool) + 1) % ORDER.length]!;
  return (
    <div className="kv-toolbar">
      <div className="kv-tools" role="radiogroup" aria-label={labels.tools}>
        {ORDER.map((tool, i) => (
          <button
            key={tool}
            type="button"
            role="radio"
            aria-checked={mode.tool === tool}
            className="kv-tool"
            onClick={() => dispatch({ type: 'tool', tool })}
          >
            <span className="kv-tool-key" aria-hidden="true">
              {i + 1}
            </span>
            {names[tool]}
          </button>
        ))}
      </div>
      {/* Small players: one button that cycles the tools. */}
      <button
        type="button"
        className="kv-tool kv-tool-cycle"
        aria-label={`${labels.tools}: ${names[mode.tool]}. ${names[next]}`}
        onClick={() => dispatch({ type: 'tool', tool: next })}
      >
        {names[mode.tool]}
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={mode.exposure}
        className="kv-tool kv-exposure-switch"
        onClick={() => dispatch({ type: 'exposure' })}
      >
        <span className="kv-tool-key" aria-hidden="true">
          E
        </span>
        {labels.exposure}
      </button>
    </div>
  );
}
