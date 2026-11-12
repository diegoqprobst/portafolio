/** @jsxImportSource react */

import { useKelvin } from './state';

/** Kelvin's mark: a sighting reticle split into a cool (CTB) and a warm (CTO) half, beside a condensed wordmark. */
export function KelvinGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg className="kv-glyph" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M12 3a9 9 0 0 0 0 18z" fill="var(--kv-paper)" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="var(--kv-orange)" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--kv-carbon)" strokeWidth="1.5" />
      <path d="M12 0.75v5.5M12 17.75v5.5M0.75 12h5.5M17.75 12h5.5" stroke="var(--kv-carbon)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.6" fill="var(--kv-carbon)" />
    </svg>
  );
}

export function KelvinMark() {
  const { labels } = useKelvin();
  return (
    <span className="kv-mark">
      <KelvinGlyph />
      <span className="kv-wordmark">{labels.brand}</span>
      <span className="kv-series">{labels.series}</span>
    </span>
  );
}
