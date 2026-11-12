/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import { temperaturePosition } from './lib/color';
import { useKelvin } from './state';

/** CTB → CTO bar with a carbon marker and a printed value — never colour alone. */
export function TemperatureScale({ kelvin }: { kelvin: number | null }) {
  const { labels } = useKelvin();
  const position = kelvin === null ? null : temperaturePosition(kelvin);
  return (
    <div className="kv-temp">
      <div className="kv-temp-bar" aria-hidden="true">
        {position === null ? null : <span className="kv-temp-marker" style={{ insetInlineStart: `${position * 100}%` }} />}
      </div>
      <div className="kv-temp-legend" aria-hidden="true">
        <span>10000 K</span>
        <span>2000 K</span>
      </div>
      <span className="kv-visually-hidden">
        {labels.temperature}: {kelvin === null ? labels.offCurve : `${labels.approx} ${kelvin} K`}
      </span>
    </div>
  );
}
