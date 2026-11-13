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
        'stroke-linejoin="miter" stroke-miterlimit="2" stroke-linecap="butt">' + content + "</svg>\n"
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


def label(x, y, text, size=17, fill=INK, anchor="middle", spacing=3):
    return (
        f'<text x="{n(x)}" y="{n(y)}" font-family="Montserrat, Helvetica Neue, Arial, sans-serif" font-weight="700" '
        f'font-size="{n(size)}" letter-spacing="{n(spacing)}" text-anchor="{anchor}" fill="{fill}" stroke="none">{text}</text>'
    )


def luminaire():
    cables = "".join(
        rect(x - 3, -600, x + 3, -64, INK, None) + rect(x - 9, -84, x + 9, -45, RUST, INK, 2)
        for x in (-300, 300)
    )
    beam = poly([(-440, 40), (440, 40), (530, 208), (-530, 208)], "#F7E7C6", None)
    axis = lines([(0, -150, 0, 222)], sw=1.5, extra=' stroke-dasharray="26 8 4 8"')
    dims = lines([
        (-450, 60, -450, 254), (450, 60, 450, 254), (-450, 238, 450, 238),
        (-462, 250, -438, 226), (438, 250, 462, 226),
        (470, -45, 540, -45), (470, 40, 540, 40), (520, -45, 520, 40),
        (508, -33, 532, -57), (508, 52, 532, 28),
    ], RUST, 2)
    figures = rect(-52, 225, 52, 251, PAPER, None) + label(1.5, 245, "1200", 20, RUST) + \
        label(548, 4, "90", 20, RUST, "start")
    marks = lines([(x - 9, y, x + 9, y) for x in (-560, 560) for y in (-150, 200)]
                  + [(x, y - 9, x, y + 9) for x in (-560, 560) for y in (-150, 200)], INK, 1.5)
    # El cajetín queda por encima de y = 300: en una pantalla apaisada se ve hasta ahí.
    block = rect(-450, 262, 450, 298, "none", INK, 2) + lines([(-150, 262, -150, 298), (150, 262, 150, 298)], INK, 2) + \
        label(-300, 286, "PLATE 01", 15) + label(0, 286, "ELEVATION", 15) + label(300, 286, "SCALE 1:10", 15)
    return rect(-600, -600, 600, 600, PAPER, None) + beam + axis + marks + cables + luminaire_body() + dims + figures + block


# ───────────────────────── 6 · la caja (relevo; mismo sitio que el alzado) ─────────────────────────

SHEET = {"w": 170, "h": 130, "cx": 120, "cy": 315}  # = PAPER en ZoomPlates.tsx


def carton_back():
    """Lo que queda detrás de la luminaria: fondo, solapas e interior. Sustituye al alzado por fundido;
    la pieza está en el mismo sitio en los dos, así que solo cambia lo de alrededor."""
    return "".join([
        rect(-600, -600, 600, 600, PAPER, None),
        poly([(-500, -100), (500, -100), (540, -300), (-540, -300)], ORANGE_L),  # solapa trasera
        poly([(-500, -100), (-540, 90), (-600, 60), (-590, -130)], ORANGE_L),
        poly([(500, -100), (540, 90), (600, 60), (590, -130)], ORANGE_L),
        poly([(-500, -100), (500, -100), (540, 90), (-540, 90)], RUST),  # interior
        luminaire_body(),
    ])


def carton_front():
    """El frente de la caja, sin fondo: sube por delante de la luminaria."""
    arrows = "".join(
        path(f"M{x} 380V270M{x - 22} 296L{x} 268L{x + 22} 296", sw=6) for x in (-250, -180)
    ) + lines([(-285, 392, -145, 392)], sw=6)
    return "".join([
        rect(-540, 90, 540, 430, ORANGE),
        poly([(-540, 90), (540, 90), (520, 205), (-520, 205)], ORANGE_L),  # solapa delantera
        arrows,
    ])


def carton_sheet():
    """La hoja pegada al frente. En blanco a propósito: la ficha de verdad se funde encima al aterrizar."""
    x0, y0 = SHEET["cx"] - SHEET["w"] / 2, SHEET["cy"] - SHEET["h"] / 2
    return rect(x0, y0, x0 + SHEET["w"], y0 + SHEET["h"], WHITE, INK, 2)


