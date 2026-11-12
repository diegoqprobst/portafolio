---
target: Kelvin skin design + measurement tools
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/diego/Code/personal/portafolio/.claude/worktrees/videojs-v10-skin-design-683dbd/kelvin/src/video/kelvin"
timestamp: 2026-11-12T19-31-44Z
slug: kelvin-src-video-kelvin
---
Method: dual-agent (A: design review · B: detector + browser). Target: kelvin/src/video/kelvin (live https://kelvin-videojs.vercel.app)

Nielsen: 1=3 status (two "≈K" readings, frame vs 5×5 patch, unlabeled); 2=2 real world ("Temperature" on reflected water, readings past 10000 K, scale reads backwards for most); 3=4 control (Esc ladder); 4=3 consistency (mobile settings button unnamed); 5=3 error prevention (touch tap pins a note instead of aiming); 6=2 recognition (X/arrows hidden); 7=3 flexibility (single-point only); 8=4 minimalism; 9=3 recovery (CORS cause unexplained); 10=2 help (no in-player legend). Total 29/40 Good.

Specificity: authored, not interchangeable; pause re-layout + specimen sheet + spectral dials are product-specific. Weak: colour timeline reads as a grey disabled track on blue-grey footage; playing state is generic.
Detector: CLI kelvin/src/video/kelvin clean (CSS not scanned); demo.css overused-font Montserrat ×6 (deliberate, user-pinned); URL scan repeating-stripes-gradient on buffer track (false positive: buffered-range convention). In-page overlay failed (pane blocks localhost: ERR_BLOCKED_BY_CLIENT).

Priority: [P1] paused mobile layout buries the picture (strip+tag+bar over ~80%, tag clipped). [P1] "Temperature" is apparent CCT of sRGB after camera WB, not light temperature; relabel, Duv, clamp/extend scale. [P1] measurement limited to one point: add Point/Area/Compare A–B/Ruler; lux and real dimensions impossible without calibration/reference scale. [P2] colour timeline invisible in demo. [P2] keyboard/touch discoverability; tap should aim, separate Pin.
Personas: lighting designer (needs key/fill ratio, uniformity; distrusts 10,901 K on water; no statement lux is impossible); power user (hidden shortcuts, no area, no copy reading); mobile (buried picture, tap opens note, unnamed button).
Minor: chapter shown twice (header + sheet); 11px caps contrast check; tiny swatch %; magnifier lacks pixel grid/centre box.
