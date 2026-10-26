import { ImageResponse } from "next/og";

export const alt = "Adtech — Engineering digital experiences that move business forward";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 80px",
          background: "radial-gradient(circle at 80% 30%, #1b3466 0%, #0B1830 40%, #07111F 75%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#101F39",
              border: "2px solid rgba(148,163,184,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#F04452" }} />
          </div>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 600, letterSpacing: -1 }}>
            <span>Adtech</span>
            <span style={{ color: "#F04452" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Engineering Digital Experiences That Move Business Forward.
          </div>
          <div style={{ fontSize: 26, color: "#A8B4C8" }}>
            Software development &amp; technology solutions
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: 160, background: "#F04452", borderRadius: 3 }} />
      </div>
    ),
    size,
  );
}
