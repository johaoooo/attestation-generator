import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDFModule, { jsPDF as jsPDFNamed } from "jspdf";
import {
  Download, ArrowLeft, Mail, FileText, RefreshCw, CheckCircle2, Sparkles, Layers, Plus, Trash2, ImageIcon,
  Palette, Star, Sliders, PenTool, Building, User, Smartphone, Monitor, Printer, Check
} from "./Icons.jsx";

const DEFAULT_COURRIER_DATA = {
  expediteurNom: "COORDIONNATION FIMA-PN",
  expediteurAdresse: "Porto-Novo, République du Bénin",
  expediteurContact: "Tél: +229 01 97 00 00 00 | Email: contact@fima-pn.bj",
  expediteurLegal: "Coordination Internationale de la Foire Internationale de Madingo-Kayes / Pointe-Noire",
  destinataireNom: "Monsieur le Maire de la Commune",
  destinataireEntreprise: "de Porto-Novo.",
  destinataireAdresse: "Porto-Novo",
  villeDate: "Porto-Novo, le 15 juillet 2026",
  reference: "RÉF. : 002/COMAFA/AMAF/FIMA-PN/2026",
  objet: "Objet : Information sur la tenue de la 4ème édition de la Foire Internationale de Madingo-Kayes/Pointe-Noire et sollicitation d'accompagnement",
  salutation: "Monsieur le Maire,",
  corps: "J'ai l'honneur de porter à votre connaissance que, depuis décembre 2022, date à laquelle la Mairie de Porto-Novo a envoyé deux artisans au Congo pour la valorisation du patrimoine culturel et artisanal de notre commune, j'ai été identifiée par les organisateurs de la Foire Internationale de Madingo-Kayes/Pointe-Noire (FIMA/PN) comme Coordonnatrice Internationale de ladite foire.\n\nÀ cet effet, je viens porter à votre connaissance la tenue de la 4ème édition de cette foire, qui se déroulera du 10 au 14 août à Madingo-Kayes et du 15 au 31 août à Pointe-Noire (voir en annexe les renseignements figurant sur l'affiche).\n\nPar la présente, je viens solliciter votre accompagnement afin de me permettre de révéler le Bénin en général, et la commune de Porto-Novo en particulier, à ce grand rendez-vous international.\n\nDans l'espoir que vous ne ménagerez aucun effort pour répondre favorablement à ma demande, recevez, Monsieur le Maire, l'expression de mes salutations distinguées.",
  signataireNom: "",
  signataireTitre: "La Coordonnatrice",
};

const PRESETS_LIST = [
  {
    name: "🏛️ Courrier Administratif Mairie (Porto-Novo)",
    data: { ...DEFAULT_COURRIER_DATA }
  },
  {
    name: "✉️ Demande de Partenariat (ONG / Entreprise)",
    data: {
      expediteurNom: "Maison AFI COLLECTION du Bénin",
      expediteurAdresse: "Rue 104, Quartier Ganhi, Cotonou",
      expediteurContact: "Tél: +229 01 97 00 00 00 | Email: contact@aficollection.bj",
      expediteurLegal: "Maison AFI COLLECTION S.A.R.L - Capital 10.000.000 FCFA - RCCM RB/COT/24 B 1892",
      destinataireNom: "À l'attention de M. le Directeur Général",
      destinataireEntreprise: "ONG ESPOIR ET NATURE",
      destinataireAdresse: "Avenue Monseigneur Steinmetz, Cotonou",
      villeDate: "Cotonou, le 30 Juillet 2026",
      reference: "N/REF : AC/CR-2026/042",
      objet: "Objet : Confirmation de partenariat et émission des attestations de formation",
      salutation: "Monsieur le Directeur,",
      corps: "J'ai l'honneur de venir par la présente solliciter votre haute bienveillance afin de faire le point sur la dernière session de formation en Macramé et Teinture de pagne tenue récemment.\n\nNous tenons à vous exprimer notre vive gratitude pour la qualité de la collaboration entre nos deux institutions. Conformément à nos engagements communs, veuillez trouver ci-joint les spécifications relatives à l'émission des attestations de fin de formation pour les lauréats.\n\nRestant à votre entière disposition pour tout renseignement complémentaire, nous vous prions d'agréer, Monsieur le Directeur, l'expression de nos salutations distinguées.",
      signataireNom: "TOSSA Afiavi Gbessito Honorine",
      signataireTitre: "La Directrice Générale",
    }
  }
];

