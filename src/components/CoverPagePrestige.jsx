import React from "react";

/**
 * CoverPagePrestige
 * Style de couverture "Institutionnelle & Cadre Prestige" pour RapportGenerator.
 * Supporte :
 * - Remplacement de "Exposé sur" par "THÈME :" Centré
 * - Plusieurs formes et styles de bordures graphiques (Art Déco, Guilloché, Baroque, Triple Prestige, etc.)
 * - Double logos haut-gauche et haut-droite (et logo central)
 * - Déplacement vers le bas du nom de l'établissement
 * - Agrandissement à volonté de l'espace du thème / bannière de titre
 */

function CornerOrnament({ className, style, color = "#8f7bc4" }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      style={style}
      width="140"
      height="140"
      fill="none"
    >
      <path d="M6 60 V6 H60" stroke={color} strokeWidth="2.4" />
      <path d="M14 60 V14 H60" stroke={color} strokeWidth="1.6" />
      <path
        d="M10 55
           C 10 30, 30 10, 55 10
           C 75 10, 85 22, 80 36
           C 76 47, 62 48, 58 38
           C 55 30, 63 24, 70 30"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="70" cy="30" r="4.5" fill={color} />
      <path d="M40 14 C 46 6, 56 6, 60 14 C 54 18, 46 18, 40 14 Z" fill={color} />
      <path d="M14 40 C 6 46, 6 56, 14 60 C 54 18, 46 18, 14 40 Z" fill={color} />
      <path
        d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z"
        fill={color}
        opacity="0.85"
      />
      <circle cx="26" cy="26" r="3" fill={color} opacity="0.85" />
    </svg>
  );
}

// Cadre Art Déco 1920 SVG
function ArtDecoFrame({ color = "#8f7bc4", inset = 24 }) {
  return (
    <svg
      style={{ position: "absolute", inset: `${inset}px`, width: `calc(100% - ${inset * 2}px)`, height: `calc(100% - ${inset * 2}px)`, pointerEvents: "none", zIndex: 2 }}
      viewBox="0 0 740 1060"
      fill="none"
    >
      <rect x="8" y="8" width="724" height="1044" stroke={color} strokeWidth="2" />
      <rect x="18" y="18" width="704" height="1024" stroke={color} strokeWidth="1" strokeDasharray="6 4" />

      {/* Coins Art Déco */}
      <g stroke={color} strokeWidth="2.5">
        <path d="M8 50 L50 8 M8 70 L70 8 M8 90 L90 8" />
        <path d="M732 50 L690 8 M732 70 L670 8 M732 90 L650 8" />
        <path d="M8 1010 L50 1052 M8 990 L70 1052 M8 970 L90 1052" />
        <path d="M732 1010 L690 1052 M732 990 L670 1052 M732 970 L650 1052" />
      </g>
    </svg>
  );
}

// Cadre Guilloché Banque Gravure SVG
function GuillocheFrame({ color = "#8f7bc4", inset = 24 }) {
  return (
    <svg
      style={{ position: "absolute", inset: `${inset}px`, width: `calc(100% - ${inset * 2}px)`, height: `calc(100% - ${inset * 2}px)`, pointerEvents: "none", zIndex: 2 }}
      viewBox="0 0 740 1060"
      fill="none"
    >
      <rect x="10" y="10" width="720" height="1040" stroke={color} strokeWidth="3" />
      <rect x="20" y="20" width="700" height="1020" stroke={color} strokeWidth="1.5" />
      
      {/* Rosaces Guillochées */}
      {[[30, 30], [710, 30], [30, 1030], [710, 1030]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="18" stroke={color} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r="5" fill={color} />
        </g>
      ))}
    </svg>
  );
}

