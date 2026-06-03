import { ImageResponse } from "next/og";

// Imagen OG branded de Lumen Studio (1200×630), generada por código.
// NOTA: Satori (next/og) exige display:flex explícito en cualquier div con
// más de un hijo, y no mezcla texto suelto con elementos. Por eso todo va en
// contenedores flex con spans separados.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lumen Studio — Technical product catalogs & spec sheets in InDesign";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0C10",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: "#F5A623",
              boxShadow: "0 0 40px 8px rgba(245,166,35,0.6)",
            }}
          />
          <div style={{ display: "flex", gap: 10, fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: "#F0F2F5" }}>Lumen</span>
            <span style={{ color: "rgba(240,242,245,0.55)", fontWeight: 500 }}>Studio</span>
          </div>
        </div>

        {/* Titular + subtítulo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            <span style={{ color: "#F0F2F5" }}>Technical product catalogs &amp;</span>
            <span style={{ color: "#F0F2F5" }}>spec sheets that stay</span>
            <span style={{ color: "#F5A623" }}>perfectly consistent.</span>
          </div>
          <span style={{ fontSize: 28, color: "rgba(240,242,245,0.55)" }}>
            Adobe InDesign · Data merge · Diego Quinde
          </span>
        </div>
      </div>
    ),
    size
  );
}
