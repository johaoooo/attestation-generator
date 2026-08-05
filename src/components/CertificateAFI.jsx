import React from "react";
import "./CertificateAFI.css";

/**
 * CertificateAFI
 * Certificat "Attestation de Participation" — gabarit réutilisable & interactif.
 * Toutes les données (nom, formations, date, lieu, signataires, logos, signatures) passent en props.
 */
export default function CertificateAFI({
  recipientName = "Mme TOSSA Afavi Gbessito Honorine",
  trainings = ["Macramé", "Teinture de pagne"],
  organizer = "Maison AFI COLLECTION du Bénin",
  partner = "Colli-Ganxo et ses structures partenaires",
  location = "Houègbo",
  date = "15 juillet 2026",
  directorLabel = "La Directrice",
  directorSub = "(Maison AFI COLLECTION)",
  representativeLabel = "Le Représentant",
  representativeSub = "du Colli-Ganxo et ses structures partenaires",
  logoLeftImg = null,
  logoCenterImg = null,
  logoRightImg = null,
  leftLogoSize = 75,
  centerLogoSize = 75,
  rightLogoSize = 75,
  customSignatureImg = null,
  customSignatureImg2 = null,
  customStampImg = null,
  positions = {},
  selectedElement = null,
  setSelectedElement = () => {},
  handleTouchStart = () => {},
}) {
  return (
    <div className="certificate-outer">
      <div className="certificate">
        {/* Coin décoratif — angle supérieur droit */}
        <CertificateCorner className="corner top-right" />
        {/* Même décor, pivoté à 180° — angle inférieur gauche */}
        <CertificateCorner className="corner bottom-left" />

        {/* HEADER LOGOS & TITLE */}
        <header className="cert-header">
          {/* LOGO GAUCHE */}
          <div 
            className={`cert-logo interactive-tappable ${selectedElement === "logoLeft" ? "active-selected" : ""}`}
            onClick={() => setSelectedElement("logoLeft")}
            onMouseDown={(e) => handleTouchStart('logoLeft', e)}
            onTouchStart={(e) => handleTouchStart('logoLeft', e)}
            style={{
              transform: `translate(${positions.logoLeft?.x || 0}px, ${positions.logoLeft?.y || 0}px)`,
              cursor: "grab"
            }}
          >
            {logoLeftImg ? (
              <img src={logoLeftImg} alt="Logo Gauche" style={{ maxHeight: `${leftLogoSize}px`, maxWidth: `${leftLogoSize * 3}px`, objectFit: "contain" }} />
            ) : (
              <>
                <div className="cert-logo-letters">
                  <span>A</span>
                  <span>F</span>
                  <span>I</span>
                </div>
                <div className="cert-logo-sub">COLLECTION</div>
              </>
            )}
          </div>

          {/* TITRE ATTESTATION */}
          <div 
            className={`cert-title-container interactive-tappable ${selectedElement === "title" ? "active-selected" : ""}`}
            onClick={() => setSelectedElement("title")}
          >
            <h1 className="cert-title">
              ATTESTATION DE
              <br />
              PARTICIPATION
            </h1>
          </div>

          {/* LOGO DROIT / SCEAU */}
          <div 
            className={`cert-seal-container interactive-tappable ${selectedElement === "logoRight" ? "active-selected" : ""}`}
            onClick={() => setSelectedElement("logoRight")}
            onMouseDown={(e) => handleTouchStart('logoRight', e)}
            onTouchStart={(e) => handleTouchStart('logoRight', e)}
            style={{
              transform: `translate(${positions.logoRight?.x || 0}px, ${positions.logoRight?.y || 0}px)`,
              cursor: "grab"
            }}
          >
            {logoRightImg ? (
              <img src={logoRightImg} alt="Logo Droit" style={{ maxHeight: `${rightLogoSize}px`, maxWidth: `${rightLogoSize * 3}px`, objectFit: "contain" }} />
            ) : (
              <div className="cert-seal">Sceau / Logo partenaire</div>
            )}
          </div>
        </header>

        {/* DIVIDER LINE + DIAMOND */}
        <div className="cert-divider">
          <span className="cert-divider-line" />
          <span className="cert-divider-diamond" />
          <span className="cert-divider-line" />
        </div>

        {/* BODY TEXT CENTERED IN MIDDLE OF DOCUMENT */}
        <div className="cert-body">
          <p className="cert-body-intro">
            Je soussignée <strong>{recipientName}</strong>, atteste que :
          </p>

          <div className="cert-recipient-line" />

          <p className="cert-body-subtitle">a participé avec assiduité aux formations suivantes :</p>

          {/* FORMATIONS LIST CENTERED */}
          <ul className="cert-trainings">
            {Array.isArray(trainings) ? trainings.map((t, idx) => (
              <li key={idx}><span>{t}</span></li>
            )) : (
              <li><span>{trainings}</span></li>
            )}
          </ul>

          <p className="cert-body-org">
            Organisées par la <strong>{organizer}</strong> en partenariat avec
            le <strong>{partner}</strong>.
          </p>

          <p className="cert-body-closing">
            En foi de quoi la présente attestation lui est délivrée pour
            servir et valoir ce que de droit.
          </p>

          <p className="cert-date">
            Fait à {location}, le {date}
          </p>
        </div>

        {/* FOOTER SIGNATURES & STAMP */}
        <footer className="cert-footer">
          <div 
            className={`cert-signature interactive-tappable ${selectedElement === "signataire" ? "active-selected" : ""}`}
            onClick={() => setSelectedElement("signataire")}
            onMouseDown={(e) => handleTouchStart('sig1', e)}
            onTouchStart={(e) => handleTouchStart('sig1', e)}
            style={{ transform: `translate(${positions.sig1?.x || 0}px, ${positions.sig1?.y || 0}px)`, cursor: "grab" }}
          >
            {customSignatureImg ? (
              <img src={customSignatureImg} alt="Signature Directrice" style={{ maxHeight: "50px", marginBottom: "4px" }} />
            ) : (
              <div className="cert-signature-line" />
            )}
            <small className="sig-name">{directorLabel}</small>
            <small className="sig-sub">{directorSub}</small>
          </div>

          <div 
            className={`cert-stamp-box interactive-tappable ${selectedElement === "stamp" ? "active-selected" : ""}`}
            onClick={() => setSelectedElement("stamp")}
            onMouseDown={(e) => handleTouchStart('stamp', e)}
            onTouchStart={(e) => handleTouchStart('stamp', e)}
            style={{ transform: `translate(${positions.stamp?.x || 0}px, ${positions.stamp?.y || 0}px)`, cursor: "grab" }}
          >
            {customStampImg ? (
              <img src={customStampImg} alt="Tampon Officiel" style={{ width: "90px", height: "90px", objectFit: "contain" }} />
            ) : (
              <div className="cert-stamp" />
            )}
          </div>

          <div 
            className={`cert-signature interactive-tappable ${selectedElement === "signataire" ? "active-selected" : ""}`}
            onClick={() => setSelectedElement("signataire")}
            onMouseDown={(e) => handleTouchStart('sig2', e)}
            onTouchStart={(e) => handleTouchStart('sig2', e)}
            style={{ transform: `translate(${positions.sig2?.x || 0}px, ${positions.sig2?.y || 0}px)`, cursor: "grab" }}
          >
            {customSignatureImg2 ? (
              <img src={customSignatureImg2} alt="Signature Représentant" style={{ maxHeight: "50px", marginBottom: "4px" }} />
            ) : (
              <div className="cert-signature-line" />
            )}
            <small className="sig-name">{representativeLabel}</small>
            <small className="sig-sub">{representativeSub}</small>
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * CertificateCorner
 * Décor d'angle : vague verte + double ruban doré + grille de points.
 */
export function CertificateCorner({ className }) {
  const dots = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      dots.push({ cx: 235 + col * 16, cy: 22 + row * 16 });
    }
  }

  return (
    <svg
      className={className}
      viewBox="0 0 340 340"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M340,0 L340,340 L170,340
           C 260,300 320,220 336,120
           C 342,80 340,40 340,0 Z"
        fill="var(--deep-green, #0a2f1a)"
      />
      <path
        d="M340,0 L340,340 L170,340
           C 250,290 300,210 320,110
           C 326,74 322,36 300,0 Z"
        fill="var(--forest-green, #1a6b3c)"
        opacity="0.55"
      />

      <path
        d="M170,340 C 260,300 320,220 340,90"
        fill="none"
        stroke="#d4a017"
        strokeWidth="6"
      />
      <path
        d="M150,340 C 250,295 312,205 320,60"
        fill="none"
        stroke="#f0c95a"
        strokeWidth="3"
      />
      <path
        d="M190,340 C 270,302 328,232 340,120"
        fill="none"
        stroke="#f0c95a"
        strokeWidth="2"
        opacity="0.8"
      />

    </svg>
  );
}