# ───────────────────────── 4 · la sala ─────────────────────────

def back_wall_works():
    """Dos trabajos colgados de frente, a la izquierda de la luminaria."""
    # Submittal de alumbrado público: lámina de plano con un báculo y su cono de luz.
    x0, y0, x1, y1 = -236, -138, -128, -62
    submittal = rect(x0, y0, x1, y1, NIGHT, INK, 2) + lines(
        [(x0 + 8, y1 - 12, x1 - 8, y1 - 12), (x0 + 30, y1 - 12, x0 + 30, y0 + 16), (x0 + 30, y0 + 16, x0 + 52, y0 + 16),
         (x1 - 34, y0 + 10, x1 - 34, y0 + 40), (x1 - 34, y0 + 25, x1 - 10, y0 + 25), (x1 - 34, y0 + 48, x1 - 10, y0 + 48),
         (x1 - 34, y0 + 54, x1 - 18, y0 + 54)], PAPER, 1.5) + \
        poly([(x0 + 46, y0 + 18), (x0 + 58, y0 + 18), (x0 + 74, y1 - 12), (x0 + 30, y1 - 12)], ORANGE, None) + \
        rect(x0 + 44, y0 + 13, x0 + 60, y0 + 18, PAPER, None)
    # Kelvin: un reproductor con su lupa y la tira de color.
    x0, y0, x1, y1 = -236, -46, -128, 30
    kelvin = rect(x0, y0, x1, y1, WHITE, INK, 2) + rect(x0 + 6, y0 + 6, x1 - 6, y1 - 18, INK, None) + \
        poly([(x0 + 6, y1 - 18), (x0 + 44, y0 + 26), (x0 + 70, y1 - 30), (x1 - 6, y0 + 22), (x1 - 6, y1 - 18)], NIGHT, None) + \
        f'<circle cx="{x0 + 66}" cy="{y0 + 26}" r="13" fill="{ORANGE}" stroke="{PAPER}" stroke-width="2"/>' + \
        "".join(rect(x0 + 6 + i * 16, y1 - 14, x0 + 22 + i * 16, y1 - 6, c, None)
                for i, c in enumerate([NIGHT, INK, HAZE, ORANGE_L, ORANGE, RUST]))
    return submittal + kelvin


def side_wall_works():
    """Tres trabajos en la pared derecha, en fuga hacia el fondo."""
    def pt(s_, v, a, b, s0, s1, v0, v1):
        sc = s0 + (s1 - s0) * a
        return 260 * sc, (v0 + (v1 - v0) * b) * sc

    out = []
    frames = [(1.14, 1.42, "catalog"), (1.52, 1.86, "deck"), (1.98, 2.3, "guide")]
    for s0, s1, kind in frames:
        v0, v1 = -78, 18
        P = lambda a, b: pt(None, None, a, b, s0, s1, v0, v1)
        quad = lambda a0, b0, a1, b1: [P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1)]
        seg = lambda a0, b0, a1, b1: (*P(a0, b0), *P(a1, b1))
        if kind == "catalog":  # catálogo de producto: retícula de fichas
            out.append(poly(quad(0, 0, 1, 1), WHITE, INK, 2))
            for r in range(2):
                for c in range(3):
                    a, b = 0.1 + c * 0.29, 0.12 + r * 0.42
                    out.append(poly(quad(a, b, a + 0.22, b + 0.24), ORANGE if (r + c) % 2 == 0 else NIGHT, None))
                    out.append(lines([seg(a, b + 0.3, a + 0.22, b + 0.3)], INK, 1.5))
        elif kind == "deck":  # presentación comercial: barras que suben
            out.append(poly(quad(0, 0, 1, 1), INK, INK, 2))
            out.append(lines([seg(0.1, 0.16, 0.6, 0.16), seg(0.1, 0.84, 0.9, 0.84)], PAPER, 3))
            for i, h in enumerate([0.22, 0.34, 0.3, 0.5]):
                a = 0.14 + i * 0.2
                out.append(poly(quad(a, 0.84 - h, a + 0.13, 0.84), ORANGE if i == 3 else PAPER, None))
        else:  # guía: portada con título y texto
            out.append(poly(quad(0, 0, 1, 1), RUST, INK, 2))
            out.append(poly(quad(0.14, 0.14, 0.86, 0.34), PAPER, None))
            out.append(lines([seg(0.14, 0.5 + i * 0.1, 0.86 if i < 3 else 0.5, 0.5 + i * 0.1) for i in range(4)], PAPER, 2))
    return "".join(out)