const THEMES = [
  {
    id: "classic-gold",
    name: "Or Prestigieux",
    bg: "#FAF6EE",
    border: "#C59B27",
    primary: "#1B2430",
    accent: "#8B263E",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
  },
  {
    id: "emerald-royal",
    name: "Émeraude Royale",
    bg: "#F4F8F5",
    border: "#1B4D3E",
    primary: "#0B2B22",
    accent: "#C59B27",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
  },
  {
    id: "ruby-bordeaux",
    name: "Bordeaux Saphir",
    bg: "#FDF8F5",
    border: "#581820",
    primary: "#2C0D11",
    accent: "#B8860B",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
  },
  {
    id: "sapphire-blue",
    name: "Bleu Saphir & Or",
    bg: "#F0F4F8",
    border: "#0F2942",
    primary: "#0A192F",
    accent: "#C59B27",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
  },
  {
    id: "modern-minimal",
    name: "Minimal Tech",
    bg: "#FFFFFF",
    border: "#1E293B",
    primary: "#0F172A",
    accent: "#2563EB",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
  }
];

const FONTS_OPTIONS = [
  { label: "Times New Roman (Par défaut)", value: "'Times New Roman', Times, serif" },
  { label: "Cormorant Garamond (Classique)", value: "'Cormorant Garamond', serif" },
  { label: "Playfair Display (Prestige)", value: "'Playfair Display', serif" },
  { label: "Cinzel (Impériale)", value: "'Cinzel', serif" },
  { label: "Montserrat (Moderne)", value: "'Montserrat', sans-serif" },
  { label: "Plus Jakarta Sans (Moderne Sans)", value: "'Plus Jakarta Sans', sans-serif" },
];

