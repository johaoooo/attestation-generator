import React from "react";

/**
 * CoverPagePrestige
 * Style de couverture "Institutionnelle & Cadre Prestige" pour RapportGenerator.
 * Supporte : 
 * - Logos haut-gauche et haut-droite (et logo central)
 * - Déplacement vers le bas du nom de l'établissement
 * - Agrandissement à volonté de l'espace du thème / bannière de titre
 * - Image de fond / Filigrane
 * - Styles de bordures & volutes ornementales
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
      <path d="M14 40 C 6 46, 6 56, 14 60 C 54 18, 46 18, 40 14 Z" fill={color} />
      <path
        d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z"
        fill={color}
        opacity="0.85"
      />
      <circle cx="26" cy="26" r="3" fill={color} opacity="0.85" />
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
  exposeLabel: "Exposé sur",
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

      {/* Cadres & Bordures */}
      {borderStyle !== "none" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: `${borderInset}px`,
              borderStyle: borderStyle === "dashed" ? "dashed" : borderStyle === "groove" ? "groove" : borderStyle === "ridge" ? "ridge" : "solid",
              borderWidth: `${borderStyle === "double" ? borderWidth + 2 : borderWidth}px`,
              borderColor: ornamentColor,
              pointerEvents: "none",
              zIndex: 2
            }}
          />
          {borderStyle === "double" && (
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
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "120px 1fr 120px", alignItems: "center" }}>
            {/* Logo Gauche */}
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              {d.logoLeftUrl ? (
                <img src={d.logoLeftUrl} alt="Logo Gauche" style={{ height: `${logoSize}px`, objectFit: "contain" }} />
              ) : (
                hasHeaderLogos && <GenericLogoPlaceholder label="LOGO G" />
              )}
            </div>

            {/* Logo Central (si pas de logos gauche/droite) */}
            {!hasHeaderLogos && (
              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                {d.logoUrl ? (
                  <img src={d.logoUrl} alt="Logo" style={{ height: `${logoSize}px`, objectFit: "contain" }} />
                ) : (
                  <GenericLogoPlaceholder label="LOGO" />
                )}
              </div>
            )}

            {/* Logo Droit */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gridColumn: "3" }}>
              {d.logoRightUrl ? (
                <img src={d.logoRightUrl} alt="Logo Droit" style={{ height: `${logoSize}px`, objectFit: "contain" }} />
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
        </div>

        {/* TITLE BANNER GROUP (Espace du Thème agrandissable à volonté) */}
        <div style={{ width: "100%", margin: `${verticalGap}px 0` }}>
          <p style={{ fontSize: "16px", fontWeight: "700", textAlign: "left", marginLeft: "8px", marginBottom: "6px", margin: "0 0 6px 8px" }}>
            : {d.exposeLabel || "Exposé sur"}
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
            <h1 style={{ color: "#ffffff", fontWeight: "700", fontSize: `${titleFontSize}px`, lineHeight: "1.25", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", margin: 0 }}>
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