// Cadre Baroque Sculpté SVG
function BaroqueFrame({ color = "#8f7bc4", inset = 24 }) {
  return (
    <svg
      style={{ position: "absolute", inset: `${inset}px`, width: `calc(100% - ${inset * 2}px)`, height: `calc(100% - ${inset * 2}px)`, pointerEvents: "none", zIndex: 2 }}
      viewBox="0 0 740 1060"
      fill="none"
    >
      <rect x="12" y="12" width="716" height="1036" stroke={color} strokeWidth="3" rx="8" />
      <rect x="24" y="24" width="692" height="1012" stroke={color} strokeWidth="1.5" rx="6" />

      {/* Fleurots d'angle */}
      <path d="M12 40 C 30 40, 40 30, 40 12" stroke={color} strokeWidth="3" fill="none" />
      <path d="M728 40 C 710 40, 700 30, 700 12" stroke={color} strokeWidth="3" fill="none" />
      <path d="M12 1020 C 30 1020, 40 1030, 40 1048" stroke={color} strokeWidth="3" fill="none" />
      <path d="M728 1020 C 710 1020, 700 1030, 700 1048" stroke={color} strokeWidth="3" fill="none" />
    </svg>
  );
}

function GenericLogoPlaceholder({ label = "LOGO" }) {
  return (
    <svg viewBox="0 0 80 100" width="65" height="80">
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

      {/* Formes et Styles de Bordures Graphiques */}
      {borderStyle === "art_deco" && <ArtDecoFrame color={ornamentColor} inset={borderInset} />}
      {borderStyle === "guilloche" && <GuillocheFrame color={ornamentColor} inset={borderInset} />}
      {borderStyle === "baroque" && <BaroqueFrame color={ornamentColor} inset={borderInset} />}

      {/* Bordures CSS Standard & Multiples Filets */}
      {borderStyle !== "none" && borderStyle !== "art_deco" && borderStyle !== "guilloche" && borderStyle !== "baroque" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: `${borderInset}px`,
              borderStyle: borderStyle === "dashed" ? "dashed" : borderStyle === "groove" ? "groove" : borderStyle === "ridge" ? "ridge" : borderStyle === "triple" ? "solid" : "solid",
              borderWidth: `${borderStyle === "double" ? borderWidth + 2 : borderStyle === "triple" ? borderWidth + 3 : borderWidth}px`,
              borderColor: ornamentColor,
              pointerEvents: "none",
              zIndex: 2
            }}
          />
          {(borderStyle === "double" || borderStyle === "triple") && (
            <div
              style={{
                position: "absolute",
                inset: `${borderInset + 6}px`,
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: ornamentColor,
                pointerEvents: "none",
                zIndex: 2,
                opacity: 0.8
              }}
            />
          )}
          {borderStyle === "triple" && (
            <div
              style={{
                position: "absolute",
                inset: `${borderInset + 12}px`,
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: ornamentColor,
                pointerEvents: "none",
                zIndex: 2,
                opacity: 0.6
              }}
            />
          )}
        </>
      )}

      {/* Volutes Ornementales aux 4 Coins */}
      {showVolutes && (
        <>
          <CornerOrnament color={ornamentColor} style={{ position: "absolute", top: 0, left: 0, zIndex: 3 }} />
          <CornerOrnament
            color={ornamentColor}
            style={{ position: "absolute", top: 0, right: 0, transform: "scaleX(-1)", zIndex: 3 }}
          />
          <CornerOrnament
            color={ornamentColor}
            style={{ position: "absolute", bottom: 0, left: 0, transform: "scaleY(-1)", zIndex: 3 }}
          />
          <CornerOrnament
            color={ornamentColor}
            style={{ position: "absolute", bottom: 0, right: 0, transform: "scale(-1,-1)", zIndex: 3 }}
          />
        </>
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
                <img src={d.logoLeftUrl} alt="Logo Gauche" style={{ height: `${logoSize}px`, maxMaxHeight: "350px", objectFit: "contain" }} />
              ) : (
                hasHeaderLogos && <GenericLogoPlaceholder label="LOGO G" />
              )}
            </div>

            {/* Logo Central (si pas de logos gauche/droite) */}
            {!hasHeaderLogos && (
              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                {d.logoUrl ? (
                  <img src={d.logoUrl} alt="Logo" style={{ height: `${logoSize}px`, maxMaxHeight: "350px", objectFit: "contain" }} />
                ) : (
                  <GenericLogoPlaceholder label="LOGO" />
                )}
              </div>
            )}

            {/* Logo Droit */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gridColumn: "3" }}>
              {d.logoRightUrl ? (
                <img src={d.logoRightUrl} alt="Logo Droit" style={{ height: `${logoSize}px`, maxMaxHeight: "350px", objectFit: "contain" }} />
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