export default function CourrierGenerator({ onBack }) {
  const [data, setData] = useState({ ...DEFAULT_COURRIER_DATA });
  const [courrierType, setCourrierType] = useState("standard");
  const [letterheadImg, setLetterheadImg] = useState(null);

  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [activeTab, setActiveTab] = useState("content");
  
  // Page Format Orientation matching AttestationFormation exactly
  const [pageFormat, setPageFormat] = useState("portrait");
  const [zoomScale, setZoomScale] = useState(0.8);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [mobileView, setMobileView] = useState("editor");
  const isMobile = windowWidth < 860;

  const [fontBody, setFontBody] = useState("'Times New Roman', Times, serif");
  const [fontSize, setFontSize] = useState(12);
  const [headerLogoSpace, setHeaderLogoSpace] = useState(90);
  const [watermarkText, setWatermarkText] = useState("");
  const [showWaxSeal, setShowWaxSeal] = useState(false);

  const [logoImg, setLogoImg] = useState(null);
  const [stampImg, setStampImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Sidebar Resize and Collapse States
  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        setZoomScale(0.8);
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

  // Export PDF identical to AttestationFormation
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsDownloadingPDF(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const jsPDFConstructor = jsPDFModule?.jsPDF || jsPDFNamed || window.jspdf?.jsPDF;
      const isPort = pageFormat === "portrait";
      const pdf = new jsPDFConstructor(isPort ? "portrait" : "landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Courrier_${pageFormat}_${data.reference.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF:", err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div className="wrap">
      {/* EXACT CSS STYLES CLONED FROM ATTESTATIONFORMATION */}
      <style>{`
        .wrap { padding: 24px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 1580px; display: grid; grid-template-columns: 440px 1fr; gap: 24px; align-items: start; }
        @media (max-width: 1100px) { .container { grid-template-columns: 1fr; } }
        
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
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
        
        .theme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .theme-card { padding: 10px; border: 2px solid #E2E8F0; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s; background: #FFFFFF; }
        .theme-card:hover { border-color: #93C5FD; }
        .theme-card.active { border-color: #2563EB; background: #EFF6FF; }
        .theme-swatch { width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); flex-shrink: 0; }
        
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-secondary { background: #F1F5F9; color: #334155; }
        .btn-secondary:hover { background: #E2E8F0; }
        .btn-pdf { background: #DC2626; color: #FFFFFF; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); }
        .btn-pdf:hover { background: #B91C1C; transform: translateY(-1px); }

        /* PREVIEW AREA & ACTION BAR CLONED EXACTLY FROM ATTESTATION FORMATION */
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

        /* CERTIFICATE / COURRIER SHEET DYNAMICS CLONED FROM ATTESTATION FORMATION */
        .certificate-sheet { position: relative; border-radius: 8px; overflow: hidden; box-sizing: border-box; font-family: 'Times New Roman', Times, serif; font-size: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); display: flex; flex-direction: column; justify-content: space-between; margin: 0 auto; }
        .certificate-sheet.format-landscape { width: 960px; height: 678px; padding: 40px 52px; }
        .certificate-sheet.format-portrait { width: 678px; height: 960px; padding: 40px 52px; }

        .wax-seal-badge { width: 70px; height: 70px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #DC2626 0%, #991B1B 70%, #450A0A 100%); border: 3px solid #F59E0B; box-shadow: 0 4px 10px rgba(153, 27, 27, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3); display: flex; align-items: center; justify-content: center; color: #FEF3C7; font-family: 'Cinzel', serif; font-size: 10px; font-weight: 800; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; transform: rotate(-10deg); }
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
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>Courrier Officiel</span>
                  </h1>
                  <p>Rédaction & mise en page administrative</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="btn btn-secondary"
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                  title="Réduire le menu pour agrandir le document"
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
              <span>1. Contenu</span>
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
              <span>3. Style & Format</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "signatures" ? "active" : ""}`}
              onClick={() => setActiveTab("signatures")}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>4. Tampons & Signatures</span>
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 1: CONTENT */}
            {activeTab === "content" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>🏢 Support & Type de Courrier</label>
                  <div className="grid-2" style={{ marginTop: "4px" }}>
                    <button
                      type="button"
                      className={`chip ${courrierType === "standard" ? "active" : ""}`}
                      onClick={() => setCourrierType("standard")}
                    >
                      📄 Courrier Standard
                    </button>
                    <button
                      type="button"
                      className={`chip ${courrierType === "letterhead" ? "active" : ""}`}
                      onClick={() => setCourrierType("letterhead")}
                    >
                      🏢 Papier En-Tête
                    </button>
                  </div>
                </div>

                {courrierType === "letterhead" && (
                  <div className="presets-box" style={{ background: "#FEF3C7", borderColor: "#F59E0B" }}>
                    <label style={{ color: "#B45309" }}>🖼️ Image du Papier En-Tête</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setLetterheadImg)} style={{ padding: "6px" }} />
                  </div>
                )}

                {courrierType === "standard" && (
                  <div className="presets-box">
                    <label>🏢 Expéditeur</label>
                    <div className="input-group" style={{ marginBottom: "8px" }}>
                      <label>Nom / Organisation</label>
                      <input type="text" value={data.expediteurNom} onChange={setField("expediteurNom")} />
                    </div>
                    <div className="input-group" style={{ marginBottom: "8px" }}>
                      <label>Adresse</label>
                      <input type="text" value={data.expediteurAdresse} onChange={setField("expediteurAdresse")} />
                    </div>
                    <div className="input-group" style={{ marginBottom: "8px" }}>
                      <label>Téléphone & Email</label>
                      <input type="text" value={data.expediteurContact} onChange={setField("expediteurContact")} />
                    </div>
                    <div className="input-group">
                      <label>Mentions Légales (Pied de page)</label>
                      <input type="text" value={data.expediteurLegal} onChange={setField("expediteurLegal")} />
                    </div>
                  </div>
                )}

                <div className="presets-box">
                  <label>👤 Destinataire & Entête</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Destinataire (Nom/Fonction)</label>
                    <input type="text" value={data.destinataireNom} onChange={setField("destinataireNom")} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Organisation / Ville Destinataire</label>
                    <input type="text" value={data.destinataireEntreprise} onChange={setField("destinataireEntreprise")} />
                  </div>
                  <div className="grid-2" style={{ marginBottom: "8px" }}>
                    <div className="input-group">
                      <label>Lieu & Date (À droite)</label>
                      <input type="text" value={data.villeDate} onChange={setField("villeDate")} />
                    </div>
                    <div className="input-group">
                      <label>N° Référence</label>
                      <input type="text" value={data.reference} onChange={setField("reference")} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Objet du Courrier (À droite)</label>
                    <input type="text" value={data.objet} onChange={setField("objet")} />
                  </div>
                </div>

                <div className="presets-box">
                  <label>📜 Texte du Courrier (Justifié)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Formule d'appel</label>
                    <input type="text" value={data.salutation} onChange={setField("salutation")} />
                  </div>
                  <div className="input-group">
                    <label>Corps de la lettre</label>
                    <textarea rows={10} value={data.corps} onChange={setField("corps")} />
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: PRESETS */}
            {activeTab === "presets" && (
              <div className="presets-box">
                <label>⭐ Modèles prédéfinis prêts à l'emploi</label>
                <div className="grid-1 gap-2" style={{ marginTop: "8px" }}>
                  {PRESETS_LIST.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chip hover-glow"
                      onClick={() => setData({ ...preset.data })}
                      style={{ textAlign: "left", padding: "10px 12px", width: "100%", borderRadius: "8px" }}
                    >
                      <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "12px" }}>{preset.name}</div>
                      <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                        {preset.data.objet.slice(0, 50)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STYLE & FORMATS */}
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
                      📱 Portrait (A4)
                    </button>
                    <button
                      type="button"
                      className={`chip ${pageFormat === "landscape" ? "active" : ""}`}
                      onClick={() => setPageFormat("landscape")}
                      style={{ padding: "8px", fontWeight: "700" }}
                    >
                      📐 Paysage (A4)
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
                  <label>🎨 Thème Graphique</label>
                  <div className="theme-grid">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className={`theme-card ${activeTheme.id === th.id ? "active" : ""}`}
                        onClick={() => setActiveTheme(th)}
                        style={{ width: "100%", textAlign: "left" }}
                      >
                        <div className="theme-swatch" style={{ background: th.border }} />
                        <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#0F172A" }}>{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="presets-box">
                  <label>🔤 Typographie & Espace Logo</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police du texte (Par défaut Times New Roman)</label>
                    <select value={fontBody} onChange={(e) => setFontBody(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Taille de la police ({fontSize}pt / px)</label>
                    <input
                      type="range"
                      min="10"
                      max="18"
                      step="0.5"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Espace libre en haut pour Logos ({headerLogoSpace}px)</label>
                    <input
                      type="range"
                      min="40"
                      max="200"
                      step="10"
                      value={headerLogoSpace}
                      onChange={(e) => setHeaderLogoSpace(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Filigrane texte</label>
                    <input
                      type="text"
                      placeholder="ex: CONFIDENTIEL / URGENT"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="waxToggle"
                      checked={showWaxSeal}
                      onChange={(e) => setShowWaxSeal(e.target.checked)}
                    />
                    <label htmlFor="waxToggle" style={{ fontSize: "11.5px", fontWeight: "600", cursor: "pointer" }}>
                      Sceau de cire officiel (Rouge 💮)
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: SIGNATURES */}
            {activeTab === "signatures" && (
              <>
                <div className="presets-box">
                  <label>🖼️ Logo & Tampon Officiel</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Logo de l'Entête (Haut de page)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setLogoImg)} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Signature Manuscrite</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setSignatureImg)} />
                  </div>
                  <div className="input-group">
                    <label>Tampon / Cachet Officiel</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setStampImg)} />
                  </div>
                </div>

                <div className="presets-box">
                  <label>✍️ Signataire</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Titre / Fonction</label>
                    <input type="text" value={data.signataireTitre} onChange={setField("signataireTitre")} />
                  </div>
                  <div className="input-group">
                    <label>Nom Complet (Optionnel)</label>
                    <input type="text" value={data.signataireNom} onChange={setField("signataireNom")} />
                  </div>
                </div>
              </>
            )}
          </div>
            </>
          )}
        </aside>

        {/* ================= PREVIEW AREA 100% CLONED FROM ATTESTATION FORMATION ================= */}
        <main className={`preview-area ${isMobile && mobileView === "editor" ? "mobile-hide-preview" : ""}`}>
          <div className="action-bar">
            {/* COLLAPSED RE-OPEN BUTTON */}
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

            {/* ORIENTATION TOGGLE BAR CLONED EXACTLY FROM ATTESTATION FORMATION */}
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

            {/* RESPONSIVE ZOOM CONTROLS CLONED EXACTLY FROM ATTESTATION FORMATION */}
            <div className="zoom-controls">
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginRight: "4px" }}>Zoom :</span>
              <button type="button" className={`zoom-btn ${zoomScale === 0.5 ? "active" : ""}`} onClick={() => setZoomScale(0.5)}>50%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 0.65 ? "active" : ""}`} onClick={() => setZoomScale(0.65)}>65%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 0.8 ? "active" : ""}`} onClick={() => setZoomScale(0.8)}>80%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 1.0 ? "active" : ""}`} onClick={() => setZoomScale(1.0)}>100%</button>
            </div>

            {/* ACTION BUTTONS CLONED EXACTLY FROM ATTESTATION FORMATION */}
            <div className="btn-group">
              {onBack && (
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                  ← Accueil
                </button>
              )}

              <button type="button" className="btn btn-pdf" onClick={handleExportPDF} disabled={isDownloadingPDF}>
                {isDownloadingPDF ? "⏳ PDF..." : "📄 Télécharger PDF"}
              </button>
            </div>
          </div>

          {/* CERT-SCROLL & CERT-SCALE-WRAPPER CLONED EXACTLY FROM ATTESTATION FORMATION */}
          <div className="cert-scroll">
            <div className="cert-scale-wrapper" style={{ transform: `scale(${zoomScale})` }}>
              <div
                ref={previewRef}
                className={`certificate-sheet format-${pageFormat}`}
                style={{
                  backgroundColor: activeTheme.bg,
                  borderColor: activeTheme.border,
                  borderWidth: "1px",
                  fontFamily: fontBody,
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.6"
                }}
              >
                {/* Background Image if Papier En-Tête Uploaded */}
                {courrierType === "letterhead" && letterheadImg && (
                  <img
                    src={letterheadImg}
                    alt="Papier en-tête d'entreprise"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      zIndex: 0
                    }}
                  />
                )}

                {/* Watermark Overlay */}
                {watermarkText && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) rotate(-45deg)",
                      fontSize: "55px",
                      fontWeight: "900",
                      color: "rgba(15, 23, 42, 0.05)",
                      letterSpacing: "0.2em",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                      zIndex: 1
                    }}
                  >
                    {watermarkText}
                  </div>
                )}

                <div style={{ position: "relative", zIndex: 2, paddingTop: `${headerLogoSpace}px`, flex: 1, display: "flex", flexDirection: "column", justifyBetween: "space-between" }}>
                  <div>
                    {/* Lieu et Date positionnés TOUT EN HAUT À DROITE */}
                    <div className="text-right font-sans font-bold text-xs text-slate-900 mb-6">
                      {data.villeDate}
                    </div>

                    {/* TYPE A: COURRIER STANDARD (Génération d'en-tête) */}
                    {courrierType === "standard" && (
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-1/2 pr-4">
                            {logoImg ? (
                              <img src={logoImg} alt="Logo" className="h-16 max-w-[200px] object-contain mb-3" />
                            ) : (
                              <h2 className="text-lg font-extrabold uppercase tracking-wide mb-1" style={{ color: activeTheme.primary, fontFamily: activeTheme.fontHeader }}>
                                {data.expediteurNom}
                              </h2>
                            )}
                            <p className="text-xs text-slate-600 font-sans">{data.expediteurAdresse}</p>
                            <p className="text-xs text-slate-500 font-sans">{data.expediteurContact}</p>
                            {data.reference && (
                              <p className="text-xs font-bold text-slate-900 font-sans mt-3">{data.reference}</p>
                            )}
                          </div>

                          {/* Official Recipient Block ("À Monsieur...") */}
                          <div className="w-[95mm] text-left font-sans">
                            <div className="bg-slate-50/90 p-4 rounded-lg border border-slate-300 shadow-sm backdrop-blur-sm">
                              <p className="text-xs font-bold text-slate-700 uppercase mb-1">À</p>
                              <p className="font-bold text-sm text-slate-950">{data.destinataireNom}</p>
                              <p className="text-xs font-bold text-slate-800 uppercase">{data.destinataireEntreprise}</p>
                              {data.destinataireAdresse && (
                                <p className="text-xs text-slate-600 mt-1">{data.destinataireAdresse}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-full h-0.5 mb-8" style={{ backgroundColor: activeTheme.primary }}></div>
                      </>
                    )}

                    {/* TYPE B: COURRIER SUR PAPIER EN-TÊTE D'ENTREPRISE */}
                    {courrierType === "letterhead" && (
                      <div className="flex justify-between items-start mb-8 font-sans text-xs">
                        <div className="w-1/2">
                          {data.reference && <p className="font-bold text-slate-900">{data.reference}</p>}
                        </div>
                        <div className="w-[95mm] text-left">
                          <div className="bg-slate-50/90 p-4 rounded-lg border border-slate-300 shadow-sm backdrop-blur-sm">
                            <p className="text-xs font-bold text-slate-700 uppercase mb-1">À</p>
                            <p className="font-bold text-sm text-slate-950">{data.destinataireNom}</p>
                            <p className="text-xs font-bold text-slate-800 uppercase">{data.destinataireEntreprise}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Objet : POSITIONNÉ À DROITE */}
                    <div className="mb-8 text-right font-sans font-bold text-sm">
                      <span className="inline-block p-3 rounded border-r-4 text-slate-900 shadow-sm text-right max-w-xl" style={{ backgroundColor: "rgba(241, 245, 249, 0.9)", borderColor: activeTheme.accent }}>
                        {data.objet}
                      </span>
                    </div>

                    {/* Salutation */}
                    <p className="font-bold mb-4">{data.salutation}</p>

                    {/* Body Text: TEXTE STRICTEMENT JUSTIFIÉ */}
                    <div className="space-y-4 whitespace-pre-line text-justify text-slate-800 leading-relaxed" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                      {data.corps}
                    </div>
                  </div>

                  {/* Bottom Signature & Signatory Block */}
                  <div className="pt-8 mt-12 border-t border-slate-200 font-sans">
                    <div className="flex justify-between items-end mb-4">
                      <div className="w-1/2 flex items-center gap-4">
                        {showWaxSeal && (
                          <div className="wax-seal-badge">
                            <span>OFFICIEL<br/>SCEAU</span>
                          </div>
                        )}
                        {stampImg && (
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Cachet Officiel</p>
                            <img src={stampImg} alt="Cachet" className="h-20 object-contain" />
                          </div>
                        )}
                      </div>

                      <div className="w-1/2 text-right">
                        {data.villeDate && (
                          <p className="text-xs text-slate-600 mb-2 italic">
                            Fait à {data.villeDate.toLowerCase().startsWith("fait à") ? data.villeDate.slice(7) : data.villeDate}
                          </p>
                        )}
                        <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: activeTheme.primary }}>
                          {data.signataireTitre}
                        </p>
                        {signatureImg ? (
                          <img src={signatureImg} alt="Signature" className="h-16 ml-auto object-contain mb-2" />
                        ) : (
                          <div className="h-16 flex items-center justify-end">
                            <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "28px", color: activeTheme.primary }}>
                              {data.signataireNom || data.signataireTitre}
                            </span>
                          </div>
                        )}
                        {data.signataireNom && (
                          <p className="text-sm font-semibold text-slate-900">{data.signataireNom}</p>
                        )}
                      </div>
                    </div>

                    {/* Legal Footer Notice if Standard Type */}
                    {courrierType === "standard" && data.expediteurLegal && (
                      <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
                        {data.expediteurLegal}
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
