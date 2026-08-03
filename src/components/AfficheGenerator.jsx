import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDFModule, { jsPDF as jsPDFNamed } from "jspdf";
import {
  Download, ArrowLeft, ImageIcon, FileText, RefreshCw, Sparkles, Plus, Trash2,
  Palette, Star, PenTool, Building, User, Smartphone, Monitor, Check, Layers
} from "./Icons.jsx";

// Inline Social Media SVG Icons
function TwitterIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" width="16" height="16">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function FacebookIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" width="16" height="16">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" width="16" height="16">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff" />
    </svg>
  );
}

function WhatsAppIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" width="22" height="22">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .55.01.18.01.42-.07.65.5.24.58.81 1.99.88 2.13.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.21.71-.83.9-1.11.19-.29.38-.24.63-.14.26.1 1.63.77 1.91.91.29.15.48.22.55.34.07.13.07.75-.17 1.43Z" />
    </svg>
  );
}

// CATALOGUE DE 10 MODÈLES D'AFFICHES AUX THÈMES VARIÉS
const MARKETING_TEMPLATES = [
  {
    id: "agency-orange",
    name: "📱 1. Agence Digital & Marketing",
    category: "Marketing",
    layout: "hero-single",
    bg: "#f26522", // Orange Vibrant
    logoTextTop: "DIGITAL",
    logoTextBottom: "AGENCY",
    headlinePrefix: "We are",
    headlineMain: "Creative Digital",
    headlineAccent: "Marketing",
    headlineSuffix: "agency",
    servicesTitle: "Our Services",
    servicesList: ["Social Media Ads", "SEO & Copywriting", "Brand Strategy", "Content Creation", "Graphic Design"],
    ctaText: "Order Services",
    phone: "+229 90 00 00 00"
  },
  {
    id: "product-showcase",
    name: "🛍️ 2. Mode, Boutique & E-Commerce",
    category: "E-Commerce",
    layout: "product-trio",
    bg: "#0D9488", // Teal Pro
    logoTextTop: "AFRIQUE",
    logoTextBottom: "STORE",
    headlinePrefix: "Nouvelle",
    headlineMain: "Collection Luxe",
    headlineAccent: "Mode & Pagne",
    headlineSuffix: "2026",
    servicesTitle: "Points Forts",
    servicesList: ["100% Coton Premium", "Fait Main au Bénin", "Livraison Rapide", "Garantie Satisfait"],
    ctaText: "Acheter Maintenant",
    phone: "+229 95 00 00 00"
  },
  {
    id: "event-speakers",
    name: "🎤 3. Conférence, Sommet & Webinaire",
    category: "Événementiel",
    layout: "speakers-dual",
    bg: "#1D4ED8", // Royal Blue
    logoTextTop: "AFRICA",
    logoTextBottom: "SUMMIT",
    headlinePrefix: "Masterclass",
    headlineMain: "Entrepreneuriat &",
    headlineAccent: "Leadership",
    headlineSuffix: "Business",
    servicesTitle: "Invités d'Honneur",
    servicesList: ["M. Jonh HENRY (PDG)", "Mme TOSSA Honorine (ONG)", "Keynotes & Réseautage", "Attestation Offerte"],
    ctaText: "Réserver mon Pass",
    phone: "+229 97 00 00 00"
  },
  {
    id: "real-estate",
    name: "🏢 4. Immobilier & Vente de Biens",
    category: "Immobilier",
    layout: "real-estate-grid",
    bg: "#0F172A", // Midnight Slate
    logoTextTop: "IMMO",
    logoTextBottom: "PRESTIGE",
    headlinePrefix: "À Vendre",
    headlineMain: "Résidence de Luxe",
    headlineAccent: "Villa Fidjrossè",
    headlineSuffix: "Cotonou",
    servicesTitle: "Equipements",
    servicesList: ["5 Chambres Autonomes", "Piscine & Jardin", "Garage 4 Véhicules", "Titre Foncier Sécurisé"],
    ctaText: "Visiter le Bien",
    phone: "+229 91 00 00 00"
  },
  {
    id: "restaurant-food",
    name: "🍕 5. Gastronomie, Resto & Fast-Food",
    category: "Restauration",
    layout: "food-quad",
    bg: "#E11D48", // Crimson Red
    logoTextTop: "DELICE",
    logoTextBottom: "GRILL",
    headlinePrefix: "Menu Spécial",
    headlineMain: "Gastronomie du",
    headlineAccent: "Bénin & Afrique",
    headlineSuffix: "Gourmand",
    servicesTitle: "Spécialités",
    servicesList: ["Poisson Braisé Cotonou", "Poulet Pimenté", "Jus Naturels Local", "Service Traiteur"],
    ctaText: "Commander mon Plat",
    phone: "+229 96 00 00 00"
  },
  {
    id: "fitness-gym",
    name: "🏋️ 6. Sport, Gym & Fitness Club",
    category: "Sport",
    layout: "product-trio",
    bg: "#D97706", // Amber Gold Volt
    logoTextTop: "FITNESS",
    logoTextBottom: "CLUB",
    headlinePrefix: "Remise en Forme",
    headlineMain: "Programme Intensif",
    headlineAccent: "Coaching Pro",
    headlineSuffix: "Cotonou",
    servicesTitle: "Avantages",
    servicesList: ["Accès Musculation 7/7", "Cours Collectifs Cardio", "Suivi Nutritionnel", "Sauna & Spa Inclus"],
    ctaText: "S'inscrire au Club",
    phone: "+229 94 00 00 00"
  },
  {
    id: "health-clinic",
    name: "🩺 Santé, Clinique & Cabinet Médical",
    category: "Santé",
    layout: "speakers-dual",
    bg: "#059669", // Emerald Medical Green
    logoTextTop: "CLINIQUE",
    logoTextBottom: "SANTE",
    headlinePrefix: "Cabinet Médical",
    headlineMain: "Consultation &",
    headlineAccent: "Soins Spécialisés",
    headlineSuffix: "Urgence 24h",
    servicesTitle: "Services Médicaux",
    servicesList: ["Médecine Générale", "Pédiatrie & Maternité", "Laboratoire d'Analyses", "Radiologie Numérique"],
    ctaText: "Prendre Rendez-vous",
    phone: "+229 93 00 00 00"
  },
  {
    id: "education-university",
    name: "🎓 Université, École & Formation",
    category: "Éducation",
    layout: "real-estate-grid",
    bg: "#1E3A8A", // Deep Academic Blue
    logoTextTop: "ECOLE",
    logoTextBottom: "AFRIQUE",
    headlinePrefix: "Inscriptions 2026",
    headlineMain: "Diplômes Homologués",
    headlineAccent: "Licence & Master",
    headlineSuffix: "Excellence",
    servicesTitle: "Filières Pro",
    servicesList: ["Informatique & IA", "Gestion des Projets", "Finance & Comptabilité", "Stage Garanti"],
    ctaText: "Déposer ma Candidature",
    phone: "+229 92 00 00 00"
  },
  {
    id: "music-concert",
    name: "🎶 Concert, Festival & Nuit Événement",
    category: "Culture",
    layout: "food-quad",
    bg: "#7C3AED", // Electric Purple Neon
    logoTextTop: "FESTIVAL",
    logoTextBottom: "LIVE",
    headlinePrefix: "Grand Concert",
    headlineMain: "Soirée Musique",
    headlineAccent: "Afrobeats Live",
    headlineSuffix: "Porto-Novo",
    servicesTitle: "Programmation",
    servicesList: ["Artistes Vedettes", "DJ Sets Internationaux", "Espace VIP & Cocktail", "Sécurité Assurée"],
    ctaText: "Acheter mon Ticket",
    phone: "+229 99 00 00 00"
  },
  {
    id: "luxury-spa",
    name: "💎 Luxe, Spa & Institut de Beauté",
    category: "Luxe & Beauté",
    layout: "hero-single",
    bg: "#BE185D", // Rose Deep Luxury
    logoTextTop: "MAISON",
    logoTextBottom: "BEAUTE",
    headlinePrefix: "Bien-Être",
    headlineMain: "Soins Visage &",
    headlineAccent: "Massage Spa",
    headlineSuffix: "Prestige",
    servicesTitle: "Offres Rituels",
    servicesList: ["Soin Hydratant Bio", "Massage Pierres Chaudes", "Manucure & Pédicure", "Epilation Définitive"],
    ctaText: "Réserver un Soin",
    phone: "+229 98 00 00 00"
  }
];

