"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lightbulb, Ruler, Gauge, Settings2, ArrowRight } from "lucide-react";

// Niveles de iluminancia mantenida recomendados (lux), alineados con
// EN 12464-1 (espacios de trabajo interiores) e IES. Son valores de planning,
// no sustituyen un estudio fotométrico.
const SPACE_TYPES = [
  { id: "office", label: "Office — general / open-plan", lux: 500, std: "EN 12464-1" },
  { id: "office-task", label: "Office — detailed / drawing work", lux: 750, std: "EN 12464-1" },
  { id: "meeting", label: "Conference / meeting room", lux: 500, std: "EN 12464-1" },
  { id: "reception", label: "Reception / lobby", lux: 300, std: "EN 12464-1" },
  { id: "retail", label: "Retail — sales floor", lux: 500, std: "IES RP-2" },
  { id: "classroom", label: "Classroom", lux: 300, std: "EN 12464-1" },
  { id: "warehouse-storage", label: "Warehouse — storage", lux: 150, std: "EN 12464-1" },
  { id: "warehouse-active", label: "Warehouse — picking / active", lux: 200, std: "EN 12464-1" },
  { id: "industrial", label: "Industrial — assembly (medium)", lux: 500, std: "EN 12464-1" },
  { id: "industrial-fine", label: "Industrial — fine / precision", lux: 1000, std: "EN 12464-1" },
  { id: "kitchen", label: "Commercial kitchen", lux: 500, std: "EN 12464-1" },
  { id: "corridor", label: "Corridor / circulation", lux: 100, std: "EN 12464-1" },
  { id: "parking", label: "Parking (indoor)", lux: 75, std: "EN 12464-1" },
  { id: "custom", label: "Custom target…", lux: 0, std: "" },
] as const;

const FT_TO_M = 0.3048;
const LUX_PER_FC = 10.7639;

