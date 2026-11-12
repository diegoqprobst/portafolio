# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Technical people who review light and colour in video: Diego himself (lighting and technical-documentation work), lighting designers, photographers. They pause a frame to read what the light is doing, then leave a note on it.

## Product Purpose

Kelvin is a Video.js v10 skin. It plays quietly with one row of controls; when paused, the frame becomes an instrument: a loupe that reads colour and approximate colour temperature, a colour timeline of the video's own dominant colours, and a sheet with chapter, timecode, palette, gauges and notes (CSV export). Entered in the Contra Video.js Skins Design Challenge (deadline 2026-11-16) and used on diegoquinde.com/kelvin.

## Positioning

Reading the paused frame like an instrument. Other players show time; Kelvin measures the light in the picture.

## Capabilities and Constraints

- Single control row during playback; tools exist only while paused.
- Pixel reads need same-origin/CORS video (Mux with `crossOrigin=""`); readings are approximate and labelled so; blocked reads show "Reading unavailable".
- Full keyboard use (X aims the loupe, arrows move, Enter pins a note, Esc steps back); every menu exits.
- Contest scoring: visual design and originality, usability, accessibility, execution.
- Built from `npx @videojs/cli skin create` (React, CSS, scaffold base); copied into the Next.js site by `npm run sync:kelvin`.

## Brand Commitments

- Name "Kelvin", series line "Instrument Series No. 1" (provisional).
- No real company names or marks (no Union Carbide, no "UCC").
- Blue (cool, CTB) and orange/amber (warm, CTO) as the colour-temperature axis.
- Binding visual reference (Diego, 2026-11-11): his board 1, `docs/superpowers/specs/assets/kelvin-board-1-blueprint.jpg` — navy technical-drawing ground with engraved optical instruments, a dark player, semicircular spectral gauges. Applies to page and player. Gauges use real spectra with meaning: temperature blue→amber, hue as a colour wheel, luminance black→white.

## Evidence on Hand

- Footage: Diego's own clip `IMG_7877.MOV` (sea lions in clear sunlit water), hosted on Mux.
- No testimonials, users or metrics exist; do not invent any.

## Product Principles

- Nothing on the picture while it plays.
- Every reading is printed as a number, never colour alone.
- The tool appears where you are looking.

## Accessibility & Inclusion

Text ≥ 4.5:1, icons/tracks/focus ≥ 3:1 over bright and dark frames; targets ≥ 24 px (44 on touch); reduced motion, reduced transparency, high contrast and forced colours honoured; all copy translatable.
