# Kelvin — submission draft (for Diego to approve)

**Title:** Kelvin — a Video.js skin for looking at light

**Links**
- Demo (public, no login): https://kelvin-videojs.vercel.app
- Live site using the skin: https://diegoquinde.com (home page, plate 01) and https://diegoquinde.com/kelvin
- Video: Diego's own footage, hosted on Mux (public playback ID _<id>_)

**Design thinking (≈190 words)**

Kelvin is drawn like a technical drawing of an optical instrument: drafting ink on navy, a ruled grid, engraved lamps and lenses, condensed engineering lettering for labels and an old serif for chapter titles. I work between lighting and technical documentation, so I built the player I want when I review footage.

During playback there is one row of controls and nothing else. The tools exist only when you stop to look. Pause, and the frame becomes a drawing sheet: the picture is framed, never covered, beside its chapter, timecode, palette, three spectral dials (temperature, hue, luminance) and your notes. A loupe follows the pointer with a magnifier, the exact colour and an approximate colour temperature. Click, or press Enter, to pin a note to that point and moment, and export the notes as CSV. The seek track is printed with the video's own dominant colours.

Blue and orange are the two lighting correction gels, CTB for daylight and CTO for tungsten. The drawing is blue, orange marks only what is live, and every other colour is kept inside a plate (dials, swatches, the colour strip), so colour on screen is always data.

Accessibility: everything works from the keyboard (X aims the loupe, arrows move it, Esc steps back), focus stays visible, contrast was checked against bright water and dark rock, no state relies on colour alone, and the skin honours reduced motion, reduced transparency, high contrast and forced colours.

**Hero image:** paused on the sand and water boundary, loupe active with a reading, sheet open, one note visible. _(Capture from the deployed demo at 1920×1080.)_

**Before submitting**
- [ ] Diego approves the chapter titles: Plate I — Approach · Plate II — Surface · Plate III — Shallows
- [ ] Diego confirms the clip's audio has nothing he does not want published
- [ ] Mux account, upload with public playback policy, playback ID set in both deploys
- [ ] Safari (macOS) and iPhone checked on the deployed URL
- [ ] Diego joins the challenge on Contra and accepts the Apache 2.0 licence himself
