import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDFModule, { jsPDF as jsPDFNamed } from "jspdf";
import {
  Download, ArrowLeft, ImageIcon, FileText, RefreshCw, Sparkles, Plus, Trash2,
  Palette, Star, PenTool, Building, User, Smartphone, Monitor, Check, Layers
} from "./Icons.jsx";

const DEFAULT_AFFICHE_DATA = {
  surTitre: "RÉPUBLIQUE DU BÉNIN — MAIRIE DE PORTO-NOVO",
  titre: "4ÈME ÉDITION DE LA FOIRE INTERNATIONALE DE MADINGO-KAYES / POINTE-NOIRE",
  sousTitre: "Valorisation du Patrimoine Culturel & Artisanal de Porto-Novo",
  dateLieu: "📍 Du 10 au 14 Août à Madingo-Kayes | Du 15 au 31 Août 2026 à Pointe-Noire",
  organisateur: "Organisé sous la haute bienveillance de la Mairie de Porto-Novo et de la Coordination FIMA/PN",
  badgePromo: "✨ ENTRÉE LIBRE & GRATUITE",
  programme: "• Expositions d'artisanat d'art & Macramé d'excellence\n• Ateliers vivants de Teinture de pagne traditionnelle\n• Rencontres B2B & Réseautage d'artisans internationaux\n• Soirées culturelles, danses & gastronomie du Bénin",
  contact: "📞 Renseignements & Inscriptions : +229 01 97 00 00 00 | ✉️ contact@fima-pn.bj | 🌐 www.fima-pn.bj",
  signataireTitre: "La Coordonnatrice Internationale",
  signataireNom: "TOSSA Afiavi Gbessito Honorine"
};

const AFFICHE_PRESETS = [
  {
    name: "🏛️ Foire & Événement Culturel (Porto-Novo / Congo)",
    data: { ...DEFAULT_AFFICHE_DATA }
  },
  {
    name: "🎓 Formation Professionnelle Macramé & Teinture",
    data: {
      surTitre: "ONG ESPOIR ET NATURE & MAISON AFI COLLECTION DU BÉNIN",
      titre: "GRAND ATELIER DE FORMATION EN MACRAMÉ & TEINTURE DE PAGNE",
      sousTitre: "Apprenez un métier d'avenir et obtenez votre attestation de fin de formation professionnelle",
      dateLieu: "📍 Du 1er au 31 Août 2026 — Centre de Formation d'Houegbo",
      organisateur: "Formation certifiante par Mme TOSSA Afiavi Gbessito Honorine",
      badgePromo: "🔥 30 PLACES DISPONIBLES SEULEMENT",
      programme: "• Techniques avancées de tissage Macramé & création d'accessoires\n• Procédés traditionnels et modernes de Teinture de pagne\n• Attestation officielle délivrée à la fin du stage\n• Fourniture complète du kit d'apprentissage",
      contact: "📞 Inscriptions ouvertes : +229 01 95 00 00 00 | ✉️ formation@aficollection.bj",
      signataireTitre: "La Directrice Générale",
      signataireNom: "TOSSA Afiavi Gbessito Honorine"
    }
  },
  {
    name: "💼 Forum Business & Conférence Internationale",
    data: {
      surTitre: "SOMMET DES LEADERS & ENTREPRENEURS D'AFRIQUE DE L'OUEST",
      titre: "FORUM INTERNATIONAL DU NUMÉRIQUE ET DE L'INNOVATION 2026",
      sousTitre: "Transformer les opportunités technologiques en croissance économique durable",
      dateLieu: "📍 15 & 16 Septembre 2026 — Palais des Congrès de Cotonou",
      organisateur: "Sous le haut patronage des Acteurs de la Tech du Bénin",
      badgePromo: "🚀 PASS CONFÉRENCE DISPONIBLE",
      programme: "• Keynotes d'experts internationaux & Paneles de discussion\n• Atelier de prototypage & Génération de documents intelligents\n• Concours Pitch Startups & Réseautage VIP",
      contact: "📞 Inscriptions & Pass : +229 01 90 00 00 00 | ✉️ summit@techbenin.bj",
      signataireTitre: "Le Comité d'Organisation",
      signataireNom: "Tech Benin Solutions"
    }
  }
];