def studio():
    """Lo que hay en el suelo: tablero de dibujo y taburete, rollos de planos, cajas de muestras y
    catálogos sobre la mesa. Nada entra en el cuadrado central, que es de la luminaria."""
    board = "".join([
        lines([(-322, 228, -330, 304), (-200, 228, -192, 304), (-326, 270, -196, 270),
               (-300, 180, -300, 228), (-222, 180, -222, 228)]),
        poly([(-336, 232), (-186, 232), (-172, 172), (-322, 172)], WHITE),
        poly([(-312, 222), (-232, 222), (-222, 182), (-302, 182)], NIGHT, INK, 1.5),
        lines([(-300, 212, -246, 212), (-296, 196, -262, 196), (-262, 196, -262, 212)], PAPER, 1.5),
        lines([(-214, 224, -196, 180)], RUST, 4),  # regla
    ])
    stool = lines([(-158, 262, -166, 310), (-126, 262, -118, 310), (-162, 290, -122, 290)]) + \
        f'<ellipse cx="-142" cy="260" rx="22" ry="7" fill="{RUST}" stroke="{INK}" stroke-width="3"/>'
    rolls = "".join(
        poly([(x, 150), (x + 9, 150), (x + 9 + lean, top), (x + lean, top)], c, INK, 1.5)
        for x, top, lean, c in [(113, 108, -4, WHITE), (122, 116, 2, ORANGE_L), (130, 104, 5, WHITE)]
    ) + rect(110, 142, 142, 170, SHADE)
    cartons = "".join([
        rect(272, 214, 344, 270, ORANGE), lines([(272, 230, 344, 230), (308, 214, 308, 230)], sw=1.5),
        rect(288, 172, 338, 214, ORANGE_L), lines([(288, 186, 338, 186), (313, 172, 313, 186)], sw=1.5),
        rect(352, 236, 400, 276, ORANGE_L), lines([(352, 248, 400, 248)], sw=1.5),
    ])
    catalogs = rect(28, 107, 74, 112, RUST, INK, 1.2) + rect(32, 103, 72, 107, INK, INK, 1.2) + \
        rect(30, 100.5, 68, 103, ORANGE, INK, 1)
    return rolls + cartons + board + stool + catalogs


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
    works = back_wall_works() + side_wall_works()
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
        side_window, works, door, desk, studio(), hangers,
        nest(center, NEST["luminaire"]),
    ])


# ───────────────────────── 3 · la ventana ─────────────────────────

def window(center, blinds=True):
    """Marco con un paño central grande; `center` es lo que se ve por él (ocupa -300..300)."""
    cols = [(-570, -320), (-300, 300), (320, 570)]
    out = [rect(-600, -600, 600, 600, WHITE, None)]
    for j, (y0, y1) in enumerate(cols):
        for i, (x0, x1) in enumerate(cols):
            if i == 1 and j == 1:
                continue
            out.append(rect(x0, y0, x1, y1, NIGHT, None))
            if j == 0 and blinds:  # persiana a medio bajar en la fila de arriba
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
    """Ventanas con la luz dada. Las vecinas de la ventana de destino quedan apagadas para que
    esa, la única con la persiana subida, se distinga desde lejos."""
    if max(abs(r), abs(c)) <= 1:
        return False
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

