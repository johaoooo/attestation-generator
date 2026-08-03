import React from "react";

/**
 * CoverPagePrestige
 * Style de couverture "Institutionnelle & Cadre Prestige" pour RapportGenerator.
 * Feuille A4 (794 x 1123 px) — cadre ornemental à volutes + logo + titre encadré.
 */

// Ornement de coin (volute), réutilisé et retourné aux 4 angles
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
      {/* double filet d'encadrement partant du coin */}
      <path d="M6 60 V6 H60" stroke={color} strokeWidth="2.4" />
      <path d="M14 60 V14 H60" stroke={color} strokeWidth="1.6" />

      {/* volute principale */}
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
      {/* petites feuilles / fleurons */}
      <circle cx="70" cy="30" r="4.5" fill={color} />
      <path d="M40 14 C 46 6, 56 6, 60 14 C 54 18, 46 18, 40 14 Z" fill={color} />
      <path d="M14 40 C 6 46, 6 56, 14 60 C 18 54, 18 46, 14 40 Z" fill={color} />
      <path
        d="M46 46 C 40 52, 30 52, 25 45 C 32 40, 42 40, 46 46 Z"
        fill={color}
        opacity="0.85"
      />
      <circle cx="26" cy="26" r="3" fill={color} opacity="0.85" />
    </svg>
  );
}

function GenericLogoPlaceholder() {
  return (
    <svg viewBox="0 0 80 100" width="72" height="90">
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
      <rect x="16" y="62" width="48" height="26" rx="2" fill="#0e9488" opacity="0.12" stroke="#0e9488" strokeWidth="1.5" />
      <text x="40" y="79" textAnchor="middle" fontSize="7" fill="#0e9488" fontWeight="700">
        LOGO
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
};

export default function CoverPagePrestige({ data = {}, accentColor = "#4a7fc1", ornamentColor = "#8f7bc4" }) {
  const d = { ...defaultData, ...data };
  const studentsList = Array.isArray(d.students) ? d.students : (d.auteur ? [d.auteur] : defaultData.students);

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
      {/* Cadre : double filet + 4 volutes */}
      <div style={{ position: "absolute", inset: "26px", border: `1.6px solid ${ornamentColor}`, pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: "32px", border: `1px solid ${ornamentColor}`, pointerEvents: "none", zIndex: 2 }} />

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

      {/* Contenu */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 80px", textAlign: "center", zIndex: 4, boxSizing: "border-box" }}>
        {/* En-tête institution */}
        <p style={{ fontSize: "19px", fontStyle: "italic", fontWeight: "700", textDecoration: "underline", lineHeight: "1.3", maxWidth: "560px", margin: 0 }}>
          {d.instituteName || d.institution}
        </p>
        <p style={{ fontSize: "14px", fontStyle: "italic", fontWeight: "700", textDecoration: "underline", marginTop: "8px", letterSpacing: "0.05em", margin: "8px 0 0 0" }}>
          {d.instituteSubtitle || d.faculte}
        </p>
        <p style={{ fontSize: "17px", fontStyle: "italic", marginTop: "12px", margin: "12px 0 0 0" }}>
          <span style={{ fontWeight: "700", textDecoration: "underline" }}>{d.specialityLabel || "Spécialité"}</span>
          {" : "}
          {d.speciality || "1ᵉʳ année ASSP"}
        </p>

        {/* Logo */}
        <div style={{ marginTop: "24px", marginBottom: "28px" }}>
          {d.logoUrl ? (
            <img src={d.logoUrl} alt="Logo" style={{ height: "90px", objectFit: "contain" }} />
          ) : (
            <GenericLogoPlaceholder />
          )}
        </div>

        {/* Label "Exposé sur" */}
        <p style={{ fontSize: "16px", fontWeight: "700", alignSelf: "flex-start", marginLeft: "8px", margin: "0 0 4px 8px" }}>
          : {d.exposeLabel || "Exposé sur"}
        </p>

        {/* Titre encadré */}
        <div
          style={{
            width: "100%",
            marginTop: "12px",
            marginBottom: "36px",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 24px",
            background: accentColor,
            boxSizing: "border-box"
          }}
        >
          <h1 style={{ color: "#ffffff", fontWeight: "700", fontSize: "32px", lineHeight: "1.25", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", margin: 0 }}>
            {d.title || d.titre}
          </h1>
        </div>

        {/* Préparé par / Professeur */}
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 8px", textAlign: "left", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}>
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

        {/* Année pédagogique */}
        <p style={{ marginTop: "auto", marginBottom: "40px", fontSize: "15px", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}>
          <span style={{ fontWeight: "700", textDecoration: "underline" }}>{d.yearLabel || "Année pédagogique"} :</span> {d.year || d.annee || "2023/2024"}
        </p>
      </div>
    </div>
  );
}