const AFFICHE_THEMES = [
  { id: "gold-midnight", name: "Or & Nuit Prestige", bg: "#0F172A", cardBg: "#1E293B", textPrimary: "#F8FAFC", accent: "#F59E0B", border: "#D4AF37", fontHeader: "'Cinzel', serif" },
  { id: "royal-blue", name: "Bleu Événementiel", bg: "#0F2942", cardBg: "#1B3A5B", textPrimary: "#FFFFFF", accent: "#38BDF8", border: "#60A5FA", fontHeader: "'Playfair Display', serif" },
  { id: "emerald-lux", name: "Émeraude Royale", bg: "#064E3B", cardBg: "#0B654E", textPrimary: "#FFFFFF", accent: "#34D399", border: "#10B981", fontHeader: "'Cinzel', serif" },
  { id: "ruby-red", name: "Bordeaux Saphir", bg: "#450A0A", cardBg: "#5C1212", textPrimary: "#FFFFFF", accent: "#F87171", border: "#EF4444", fontHeader: "'Playfair Display', serif" }
];

export default function AfficheGenerator({ onBack }) {
  const [data, setData] = useState({ ...DEFAULT_AFFICHE_DATA });
  const [bgImg, setBgImg] = useState(null);

  const [activeTheme, setActiveTheme] = useState(AFFICHE_THEMES[0]);
  const [activeTab, setActiveTab] = useState("content");
  const [pageFormat, setPageFormat] = useState("portrait");
  const [zoomScale, setZoomScale] = useState(0.85);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [mobileView, setMobileView] = useState("editor");
  const isMobile = windowWidth < 860;

  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [fontBody, setFontBody] = useState("'Times New Roman', Times, serif");
  const [fontSize, setFontSize] = useState(14);

  const [logoImg, setLogoImg] = useState(null);
  const [stampImg, setStampImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Auto zoom based on viewport width
  useEffect(() => {
    const updateAutoZoom = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 860) {
        const targetPaperWidth = pageFormat === "landscape" ? 960 : 678;
        const availableWidth = Math.max(260, w - 32);
        const autoZoom = Math.max(0.3, Math.min(0.95, availableWidth / targetPaperWidth));
        setZoomScale(Number(autoZoom.toFixed(2)));
      } else {
        setZoomScale(0.85);
      }
    };
    updateAutoZoom();
    window.addEventListener("resize", updateAutoZoom);
    return () => window.removeEventListener("resize", updateAutoZoom);
  }, [pageFormat]);

  const previewRef = useRef(null);

  const setField = (field) => (e) => {
    const val = e.target.value;
    setData((prev) => ({ ...prev, [field]: val }));
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
        scale: 2,
        useCORS: true,
        backgroundColor: activeTheme.bg,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const jsPDFConstructor = jsPDFModule?.jsPDF || jsPDFNamed || window.jspdf?.jsPDF;
      const isPort = pageFormat === "portrait";
      const pdf = new jsPDFConstructor(isPort ? "portrait" : "landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Affiche_${data.titre.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF Affiche:", err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const isPort = pageFormat === "portrait";

  return (
    <div className="wrap">
      <style>{`
        .wrap { padding: 24px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 1580px; display: grid; gap: 24px; align-items: start; }
        @media (max-width: 1100px) { .container { grid-template-columns: 1fr !important; } }
        
        .editor-panel { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 48px); position: sticky; top: 24px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .editor-header { padding: 18px 20px 14px; border-bottom: 1px solid #F1F5F9; background: #FAFAFA; }
        .editor-header h1 { font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: #0F172A; }
        .editor-header p { font-size: 12px; color: #64748B; margin-top: 2px; }
        
        .tabs { display: flex; flex-wrap: wrap; background: #F8FAFC; padding: 10px 12px; gap: 6px; border-bottom: 2px solid #E2E8F0; }
        .tab-btn { padding: 8px 12px; border: 1px solid #CBD5E1; background: #FFFFFF; font-size: 12px; font-weight: 700; color: #334155; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .tab-btn:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; transform: translateY(-1px); }
        .tab-btn.active { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF; border-color: #1D4ED8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); }
        .tab-content { padding: 18px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
        
        .presets-box { background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 10px; }
        .presets-box label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; display: block; margin-bottom: 6px; }
        .chip { font-size: 11px; padding: 6px 10px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 16px; cursor: pointer; font-weight: 600; transition: all 0.15s; }
        .chip.active, .chip:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; }
        
        .input-group { display: flex; flex-direction: column; gap: 4px; }
        .input-group label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #475569; }
        .input-group input, .input-group select, .input-group textarea { padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 12.5px; font-family: inherit; color: #0F172A; background: #FFFFFF; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .theme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .theme-card { padding: 10px; border: 2px solid #E2E8F0; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s; background: #FFFFFF; }
        .theme-card:hover { border-color: #93C5FD; }
        .theme-card.active { border-color: #2563EB; background: #EFF6FF; }
        .theme-swatch { width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); flex-shrink: 0; }
        
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-secondary { background: #F1F5F9; color: #334155; }
        .btn-secondary:hover { background: #E2E8F0; }
        .btn-primary { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF; border-color: #1D4ED8; }
        .btn-pdf { background: #DC2626; color: #FFFFFF; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); }

        .preview-area { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; min-width: 0; }
        .action-bar { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 8px 16px; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); flex-wrap: wrap; }
        .format-selector-bar { display: flex; align-items: center; background: #F1F5F9; padding: 3px; border-radius: 8px; gap: 2px; }
        .format-bar-btn { border: none; background: transparent; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; color: #475569; transition: all 0.15s; }
        .format-bar-btn.active { background: #FFFFFF; color: #2563EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        
        .zoom-controls { display: flex; align-items: center; gap: 4px; background: #F1F5F9; padding: 3px 6px; border-radius: 8px; }
        .zoom-btn { border: none; background: #FFFFFF; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .zoom-btn.active { background: #2563EB; color: #FFFFFF; }
        
        .cert-scroll { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; overflow-y: auto; text-align: center; background: #CBD5E1; border-radius: 14px; padding: 30px 20px; min-height: 520px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.1); }
        .cert-scale-wrapper { display: inline-block; text-align: left; margin: 0 auto; transform-origin: top center; transition: transform 0.2s ease; }

        .certificate-sheet { position: relative; border-radius: 8px; overflow: hidden; box-sizing: border-box; font-family: 'Times New Roman', Times, serif; font-size: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); display: flex; flex-direction: column; justify-content: space-between; margin: 0 auto; }
        .certificate-sheet.format-landscape { width: 960px; height: 678px; padding: 40px 52px; }
        .certificate-sheet.format-portrait { width: 678px; height: 960px; padding: 40px 52px; }
      `}</style>

      {/* MOBILE VIEW TOGGLE SWITCHER (< 860px) */}
      <div className="mobile-view-tabs no-print">
        <button 
          type="button"
          className={`mobile-view-btn ${mobileView === "editor" ? "active" : ""}`}
          onClick={() => setMobileView("editor")}
        >
          ✏️ Formulaire d'Édition
        </button>
        <button 
          type="button"
          className={`mobile-view-btn ${mobileView === "preview" ? "active" : ""}`}
          onClick={() => setMobileView("preview")}
        >
          👁️ Aperçu ({Math.round(zoomScale * 100)}%)
        </button>
      </div>

      <div className="container" style={{ gridTemplateColumns: isMobile ? "1fr" : (isSidebarCollapsed ? "50px 1fr" : `${sidebarWidth}px 1fr`), transition: "grid-template-columns 0.25s ease" }}>
        {/* Left Sidebar Editor Panel */}
        <aside className={`editor-panel no-print ${isMobile && mobileView === "preview" ? "mobile-hide-editor" : ""}`} style={{ width: "100%", overflow: "hidden" }}>
          {isSidebarCollapsed ? (
            <div style={{ padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="btn btn-primary"
                style={{ padding: "10px 8px", fontSize: "14px" }}
                title="Déplier et afficher le menu d'édition"
              >
                ▶
              </button>
              <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "11px", fontWeight: "700", color: "#64748B", letterSpacing: "0.1em" }}>
                MENU ÉDITION
              </div>
            </div>
          ) : (
            <>
              <div className="editor-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <span>Affiche & Poster Officiel</span>
                  </h1>
                  <p>Conception d'affiches d'événements, foires & conférences</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="btn btn-secondary"
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                  title="Réduire le menu"
                >
                  ◀ Masquer
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
                  onClick={() => setActiveTab("content")}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Titre & Contenu</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "presets" ? "active" : ""}`}
                  onClick={() => setActiveTab("presets")}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>2. Modèles</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "style" ? "active" : ""}`}
                  onClick={() => setActiveTab("style")}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>3. Style & Couleurs</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "images" ? "active" : ""}`}
                  onClick={() => setActiveTab("images")}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>4. Images & Logos</span>
                </button>
              </div>

              <div className="tab-content">
                {/* TAB 1: CONTENT */}
                {activeTab === "content" && (
                  <>
                    <div className="presets-box">
                      <label>🏛️ En-Tête & Titres de l'Affiche</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Sur-titre (Institution / Organisme)</label>
                        <input type="text" value={data.surTitre} onChange={setField("surTitre")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Titre Principal de l'Événement</label>
                        <textarea rows={2} value={data.titre} onChange={setField("titre")} style={{ fontWeight: "700" }} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Sous-titre / Thème principal</label>
                        <input type="text" value={data.sousTitre} onChange={setField("sousTitre")} />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>📍 Date, Lieu & Programme</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Badge de Promotion (ex: ENTRÉE LIBRE)</label>
                        <input type="text" value={data.badgePromo} onChange={setField("badgePromo")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Lieu & Dates de l'événement</label>
                        <input type="text" value={data.dateLieu} onChange={setField("dateLieu")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Programme & Points Forts</label>
                        <textarea rows={5} value={data.programme} onChange={setField("programme")} />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>📞 Contact & Inscriptions</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Organisateur / Patronage</label>
                        <input type="text" value={data.organisateur} onChange={setField("organisateur")} />
                      </div>
                      <div className="input-group">
                        <label>Coordonnées de Contact & Site Web</label>
                        <input type="text" value={data.contact} onChange={setField("contact")} />
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2: PRESETS */}
                {activeTab === "presets" && (
                  <div className="presets-box">
                    <label>⭐ Modèles d'Affiches Prédéfinis</label>
                    <div className="grid-1 gap-2" style={{ marginTop: "8px" }}>
                      {AFFICHE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="chip hover-glow"
                          onClick={() => setData({ ...preset.data })}
                          style={{ textAlign: "left", padding: "10px 12px", width: "100%", borderRadius: "8px" }}
                        >
                          <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "12px" }}>{preset.name}</div>
                          <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                            {preset.data.titre.slice(0, 50)}...
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: STYLE */}
                {activeTab === "style" && (
                  <>
                    <div className="presets-box">
                      <label style={{ color: "#2563EB" }}>📐 Format de la Page (Orientation)</label>
                      <div className="grid-2" style={{ marginTop: "4px" }}>
                        <button
                          type="button"
                          className={`chip ${pageFormat === "portrait" ? "active" : ""}`}
                          onClick={() => setPageFormat("portrait")}
                          style={{ padding: "8px", fontWeight: "700" }}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Portrait (A4)</span>
                        </button>
                        <button
                          type="button"
                          className={`chip ${pageFormat === "landscape" ? "active" : ""}`}
                          onClick={() => setPageFormat("landscape")}
                          style={{ padding: "8px", fontWeight: "700" }}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>Paysage (A4)</span>
                        </button>
                      </div>
                    </div>

                    <div className="presets-box">
                      <label style={{ color: "#2563EB" }}>📐 Largeur du Menu Latéral ({sidebarWidth}px)</label>
                      <div className="input-group" style={{ marginTop: "4px" }}>
                        <input
                          type="range"
                          min="260"
                          max="600"
                          step="10"
                          value={sidebarWidth}
                          onChange={(e) => setSidebarWidth(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>🎨 Thème de Couleur & Ambiance</label>
                      <div className="theme-grid">
                        {AFFICHE_THEMES.map((th) => (
                          <button
                            key={th.id}
                            type="button"
                            className={`theme-card ${activeTheme.id === th.id ? "active" : ""}`}
                            onClick={() => setActiveTheme(th)}
                            style={{ width: "100%", textAlign: "left" }}
                          >
                            <div className="theme-swatch" style={{ background: th.bg }} />
                            <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#0F172A" }}>{th.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>🔤 Typographie des Titres</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Police de caractères</label>
                        <select value={fontBody} onChange={(e) => setFontBody(e.target.value)}>
                          <option value="'Cinzel', serif">Cinzel (Gravure Impériale)</option>
                          <option value="'Playfair Display', serif">Playfair Display (Élégant)</option>
                          <option value="'Montserrat', sans-serif">Montserrat (Moderne Épuré)</option>
                          <option value="'Times New Roman', Times, serif">Times New Roman (Classique)</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Taille du texte ({fontSize}px)</label>
                        <input
                          type="range"
                          min="11"
                          max="18"
                          step="0.5"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 4: IMAGES */}
                {activeTab === "images" && (
                  <>
                    <div className="presets-box">
                      <label>🖼️ Images & Logos</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Logo de l'Institution / Partenaire</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload(setLogoImg)} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Image d'Arrière-Plan / Affiche</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload(setBgImg)} />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>✍️ Signature & Cachet Officiel</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Tampon Officiel</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload(setStampImg)} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Signature Manuscrite</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload(setSignatureImg)} />
                      </div>
                      <div className="input-group">
                        <label>Signataire (Nom & Titre)</label>
                        <input type="text" value={data.signataireNom} onChange={setField("signataireNom")} placeholder="Nom" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </aside>

        {/* ================= PREVIEW AREA ================= */}
        <main className={`preview-area ${isMobile && mobileView === "editor" ? "mobile-hide-preview" : ""}`}>
          <div className="action-bar">
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="btn btn-primary"
                style={{ fontSize: "11.5px", padding: "6px 12px" }}
              >
                ▶ Ouvrir le menu d'édition
              </button>
            )}

            <div className="format-selector-bar">
              <button
                type="button"
                className={`format-bar-btn ${pageFormat === "landscape" ? "active" : ""}`}
                onClick={() => setPageFormat("landscape")}
              >
                📐 Paysage
              </button>
              <button
                type="button"
                className={`format-bar-btn ${pageFormat === "portrait" ? "active" : ""}`}
                onClick={() => setPageFormat("portrait")}
              >
                📱 Portrait
              </button>
            </div>

            <div className="zoom-controls">
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginRight: "4px" }}>Zoom :</span>
              <button type="button" className={`zoom-btn ${zoomScale === 0.5 ? "active" : ""}`} onClick={() => setZoomScale(0.5)}>50%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 0.65 ? "active" : ""}`} onClick={() => setZoomScale(0.65)}>65%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 0.8 ? "active" : ""}`} onClick={() => setZoomScale(0.8)}>80%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 1.0 ? "active" : ""}`} onClick={() => setZoomScale(1.0)}>100%</button>
            </div>

            <div className="btn-group">
              {onBack && (
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Accueil</span>
                </button>
              )}

              <button type="button" className="btn btn-pdf" onClick={handleExportPDF} disabled={isDownloadingPDF}>
                <Download className="w-4 h-4" />
                <span>{isDownloadingPDF ? "⏳ PDF..." : "Télécharger PDF"}</span>
              </button>
            </div>
          </div>

          <div className="cert-scroll">
            <div className="cert-scale-wrapper" style={{ transform: `scale(${zoomScale})` }}>
              <div
                ref={previewRef}
                className={`certificate-sheet format-${pageFormat}`}
                style={{
                  backgroundColor: activeTheme.bg,
                  borderColor: activeTheme.border,
                  borderWidth: "2px",
                  color: activeTheme.textPrimary,
                  fontFamily: fontBody,
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.6"
                }}
              >
                {/* Background Image if uploaded */}
                {bgImg && (
                  <img
                    src={bgImg}
                    alt="Fond Affiche"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.25,
                      zIndex: 0
                    }}
                  />
                )}

                <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    {/* TOP BRANDING & LOGO */}
                    <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                      <div>
                        {logoImg ? (
                          <img src={logoImg} alt="Logo" className="h-16 max-w-[200px] object-contain" />
                        ) : (
                          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                            {data.surTitre}
                          </span>
                        )}
                      </div>
                      {data.badgePromo && (
                        <span className="px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-lg" style={{ backgroundColor: activeTheme.accent, color: "#0F172A" }}>
                          {data.badgePromo}
                        </span>
                      )}
                    </div>

                    {/* MAIN TITLE BLOCK */}
                    <div className="text-center my-6">
                      <h1 className="text-2xl font-black uppercase tracking-wide leading-tight mb-3" style={{ color: activeTheme.accent, fontFamily: activeTheme.fontHeader }}>
                        {data.titre}
                      </h1>
                      {data.sousTitre && (
                        <p className="text-sm font-semibold italic text-slate-200 max-w-xl mx-auto">
                          {data.sousTitre}
                        </p>
                      )}
                    </div>

                    {/* DATE & VENUE HERO BANNER */}
                    <div className="p-4 rounded-xl text-center my-6 border shadow-inner" style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}>
                      <p className="text-sm font-extrabold tracking-wide uppercase text-amber-300">
                        {data.dateLieu}
                      </p>
                    </div>

                    {/* PROGRAMME & HIGHLIGHTS */}
                    <div className="p-5 rounded-xl border mb-6 backdrop-blur-sm" style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", borderColor: "rgba(255, 255, 255, 0.15)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-amber-400">
                        🎯 AU PROGRAMME DE CET ÉVÉNEMENT :
                      </h3>
                      <div className="text-xs whitespace-pre-line leading-relaxed text-slate-200">
                        {data.programme}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ORGANIZER & CONTACT BLOCK */}
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-[11px] text-center italic text-slate-300 mb-3">
                      {data.organisateur}
                    </p>

                    <div className="p-3 rounded-lg text-center text-xs font-bold tracking-wide" style={{ backgroundColor: activeTheme.cardBg, color: "#FFFFFF" }}>
                      {data.contact}
                    </div>

                    {(signatureImg || stampImg || data.signataireNom) && (
                      <div className="flex justify-between items-end mt-4 text-xs">
                        <div>
                          {stampImg && <img src={stampImg} alt="Tampon" className="h-14 object-contain" />}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-300 uppercase text-[10px]">{data.signataireTitre}</p>
                          {signatureImg && <img src={signatureImg} alt="Signature" className="h-12 ml-auto object-contain my-1" />}
                          <p className="font-semibold text-white">{data.signataireNom}</p>
                        </div>
                      </div>
                    )}
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
