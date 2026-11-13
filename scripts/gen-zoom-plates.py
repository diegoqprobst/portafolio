#!/usr/bin/env python3
"""Dibuja los planos del zoom (app/ZoomPlates.tsx) como SVG en public/zoom/.

La regla que hace creíble el zoom: cada plano está dibujado, entero y a escala, dentro del anterior.
La ciudad contiene la fachada, la fachada contiene la ventana, la ventana la sala y la sala la
luminaria. Nada se funde con nada: es un solo dibujo visto cada vez más cerca. Los grosores de
línea escalan con el dibujo por la misma razón.

Cada plano ocupa un cuadrado de -600 a 600. NEST dice a qué tamaño aparece dentro del anterior;
el `zoom` de cada tramo en ZoomPlates.tsx tiene que ser 1200 / ese tamaño.

Uso: python3 scripts/gen-zoom-plates.py
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "zoom"

INK = "#575892"  # tinta: líneas y cielo
NIGHT = "#14244F"  # vidrio
PAPER = "#F3F0E7"
WHITE = "#FFFFFF"
SHADE = "#E2DDCF"  # papel en sombra
HAZE = "#8E8FBC"  # edificios lejanos
ORANGE = "#DF9F40"  # luz y cartón
ORANGE_L = "#EDC98F"
RUST = "#A85334"  # cotas y fondo de la caja
WOOD = "#E6CFA6"

NEST = {"facade": 200, "window": 200, "room": 600, "luminaire": 200}  # zoom 6 · 6 · 2 · 6


def n(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def rect(x0, y0, x1, y1, fill="none", stroke=INK, sw=3):
    s = f' stroke="{stroke}" stroke-width="{n(sw)}"' if stroke else ' stroke="none"'
    return f'<rect x="{n(x0)}" y="{n(y0)}" width="{n(x1 - x0)}" height="{n(y1 - y0)}" fill="{fill}"{s}/>'


def poly(pts, fill="none", stroke=INK, sw=3):
    s = f' stroke="{stroke}" stroke-width="{n(sw)}"' if stroke else ' stroke="none"'
    return f'<polygon points="{" ".join(f"{n(x)},{n(y)}" for x, y in pts)}" fill="{fill}"{s}/>'


def path(d, stroke=INK, sw=3, extra=""):
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{n(sw)}"{extra}/>'


def lines(segs, stroke=INK, sw=3, extra=""):
    return path("".join(f"M{n(a)} {n(b)}L{n(c)} {n(d)}" for a, b, c, d in segs), stroke, sw, extra)


def nest(content, size):
    h = size / 2
    return f'<svg x="{n(-h)}" y="{n(-h)}" width="{n(size)}" height="{n(size)}" viewBox="-600 -600 1200 1200">{content}</svg>'


def wrap(content):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-600 -600 1200 1200" '
        'stroke-linejoin="miter" stroke-linecap="butt">' + content + "</svg>\n"
    )


# ───────────────────────── 5 · la luminaria (alzado técnico) ─────────────────────────

def luminaire_body():
    """La pieza sola: la comparten el alzado y la caja, en el mismo sitio."""
    return "".join([
        rect(-160, -64, 160, -45, SHADE),  # alojamiento del driver
        rect(-450, -45, 450, 25, WHITE),
        rect(-450, -45, -424, 25, SHADE),
        rect(424, -45, 450, 25, SHADE),
        lines([(-424, -10, 424, -10)], sw=1.5),
        rect(-440, 25, 440, 40, ORANGE),  # difusor encendido
    ])


def luminaire():
    cables = "".join(
        rect(x - 3, -600, x + 3, -64, INK, None) + rect(x - 9, -84, x + 9, -45, RUST, INK, 2)
        for x in (-300, 300)
    )
    beam = poly([(-440, 40), (440, 40), (560, 300), (-560, 300)], "#F7E7C6", None)
    axis = lines([(0, -150, 0, 470)], sw=1.5, extra=' stroke-dasharray="26 8 4 8"')
    dims = lines([
        (-450, 70, -450, 400), (450, 70, 450, 400), (-450, 380, 450, 380),
        (-462, 392, -438, 368), (438, 392, 462, 368),
        (470, -45, 540, -45), (470, 40, 540, 40), (520, -45, 520, 40),
        (508, -33, 532, -57), (508, 52, 532, 28),
    ], RUST, 2)
    return rect(-600, -600, 600, 600, PAPER, None) + beam + axis + cables + luminaire_body() + dims


# ───────────────────────── 6 · la caja (relevo; mismo sitio que el alzado) ─────────────────────────

SHEET = {"w": 170, "h": 130, "cx": 120, "cy": 315}  # = PAPER en ZoomPlates.tsx


def carton():
    x0, y0 = SHEET["cx"] - SHEET["w"] / 2, SHEET["cy"] - SHEET["h"] / 2
    x1, y1 = x0 + SHEET["w"], y0 + SHEET["h"]
    # En blanco a propósito: la ficha de verdad se funde encima al aterrizar.
    sheet = rect(x0, y0, x1, y1, WHITE, INK, 2)
    arrows = "".join(
        path(f"M{x} 380V270M{x - 22} 296L{x} 268L{x + 22} 296", sw=6) for x in (-250, -180)
    ) + lines([(-285, 392, -145, 392)], sw=6)
    return "".join([
        rect(-600, -600, 600, 600, PAPER, None),
        poly([(-500, -100), (500, -100), (540, -300), (-540, -300)], ORANGE_L),  # solapa trasera
        poly([(-500, -100), (-540, 90), (-600, 60), (-590, -130)], ORANGE_L),
        poly([(500, -100), (540, 90), (600, 60), (590, -130)], ORANGE_L),
        poly([(-500, -100), (500, -100), (540, 90), (-540, 90)], RUST),  # interior
        luminaire_body(),
        rect(-540, 90, 540, 430, ORANGE),  # frente
        poly([(-540, 90), (540, 90), (520, 205), (-520, 205)], ORANGE_L),  # solapa delantera
        arrows,
        sheet,
    ])


# ───────────────────────── 4 · la sala ─────────────────────────

def room(center):
    k = 392.31  # donde las aristas cortan el borde: 600 · 170 / 260
    ceiling_grid = lines(
        [(x, -170, x * 600 / 170, -600) if abs(x) < 170 else (x, -170, 600 * (1 if x > 0 else -1), -170 * 600 / abs(x))
         for x in (-195, -130, -65, 0, 65, 130, 195)]
        + [(-325, -212.5, 325, -212.5), (-442, -289, 442, -289), (-600, -425, 600, -425)], sw=1.5)
    floor_grid = lines(
        [(x, 170, x * 600 / 170, 600) if abs(x) < 170 else (x, 170, 600 * (1 if x > 0 else -1), 170 * 600 / abs(x))
         for x in (-195, -130, -65, 0, 65, 130, 195)]
        + [(-325, 212.5, 325, 212.5), (-442, 289, 442, 289), (-600, 425, 600, 425)], sw=1.5)
    side_window = (
        poly([(-380, -95), (-560, -140), (-560, 59), (-380, 40)], INK)
        + lines([(-470, -117.5, -470, 49.5), (-380, -27.5, -560, -40.5)], PAPER, 3)
    )
    plan = rect(-228, -98, -132, -24, NIGHT) + lines(
        [(-216, -84, -144, -84), (-216, -38, -144, -38), (-216, -84, -216, -38), (-144, -84, -144, -38),
         (-190, -84, -190, -38), (-190, -60, -144, -60)], PAPER, 1.5)
    door = rect(150, -40, 232, 170, SHADE) + rect(160, -30, 222, 60, PAPER, INK, 1.5) + \
        f'<circle cx="166" cy="76" r="4" fill="{INK}"/>'
    desk = rect(-96, 112, 96, 122, WOOD) + lines([(-84, 122, -84, 170), (84, 122, 84, 170), (-84, 150, 84, 150)])
    hangers = "".join(
        rect(x - 0.5, -272, x + 0.5, -100, INK, None) + rect(x - 7, -276, x + 7, -270, INK, None)
        for x in (-50, 50)
    )
    return "".join([
        poly([(-600, -600), (600, -600), (600, -k), (260, -170), (-260, -170), (-600, -k)], WHITE, None),  # techo
        poly([(-600, 600), (600, 600), (600, k), (260, 170), (-260, 170), (-600, k)], WOOD, None),  # suelo
        poly([(-600, -k), (-260, -170), (-260, 170), (-600, k)], SHADE, None),
        poly([(600, -k), (260, -170), (260, 170), (600, k)], SHADE, None),
        rect(-260, -170, 260, 170, PAPER, None),
        ceiling_grid, floor_grid,
        lines([(-260, -170, -600, -k), (260, -170, 600, -k), (-260, 170, -600, k), (260, 170, 600, k)]),
        rect(-260, -170, 260, 170),
        side_window, plan, door, desk, hangers,
        nest(center, NEST["luminaire"]),
    ])


# ───────────────────────── 3 · la ventana ─────────────────────────

def window(center):
    """Marco con un paño central grande; `center` es lo que se ve por él (ocupa -300..300)."""
    cols = [(-570, -320), (-300, 300), (320, 570)]
    out = [rect(-600, -600, 600, 600, WHITE, None)]
    for j, (y0, y1) in enumerate(cols):
        for i, (x0, x1) in enumerate(cols):
            if i == 1 and j == 1:
                continue
            out.append(rect(x0, y0, x1, y1, NIGHT, None))
            if j == 0:  # persiana a medio bajar en la fila de arriba
                out.append(lines([(x0, y, x1, y) for y in range(y0 + 22, y1 - 60, 26)], PAPER, 9))
            else:
                w = x1 - x0
                out.append(lines([(x0 + w * 0.2, y1 - 30, x0 + w * 0.55, y0 + 30),
                                  (x0 + w * 0.5, y1 - 30, x0 + w * 0.75, y0 + 90)], INK, 6))
    out.append(center)
    for (a, b) in cols:
        for (c, d) in cols:
            out.append(rect(c, a, d, b))
    out.append(rect(-597, -597, 597, 597, sw=6))
    return "".join(out)


def pane(fill):
    return rect(-300, -300, 300, 300, fill, None)


# ───────────────────────── 2 · la fachada ─────────────────────────

def lit(r, c):
    return (r * 7 + c * 13 + 3) % 6 == 0


def facade(center, rows, cols):
    """Ventanas de 200 cada 240. `center` es la ventana (0,0), dibujada entera."""
    out = []
    for r in rows:
        for c in cols:
            cx, cy = c * 240, r * 240
            out.append(rect(cx - 120, cy - 120, cx + 120, cy + 120, PAPER, None))
    for c in cols:  # pilastras entre columnas
        cx = c * 240
        y0, y1 = rows[0] * 240 - 120, rows[-1] * 240 + 120
        out.append(rect(cx - 120, y0, cx - 106, y1, SHADE, None) + rect(cx + 106, y0, cx + 120, y1, SHADE, None))
        out.append(lines([(cx - 106, y0, cx - 106, y1), (cx + 106, y0, cx + 106, y1)], sw=1.5))
    for r in rows:
        for c in cols:
            cx, cy = c * 240, r * 240
            if r == 0 and c == 0:
                out.append(center)
            else:
                inner = window(pane(ORANGE if lit(r, c) else NIGHT))
                out.append(f'<g transform="translate({cx} {cy}) scale({1 / 6:.6f})">{inner}</g>')
            out.append(rect(cx - 108, cy + 100, cx + 108, cy + 110, WHITE, INK, 2))  # alféizar
            out.append(lines([(cx - 106, cy + 120, cx + 106, cy + 120)], sw=1.5))
    return "".join(out)


# ───────────────────────── 1 · la ciudad ─────────────────────────

def block(x, w, top, base=220, rows=True, d=14):
    """Un edificio: frente de papel, costado en sombra, hileras de ventanas."""
    out = [
        poly([(x + w, top), (x + w + d, top - d * 0.7), (x + w + d, base), (x + w, base)], SHADE),
        poly([(x, top), (x + d, top - d * 0.7), (x + w + d, top - d * 0.7), (x + w, top)], WHITE),
        rect(x, top, x + w, base, PAPER),
    ]
    if rows:
        ys = range(int(top) + 22, int(base) - 14, 26)
        out.append(lines([(x + 10, y, x + w - 10, y) for y in ys], INK, 7, ' stroke-dasharray="9 7"'))
    return "".join(out)


def city(center):
    far = "".join(
        rect(x, top, x + w, 222, HAZE, None)
        for x, w, top in [(-600, 90, -60), (-505, 70, -150), (-430, 100, -30), (-325, 80, -110), (-240, 70, -190),
                          (-165, 60, -70), (105, 75, -160), (185, 90, -50), (280, 70, -130), (355, 95, -210),
                          (455, 70, -80), (530, 80, -140)]
    )
    near = "".join(block(x, w, top) for x, w, top in [
        (-590, 100, 40), (-470, 110, -40), (-345, 90, 80), (-245, 96, 0),
        (140, 92, 20), (250, 104, 90), (366, 96, -50), (476, 110, 50),
    ])
    tower = "".join([
        poly([(100, -300), (126, -318), (126, 220), (100, 220)], SHADE),
        rect(-70, -330, 70, -300, PAPER), rect(-40, -354, 40, -330, PAPER),
        lines([(0, -354, 0, -430)], sw=4),
        f'<g transform="scale({1 / 6:.6f})">{facade(center, list(range(-7, 6)), list(range(-2, 3)))}</g>',
        rect(-100, -300, 100, 220),
    ])
    trees = "".join(
        f'<path d="M{x} {y}v-16" stroke="{INK}" stroke-width="3"/><circle cx="{x}" cy="{y - 26}" r="13" fill="{NIGHT}"/>'
        for x, y in [(-190, 262), (-255, 318), (190, 262), (255, 318), (-330, 388), (330, 388)]
    )
    return "".join([
        rect(-600, -600, 600, 600, INK, None),
        f'<circle cx="205" cy="-235" r="44" fill="{ORANGE}"/>',
        far,
        rect(-600, 220, 600, 600, SHADE, None),
        poly([(-130, 220), (130, 220), (330, 600), (-330, 600)], PAPER),
        lines([(0, 250, 0, 290), (0, 330, 0, 390), (0, 450, 0, 540)], sw=4),
        lines([(-600, 220, 600, 220)]),
        near, tower, trees,
    ])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    p5 = luminaire()
    p4 = room(p5)
    p3 = window(nest(p4, NEST["room"]))
    p2_center = nest(p3, NEST["window"])
    p2 = facade(p2_center, [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2])
    p1 = city(p2_center)
    plates = {"1-ciudad": p1, "2-edificio": p2, "3-ventana": p3, "4-sala": p4, "5-luminaria": p5, "6-caja": carton()}
    for name, content in plates.items():
        f = OUT / f"{name}.svg"
        f.write_text(wrap(content))
        print(f"{f.name}: {f.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
