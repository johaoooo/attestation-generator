import React from "react";

export default function HomeHub({ setActiveDocType }) {
  const documentTypes = [
    {
      id: "attestation",
      title: "Attestation de Formation",
      description: "Générez des attestations et certificats de réussite personnalisés avec dorures, sceaux de cire et signatures."
    },
    {
      id: "courrier",
      title: "Courrier & Lettre Officielle",
      description: "Rédigez des lettres administratives et courriers d'entreprise normés avec en-tête, référence et tampon officiel."
    },
    {
      id: "facture",
      title: "Facture Officielle & Proforma",
      description: "Éditez des factures professionnelles avec calculs automatiques HT/TVA/TTC, acompte, RIB/MoMo et signature."
    },
    {
      id: "affiche",
      title: "Affiche & Poster d'Événement",
      description: "Concevez des affiches et posters d'événements, foires et ateliers avec visuels d'en-tête."
    },
    {
      id: "cv",
      title: "CV Professionnel",
      description: "Créez un Curriculum Vitae moderne et structuré avec photo de profil, parcours et compétences exportables en PDF."
    },
    {
      id: "rapport",
      title: "Rapport de Mémoire",
      description: "Rédigez vos travaux académiques et projets d'études avec page de garde officielle, sommaire et pagination automatique."
    }
  ];

  return (
    <div className="hub-wrap">
      {/* Hero Title Header */}
      <div className="hub-hero">
        <h1>Quel document souhaitez-vous <span>générer</span> ?</h1>
        <p>
          Choisissez parmi nos 6 générateurs professionnels. Personnalisez l'intégralité du contenu en direct et téléchargez vos documents au format PDF haute définition.
        </p>
      </div>

      {/* 6 Cards Grid */}
      <div className="hub-grid">
        {documentTypes.map((doc) => {
          return (
            <div
              key={doc.id}
              onClick={() => setActiveDocType(doc.id)}
              className="hub-card"
            >
              <div>
                <h2 className="hub-card-title">{doc.title}</h2>
                <p className="hub-card-desc">{doc.description}</p>
              </div>

              <div className="hub-card-action">
                <span>Créer ce document</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Guarantees Bar */}
      <div className="presets-box" style={{ padding: "20px" }}>
        <div className="grid-3">
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Aperçu Temps Réel</p>
            <p style={{ fontSize: "11.5px", color: "#64748B" }}>Modification instantanée et fidèle à l'impression</p>
          </div>

          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Export Vectoriel PDF</p>
            <p style={{ fontSize: "11.5px", color: "#64748B" }}>Format A4 haute résolution d'impression</p>
          </div>

          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Confidentialité Garantie</p>
            <p style={{ fontSize: "11.5px", color: "#64748B" }}>Vos données restent sur votre ordinateur</p>
          </div>
        </div>
      </div>
    </div>
  );
}

