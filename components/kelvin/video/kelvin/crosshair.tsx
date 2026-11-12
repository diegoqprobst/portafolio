/** @jsxImportSource react */

/** Box of the picture inside the player, in player-relative px. */
// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
export type PictureBox = { left: number; top: number; width: number; height: number };

/**
 * Drafting crosshair: two hairlines across the picture through the reticle, with the position
 * printed at the frame edges in source pixels. Paused only; drawn under the reticle and tag.
 */
export function Crosshair({
  box,
  x,
  y,
  videoWidth,
  videoHeight,
}: {
  box: PictureBox;
  x: number;
  y: number;
  videoWidth: number;
  videoHeight: number;
}) {
  const u = box.width ? (x - box.left) / box.width : 0;
  const v = box.height ? (y - box.top) / box.height : 0;
  const sx = Math.round(Math.min(1, Math.max(0, u)) * videoWidth);
  const sy = Math.round(Math.min(1, Math.max(0, v)) * videoHeight);
  return (
    <div className="kv-crosshair-frame" style={box} aria-hidden="true">
      <span className="kv-crosshair-h" style={{ top: y - box.top }} />
      <span className="kv-crosshair-v" style={{ left: x - box.left }} />
      <span className="kv-crosshair-coord kv-crosshair-coord--x" style={{ left: x - box.left }}>
        x {sx}
      </span>
      <span className="kv-crosshair-coord kv-crosshair-coord--y" style={{ top: y - box.top }}>
        y {sy}
      </span>
    </div>
  );
}
