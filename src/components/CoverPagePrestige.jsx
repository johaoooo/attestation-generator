import React from "react";

/**
 * CoverPagePrestige
 * Style de couverture "Institutionnelle & Cadre Prestige" pour RapportGenerator.
 * Architecture Full-Page SVG Overlay pour garantie absolue du rendu des 4 coins lors de l'export PDF HD html2canvas.
 */

// Cadre Prestige Global SVG (Bordures + 4 Volutes d'Angles en 1 seul élément SVG 794x1123)
function PrestigeCoverFrame({ color = "#8f7bc4", inset = 26, showVolutes = true, borderStyle = "double", borderWidth = 2 }) {
  const w = 794;
  const h = 1123;
  const outerInset = inset;
  const innerInset = inset + 6;
  const tripleInset = inset + 12;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={`${w}px`}
      height={`${h}px`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${w}px`,
        height: `${h}px`,
        pointerEvents: "none",
        zIndex: 3
      }}
    >
      {/* Cadres & Bordures Vectorielles */}
      {borderStyle !== "none" && borderStyle !== "art_deco" && borderStyle !== "guilloche" && borderStyle !== "baroque" && (
        <g stroke={color} fill="none">
          {/* Outer Border */}
          <rect
            x={outerInset}
            y={outerInset}
            width={w - outerInset * 2}
            height={h - outerInset * 2}
            strokeWidth={borderStyle === "double" ? borderWidth + 1 : borderWidth}
            strokeDasharray={borderStyle === "dashed" ? "8 5" : "none"}
          />
          {/* Inner Border (Double / Triple) */}
          {(borderStyle === "double" || borderStyle === "triple") && (
            <rect
              x={innerInset}
              y={innerInset}
              width={w - innerInset * 2}
              height={h - innerInset * 2}
              strokeWidth="1.2"
              opacity="0.85"
            />
          )}
          {/* Triple Border */}
          {borderStyle === "triple" && (
            <rect
              x={tripleInset}
              y={tripleInset}
              width={w - tripleInset * 2}
              height={h - tripleInset * 2}
              strokeWidth="1"
              opacity="0.6"
            />
          )}
        </g>
      )}

      {/* 4 VOLUTES D'ANGLES EN RENDU VECTORIEL NATIVEMENT INTÉGRÉ (TOP-LEFT, TOP-RIGHT, BOTTOM-LEFT, BOTTOM-RIGHT) */}
      {showVolutes && (
        <g stroke={color} fill="none">
          {/* 1. TOP-LEFT CORNER */}
          <g transform={`translate(${outerInset - 16}, ${outerInset - 16})`}>
            <path d="M6 60 V6 H60" strokeWidth="2.8" />
            <path d="M14 60 V14 H60" strokeWidth="1.8" />
            <path d="M10 55 C 10 30, 30 10, 55 10 C 75 10, 85 22, 80 36 C 76 47, 62 48, 58 38 C 55 30, 63 24, 70 30" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="70" cy="30" r="5" fill={color} />
            <path d="M40 14 C 46 6, 56 6, 60 14 C 54 18, 46 18, 40 14 Z" fill={color} />
            <path d="M14 40 C 6 46, 6 56, 14 60 C 54 18, 46 18, 14 40 Z" fill={color} />
            <path d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z" fill={color} opacity="0.9" />
            <circle cx="26" cy="26" r="3.5" fill={color} />
          </g>

          {/* 2. TOP-RIGHT CORNER */}
          <g transform={`translate(${w - outerInset + 16}, ${outerInset - 16}) scale(-1, 1)`}>
            <path d="M6 60 V6 H60" strokeWidth="2.8" />
            <path d="M14 60 V14 H60" strokeWidth="1.8" />
            <path d="M10 55 C 10 30, 30 10, 55 10 C 75 10, 85 22, 80 36 C 76 47, 62 48, 58 38 C 55 30, 63 24, 70 30" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="70" cy="30" r="5" fill={color} />
            <path d="M40 14 C 46 6, 56 6, 60 14 C 54 18, 46 18, 40 14 Z" fill={color} />
            <path d="M14 40 C 6 46, 6 56, 14 60 C 54 18, 46 18, 14 40 Z" fill={color} />
            <path d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z" fill={color} opacity="0.9" />
            <circle cx="26" cy="26" r="3.5" fill={color} />
          </g>

          {/* 3. BOTTOM-LEFT CORNER */}
          <g transform={`translate(${outerInset - 16}, ${h - outerInset + 16}) scale(1, -1)`}>
            <path d="M6 60 V6 H60" strokeWidth="2.8" />
            <path d="M14 60 V14 H60" strokeWidth="1.8" />
            <path d="M10 55 C 10 30, 30 10, 55 10 C 75 10, 85 22, 80 36 C 76 47, 62 48, 58 38 C 55 30, 63 24, 70 30" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="70" cy="30" r="5" fill={color} />
            <path d="M40 14 C 46 6, 56 6, 60 14 C 54 18, 46 18, 40 14 Z" fill={color} />
            <path d="M14 40 C 6 46, 6 56, 14 60 C 54 18, 46 18, 14 40 Z" fill={color} />
            <path d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z" fill={color} opacity="0.9" />
            <circle cx="26" cy="26" r="3.5" fill={color} />
          </g>

          {/* 4. BOTTOM-RIGHT CORNER */}
          <g transform={`translate(${w - outerInset + 16}, ${h - outerInset + 16}) scale(-1, -1)`}>
            <path d="M6 60 V6 H60" strokeWidth="2.8" />
            <path d="M14 60 V14 H60" strokeWidth="1.8" />
            <path d="M10 55 C 10 30, 30 10, 55 10 C 75 10, 85 22, 80 36 C 76 47, 62 48, 58 38 C 55 30, 63 24, 70 30" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="70" cy="30" r="5" fill={color} />
            <path d="M40 14 C 46 6, 56 6, 60 14 C 54 18, 46 18, 40 14 Z" fill={color} />
            <path d="M14 40 C 6 46, 6 56, 14 60 C 54 18, 46 18, 14 40 Z" fill={color} />
            <path d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z" fill={color} opacity="0.9" />
            <circle cx="26" cy="26" r="3.5" fill={color} />
          </g>
        </g>
      )}
    </svg>
  );
}

// Cadre Art Déco 1920 SVG (Full-Page Overlay 794x1123)
function ArtDecoFrame({ color = "#8f7bc4", inset = 24 }) {
  const w = 794;
  const h = 1123;
  const innerInset = inset + 10;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={`${w}px`}
      height={`${h}px`}
      style={{ position: "absolute", top: 0, left: 0, width: `${w}px`, height: `${h}px`, pointerEvents: "none", zIndex: 2 }}
    >
      <rect x={inset} y={inset} width={w - inset * 2} height={h - inset * 2} stroke={color} strokeWidth="2.5" fill="none" />
      <rect x={innerInset} y={innerInset} width={w - innerInset * 2} height={h - innerInset * 2} stroke={color} strokeWidth="1.2" strokeDasharray="6 4" fill="none" />

      {/* Coins Art Déco */}
      <g stroke={color} strokeWidth="2.8" fill="none">
        <path d={`M${inset} ${inset + 40} L${inset + 40} ${inset} M${inset} ${inset + 60} L${inset + 60} ${inset} M${inset} ${inset + 80} L${inset + 80} ${inset}`} />
        <path d={`M${w - inset} ${inset + 40} L${w - inset - 40} ${inset} M${w - inset} ${inset + 60} L${w - inset - 60} ${inset} M${w - inset} ${inset + 80} L${w - inset - 80} ${inset}`} />
        <path d={`M${inset} ${h - inset - 40} L${inset + 40} ${h - inset} M${inset} ${h - inset - 60} L${inset + 60} ${h - inset} M${inset} ${h - inset - 80} L${inset + 80} ${h - inset}`} />
        <path d={`M${w - inset} ${h - inset - 40} L${w - inset - 40} ${h - inset} M${w - inset} ${h - inset - 60} L${w - inset - 60} ${h - inset} M${w - inset} ${h - inset - 80} L${w - inset - 80} ${h - inset}`} />
      </g>
    </svg>
  );
}

// Cadre Guilloché Banque Gravure SVG (Full-Page Overlay 794x1123)
function GuillocheFrame({ color = "#8f7bc4", inset = 24 }) {
  const w = 794;
  const h = 1123;
  const innerInset = inset + 10;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={`${w}px`}
      height={`${h}px`}
      style={{ position: "absolute", top: 0, left: 0, width: `${w}px`, height: `${h}px`, pointerEvents: "none", zIndex: 2 }}
    >
      <rect x={inset} y={inset} width={w - inset * 2} height={h - inset * 2} stroke={color} strokeWidth="3" fill="none" />
      <rect x={innerInset} y={innerInset} width={w - innerInset * 2} height={h - innerInset * 2} stroke={color} strokeWidth="1.5" fill="none" />
      
      {/* Rosaces Guillochées */}
      {[[inset + 20, inset + 20], [w - inset - 20, inset + 20], [inset + 20, h - inset - 20], [w - inset - 20, h - inset - 20]].map(([cx, cy], i) => (
        <g key={i} fill="none">
          <circle cx={cx} cy={cy} r="18" stroke={color} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r="5" fill={color} />
        </g>
      ))}
    </svg>
  );
}

// Cadre Baroque Sculpté SVG (Full-Page Overlay 794x1123)
function BaroqueFrame({ color = "#8f7bc4", inset = 24 }) {
  const w = 794;
  const h = 1123;
  const innerInset = inset + 12;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={`${w}px`}
      height={`${h}px`}
      style={{ position: "absolute", top: 0, left: 0, width: `${w}px`, height: `${h}px`, pointerEvents: "none", zIndex: 2 }}
    >
      <rect x={inset} y={inset} width={w - inset * 2} height={h - inset * 2} stroke={color} strokeWidth="3" rx="8" fill="none" />
      <rect x={innerInset} y={innerInset} width={w - innerInset * 2} height={h - innerInset * 2} stroke={color} strokeWidth="1.5" rx="6" fill="none" />

      {/* Fleurots d'angle */}
      <g stroke={color} strokeWidth="3" fill="none">
        <path d={`M${inset} ${inset + 30} C ${inset + 20} ${inset + 20}, ${inset + 20} ${inset + 20}, ${inset + 30} ${inset}`} />
        <path d={`M${w - inset} ${inset + 30} C ${w - inset - 20} ${inset + 20}, ${w - inset - 20} ${inset + 20}, ${w - inset - 30} ${inset}`} />
        <path d={`M${inset} ${h - inset - 30} C ${inset + 20} ${h - inset - 20}, ${inset + 20} ${h - inset - 20}, ${inset + 30} ${h - inset}`} />
        <path d={`M${w - inset} ${h - inset - 30} C ${w - inset - 20} ${h - inset - 20}, ${w - inset - 20} ${h - inset - 20}, ${w - inset - 30} ${h - inset}`} />
      </g>
    </svg>
  );
}

function GenericLogoPlaceholder({ label = "LOGO" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" width="65" height="80">
      <path d="M40 6 L40 60" stroke="#0e9488" strokeWidth="3" />
      <path
        d="M40 20 C 26 24, 26 36, 40 40 C 54 44, 54 56, 40 60"
        stroke="#0e9488"
        strokeWidth="3"
        fill="none"
      />
      <path d="M18 26 L62 26" stroke="#0e9488" strokeWidth="3" />
      <circle cx="18" cy="26" r="4" fill="#0e9488" />
      <circle cx="62" cy="26" r="4" fill="#0e9488" />
      <rect x="14" y="62" width="52" height="26" rx="2" fill="#0e9488" opacity="0.12" stroke="#0e9488" strokeWidth="1.5" />
      <text x="40" y="79" textAnchor="middle" fontSize="6.5" fill="#0e9488" fontWeight="700">
        {label}
      </text>
    </svg>
  );
}

const defaultData = {
  instituteName: "Institut national de la formation supérieure paramédicale",
  instituteSubtitle: "SAHNOUNE LAKHDAR BECHAR",
  specialityLabel: "Spécialité",
  speciality: "1ᵉʳ année ASSP",
  exposeLabel: "THÈME :",
  title: "La Planification familiale",
  preparedByLabel: "Préparé par",
  students: ["HAMADA ASMA", "HAIDAS MEBAREKA", "HAMIDAOUI MERIEM", "HOUCINI MOUNA"],
  professorLabel: "Prof",
  professor: "BENYOUCEF",
  yearLabel: "Année pédagogique",
  year: "2023/2024",
  logoUrl: null,
  logoLeftUrl: null,
  logoRightUrl: null,
};

export default function CoverPagePrestige({
  data = {},
  accentColor = "#4a7fc1",
  ornamentColor = "#8f7bc4",
  bgImage = null,
  bgOpacity = 0.15,
  bgFit = "contain",
  borderStyle = "double",
  borderWidth = 2,
  borderInset = 26,
  showVolutes = true,
  titleRadius = 16,
  titleFontSize = 32,
  titleBoxPaddingV = 28,
  titleBoxMinHeight = 100,
  establishmentMarginTop = 15,
  logoSize = 80,
  verticalGap = 20
}) {
  const d = { ...defaultData, ...data };
  const studentsList = Array.isArray(d.students) ? d.students : (d.auteur ? [d.auteur] : defaultData.students);

  const hasHeaderLogos = d.logoLeftUrl || d.logoRightUrl;

  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        fontFamily: "'Times New Roman', Times, serif",
        position: "relative",
        backgroundColor: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        margin: "0 auto",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >
      {/* Image de Fond / Filigrane */}
      {bgImage && (
        <img
          src={bgImage}
          alt="Fond de couverture"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: bgFit,
            objectPosition: "center center",
            opacity: bgOpacity,
            pointerEvents: "none",
            zIndex: 1
          }}
        />
      )}

      {/* CADRE & 4 VOLUTES D'ANGLES INTEGRES EN UN SEUL SVG OVERLAY FULL PAGE (Garantie Rendu 4/4 dans html2canvas PDF Export) */}
      {borderStyle === "art_deco" ? (
        <ArtDecoFrame color={ornamentColor} inset={borderInset} />
      ) : borderStyle === "guilloche" ? (
        <GuillocheFrame color={ornamentColor} inset={borderInset} />
      ) : borderStyle === "baroque" ? (
        <BaroqueFrame color={ornamentColor} inset={borderInset} />
      ) : (
        <PrestigeCoverFrame
          color={ornamentColor}
          inset={borderInset}
          showVolutes={showVolutes}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
        />
      )}

      {/* Contenu de la Couverture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${borderInset + 30}px 60px`,
          textAlign: "center",
          zIndex: 4,
          boxSizing: "border-box"
        }}
      >
        {/* TOP ROW : LOGO GAUCHE, INSTITUTION, LOGO DROIT */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Rangée supérieure avec Logos Gauche et Droit */}
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: `${Math.max(120, logoSize + 20)}px 1fr ${Math.max(120, logoSize + 20)}px`, alignItems: "center" }}>
            {/* Logo Gauche */}
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              {d.logoLeftUrl ? (
                <img src={d.logoLeftUrl} alt="Logo Gauche" style={{ height: `${logoSize}px`, maxHeight: "350px", objectFit: "contain" }} />
              ) : (
                hasHeaderLogos && <GenericLogoPlaceholder label="LOGO G" />
              )}
            </div>

            {/* Logo Central (si pas de logos gauche/droite) */}
            {!hasHeaderLogos && (
              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                {d.logoUrl ? (
                  <img src={d.logoUrl} alt="Logo" style={{ height: `${logoSize}px`, maxHeight: "350px", objectFit: "contain" }} />
                ) : (
                  <GenericLogoPlaceholder label="LOGO" />
                )}
              </div>
            )}

            {/* Logo Droit */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gridColumn: "3" }}>
              {d.logoRightUrl ? (
                <img src={d.logoRightUrl} alt="Logo Droit" style={{ height: `${logoSize}px`, maxHeight: "350px", objectFit: "contain" }} />
              ) : (
                hasHeaderLogos && <GenericLogoPlaceholder label="LOGO D" />
              )}
            </div>
          </div>

          {/* Nom de l'établissement ramené légèrement en bas avec establishmentMarginTop */}
          <div style={{ marginTop: `${establishmentMarginTop}px`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <p style={{ fontSize: "19px", fontStyle: "italic", fontWeight: "700", textDecoration: "underline", lineHeight: "1.3", maxWidth: "580px", margin: 0 }}>
              {d.instituteName || d.institution}
            </p>
            <p style={{ fontSize: "14px", fontStyle: "italic", fontWeight: "700", textDecoration: "underline", letterSpacing: "0.05em", margin: 0 }}>
              {d.instituteSubtitle || d.faculte}
            </p>
            <p style={{ fontSize: "17px", fontStyle: "italic", margin: 0 }}>
              <span style={{ fontWeight: "700", textDecoration: "underline" }}>{d.specialityLabel || "Spécialité"}</span>
              {" : "}
              {d.speciality || "1ᵉʳ année ASSP"}
            </p>
          </div>

          {/* LIGNE DE SÉPARATION ÉLÉGANTE ENTRE SPÉCIALITÉ ET THÈME */}
          <div style={{ width: "70%", height: "2px", background: `linear-gradient(90deg, transparent 0%, ${ornamentColor} 30%, ${ornamentColor} 70%, transparent 100%)`, margin: "18px auto 8px auto", position: "relative", opacity: 0.85 }}>
            <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: ornamentColor, border: "2px solid #ffffff" }} />
          </div>
        </div>

        {/* TITLE BANNER GROUP (LABEL "THÈME :" CENTRÉ & BANNIÈRE AGRANDISSABLE) */}
        <div style={{ width: "100%", margin: `${verticalGap}px 0` }}>
          {/* LABEL THÈME CENTRÉ */}
          <p
            style={{
              fontSize: "18px",
              fontWeight: "800",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#1e293b",
              marginBottom: "8px",
              margin: "0 0 8px 0"
            }}
          >
            {d.exposeLabel || "THÈME :"}
          </p>

          <div
            style={{
              width: "100%",
              minHeight: `${titleBoxMinHeight}px`,
              borderRadius: `${titleRadius}px`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `${titleBoxPaddingV}px 24px`,
              background: accentColor,
              boxSizing: "border-box",
              transition: "all 0.2s ease"
            }}
          >
            <h1 style={{ color: "#ffffff", fontWeight: "700", fontSize: `${titleFontSize}px`, lineHeight: "1.25", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", margin: 0, textAlign: "center" }}>
              {d.title || d.titre}
            </h1>
          </div>
        </div>

        {/* AUTHORS & PROFESSOR SECTION */}
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 8px", textAlign: "left", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", margin: `${verticalGap / 2}px 0` }}>
          <div>
            <p style={{ fontWeight: "700", textDecoration: "underline", fontSize: "15px", marginBottom: "8px", margin: "0 0 8px 0" }}>
              {d.preparedByLabel || "Préparé par"} :
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              {studentsList.map((s, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#262626" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#262626", flexShrink: 0 }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontWeight: "700", textDecoration: "underline", fontSize: "15px", whiteSpace: "nowrap", margin: 0 }}>
              {d.professorLabel || "Prof"} : {d.professor || d.encadrant || "BENYOUCEF"}
            </p>
          </div>
        </div>

        {/* FOOTER ACADEMIC YEAR */}
        <p style={{ fontSize: "15px", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", marginTop: "12px", marginBottom: "16px", margin: "12px 0 16px 0" }}>
          <span style={{ fontWeight: "700", textDecoration: "underline" }}>{d.yearLabel || "Année pédagogique"} :</span> {d.year || d.annee || "2023/2024"}
        </p>
      </div>
    </div>
  );
}