def block(x, w, top, base=220, d=14, seed=0):
    """Un edificio cercano: cornisa, ventanas con marco y parteluz, bajo comercial, costado en sombra.
    Las líneas son finas a propósito: la cámara lo amplía seis veces al pasar a su lado."""
    fine = 1.2
    out = [
        poly([(x + w, top), (x + w + d, top - d * 0.7), (x + w + d, base), (x + w, base)], SHADE, INK, fine),
        poly([(x, top), (x + d, top - d * 0.7), (x + w + d, top - d * 0.7), (x + w, top)], WHITE, INK, fine),
        rect(x, top, x + w, base, PAPER, INK, fine),
        rect(x - 2, top, x + w + 2, top + 5, WHITE, INK, fine),  # cornisa
    ]
    # costado: una línea por planta
    floors = list(range(int(top) + 14, int(base) - 30, 20))
    out.append(lines([(x + w, y + 14, x + w + d, y + 14 - d * 0.7) for y in floors], INK, 0.6))
    # ventanas
    cols = max(3, int((w - 12) // 15))
    pitch = (w - 12) / cols
    dark, litp, mull = [], [], []
    for r, y in enumerate(floors):
        for c in range(cols):
            wx = x + 6 + c * pitch + (pitch - 9) / 2
            box = f"M{n(wx)} {n(y)}h9v12h-9z"
            (litp if (r * 5 + c * 3 + seed) % 7 == 0 else dark).append(box)
            mull.append((wx + 4.5, y, wx + 4.5, y + 12))
            mull.append((wx - 1, y + 13, wx + 10, y + 13))  # alféizar
    out.append(f'<path d="{"".join(dark)}" fill="{NIGHT}" stroke="{INK}" stroke-width="0.6"/>')
    if litp:
        out.append(f'<path d="{"".join(litp)}" fill="{ORANGE}" stroke="{INK}" stroke-width="0.6"/>')
    out.append(lines(mull, PAPER, 0.7))
    # bajo comercial: escaparates, puerta y toldo
    gy = base - 24
    out.append(lines([(x, gy - 3, x + w, gy - 3)], INK, fine))
    out.append(rect(x + 6, gy + 3, x + w / 2 - 7, base - 3, NIGHT, INK, 0.6))
    out.append(rect(x + w / 2 + 7, gy + 3, x + w - 6, base - 3, NIGHT, INK, 0.6))
    out.append(rect(x + w / 2 - 5, gy + 5, x + w / 2 + 5, base, RUST, INK, 0.6))
    out.append(poly([(x + 4, gy), (x + w / 2 - 5, gy), (x + w / 2 - 8, gy + 5), (x + 2, gy + 5)], ORANGE, INK, 0.6))
    # azotea: caseta o depósito
    if seed % 2:
        out.append(rect(x + w * 0.55, top - 12, x + w * 0.8, top, SHADE, INK, fine))
    else:
        tx = x + w * 0.3
        out.append(lines([(tx - 5, top, tx - 5, top - 6), (tx + 5, top, tx + 5, top - 6)], INK, fine))
        out.append(rect(tx - 8, top - 18, tx + 8, top - 6, ORANGE_L, INK, fine))
    return "".join(out)


def far_block(x, w, top, seed=0):
    """Un edificio lejano: silueta en bruma con sus hileras de ventanas apenas marcadas."""
    out = [rect(x, top, x + w, 222, HAZE, None)]
    cols = max(3, int(w // 13))
    pitch = w / cols
    wins = "".join(
        f"M{n(x + c * pitch + pitch / 2 - 2.5)} {y}h5v7h-5z"
        for y in range(int(top) + 10, 214, 15) for c in range(cols) if (c + y + seed) % 5
    )
    out.append(f'<path d="{wins}" fill="{INK}" stroke="none" opacity="0.55"/>')
    out.append(lines([(x, top, x + w, top), (x + w, top, x + w, 222)], INK, 0.8))
    return "".join(out)


def sky():
    """Cielo de grabado: rayas horizontales que se aprietan hacia el horizonte, nubes hechas de
    barras y el sol con su aro."""
    ys, y, gap = [], 214.0, 5.0
    while y > -600:
        ys.append(y)
        y -= gap
        gap = min(gap * 1.09, 30)
    hatch = lines([(-600, v, 600, v) for v in ys], HAZE, 1, ' opacity="0.55"')

    def cloud(cx, cy, k=1.0):
        bars = [(-70, 0, 150), (-110, 13, 230), (-40, 26, 120), (-20, -13, 90)]
        return "".join(
            f'<rect x="{n(cx + dx * k)}" y="{n(cy + dy * k)}" width="{n(w * k)}" height="{n(9 * k)}" '
            f'rx="{n(4.5 * k)}" fill="{PAPER}" stroke="none"/>' for dx, dy, w in bars
        )

    sun = (
        f'<circle cx="205" cy="-235" r="58" fill="none" stroke="{ORANGE}" stroke-width="1.5"/>'
        f'<circle cx="205" cy="-235" r="44" fill="{ORANGE}"/>'
    )
    return hatch + sun + cloud(-360, -265) + cloud(430, -300, 0.8) + cloud(-120, -330, 0.6)


def city(center):
    far = "".join(
        far_block(x, w, top, k)
        for k, (x, w, top) in enumerate([
            (-600, 96, -60), (-505, 76, -150), (-430, 106, -30), (-325, 86, -110), (-240, 76, -190),
            (-165, 70, -70), (100, 86, -160), (185, 96, -50), (280, 76, -130), (355, 101, -210),
            (455, 76, -80), (530, 80, -140)])
    )
    near = "".join(block(x, w, top, seed=k) for k, (x, w, top) in enumerate([
        (-590, 100, 40), (-470, 110, -40), (-345, 90, 80), (-245, 96, 0),
        (140, 92, 20), (250, 104, 90), (366, 96, -50), (476, 110, 50),
    ]))
    tower = "".join([
        poly([(100, -300), (126, -318), (126, 220), (100, 220)], SHADE, INK, 1.2),
        lines([(100, y, 126, y - 18) for y in range(-260, 220, 40)], INK, 0.6),  # una línea por planta
        rect(-70, -330, 70, -300, PAPER, INK, 1.2), rect(-40, -354, 40, -330, PAPER, INK, 1.2),
        lines([(-70, -322, 70, -322), (-40, -346, 40, -346)], INK, 0.6),
        lines([(0, -354, 0, -430)], sw=2),
        f'<g transform="scale({1 / 6:.6f})">{facade(center, list(range(-7, 6)), list(range(-2, 3)))}</g>',
        rect(-100, -300, 100, 220, sw=1.2),
    ])
    trees = "".join(
        f'<path d="M{x} {y}v-16" stroke="{INK}" stroke-width="2"/><circle cx="{x}" cy="{y - 26}" r="13" fill="{NIGHT}"/>'
        f'<circle cx="{x - 4}" cy="{y - 30}" r="5" fill="{INK}"/>'
        for x, y in [(-190, 262), (-255, 318), (190, 262), (255, 318), (-330, 388), (330, 388)]
    )
    return "".join([
        rect(-600, -600, 600, 600, INK, None),
        sky(),
        far,
        rect(-600, 220, 600, 600, SHADE, None),
        poly([(-130, 220), (130, 220), (330, 600), (-330, 600)], PAPER, INK, 1.2),
        lines([(0, 250, 0, 290), (0, 330, 0, 390), (0, 450, 0, 540)], sw=4),
        lines([(-600, 220, 600, 220)], sw=1.2),
        # acera y bordillo a los lados de la avenida
        lines([(-150, 220, -372, 600), (150, 220, 372, 600)], sw=1.2),
        near, tower, trees,
    ])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    p5 = luminaire()
    p4 = room(p5)
    p3 = window(nest(p4, NEST["room"]), blinds=False)
    p2_center = nest(p3, NEST["window"])
    p2 = facade(p2_center, [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2])
    p1 = city(p2_center)
    plates = {"1-ciudad": p1, "2-edificio": p2, "3-ventana": p3, "4-sala": p4, "5-luminaria": p5,
              "6-caja": carton_back(), "7-caja-frente": carton_front(), "8-hoja": carton_sheet()}
    for name, content in plates.items():
        f = OUT / f"{name}.svg"
        f.write_text(wrap(content))
        print(f"{f.name}: {f.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
