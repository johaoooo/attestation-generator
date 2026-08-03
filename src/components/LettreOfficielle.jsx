import React from "react";

/**
 * LettreOfficielle
 * Module "Courrier / Lettre officielle" pour DocStudio.
 * Feuille A4 (794 x 1123 px) — en-tête à double logo, référence + date,
 * objet, corps de lettre justifié, bloc signature, pied de page + bandeau tricolore.
 */

function GenericLogoPlaceholder({ label = "LOGO", size = 64 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        border: "2px dashed #cbd5e1",
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: "700"
      }}
    >
      {label}
    </div>
  );
}

const defaultData = {
  logoUrl: null,
  logoLeftUrl: null,
  logoRightUrl: null,
  reference: "002/COMAFA/AMAF/FIMA-PN/2026",
  lieuDate: "Porto-Novo, le 15 juillet 2026",
  destinataire: [
    "Monsieur le Président de la Chambre des Métiers",
    "de l'Artisanat du Bénin.",
  ],
  objetLabel: "Objet",
  objet:
    "Information et sollicitation d'accompagnement / Participation Foire Internationale de Madingo Kayes (Pointe-Noire)",
  formuleAppel: "Monsieur le Président,",
  paragraphes: [
    "J'ai l'honneur de porter à votre haute connaissance que, depuis trois (3) ans, j'ai été nommée Coordonnatrice de la Foire Internationale de Madingo-Kayes/Pointe-Noire, dont vous aviez reçu le courrier pour une large diffusion.",
    "Je tiens à vous remercier pour votre dynamisme et votre sens de l'écoute dans la vulgarisation de cette information au sein de toutes les confédérations. Que Dieu vous bénisse.",
    "Compte tenu du coût du billet et des frais de séjour liés à ce voyage, plusieurs personnes ayant manifesté le désir d'y aller, par des appels téléphoniques, ont dû désister.",
    "Vu l'importance de cette rencontre, qui constitue un véritable carrefour des innovations en Afrique, je sollicite votre accompagnement de tout genre afin de révéler, à ce rendez-vous, le patrimoine culturel et artisanal béninois.",
    "Dans l'espoir que vous ne ménagerez aucun effort pour répondre favorablement à ma demande, recevez, Monsieur le Président, l'expression de mes salutations distinguées.",
  ],
  faitA: "Fait à Porto-Novo le 15 juillet 2026",
  signataireNom: "TOSSA Afiavi G. Honorine",
  signataireTitre: "La Coordonnatrice",
  signatureUrl: null,
  stampUrl: null,
  watermarkText: "",
  footer: {
    ligne1: "AFI COLLECTION DU BÉNIN | RCCM RB/ABC/15 A 2297 | IFU 12013190056803",
    ligne2: "Ilot : 283, Parcelle : g-8, Maison : Kwami Alexandre TOSSA, Atlantique, Abomey-Calavi, Zoundja, Bénin",
    ligne3: "(+229) 61 68 40 40 / 63 61 71 71 / 63 63 16 16 | afiavitossa@gmail.com",
  },
  bandeauCouleurs: ["#0f9b4f", "#f4d02c", "#d61a2c"], // vert / jaune / rouge (drapeau)
};

