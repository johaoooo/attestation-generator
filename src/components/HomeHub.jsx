import React from "react";
import { 
  Award, 
  Mail, 
  UserCheck, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Zap,
  Printer,
  ShieldCheck,
  Receipt,
  ImageIcon
} from "./Icons.jsx";

export default function HomeHub({ setActiveDocType }) {
  const documentTypes = [
    {
      id: "attestation",
      title: "Attestation de Formation",
      description: "Générez des attestations et certificats de réussite personnalisés avec dorures, sceaux de cire et signatures.",
      icon: Award,
      badge: "Incontournable",
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      borderColor: "#F59E0B"
    },
    {
      id: "courrier",
      title: "Courrier & Lettre Officielle",
      description: "Rédigez des lettres administratives et courriers d'entreprise normés avec en-tête, référence et tampon officiel.",
      icon: Mail,
      badge: "Administratif",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      borderColor: "#3B82F6"
    },
    {
      id: "facture",
      title: "Facture Officielle & Proforma",
      description: "Éditez des factures professionnelles avec calculs automatiques HT/TVA/TTC, acompte, RIB/MoMo et signature.",
      icon: Receipt,
      badge: "Comptabilité",
      iconBg: "#E0F2FE",
      iconColor: "#0284C7",
      borderColor: "#38BDF8"
    },
    {
      id: "affiche",
      title: "Affiche & Poster d'Événement",
      description: "Concevez des affiches et posters d'événements, foires et ateliers avec visuels, badges et visuels d'en-tête.",
      icon: ImageIcon,
      badge: "Événementiel",
      iconBg: "#FCE7F3",
      iconColor: "#DB2777",
      borderColor: "#F472B6"
    },
    {
      id: "cv",
      title: "CV Professionnel",
      description: "Créez un Curriculum Vitae moderne et structuré avec photo de profil, parcours et compétences exportables en PDF.",
      icon: UserCheck,
      badge: "Carrière",
      iconBg: "#D1FAE5",
      iconColor: "#059669",
      borderColor: "#10B981"
    },
    {
      id: "rapport",
      title: "Rapport de Mémoire",
      description: "Rédigez vos travaux académiques et projets d'études avec page de garde officielle, sommaire et pagination automatique.",
      icon: BookOpen,
      badge: "Multi-Pages",
      iconBg: "#EDE9FE",
      iconColor: "#7C3AED",
      borderColor: "#8B5CF6"
    }
  ];

  return (
    <div className="hub-wrap">
      {/* Hero Title Header */}
      <div className="hub-hero">
        <div className="hub-badge">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plateforme de Génération Officielle</span>
        </div>
        <h1>Quel document souhaitez-vous <span>générer</span> ?</h1>
        <p>
          Choisissez parmi nos 6 générateurs professionnels. Personnalisez l'intégralité du contenu en direct et téléchargez vos documents au format PDF haute définition.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="hub-grid">
        {documentTypes.map((doc) => {
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              onClick={() => setActiveDocType(doc.id)}
              className="hub-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="hub-card-icon"
                    style={{ backgroundColor: doc.iconBg, color: doc.iconColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="chip active">
                    {doc.badge}
                  </span>
                </div>

                <h2 className="hub-card-title">{doc.title}</h2>
                <p className="hub-card-desc">{doc.description}</p>
              </div>

              <div className="hub-card-action">
                <span>Créer ce document</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Guarantees Bar */}
      <div className="presets-box" style={{ padding: "20px" }}>
        <div className="grid-3">
          <div className="flex items-center gap-3">
            <div className="hub-card-icon" style={{ backgroundColor: "#EFF6FF", color: "#2563EB", width: "40px", height: "40px", marginBottom: 0 }}>
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Aperçu Temps Réel</p>
              <p style={{ fontSize: "11.5px", color: "#64748B" }}>Modification instantanée et fidèle à l'impression</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hub-card-icon" style={{ backgroundColor: "#EFF6FF", color: "#2563EB", width: "40px", height: "40px", marginBottom: 0 }}>
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Export Vectoriel PDF</p>
              <p style={{ fontSize: "11.5px", color: "#64748B" }}>Format A4 haute résolution d'impression</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hub-card-icon" style={{ backgroundColor: "#EFF6FF", color: "#2563EB", width: "40px", height: "40px", marginBottom: 0 }}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Confidentialité Garantie</p>
              <p style={{ fontSize: "11.5px", color: "#64748B" }}>Vos données restent sur votre ordinateur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
