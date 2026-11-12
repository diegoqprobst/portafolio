import { ImageResponse } from "next/og";

// Tarjeta social de la raíz (1200×630): la portada del folleto, reducida.
// Plancha ultramar a sangre, nombre en caja alta pesada troquelado en crema,
// filete de registro y la línea de especificación abajo.
//
// NOTA: Satori (next/og) exige display:flex explícito en cualquier div con más
// de un hijo, y no mezcla texto suelto con elementos. Por eso todo va en
// contenedores flex con spans separados.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Diego Quinde — lighting submittals, spec sheets and technical catalogs built to IES, NFPA and EN requirements";

const INK = "#575892";
const INK_NIGHT = "#42437A";
const CREAM = "#F4ECD9";
const CREAM_2 = "#DCD2BB";

// Montserrat Black para el titular. Si la descarga falla en build, la tarjeta
// se compone igual con la grotesca del runtime: degrada, no rompe.
async function montserrat(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Montserrat:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [black, bold] = await Promise.all([montserrat(900), montserrat(700)]);
  const fonts = [
    black && { name: "Montserrat", data: black, weight: 900 as const, style: "normal" as const },
    bold && { name: "Montserrat", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 900 | 700; style: "normal" }[];

  const display = fonts.length ? "Montserrat" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "66px 76px 0",
          fontFamily: "sans-serif",
          color: CREAM,
        }}
      >
        {/* Titular troquelado */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: display,
              fontWeight: 900,
              fontSize: 150,
              lineHeight: 0.82,
              letterSpacing: -5,
              textTransform: "uppercase",
            }}
          >
            <span>Diego</span>
            <span>Quinde</span>
          </div>
          <div style={{ display: "flex", height: 4, background: CREAM, marginTop: 30 }} />
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 25,
              lineHeight: 1.5,
              letterSpacing: 2.6,
              textTransform: "uppercase",
              maxWidth: 940,
              color: CREAM,
            }}
          >
            Technical documentation for lighting brands — submittals, spec sheets and catalogs
          </div>
        </div>

        {/* Pie de especificación */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingBottom: 26,
              fontSize: 22,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: CREAM_2,
            }}
          >
            <span>IES · NFPA · EN</span>
            <span>InDesign + AI</span>
            <span>Miami, Florida</span>
            <span style={{ color: CREAM, fontFamily: display, fontWeight: 700 }}>
              diegoquinde.com
            </span>
          </div>
          <div style={{ display: "flex", height: 14, background: INK_NIGHT }} />
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
