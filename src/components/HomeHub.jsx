import React, { useState, useEffect } from "react";
import { getBrandKit } from "../utils/brandStore.js";
import {
  Palette, Sparkles, Building, FileText, ArrowRight, ShieldCheck, Download,
  Receipt, Mail, Award, Briefcase, BookOpen, Layout, IdCard
} from "./Icons.jsx";

export default function HomeHub({ setActiveDocType, onOpenBrandKit }) {
  const [brand, setBrand] = useState(getBrandKit());

  useEffect(() => {
    const handleBrand = (e) => setBrand(e.detail);
    window.addEventListener("brandKitUpdated", handleBrand);
    return () => window.removeEventListener("brandKitUpdated", handleBrand);
  }, []);

  const documentTypes = [
    {
      id: "canva_studio",
      title: "Canva & Photoshop Studio PME",
      badge: "Nouveau — Marketing",
      icon: Palette,
      iconColor: "#2563EB",
      description: "Concevez des visuels marketing, posts Instagram/WhatsApp, story, bannières web et flyers avec drag-and-drop, filtres et calques."
    },
    {
      id: "carte_visite",
      title: "Cartes de Visite PME",
      badge: "Impression A4",
      icon: IdCard,
      iconColor: "#D97706",
      description: "Générez des cartes de visite professionnelles recto/verso avec QR Code, prêtes à imprimer en planche A4 (10 cartes)."
    },
    {
      id: "facture",
      title: "Facture Officielle & Proforma",
      icon: Receipt,
      iconColor: "#059669",
      description: "Éditez des factures professionnelles avec calculs automatiques HT/TVA/TTC, acompte, RIB/MoMo et signature."
    },
    {
      id: "courrier",
      title: "Courrier & Lettre Officielle",
      icon: Mail,
      iconColor: "#2563EB",
      description: "Rédigez des lettres administratives et courriers d'entreprise normés avec en-tête, référence et tampon officiel."
    },
    {
      id: "affiche",
      title: "Affiche & Poster d'Événement",
      icon: Layout,
      iconColor: "#7C3AED",
      description: "Concevez des affiches et posters d'événements, foires et ateliers avec visuels d'en-tête."
    },
    {
      id: "attestation",
      title: "Attestation de Formation",
      icon: Award,
      iconColor: "#D97706",
      description: "Générez des attestations et certificats de réussite personnalisés avec dorures, sceaux de cire et signatures."
    },
    {
      id: "cv",
      title: "CV Professionnel",
      icon: Briefcase,
      iconColor: "#475569",
      description: "Créez un Curriculum Vitae moderne et structuré avec photo de profil, parcours et compétences exportables en PDF."
    },
    {
      id: "rapport",
      title: "Rapport de Mémoire & Gestion",
      icon: BookOpen,
      iconColor: "#0284C7",
      description: "Rédigez vos travaux académiques et projets d'études avec page de garde officielle, sommaire et pagination automatique."
    }
  ];

  return (
    <div className="hub-wrap">
      
      {/* PME Brand Banner */}
      <div 
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #E2E8F0",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "30px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {brand.pmeLogo ? (
            <img src={brand.pmeLogo} alt="Logo PME" style={{ height: "48px", objectFit: "contain", borderRadius: "8px" }} />
          ) : (
            <div 
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#FFFFFF",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
              }}
            >
              {brand.pmeName.substr(0, 2)}
            </div>
          )}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: "12px" }}>
                Charte PME Active
              </span>
              <span style={{ fontSize: "11px", color: "#64748B" }}>IFU: {brand.pmeIfu}</span>
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>
              {brand.pmeName}
            </h2>
            <p style={{ fontSize: "12px", color: "#64748B" }}>{brand.pmeSlogan}</p>
          </div>
        </div>

        <button
          onClick={onOpenBrandKit}
          className="btn btn-primary"
          style={{ fontSize: "12px", padding: "8px 16px" }}
        >
          <Palette className="w-4 h-4" /> Modifier la Charte PME (Brand Kit)
        </button>
      </div>

      {/* Hero Header */}
      <div className="hub-hero">
        <h1>Suite All-in-One de Documents & <span>Visuels PME</span></h1>
        <p>
          Concevez vos affiches Canva, factures, cartes de visite, certificats et courriers d'entreprise. Votre charte graphique s'applique automatiquement sur tous les contenus !
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="hub-grid">
        {documentTypes.map((doc) => {
          const IconComponent = doc.icon;
          return (
            <div
              key={doc.id}
              onClick={() => setActiveDocType(doc.id)}
              className="hub-card"
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "12px" }}>
                  <div 
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: doc.iconColor }} />
                  </div>

                  {doc.badge && (
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: "12px" }}>
                      {doc.badge}
                    </span>
                  )}
                </div>

                <h2 className="hub-card-title">{doc.title}</h2>
                <p className="hub-card-desc">{doc.description}</p>
              </div>

              <div className="hub-card-action">
                <span>Ouvrir cet outil</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantees Footer Bar */}
      <div className="presets-box" style={{ padding: "20px", marginTop: "20px" }}>
        <div className="grid-3">
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Aperçu Temps Réel</p>
            <p style={{ fontSize: "11.5px", color: "#64748B" }}>Modification instantanée et fidèle à l'impression</p>
          </div>

          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Export Vectoriel PDF & PNG</p>
            <p style={{ fontSize: "11.5px", color: "#64748B" }}>Haute résolution pour impression et réseaux sociaux</p>
          </div>

          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Confidentialité Garantie</p>
            <p style={{ fontSize: "11.5px", color: "#64748B" }}>Toutes les données restent sur votre ordinateur</p>
          </div>
        </div>
      </div>

    </div>
  );
}