export default function AfficheGenerator({ onBack }) {
  const [selectedTemplate, setSelectedTemplate] = useState(MARKETING_TEMPLATES[0]);
  const [templateData, setTemplateData] = useState({ ...MARKETING_TEMPLATES[0] });

  // MULTI-IMAGE STATES (UP TO 4 IMAGES + FULL BACKGROUND + LOGO)
  const [fullBgImg, setFullBgImg] = useState(null); // Image de Fond Globale
  const [bgOpacity, setBgOpacity] = useState(0.35); // Opacité du fond (0.05 à 1.0)
  const [bgImg, setBgImg] = useState(null);         // Photo 1 Principale
  const [extraImg1, setExtraImg1] = useState(null);   // Photo 2 Secondaire
  const [extraImg2, setExtraImg2] = useState(null);   // Photo 3 Secondaire
  const [extraImg3, setExtraImg3] = useState(null);   // Photo 4 Secondaire
  const [logoImg, setLogoImg] = useState(null);       // Logo Officiel
  const [logoSize, setLogoSize] = useState(40);       // Taille du logo en px (20px à 100px)
  const [imageScale, setImageScale] = useState(1.0);   // Echelle de taille des images (0.5 à 1.8)

  const [activeTab, setActiveTab] = useState("presets");
  const [pageFormat, setPageFormat] = useState("portrait"); // "portrait" (400x711) | "landscape" (711x400)
  const [showBorder, setShowBorder] = useState(true);      // Afficher ou masquer la bordure d'encadrement
  const [borderStyle, setBorderStyle] = useState("classic-solid"); // "classic-solid" | "double-executive" | "minimal-gradient" | "dashed-creative" | "shadow-floating" | "vintage-corners"
  const [borderRadius, setBorderRadius] = useState(14);   // Rayon des coins (0px à 24px)
  const [borderColor, setBorderColor] = useState("");      // Couleur personnalisée de la bordure
  const [zoomScale, setZoomScale] = useState(0.85);
  const [imageTopPos, setImageTopPos] = useState(185);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const previewRef = useRef(null);

  const switchTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setTemplateData({ ...tmpl });
  };

  const handleImageUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsDownloadingPDF(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");
      const jsPDFConstructor = jsPDFModule?.jsPDF || jsPDFNamed || window.jspdf?.jsPDF;
      const isPort = pageFormat === "portrait";
      const pdf = new jsPDFConstructor(isPort ? "portrait" : "landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Affiche_${templateData.headlineAccent.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF Affiche:", err);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div className="wrap">
      <style>{`
        .wrap { padding: 24px; display: flex; justify-content: center; background: #F1F5F9; min-height: 100vh; }
        .container { width: 100%; max-width: 1580px; display: grid; gap: 24px; align-items: start; }
        
        .editor-panel { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 48px); position: sticky; top: 24px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .editor-header { padding: 16px 20px; border-bottom: 1px solid #F1F5F9; background: #FAFAFA; display: flex; justify-content: space-between; align-items: center; }
        .editor-header h1 { font-size: 16px; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0F172A; margin: 0; }
        .editor-header p { font-size: 11px; color: #64748B; margin: 2px 0 0 0; }
        
        .tabs { display: grid; grid-template-columns: repeat(4, 1fr); background: #F8FAFC; padding: 8px; gap: 6px; border-bottom: 1px solid #E2E8F0; }
        .tab-btn { padding: 8px 4px; border: 1px solid #CBD5E1; background: #FFFFFF; font-size: 11.5px; font-weight: 700; color: #334155; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease; }
        .tab-btn:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; }
        .tab-btn.active { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF; border-color: #1D4ED8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
        .tab-content { padding: 18px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
        
        .presets-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
        .presets-box label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #334155; display: block; margin: 0; }
        
        .input-group { display: flex; flex-direction: column; gap: 4px; }
        .input-group label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #475569; }
        .input-group input, .input-group select, .input-group textarea { padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 12.5px; font-family: inherit; color: #0F172A; background: #FFFFFF; outline: none; transition: border-color 0.15s; }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-secondary { background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; }
        .btn-secondary:hover { background: #E2E8F0; }
        .btn-primary { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF; }
        .btn-pdf { background: #DC2626; color: #FFFFFF; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25); }

        .preview-area { display: flex; flex-direction: column; align-items: center; width: 100%; min-width: 0; }
        .action-bar { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px 20px; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin-bottom: 20px; }
        .canvas-wrapper { background: #CBD5E1; border: 1px solid #94A3B8; border-radius: 24px; padding: 40px; width: 100%; display: flex; justify-content: center; overflow-x: auto; box-shadow: inset 0 2px 6px rgba(0,0,0,0.1); }
      `}</style>

      <div className="container" style={{ gridTemplateColumns: isSidebarCollapsed ? "50px 1fr" : `${sidebarWidth}px 1fr`, transition: "grid-template-columns 0.25s ease" }}>
        
        {/* ================= LEFT SIDEBAR EDITOR ================= */}
        <aside className="editor-panel">
          
          <div className="editor-header">
            {!isSidebarCollapsed && (
              <div>
                <h1>
                  {onBack && (
                    <button type="button" onClick={onBack} className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }}>
                      ← Hub
                    </button>
                  )}
                  Catalogue 10 Modèles Multi-Images
                </h1>
                <p>Affiches thématiques pour tous les secteurs d'activités</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="btn btn-secondary"
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              {isSidebarCollapsed ? "▶" : "◀ Masquer"}
            </button>
          </div>

          {!isSidebarCollapsed && (
            <>
              {/* TABS OF SIDEBAR */}
              <div className="tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "presets" ? "active" : ""}`}
                  onClick={() => setActiveTab("presets")}
                >
                  ⭐ 10 Modèles
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
                  onClick={() => setActiveTab("content")}
                >
                  📝 Contenu
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "images" ? "active" : ""}`}
                  onClick={() => setActiveTab("images")}
                >
                  🖼️ Multi-Images
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "style" ? "active" : ""}`}
                  onClick={() => setActiveTab("style")}
                >
                  🎨 Style
                </button>
              </div>

              <div className="tab-content">
                
                {/* TAB 1: MODÈLES PRESETS (10 TEMPLATES) */}
                {activeTab === "presets" && (
                  <div className="presets-box">
                    <label>⭐ Catalogue de 10 Modèles Thématiques</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {MARKETING_TEMPLATES.map((tmpl) => (
                        <div
                          key={tmpl.id}
                          onClick={() => switchTemplate(tmpl)}
                          style={{
                            padding: "10px 12px",
                            border: selectedTemplate.id === tmpl.id ? "2px solid #2563EB" : "1px solid #CBD5E1",
                            borderRadius: "10px",
                            background: selectedTemplate.id === tmpl.id ? "#EFF6FF" : "#FFFFFF",
                            cursor: "pointer",
                            transition: "all 0.15s"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between" }}>
                            <span style={{ fontWeight: "800", fontSize: "12px", color: "#0F172A" }}>{tmpl.name}</span>
                            <span style={{ fontSize: "9.5px", fontWeight: "700", padding: "2px 6px", borderRadius: "10px", backgroundColor: tmpl.bg, color: "#ffffff" }}>
                              {tmpl.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: FORM CONTENT */}
                {activeTab === "content" && (
                  <>
                    {/* IMPORTER IMAGE DE FOND ACCESSIBLE DIRECTEMENT */}
                    <div className="presets-box" style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}>
                      <label style={{ color: "#1E40AF" }}>🌆 Image de Fond de l'Affiche (Arrière-Plan)</label>
                      {fullBgImg ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img src={fullBgImg} alt="Preview Fond" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Fond d'Écran Actif</span>
                          </div>
                          <button type="button" onClick={() => setFullBgImg(null)} className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px", color: "#DC2626" }}>
                            ✕ Supprimer
                          </button>
                        </div>
                      ) : (
                        <label className="btn btn-primary" style={{ cursor: "pointer", width: "100%", padding: "10px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <ImageIcon className="w-4 h-4" /> Importer une Image de Fond
                          <input type="file" accept="image/*" onChange={handleImageUpload(setFullBgImg)} style={{ display: "none" }} />
                        </label>
                      )}

                      {fullBgImg && (
                        <div className="input-group" style={{ marginTop: "8px" }}>
                          <label>🔆 Transparence / Opacité ({Math.round(bgOpacity * 100)}%)</label>
                          <input
                            type="range"
                            min="0.05"
                            max="1.0"
                            step="0.05"
                            value={bgOpacity}
                            onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                          />
                        </div>
                      )}
                    </div>

                    <div className="presets-box">
                      <label>🏷️ Marque & Logo</label>
                      <div className="grid-2">
                        <div className="input-group">
                          <label>Logo Ligne 1</label>
                          <input
                            type="text"
                            value={templateData.logoTextTop}
                            onChange={(e) => setTemplateData({ ...templateData, logoTextTop: e.target.value })}
                          />
                        </div>
                        <div className="input-group">
                          <label>Logo Ligne 2</label>
                          <input
                            type="text"
                            value={templateData.logoTextBottom}
                            onChange={(e) => setTemplateData({ ...templateData, logoTextBottom: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>📣 Titre Accrocheur (Headline)</label>
                      <div className="input-group">
                        <label>Préfixe (ex: We are / Nouvelle / À Vendre)</label>
                        <input
                          type="text"
                          value={templateData.headlinePrefix}
                          onChange={(e) => setTemplateData({ ...templateData, headlinePrefix: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Titre Principal</label>
                        <input
                          type="text"
                          value={templateData.headlineMain}
                          onChange={(e) => setTemplateData({ ...templateData, headlineMain: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Mot en Couleur Accentuée</label>
                        <input
                          type="text"
                          value={templateData.headlineAccent}
                          onChange={(e) => setTemplateData({ ...templateData, headlineAccent: e.target.value })}
                          style={{ fontWeight: "700", color: templateData.bg }}
                        />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>💼 Carte d'Informations / Services</label>
                      <div className="input-group">
                        <label>Titre de la Carte</label>
                        <input
                          type="text"
                          value={templateData.servicesTitle}
                          onChange={(e) => setTemplateData({ ...templateData, servicesTitle: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Liste des Eléments (1 par ligne)</label>
                        <textarea
                          rows={4}
                          value={templateData.servicesList.join("\n")}
                          onChange={(e) => setTemplateData({ ...templateData, servicesList: e.target.value.split("\n") })}
                        />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>📞 Contact & WhatsApp</label>
                      <div className="input-group">
                        <label>Texte du Bouton CTA</label>
                        <input
                          type="text"
                          value={templateData.ctaText}
                          onChange={(e) => setTemplateData({ ...templateData, ctaText: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Numéro WhatsApp Pro</label>
                        <input
                          type="text"
                          value={templateData.phone}
                          onChange={(e) => setTemplateData({ ...templateData, phone: e.target.value })}
                          style={{ fontWeight: "700" }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 3: MULTI-IMAGES MANAGER */}
                {activeTab === "images" && (
                  <div className="presets-box">
                    <label>🖼️ Emplacements Multi-Photos (Jusqu'à 4 Images)</label>

                    {/* UPLOAD LOGO */}
                    <div className="input-group">
                      <label>🏷️ Logo Officiel (En-Tête)</label>
                      {logoImg ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <img src={logoImg} alt="Preview Logo" style={{ height: "30px", objectFit: "contain" }} />
                          <button type="button" onClick={() => setLogoImg(null)} className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px", color: "#DC2626" }}>✕ Retirer</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ cursor: "pointer", width: "100%" }}>
                          <ImageIcon className="w-4 h-4" /> Importer le Logo Officiel (PNG/JPG/SVG)
                          <input type="file" accept="image/*" onChange={handleImageUpload(setLogoImg)} style={{ display: "none" }} />
                        </label>
                      )}
                    </div>

                    {/* UPLOAD FULL BACKGROUND IMAGE */}
                    <div className="input-group" style={{ marginTop: "10px" }}>
                      <label>🌆 Image de Fond Globale (Arrière-Plan)</label>
                      {fullBgImg ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <img src={fullBgImg} alt="Preview Fond" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Fond Chargé</span>
                          <button type="button" onClick={() => setFullBgImg(null)} className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px", color: "#DC2626" }}>✕ Retirer</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ cursor: "pointer", width: "100%" }}>
                          <ImageIcon className="w-4 h-4" /> Importer l'Image de Fond Globale
                          <input type="file" accept="image/*" onChange={handleImageUpload(setFullBgImg)} style={{ display: "none" }} />
                        </label>
                      )}
                    </div>

                    {fullBgImg && (
                      <div className="input-group" style={{ marginTop: "6px" }}>
                        <label>🔆 Opacité de l'Image de Fond ({Math.round(bgOpacity * 100)}%)</label>
                        <input
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={bgOpacity}
                          onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                        />
                      </div>
                    )}

                    {/* UPLOAD HERO PHOTO 1 */}
                    <div className="input-group" style={{ marginTop: "8px" }}>
                      <label>📸 Photo 1 (Image Principale)</label>
                      {bgImg ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <img src={bgImg} alt="Preview Photo 1" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Photo 1 Chargée</span>
                          <button type="button" onClick={() => setBgImg(null)} className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px", color: "#DC2626" }}>✕ Retirer</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ cursor: "pointer", width: "100%" }}>
                          <ImageIcon className="w-4 h-4" /> Importer Photo 1
                          <input type="file" accept="image/*" onChange={handleImageUpload(setBgImg)} style={{ display: "none" }} />
                        </label>
                      )}
                    </div>

                    {/* UPLOAD EXTRA PHOTO 2 */}
                    <div className="input-group" style={{ marginTop: "8px" }}>
                      <label>📸 Photo 2 (Vignette / Invité 2 / Salon)</label>
                      {extraImg1 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <img src={extraImg1} alt="Preview Photo 2" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Photo 2 Chargée</span>
                          <button type="button" onClick={() => setExtraImg1(null)} className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px", color: "#DC2626" }}>✕ Retirer</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ cursor: "pointer", width: "100%" }}>
                          <ImageIcon className="w-4 h-4" /> Importer Photo 2
                          <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg1)} style={{ display: "none" }} />
                        </label>
                      )}
                    </div>

                    {/* UPLOAD EXTRA PHOTO 3 */}
                    <div className="input-group" style={{ marginTop: "8px" }}>
                      <label>📸 Photo 3 (Vignette / Plat 3 / Galerie)</label>
                      {extraImg2 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <img src={extraImg2} alt="Preview Photo 3" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Photo 3 Chargée</span>
                          <button type="button" onClick={() => setExtraImg2(null)} className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px", color: "#DC2626" }}>✕ Retirer</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ cursor: "pointer", width: "100%" }}>
                          <ImageIcon className="w-4 h-4" /> Importer Photo 3
                          <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg2)} style={{ display: "none" }} />
                        </label>
                      )}
                    </div>

                    {/* UPLOAD EXTRA PHOTO 4 */}
                    <div className="input-group" style={{ marginTop: "8px" }}>
                      <label>📸 Photo 4 (Plat 4 / Galerie)</label>
                      {extraImg3 ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", background: "#FFFFFF" }}>
                          <img src={extraImg3} alt="Preview Photo 4" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Photo 4 Chargée</span>
                          <button type="button" onClick={() => setExtraImg3(null)} className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px", color: "#DC2626" }}>✕ Retirer</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary" style={{ cursor: "pointer", width: "100%" }}>
                          <ImageIcon className="w-4 h-4" /> Importer Photo 4
                          <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg3)} style={{ display: "none" }} />
                        </label>
                      )}
                    </div>

                    {/* SLIDER TAILLE DU LOGO */}
                    <div className="input-group" style={{ marginTop: "12px" }}>
                      <label>🔍 Taille du Logo ({logoSize} px)</label>
                      <input
                        type="range"
                        min="20"
                        max="220"
                        step="5"
                        value={logoSize}
                        onChange={(e) => setLogoSize(parseInt(e.target.value))}
                      />
                      <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                        <button type="button" onClick={() => setLogoSize(40)} className="btn btn-secondary" style={{ flex: 1, padding: "2px", fontSize: "10px" }}>Petit (40px)</button>
                        <button type="button" onClick={() => setLogoSize(80)} className="btn btn-secondary" style={{ flex: 1, padding: "2px", fontSize: "10px" }}>Moyen (80px)</button>
                        <button type="button" onClick={() => setLogoSize(130)} className="btn btn-secondary" style={{ flex: 1, padding: "2px", fontSize: "10px" }}>Grand (130px)</button>
                        <button type="button" onClick={() => setLogoSize(180)} className="btn btn-secondary" style={{ flex: 1, padding: "2px", fontSize: "10px" }}>Géant (180px)</button>
                      </div>
                    </div>

                    {/* SLIDER TAILLE DES PHOTOS */}
                    <div className="input-group" style={{ marginTop: "8px" }}>
                      <label>🔍 Agrandissement des Photos ({Math.round(imageScale * 100)} %)</label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.8"
                        step="0.05"
                        value={imageScale}
                        onChange={(e) => setImageScale(parseFloat(e.target.value))}
                      />
                    </div>

                    {/* SLIDER POSITION VERTICALE */}
                    <div className="input-group" style={{ marginTop: "8px" }}>
                      <label>⬇️ Position Verticale du Bloc Photo ({imageTopPos} px)</label>
                      <input
                        type="range"
                        min="120"
                        max="260"
                        value={imageTopPos}
                        onChange={(e) => setImageTopPos(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: STYLE & COULEUR */}
                {activeTab === "style" && (
                  <>
                    <div className="presets-box">
                      <label>📐 Format & Orientation de l'Affiche</label>
                      <div className="grid-2" style={{ marginBottom: "16px" }}>
                        <button
                          type="button"
                          className={`btn ${pageFormat === "portrait" ? "btn-primary" : "btn-secondary"}`}
                          onClick={() => setPageFormat("portrait")}
                          style={{ padding: "10px", fontSize: "12px", fontWeight: "700" }}
                        >
                          📱 Portrait (9:16)
                        </button>
                        <button
                          type="button"
                          className={`btn ${pageFormat === "landscape" ? "btn-primary" : "btn-secondary"}`}
                          onClick={() => setPageFormat("landscape")}
                          style={{ padding: "10px", fontSize: "12px", fontWeight: "700" }}
                        >
                          🖥️ Paysage (16:9)
                        </button>
                      </div>

                      <label>🖼️ Bordure & Encadrement Extérieur</label>
                      <div className="grid-2" style={{ marginBottom: "12px" }}>
                        <button
                          type="button"
                          className={`btn ${showBorder ? "btn-primary" : "btn-secondary"}`}
                          onClick={() => setShowBorder(true)}
                          style={{ padding: "8px", fontSize: "11.5px" }}
                        >
                          🖼️ Avec Bordure
                        </button>
                        <button
                          type="button"
                          className={`btn ${!showBorder ? "btn-primary" : "btn-secondary"}`}
                          onClick={() => setShowBorder(false)}
                          style={{ padding: "8px", fontSize: "11.5px" }}
                        >
                          🚫 Sans Bordure
                        </button>
                      </div>

                      <div className="input-group" style={{ marginTop: "8px" }}>
                        <label>🔘 Arrondi des Coins ({borderRadius} px)</label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={borderRadius}
                          onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                        />
                      </div>

                      {showBorder && (
                        <>
                          <label style={{ marginTop: "12px", display: "block" }}>👑 Style de la Bordure Professionnelle</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px" }}>
                            {[
                              { id: "classic-solid", label: "🖼️ Épais Solide", desc: "Cadre pro classique" },
                              { id: "double-executive", label: "🏛️ Double Luxe", desc: "Filet double exécutif" },
                              { id: "minimal-gradient", label: "🌈 Dégradé Néon", desc: "Bordure à reflet moderne" },
                              { id: "dashed-creative", label: "✂️ Poinçonné", desc: "Style promotion & offre" },
                              { id: "shadow-floating", label: "✨ Ombre 3D", desc: "Effet d'ombre flottante" },
                              { id: "vintage-corners", label: "👑 Coins Or Luxe", desc: "Angles dorés prestige" }
                            ].map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => setBorderStyle(b.id)}
                                className={`btn ${borderStyle === b.id ? "btn-primary" : "btn-secondary"}`}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  padding: "8px 10px",
                                  textAlign: "left"
                                }}
                              >
                                <span style={{ fontSize: "11px", fontWeight: "800" }}>{b.label}</span>
                                <span style={{ fontSize: "9px", opacity: 0.8, fontWeight: "500" }}>{b.desc}</span>
                              </button>
                            ))}
                          </div>

                          <div className="input-group" style={{ marginTop: "12px" }}>
                            <label>🎨 Couleur de la Bordure Extérieure</label>
                            <input
                              type="color"
                              value={borderColor || templateData.bg}
                              onChange={(e) => setBorderColor(e.target.value)}
                              style={{ height: "40px", cursor: "pointer" }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="presets-box">
                      <label>🎨 Couleur Thématique Principale</label>
                      <div className="input-group">
                        <label>Couleur d'Accentuation du Thème</label>
                        <input
                          type="color"
                          value={templateData.bg}
                          onChange={(e) => setTemplateData({ ...templateData, bg: e.target.value })}
                          style={{ height: "40px", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  </>
                )}

              </div>
            </>
          )}

        </aside>

        {/* ================= RIGHT PREVIEW WORKSPACE ================= */}
        <main className="preview-area">
          
          <div className="action-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* BOUTONS PORTRAIT / PAYSAGE */}
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  type="button"
                  className={`btn ${pageFormat === "portrait" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setPageFormat("portrait")}
                  style={{ fontSize: "11px", padding: "5px 10px", fontWeight: "700" }}
                >
                  📱 Portrait (9:16)
                </button>
                <button
                  type="button"
                  className={`btn ${pageFormat === "landscape" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setPageFormat("landscape")}
                  style={{ fontSize: "11px", padding: "5px 10px", fontWeight: "700" }}
                >
                  🖥️ Paysage (16:9)
                </button>
              </div>

              <span style={{ width: "1px", height: "16px", background: "#CBD5E1", margin: "0 2px" }} />

              <label className="btn btn-secondary" style={{ cursor: "pointer", fontSize: "11.5px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                🌆 Importer Fond
                <input type="file" accept="image/*" onChange={handleImageUpload(setFullBgImg)} style={{ display: "none" }} />
              </label>

              <span style={{ width: "1px", height: "16px", background: "#CBD5E1", margin: "0 2px" }} />

              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Zoom :</label>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.05"
                value={zoomScale}
                onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                style={{ width: "80px" }}
              />
              <span style={{ fontSize: "12px", fontWeight: "800" }}>{Math.round(zoomScale * 100)}%</span>
            </div>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isDownloadingPDF}
              className="btn btn-pdf"
            >
              <Download className="w-4 h-4" /> {isDownloadingPDF ? "Génération PDF..." : "Export PDF Haute Définition"}
            </button>
          </div>

          {/* CANVAS WORKSPACE (9:16 PORTRAIT OU 16:9 PAYSAGE) */}
          <div className="canvas-wrapper">
            <div style={{ transform: `scale(${zoomScale})`, transformOrigin: "top center", transition: "all 0.3s ease" }}>
              
              <div 
                ref={previewRef}
                style={{
                  width: pageFormat === "landscape" ? "711px" : "400px",
                  height: pageFormat === "landscape" ? "400px" : "711px",
                  background: !showBorder 
                    ? "transparent" 
                    : borderStyle === "minimal-gradient" 
                    ? `linear-gradient(135deg, ${borderColor || templateData.bg}, #3B82F6, #EC4899)` 
                    : borderStyle === "dashed-creative" 
                    ? "#FFFFFF" 
                    : (borderColor || templateData.bg),
                  padding: !showBorder || borderStyle === "shadow-floating" ? "0px" : "10px",
                  borderRadius: `${borderRadius}px`,
                  boxShadow: borderStyle === "shadow-floating" 
                    ? "0 30px 60px -12px rgba(0, 0, 0, 0.45)" 
                    : "0 22px 45px rgba(0,0,0,0.3)",
                  border: showBorder && borderStyle === "dashed-creative" 
                    ? `4px dashed ${borderColor || templateData.bg}` 
                    : showBorder && borderStyle === "double-executive" 
                    ? "2px solid #F59E0B" 
                    : "none",
                  outline: showBorder && borderStyle === "double-executive" ? "2px solid #D97706" : "none",
                  outlineOffset: showBorder && borderStyle === "double-executive" ? "-6px" : "0px",
                  position: "relative",
                  boxSizing: "border-box",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  userSelect: "none",
                  transition: "all 0.3s ease"
                }}
              >
                {/* VINTAGE GOLDEN CORNER ACCENTS */}
                {showBorder && borderStyle === "vintage-corners" && (
                  <>
                    <div style={{ position: "absolute", top: "16px", left: "16px", width: "24px", height: "24px", borderTop: "3px solid #F59E0B", borderLeft: "3px solid #F59E0B", zIndex: 30, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: "16px", right: "16px", width: "24px", height: "24px", borderTop: "3px solid #F59E0B", borderRight: "3px solid #F59E0B", zIndex: 30, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "24px", height: "24px", borderBottom: "3px solid #F59E0B", borderLeft: "3px solid #F59E0B", zIndex: 30, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "24px", height: "24px", borderBottom: "3px solid #F59E0B", borderRight: "3px solid #F59E0B", zIndex: 30, pointerEvents: "none" }} />
                  </>
                )}

                {/* WHITE INNER CANVAS */}
                <div 
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f7f6f4",
                    borderRadius: !showBorder || borderStyle === "shadow-floating" ? `${borderRadius}px` : `${Math.max(0, borderRadius - 4)}px`,
                    position: "relative",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    textAlign: "left"
                  }}
                >
                  {/* FOND D'ÉCRAN GLOBAL SI CHARGÉ */}
                  {fullBgImg && (
                    <img
                      src={fullBgImg}
                      alt="Fond Globale Affiche"
                      style={{
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        opacity: bgOpacity,
                        zIndex: 0
                      }}
                    />
                  )}

                  {/* ===== TOP BAR ===== */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyBetween: "space-between", padding: pageFormat === "landscape" ? "16px 24px 0 24px" : "24px 24px 0 24px", position: "relative", zIndex: 10 }}>
                    <div style={{ flex: 1, lineHeight: 0.95 }}>
                      {logoImg ? (
                        <img 
                          src={logoImg} 
                          alt="Logo" 
                          style={{ 
                            maxHeight: `${pageFormat === "landscape" ? Math.min(60, logoSize) : logoSize}px`, 
                            maxWidth: `${Math.min(260, logoSize * 4)}px`, 
                            objectFit: "contain",
                            display: "block",
                            transition: "all 0.15s ease" 
                          }} 
                        />
                      ) : (
                        <>
                          <div style={{ fontSize: pageFormat === "landscape" ? "13px" : "15px", fontWeight: "800", letterSpacing: "0.05em", color: "#171717" }}>
                            {templateData.logoTextTop}
                          </div>
                          <div style={{ fontSize: pageFormat === "landscape" ? "13px" : "15px", fontWeight: "800", letterSpacing: "0.05em", color: "#171717" }}>
                            {templateData.logoTextBottom}
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "9px", fontWeight: "600", color: "#404040", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Follow Us Now
                      </div>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {[TwitterIcon, InstagramIcon, YoutubeIcon, FacebookIcon].map((Icon, i) => (
                          <span
                            key={i}
                            style={{
                              width: "18px", height: "18px",
                              borderRadius: "50%",
                              backgroundColor: templateData.bg,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff"
                            }}
                          >
                            <Icon />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ===== HEADLINE ===== */}
                  <div style={{ padding: pageFormat === "landscape" ? "10px 24px 0 24px" : "20px 24px 0 24px", position: "relative", zIndex: 10, maxWidth: pageFormat === "landscape" ? "350px" : "100%" }}>
                    <div style={{ fontSize: pageFormat === "landscape" ? "15px" : "19px", lineHeight: "1.15", color: "#262626", fontWeight: "500" }}>
                      {templateData.headlinePrefix}{" "}
                      <span style={{ display: "inline-block", verticalAlign: "middle", width: "30px", height: "8px", backgroundColor: "#d4d4d4", marginLeft: "4px", borderRadius: "4px" }} />
                    </div>
                    <div style={{ fontSize: pageFormat === "landscape" ? "16px" : "19px", lineHeight: "1.15", color: "#262626", fontWeight: "500" }}>
                      {templateData.headlineMain}
                    </div>
                    <div style={{ fontSize: pageFormat === "landscape" ? "24px" : "32px", lineHeight: "1.05", fontWeight: "900", color: templateData.bg, marginTop: "-2px" }}>
                      {templateData.headlineAccent}
                    </div>
                    <div style={{ fontSize: pageFormat === "landscape" ? "15px" : "19px", lineHeight: "1.15", color: "#262626", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                      {templateData.headlineSuffix}
                      <span style={{ display: "inline-block", width: "24px", height: "5px", borderRadius: "3px", backgroundColor: templateData.bg }} />
                    </div>
                  </div>

                  {/* ===== MULTI-IMAGE LAYOUT RENDERER ===== */}
                  <div 
                    style={{ 
                      position: "absolute",
                      right: pageFormat === "landscape" ? "24px" : "16px",
                      top: pageFormat === "landscape" ? `${Math.max(40, imageTopPos - 105)}px` : `${imageTopPos}px`,
                      width: pageFormat === "landscape" ? "280px" : "200px",
                      zIndex: 5,
                      transform: `scale(${imageScale})`,
                      transformOrigin: "top right",
                      transition: "all 0.2s ease"
                    }}
                  >

                    {/* LAYOUT 1: HERO SINGLE IMAGE */}
                    {selectedTemplate.layout === "hero-single" && (
                      <label style={{ width: "100%", height: pageFormat === "landscape" ? "230px" : "280px", display: "block", cursor: "pointer", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.18)", border: "2px solid #ffffff" }}>
                        {bgImg ? (
                          <img src={bgImg} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(212,212,212,0.7)", border: "2px dashed #a3a3a3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "14px" }}>
                            <ImageIcon className="w-8 h-8 text-neutral-500" />
                            <span style={{ fontSize: "10px", fontWeight: "700", color: "#525252", padding: "0 8px", textAlign: "center" }}>+ IMPORTER PHOTO 1</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload(setBgImg)} style={{ display: "none" }} />
                      </label>
                    )}

                    {/* LAYOUT 2: PRODUCT TRIO (1 MAIN + 2 VIGNETTES) */}
                    {selectedTemplate.layout === "product-trio" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {/* MAIN PRODUCT PHOTO */}
                        <label style={{ width: "100%", height: pageFormat === "landscape" ? "140px" : "170px", display: "block", cursor: "pointer", borderRadius: "12px", overflow: "hidden", boxShadow: "0 6px 15px rgba(0,0,0,0.15)", border: "2px solid #ffffff" }}>
                          {bgImg ? (
                            <img src={bgImg} alt="Product Main" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(212,212,212,0.7)", border: "2px dashed #a3a3a3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "10px", fontWeight: "700", color: "#525252" }}>+ PHOTO 1 (MAIN)</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageUpload(setBgImg)} style={{ display: "none" }} />
                        </label>

                        {/* 2 SECONDARY VIGNETTES */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <label style={{ height: pageFormat === "landscape" ? "60px" : "70px", borderRadius: "10px", overflow: "hidden", border: "2px solid #ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", cursor: "pointer", display: "block" }}>
                            {extraImg1 ? (
                              <img src={extraImg1} alt="Detail 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#737373" }}>+ PHOTO 2</div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg1)} style={{ display: "none" }} />
                          </label>

                          <label style={{ height: pageFormat === "landscape" ? "60px" : "70px", borderRadius: "10px", overflow: "hidden", border: "2px solid #ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", cursor: "pointer", display: "block" }}>
                            {extraImg2 ? (
                              <img src={extraImg2} alt="Detail 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#737373" }}>+ PHOTO 3</div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg2)} style={{ display: "none" }} />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* LAYOUT 3: SPEAKERS DUAL (2 SPEAKER PORTRAITS) */}
                    {selectedTemplate.layout === "speakers-dual" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 6px 16px rgba(0,0,0,0.12)", cursor: "pointer", border: "1px solid #E2E8F0" }}>
                          {bgImg ? (
                            <img src={bgImg} alt="Speaker 1" style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#d4d4d4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#525252" }}>PHOTO 1</div>
                          )}
                          <div>
                            <div style={{ fontSize: "10.5px", fontWeight: "800", color: "#171717" }}>Intervenant 1</div>
                            <div style={{ fontSize: "8.5px", color: "#64748B" }}>Cliquer pour importer</div>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload(setBgImg)} style={{ display: "none" }} />
                        </label>

                        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 6px 16px rgba(0,0,0,0.12)", cursor: "pointer", border: "1px solid #E2E8F0" }}>
                          {extraImg1 ? (
                            <img src={extraImg1} alt="Speaker 2" style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#d4d4d4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#525252" }}>PHOTO 2</div>
                          )}
                          <div>
                            <div style={{ fontSize: "10.5px", fontWeight: "800", color: "#171717" }}>Intervenant 2</div>
                            <div style={{ fontSize: "8.5px", color: "#64748B" }}>Cliquer pour importer</div>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg1)} style={{ display: "none" }} />
                        </label>
                      </div>
                    )}

                    {/* LAYOUT 4: REAL ESTATE GRID (3 PROPERTY COLLAGE) */}
                    {selectedTemplate.layout === "real-estate-grid" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ width: "100%", height: pageFormat === "landscape" ? "120px" : "140px", display: "block", cursor: "pointer", borderRadius: "12px", overflow: "hidden", border: "2px solid #ffffff", boxShadow: "0 6px 15px rgba(0,0,0,0.15)" }}>
                          {bgImg ? (
                            <img src={bgImg} alt="Facade" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "#d4d4d4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>+ FAÇADE (PHOTO 1)</div>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageUpload(setBgImg)} style={{ display: "none" }} />
                        </label>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                          <label style={{ height: pageFormat === "landscape" ? "70px" : "80px", borderRadius: "8px", overflow: "hidden", cursor: "pointer", display: "block", border: "2px solid #ffffff" }}>
                            {extraImg1 ? <img src={extraImg1} alt="Intérieur 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8.5px", fontWeight: "700" }}>+ PHOTO 2</div>}
                            <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg1)} style={{ display: "none" }} />
                          </label>
                          <label style={{ height: pageFormat === "landscape" ? "70px" : "80px", borderRadius: "8px", overflow: "hidden", cursor: "pointer", display: "block", border: "2px solid #ffffff" }}>
                            {extraImg2 ? <img src={extraImg2} alt="Intérieur 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8.5px", fontWeight: "700" }}>+ PHOTO 3</div>}
                            <input type="file" accept="image/*" onChange={handleImageUpload(setExtraImg2)} style={{ display: "none" }} />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* LAYOUT 5: FOOD QUAD (4 DISHES GRID) */}
                    {selectedTemplate.layout === "food-quad" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        {[
                          { img: bgImg, setter: setBgImg, label: "PHOTO 1" },
                          { img: extraImg1, setter: setExtraImg1, label: "PHOTO 2" },
                          { img: extraImg2, setter: setExtraImg2, label: "PHOTO 3" },
                          { img: extraImg3, setter: setExtraImg3, label: "PHOTO 4" }
                        ].map((slot, idx) => (
                          <label key={idx} style={{ height: pageFormat === "landscape" ? "80px" : "90px", borderRadius: "10px", overflow: "hidden", border: "2px solid #ffffff", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", cursor: "pointer", display: "block" }}>
                            {slot.img ? (
                              <img src={slot.img} alt={`Plat ${idx+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#525252" }}>+ {slot.label}</div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload(slot.setter)} style={{ display: "none" }} />
                          </label>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* ===== SERVICES / INFO CARD ===== */}
                  <div 
                    style={{
                      position: "absolute",
                      left: "24px",
                      top: pageFormat === "landscape" ? "165px" : "255px",
                      width: pageFormat === "landscape" ? "330px" : "170px",
                      backgroundColor: "rgba(38, 38, 38, 0.95)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: pageFormat === "landscape" ? "8px 12px" : "12px 14px",
                      zIndex: 20,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                      border: "1px solid #404040",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ fontSize: "9px", fontWeight: "700", color: "#f7924a", letterSpacing: "0.05em", marginBottom: "2px" }}>
                      Points Forts <span style={{ color: templateData.bg }}>●●●</span>
                    </div>
                    <div style={{ fontSize: pageFormat === "landscape" ? "12.5px" : "14px", fontWeight: "900", marginBottom: "4px" }}>
                      {templateData.servicesTitle}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: pageFormat === "landscape" ? "row" : "column", flexWrap: "wrap", gap: pageFormat === "landscape" ? "4px 10px" : "4px" }}>
                      {templateData.servicesList.map((item, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9.5px", lineHeight: "1.2", color: "#f5f5f5" }}>
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: templateData.bg, flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ===== CONTACT US BUTTON ===== */}
                  <div style={{ 
                    position: "absolute", 
                    left: "24px", 
                    top: pageFormat === "landscape" ? "295px" : "525px", 
                    width: pageFormat === "landscape" ? "170px" : "auto",
                    right: pageFormat === "landscape" ? "auto" : "24px",
                    zIndex: 20 
                  }}>
                    <button 
                      style={{
                        width: "100%",
                        backgroundColor: templateData.bg,
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: pageFormat === "landscape" ? "11.5px" : "13px",
                        letterSpacing: "0.05em",
                        padding: pageFormat === "landscape" ? "8px" : "10px",
                        borderRadius: "6px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        cursor: "pointer"
                      }}
                    >
                      {templateData.ctaText}
                    </button>
                  </div>

                  {/* ===== WHATSAPP ROW ===== */}
                  <div style={{ 
                    position: "absolute", 
                    left: pageFormat === "landscape" ? "210px" : "24px", 
                    top: pageFormat === "landscape" ? "291px" : "575px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    zIndex: 20 
                  }}>
                    <WhatsAppIcon style={{ color: templateData.bg, width: pageFormat === "landscape" ? "20px" : "24px", height: pageFormat === "landscape" ? "20px" : "24px" }} />
                    <div style={{ fontSize: "9px", lineHeight: "1.2", color: "#404040" }}>
                      Contact & Réservation :
                      <br />
                      <span style={{ fontSize: pageFormat === "landscape" ? "11.5px" : "13px", fontWeight: "900", color: "#171717" }}>
                        {templateData.phone}
                      </span>
                    </div>
                  </div>

                  {/* ===== FOOTER TAGLINE ===== */}
                  <div 
                    style={{
                      position: "absolute", left: 0, right: 0, bottom: 0,
                      backgroundColor: "rgba(229, 229, 229, 0.85)",
                      padding: pageFormat === "landscape" ? "4px 10px" : "10px",
                      textAlign: "center",
                      borderTop: "1px solid #d4d4d4"
                    }}
                  >
                    <div style={{ fontSize: "8.5px", fontWeight: "600", color: "#525252" }}>
                      Afrique Innovation PME — Tous droits réservés 2026
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