export default function LumenCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("4");
  const [spaceId, setSpaceId] = useState<(typeof SPACE_TYPES)[number]["id"]>("office");
  const [customLux, setCustomLux] = useState("400");
  const [fixtureLumens, setFixtureLumens] = useState("3000");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mf, setMf] = useState("0.8"); // maintenance factor
  const [uf, setUf] = useState("0.5"); // utilization factor

  const space = SPACE_TYPES.find((s) => s.id === spaceId)!;
  const isImperial = unit === "imperial";

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const areaM2 = isImperial ? l * FT_TO_M * (w * FT_TO_M) : l * w;

    const targetLux =
      spaceId === "custom"
        ? isImperial
          ? (parseFloat(customLux) || 0) * LUX_PER_FC // custom entered in fc when imperial
          : parseFloat(customLux) || 0
        : space.lux;

    const mfv = Math.min(Math.max(parseFloat(mf) || 0.8, 0.1), 1);
    const ufv = Math.min(Math.max(parseFloat(uf) || 0.5, 0.1), 1);

    // Lumen method: installed flux = (E × A) / (UF × MF)
    const deliveredLumens = targetLux * areaM2; // at the working plane
    const installedLumens = deliveredLumens / (ufv * mfv);
    const fLumens = parseFloat(fixtureLumens) || 0;
    const fixtures = fLumens > 0 ? Math.ceil(installedLumens / fLumens) : null;
    const densityWm2 = null; // reserved for a future watts estimate

    return {
      areaM2,
      targetLux,
      deliveredLumens,
      installedLumens,
      fixtures,
      densityWm2,
    };
  }, [length, width, isImperial, spaceId, customLux, space.lux, mf, uf, fixtureLumens]);

  const fmt = (n: number) =>
    n >= 1000 ? Math.round(n).toLocaleString("en-US") : Math.round(n).toString();
  const luxLabel = isImperial
    ? `${Math.round(result.targetLux)} lux · ${(result.targetLux / LUX_PER_FC).toFixed(0)} fc`
    : `${Math.round(result.targetLux)} lux`;

  return (
    <div className="lumen-calc">
      {/* Unit toggle */}
      <div className="lc-units">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            type="button"
            className={`lc-unit-btn${unit === u ? " active" : ""}`}
            onClick={() => setUnit(u)}
          >
            {u === "metric" ? "Metric (m · lux)" : "Imperial (ft · fc)"}
          </button>
        ))}
      </div>

      <div className="lc-grid">
        {/* ── Inputs ── */}
        <div className="lc-panel">
          <div className="lc-field">
            <label className="lc-label">
              <Ruler className="w-4 h-4" /> Room size ({isImperial ? "ft" : "m"})
            </label>
            <div className="lc-row">
              <input
                className="lc-input"
                type="number"
                min="0"
                inputMode="decimal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                aria-label="Length"
              />
              <span className="lc-times">×</span>
              <input
                className="lc-input"
                type="number"
                min="0"
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                aria-label="Width"
              />
            </div>
            <div className="lc-hint">
              Area: {result.areaM2 > 0 ? result.areaM2.toFixed(1) : "0"} m²
              {result.areaM2 > 0 && ` · ${(result.areaM2 / (FT_TO_M * FT_TO_M)).toFixed(0)} ft²`}
            </div>
          </div>

          <div className="lc-field">
            <label className="lc-label">
              <Lightbulb className="w-4 h-4" /> Space type
            </label>
            <select
              className="lc-input"
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value as typeof spaceId)}
            >
              {SPACE_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                  {s.lux ? ` (${s.lux} lux)` : ""}
                </option>
              ))}
            </select>
            {spaceId === "custom" ? (
              <div className="lc-row" style={{ marginTop: 8 }}>
                <input
                  className="lc-input"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={customLux}
                  onChange={(e) => setCustomLux(e.target.value)}
                  aria-label="Target illuminance"
                />
                <span className="lc-times">{isImperial ? "fc" : "lux"}</span>
              </div>
            ) : (
              <div className="lc-hint">
                Target: {luxLabel} · {space.std}
              </div>
            )}
          </div>

          <div className="lc-field">
            <label className="lc-label">
              <Lightbulb className="w-4 h-4" /> Lumens per fixture (optional)
            </label>
            <input
              className="lc-input"
              type="number"
              min="0"
              inputMode="decimal"
              value={fixtureLumens}
              onChange={(e) => setFixtureLumens(e.target.value)}
              aria-label="Lumens per fixture"
            />
            <div className="lc-hint">Used to estimate how many fixtures you need.</div>
          </div>

          <button
            type="button"
            className="lc-advanced-toggle"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            <Settings2 className="w-4 h-4" /> Advanced factors {showAdvanced ? "−" : "+"}
          </button>
          {showAdvanced && (
            <div className="lc-advanced">
              <div className="lc-field">
                <label className="lc-label-sm">Maintenance factor (MF)</label>
                <input
                  className="lc-input"
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1"
                  value={mf}
                  onChange={(e) => setMf(e.target.value)}
                />
                <div className="lc-hint">Light loss over time. Typical 0.7–0.8.</div>
              </div>
              <div className="lc-field">
                <label className="lc-label-sm">Utilization factor (UF)</label>
                <input
                  className="lc-input"
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                />
                <div className="lc-hint">Room/fixture efficiency. Typical 0.4–0.6.</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <div className="lc-results">
          <div className="lc-result-big">
            <Gauge className="w-5 h-5 text-electric" />
            <div>
              <div className="lc-result-val">{fmt(result.installedLumens)}</div>
              <div className="lc-result-lbl">total lumens required</div>
            </div>
          </div>

          {result.fixtures !== null && (
            <div className="lc-result-big alt">
              <Lightbulb className="w-5 h-5 text-electric" />
              <div>
                <div className="lc-result-val">{result.fixtures}</div>
                <div className="lc-result-lbl">
                  fixtures @ {fmt(parseFloat(fixtureLumens) || 0)} lm each
                </div>
              </div>
            </div>
          )}

          <dl className="lc-breakdown">
            <div>
              <dt>Target illuminance</dt>
              <dd>{luxLabel}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>
                {result.areaM2.toFixed(1)} m² ·{" "}
                {(result.areaM2 / (FT_TO_M * FT_TO_M)).toFixed(0)} ft²
              </dd>
            </div>
            <div>
              <dt>Lumens at task plane</dt>
              <dd>{fmt(result.deliveredLumens)} lm</dd>
            </div>
            <div>
              <dt>Installed (÷ UF·MF)</dt>
              <dd>{fmt(result.installedLumens)} lm</dd>
            </div>
          </dl>

          <p className="lc-disclaimer">
            A planning estimate using the lumen method — not a photometric layout.
            Real projects need point-by-point calculations (DIALux / AGi32) and a
            compliant submittal.
          </p>
          <Link href="/#contact" className="lc-cta">
            Need a real photometric study or spec sheet? <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