export default function LettreOfficielle({ data = {}, fontFamily = "'Georgia', 'Times New Roman', serif" }) {
  const d = {
    ...defaultData,
    ...data,
    destinataire: Array.isArray(data.destinataire) ? data.destinataire : (typeof data.destinataire === "string" ? data.destinataire.split("\n") : defaultData.destinataire),
    paragraphes: Array.isArray(data.paragraphes) ? data.paragraphes : (typeof data.paragraphes === "string" ? data.paragraphes.split("\n\n") : defaultData.paragraphes),
    footer: { ...defaultData.footer, ...(data.footer || {}) },
    bandeauCouleurs: data.bandeauCouleurs || defaultData.bandeauCouleurs,
  };

  const leftLogoSrc = d.logoLeftUrl || d.logoUrl;
  const rightLogoSrc = d.logoRightUrl || d.logoUrl;

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "794px",
        height: "1123px",
        fontFamily: fontFamily,
        color: "#1a1a1a",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      {/* Filigrane d'arrière-plan */}
      {d.watermarkText && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            fontSize: "60px",
            fontWeight: "900",
            color: "rgba(15, 23, 42, 0.05)",
            letterSpacing: "0.2em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            zIndex: 1
          }}
        >
          {d.watermarkText}
        </div>
      )}

      {/* ===== EN-TÊTE : LOGO GAUCHE + LOGO DROIT ===== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "40px 48px 0 48px", zIndex: 2 }}>
        {leftLogoSrc ? (
          <img src={leftLogoSrc} alt="Logo Gauche" style={{ height: "68px", maxWidth: "220px", objectFit: "contain" }} />
        ) : (
          <GenericLogoPlaceholder label="LOGO G" size={64} />
        )}

        {rightLogoSrc ? (
          <img src={rightLogoSrc} alt="Logo Droit" style={{ height: "68px", maxWidth: "220px", objectFit: "contain" }} />
        ) : (
          <GenericLogoPlaceholder label="LOGO D" size={64} />
        )}
      </div>

      {/* ===== CORPS DE LA LETTRE ===== */}
      <div style={{ flex: 1, padding: "54px 56px 0 56px", fontSize: "14.5px", lineHeight: "1.55", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Référence + Destinataire/Date sur la même ligne (Alignement Gauche sur la colonne de droite) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", margin: 0 }}>RÉF. : {d.reference}</p>
            <div style={{ textAlign: "left", width: "320px", marginLeft: "auto" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>{d.lieuDate}</p>
              <p style={{ margin: "8px 0 2px 0", fontWeight: "700" }}>A</p>
              {d.destinataire.map((line, i) => (
                <p key={i} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Objet */}
          <p style={{ fontWeight: "700", marginBottom: "24px", margin: "0 0 24px 0", lineHeight: "1.4" }}>
            {d.objetLabel || "Objet"} : {d.objet}
          </p>

          {/* Formule d'appel */}
          <p style={{ fontWeight: "700", marginBottom: "16px", margin: "0 0 16px 0" }}>{d.formuleAppel}</p>

          {/* Paragraphes justifiés */}
          <div style={{ textAlign: "justify", textJustify: "inter-word", display: "flex", flexDirection: "column", gap: "16px" }}>
            {d.paragraphes.map((p, i) => (
              <p key={i} style={{ margin: 0 }}>{p}</p>
            ))}
          </div>
        </div>

        {/* Pied du corps : Fait à + Bloc Signature & Tampon */}
        <div style={{ marginTop: "24px" }}>
          {/* Fait à / date */}
          <p style={{ textAlign: "right", margin: "0 8px 12px 0", fontStyle: "italic", fontSize: "13.5px" }}>{d.faitA}</p>

          {/* Bloc signature */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", margin: "0 8px 0 0" }}>
            {/* Image Tampon / Cachet s'il existe */}
            {d.stampUrl && (
              <img src={d.stampUrl} alt="Cachet Officiel" style={{ height: "70px", objectFit: "contain", marginBottom: "4px" }} />
            )}

            {/* Signature Manuscrite ou Paraphe SVG */}
            {d.signatureUrl ? (
              <img src={d.signatureUrl} alt="Signature" style={{ height: "55px", objectFit: "contain", marginBottom: "4px" }} />
            ) : (
              <svg width="90" height="40" viewBox="0 0 90 40">
                <path
                  d="M6 30 C 14 8, 22 8, 26 22 C 30 34, 36 18, 42 14 C 48 10, 50 26, 58 20 C 66 14, 70 6, 78 12"
                  stroke="#1b2a6b"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* Cadre Nom du Signataire */}
            <div
              style={{
                border: "2px solid #1b2a6b",
                borderRadius: "4px",
                padding: "4px 12px",
                marginTop: "-4px"
              }}
            >
              <span style={{ fontWeight: "700", fontSize: "13px", color: "#1b2a6b" }}>
                {d.signataireNom}
              </span>
            </div>
            <p style={{ fontWeight: "700", fontSize: "13.5px", marginTop: "8px", margin: "8px 0 0 0" }}>{d.signataireTitre}</p>
          </div>
        </div>
      </div>

      {/* ===== PIED DE PAGE & BANDEAU TRICOLORE ===== */}
      <div>
        <div style={{ padding: "0 56px 14px 56px", fontSize: "10.5px", lineHeight: "1.6", color: "#334155", textAlign: "center" }}>
          <p style={{ fontWeight: "700", margin: 0 }}>{d.footer?.ligne1}</p>
          <p style={{ margin: 0 }}>{d.footer?.ligne2}</p>
          <p style={{ margin: 0 }}>{d.footer?.ligne3}</p>
        </div>

        {/* Bandeau tricolore (Vert / Jaune / Rouge) */}
        <div style={{ display: "flex", width: "100%", height: "26px" }}>
          {(d.bandeauCouleurs || ["#0f9b4f", "#f4d02c", "#d61a2c"]).map((c, i) => (
            <div key={i} style={{ background: c, flex: 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
