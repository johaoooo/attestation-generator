import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDFModule, { jsPDF as jsPDFNamed } from "jspdf";
import {
  Download, ArrowLeft, Receipt, FileText, RefreshCw, Sparkles, Plus, Trash2,
  Palette, Star, PenTool, Building, User, Smartphone, Monitor, Check
} from "./Icons.jsx";

const DEFAULT_FACTURE_DATA = {
  invoiceType: "definitif", // 'definitif' or 'proforma'
  invoiceNumber: "FAC-2026-0104",
  invoiceDate: "2026-07-30",
  dueDate: "2026-08-30",
  currency: "FCFA",
  
  // Vendeur / Emetteur
  vendeurNom: "Maison AFI COLLECTION du Bénin",
  vendeurAdresse: "Rue 104, Quartier Ganhi, Cotonou - Bénin",
  vendeurContact: "Tél: +229 01 97 00 00 00 | Email: facturation@aficollection.bj",
  vendeurIfu: "IFU: 3201910482910 | RCCM: RB/COT/24 B 1892",
  vendeurBanque: "BOA Bénin - IBAN: BJ66 0100 1001 0001 2345 6789 01",

  // Client / Destinataire
  clientNom: "ONG ESPOIR ET NATURE",
  clientAdresse: "Avenue Monseigneur Steinmetz, Cotonou",
  clientContact: "Tél: +229 01 95 00 00 00 | Email: contact@espoir-nature.org",
  clientIfu: "IFU: 3201509823101",

  // Articles & Prestations
  items: [
    { id: 1, description: "Formation Macramé & Teinture de pagne (Session de Juillet)", qty: 15, unitPrice: 25000, tva: 0 },
    { id: 2, description: "Fourniture de kits de démarrage (Fils, teintures et accessoires)", qty: 15, unitPrice: 10000, tva: 0 },
    { id: 3, description: "Conception et édition des attestations de fin de formation", qty: 15, unitPrice: 2500, tva: 0 }
  ],

  acompte: 100000,
  notes: "Modalités de règlement : Virement bancaire ou Mobile Money au +229 01 97 00 00 00.\nMerci de votre confiance !",
  signataireTitre: "La Directrice Générale",
  signataireNom: "TOSSA Afiavi Gbessito Honorine"
};

const FACTURE_THEMES = [
  { id: "navy-finance", name: "Bleu Finance", headerColor: "#0F2942", border: "#0F2942", accent: "#2563EB", bg: "#FFFFFF" },
  { id: "emerald-pro", name: "Émeraude Pro", headerColor: "#064E3B", border: "#064E3B", accent: "#059669", bg: "#F4F8F5" },
  { id: "midnight-dark", name: "Noir Exécutif", headerColor: "#0F172A", border: "#0F172A", accent: "#3B82F6", bg: "#FFFFFF" },
  { id: "bordeaux-royal", name: "Bordeaux Prestige", headerColor: "#450A0A", border: "#450A0A", accent: "#B91C1C", bg: "#FDF8F5" }
];

export default function FactureGenerator({ onBack }) {
  const [data, setData] = useState({ ...DEFAULT_FACTURE_DATA });
  const [courrierType, setCourrierType] = useState("standard");
  const [letterheadImg, setLetterheadImg] = useState(null);

  const [activeTheme, setActiveTheme] = useState(FACTURE_THEMES[0]);
  const [activeTab, setActiveTab] = useState("items");
  const [pageFormat, setPageFormat] = useState("portrait");
  const [zoomScale, setZoomScale] = useState(0.85);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [mobileView, setMobileView] = useState("editor");
  const isMobile = windowWidth < 860;

  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [fontBody, setFontBody] = useState("'Times New Roman', Times, serif");
  const [fontSize, setFontSize] = useState(12);
  const [headerLogoSpace, setHeaderLogoSpace] = useState(30);

  const [logoImg, setLogoImg] = useState(null);
  const [stampImg, setStampImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Touch Drag & Quick Edit States
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragMode, setDragMode] = useState(false);
  const [positions, setPositions] = useState({
    logo: { x: 0, y: 0 },
    stamp: { x: 0, y: 0 },
    signature: { x: 0, y: 0 },
  });
  const [dragState, setDragState] = useState(null);

  const handleTouchStart = (key, e) => {
    const touch = e.touches ? e.touches[0] : e;
    const currentPos = positions[key] || { x: 0, y: 0 };
    setDragState({
      key,
      startX: touch.clientX - currentPos.x,
      startY: touch.clientY - currentPos.y
    });
  };

  const handleTouchMove = (e) => {
    if (!dragState) return;
    const touch = e.touches ? e.touches[0] : e;
    const newX = touch.clientX - dragState.startX;
    const newY = touch.clientY - dragState.startY;
    setPositions(prev => ({
      ...prev,
      [dragState.key]: { x: newX, y: newY }
    }));
  };

  const handleTouchEnd = () => {
    setDragState(null);
  };

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

  // Article Table Item Operations
  const handleItemChange = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    }));
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: "Désignation de la prestation / produit", qty: 1, unitPrice: 10000, tva: 0 }
      ]
    }));
  };

  const removeItem = (id) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id)
    }));
  };

  // Automatic Calculation Logic
  const totalHT = data.items.reduce((acc, it) => acc + (parseFloat(it.qty) || 0) * (parseFloat(it.unitPrice) || 0), 0);
  const totalTVA = data.items.reduce((acc, it) => acc + (parseFloat(it.qty) || 0) * (parseFloat(it.unitPrice) || 0) * ((parseFloat(it.tva) || 0) / 100), 0);
  const totalTTC = totalHT + totalTVA;
  const netAPayer = Math.max(0, totalTTC - (parseFloat(data.acompte) || 0));

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " " + data.currency;
  };

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
      pdf.save(`Facture_${data.invoiceNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF Facture:", err);
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
              <div className="editor-header" style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                <div>
                  <h1 className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <span>Facture Officielle</span>
                  </h1>
                  <p>Facturation proforma, définitive & calculs automatiques</p>
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
                  className={`tab-btn ${activeTab === "items" ? "active" : ""}`}
                  onClick={() => setActiveTab("items")}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>1. Articles</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "parties" ? "active" : ""}`}
                  onClick={() => setActiveTab("parties")}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>2. Client & Vendeur</span>
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
                  <span>4. Signatures</span>
                </button>
              </div>

              <div className="tab-content">
                {/* TAB 1: ARTICLES & PRESTATIONS */}
                {activeTab === "items" && (
                  <>
                    <div className="presets-box">
                      <label style={{ color: "#2563EB" }}>📄 Type de Facture & N° Document</label>
                      <div className="grid-2" style={{ marginBottom: "8px" }}>
                        <div className="input-group">
                          <label>Statut Facture</label>
                          <select value={data.invoiceType} onChange={setField("invoiceType")}>
                            <option value="definitif">Facture Définitive</option>
                            <option value="proforma">Facture Proforma</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>N° Facture</label>
                          <input type="text" value={data.invoiceNumber} onChange={setField("invoiceNumber")} />
                        </div>
                      </div>

                      <div className="grid-2">
                        <div className="input-group">
                          <label>Date de Facturation</label>
                          <input type="date" value={data.invoiceDate} onChange={setField("invoiceDate")} />
                        </div>
                        <div className="input-group">
                          <label>Date d'Échéance</label>
                          <input type="date" value={data.dueDate} onChange={setField("dueDate")} />
                        </div>
                      </div>
                    </div>

                    <div className="presets-box">
                      <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                        <label style={{ margin: 0 }}>📊 Articles & Services ({data.items.length})</label>
                        <button type="button" onClick={addItem} className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "11px" }}>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {data.items.map((it, idx) => (
                          <div key={it.id} style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px", position: "relative" }}>
                            <button
                              type="button"
                              onClick={() => removeItem(it.id)}
                              style={{ position: "absolute", top: "6px", right: "6px", border: "none", background: "none", color: "#EF4444", cursor: "pointer" }}
                              title="Supprimer la ligne"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="input-group" style={{ marginBottom: "6px" }}>
                              <label>Ligne #{idx + 1} - Description</label>
                              <input
                                type="text"
                                value={it.description}
                                onChange={(e) => handleItemChange(it.id, "description", e.target.value)}
                              />
                            </div>

                            <div className="grid-3 gap-2">
                              <div className="input-group">
                                <label>Qté</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={it.qty}
                                  onChange={(e) => handleItemChange(it.id, "qty", parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="input-group">
                                <label>Prix Unitaire</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={it.unitPrice}
                                  onChange={(e) => handleItemChange(it.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="input-group">
                                <label>TVA (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={it.tva}
                                  onChange={(e) => handleItemChange(it.id, "tva", parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>💰 Règlement & Acompte</label>
                      <div className="grid-2" style={{ marginBottom: "8px" }}>
                        <div className="input-group">
                          <label>Devise</label>
                          <select value={data.currency} onChange={setField("currency")}>
                            <option value="FCFA">FCFA (Bénin / UEMOA)</option>
                            <option value="EUR (€)">EUR (€)</option>
                            <option value="USD ($)">USD ($)</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>Acompte déjà versé</label>
                          <input type="number" min="0" value={data.acompte} onChange={setField("acompte")} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Notes & Modalités de paiement</label>
                        <textarea rows={3} value={data.notes} onChange={setField("notes")} />
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2: CLIENT & VENDEUR */}
                {activeTab === "parties" && (
                  <>
                    <div className="presets-box">
                      <label>🏢 Émetteur / Votre Entreprise</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Raison Sociale</label>
                        <input type="text" value={data.vendeurNom} onChange={setField("vendeurNom")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Adresse</label>
                        <input type="text" value={data.vendeurAdresse} onChange={setField("vendeurAdresse")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Téléphone & Email</label>
                        <input type="text" value={data.vendeurContact} onChange={setField("vendeurContact")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>IFU / RCCM / Tél Fiscal</label>
                        <input type="text" value={data.vendeurIfu} onChange={setField("vendeurIfu")} />
                      </div>
                      <div className="input-group">
                        <label>Coordonnées Bancaires / RIB / MoMo</label>
                        <input type="text" value={data.vendeurBanque} onChange={setField("vendeurBanque")} />
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>👤 Client / Destinataire</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Nom du Client / Organisation</label>
                        <input type="text" value={data.clientNom} onChange={setField("clientNom")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Adresse du Client</label>
                        <input type="text" value={data.clientAdresse} onChange={setField("clientAdresse")} />
                      </div>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Contact Client</label>
                        <input type="text" value={data.clientContact} onChange={setField("clientContact")} />
                      </div>
                      <div className="input-group">
                        <label>IFU Client (Optionnel)</label>
                        <input type="text" value={data.clientIfu} onChange={setField("clientIfu")} />
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 3: STYLE & FORMAT */}
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
                      <label>🎨 Thème de Couleur Facture</label>
                      <div className="theme-grid">
                        {FACTURE_THEMES.map((th) => (
                          <button
                            key={th.id}
                            type="button"
                            className={`theme-card ${activeTheme.id === th.id ? "active" : ""}`}
                            onClick={() => setActiveTheme(th)}
                            style={{ width: "100%", textAlign: "left" }}
                          >
                            <div className="theme-swatch" style={{ background: th.headerColor }} />
                            <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#0F172A" }}>{th.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="presets-box">
                      <label>🔤 Typographie & Marges</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Police du texte</label>
                        <select value={fontBody} onChange={(e) => setFontBody(e.target.value)}>
                          <option value="'Times New Roman', Times, serif">Times New Roman (Standard)</option>
                          <option value="'Inter', sans-serif">Inter (Moderne)</option>
                          <option value="'Playfair Display', serif">Playfair (Prestige)</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Taille de la police ({fontSize}px)</label>
                        <input
                          type="range"
                          min="10"
                          max="16"
                          step="0.5"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 4: SIGNATURES & TAMPON */}
                {activeTab === "signatures" && (
                  <>
                    <div className="presets-box">
                      <label>🖼️ Logo & Tampon Officiel</label>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Logo d'Entête</label>
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
                        <label>Nom Complet</label>
                        <input type="text" value={data.signataireNom} onChange={setField("signataireNom")} />
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
                  borderWidth: "1px",
                  fontFamily: fontBody,
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.5"
                }}
              >
                <div>
                  {/* TOP HEADER */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b" style={{ borderColor: activeTheme.headerColor }}>
                    <div className="w-1/2 pr-4">
                      {logoImg ? (
                        <img src={logoImg} alt="Logo" className="h-16 max-w-[200px] object-contain mb-3" />
                      ) : (
                        <h2 className="text-xl font-extrabold uppercase tracking-wide mb-1" style={{ color: activeTheme.headerColor }}>
                          {data.vendeurNom}
                        </h2>
                      )}
                      <p className="text-xs text-slate-600">{data.vendeurAdresse}</p>
                      <p className="text-xs text-slate-500">{data.vendeurContact}</p>
                      {data.vendeurIfu && <p className="text-xs font-semibold text-slate-700 mt-1">{data.vendeurIfu}</p>}
                    </div>

                    {/* INVOICE TITLE & NUMBER BLOCK */}
                    <div className="text-right">
                      <span className="inline-block px-4 py-1.5 rounded-lg text-white font-extrabold text-sm uppercase tracking-wider mb-2" style={{ backgroundColor: activeTheme.headerColor }}>
                        {data.invoiceType === "proforma" ? "FACTURE PROFORMA" : "FACTURE DÉFINITIVE"}
                      </span>
                      <p className="text-base font-extrabold text-slate-900">{data.invoiceNumber}</p>
                      <p className="text-xs text-slate-600">Date: {data.invoiceDate}</p>
                      <p className="text-xs text-slate-600">Échéance: {data.dueDate}</p>
                    </div>
                  </div>

                  {/* CLIENT BLOCK */}
                  <div className="bg-slate-50/90 p-4 rounded-lg border border-slate-300 mb-8 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">FACTURÉ À :</p>
                      <p className="text-base font-bold text-slate-950">{data.clientNom}</p>
                      <p className="text-xs text-slate-600">{data.clientAdresse}</p>
                      <p className="text-xs text-slate-500">{data.clientContact}</p>
                    </div>
                    {data.clientIfu && (
                      <div className="text-right text-xs font-semibold text-slate-700">
                        {data.clientIfu}
                      </div>
                    )}
                  </div>

                  {/* TABLE OF ITEMS & PRESTATIONS */}
                  <div className="mb-8 overflow-hidden rounded-lg border border-slate-300 shadow-sm">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="text-white text-xs uppercase" style={{ backgroundColor: activeTheme.headerColor }}>
                          <th className="p-3">Désignation / Article</th>
                          <th className="p-3 text-center w-16">Qté</th>
                          <th className="p-3 text-right w-28">P.U HT</th>
                          <th className="p-3 text-right w-28">Total HT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.items.map((it, idx) => {
                          const lineHT = (parseFloat(it.qty) || 0) * (parseFloat(it.unitPrice) || 0);
                          return (
                            <tr key={it.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                              <td className="p-3 font-medium text-slate-900">{it.description}</td>
                              <td className="p-3 text-center">{it.qty}</td>
                              <td className="p-3 text-right">{formatMoney(it.unitPrice)}</td>
                              <td className="p-3 text-right font-semibold text-slate-900">{formatMoney(lineHT)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* SUMMARY & TOTALS */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-1/2 pr-6">
                      {data.vendeurBanque && (
                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200 text-xs mb-4">
                          <p className="font-bold text-blue-900 mb-1">💳 Règlement Bancaire / MoMo :</p>
                          <p className="text-blue-800 font-mono text-[11px]">{data.vendeurBanque}</p>
                        </div>
                      )}
                      {data.notes && (
                        <p className="text-xs text-slate-600 whitespace-pre-line italic">
                          {data.notes}
                        </p>
                      )}
                    </div>

                    <div className="w-64 bg-slate-50 p-4 rounded-lg border border-slate-300 font-sans text-xs space-y-2">
                      <div className="flex justify-between text-slate-700">
                        <span>Total HT :</span>
                        <span className="font-bold">{formatMoney(totalHT)}</span>
                      </div>
                      {totalTVA > 0 && (
                        <div className="flex justify-between text-slate-700">
                          <span>Total TVA :</span>
                          <span className="font-bold">{formatMoney(totalTVA)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-900 pt-2 border-t font-bold text-sm">
                        <span>Total TTC :</span>
                        <span>{formatMoney(totalTTC)}</span>
                      </div>
                      {data.acompte > 0 && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Acompte versé :</span>
                          <span>- {formatMoney(data.acompte)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-blue-900 pt-2 border-t-2 border-slate-400 font-extrabold text-sm" style={{ color: activeTheme.headerColor }}>
                        <span>Net à Payer :</span>
                        <span>{formatMoney(netAPayer)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SIGNATURE BLOCK */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                  <div className="text-xs text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1">Mention légale :</p>
                    <p>Facture émise conformément au Code Général des Impôts.</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: activeTheme.headerColor }}>
                      {data.signataireTitre}
                    </p>
                    {signatureImg ? (
                      <img src={signatureImg} alt="Signature" className="h-14 ml-auto object-contain mb-1" />
                    ) : (
                      <div className="h-14 flex items-center justify-end">
                        <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "26px", color: activeTheme.headerColor }}>
                          {data.signataireNom || data.signataireTitre}
                        </span>
                      </div>
                    )}
                    {data.signataireNom && (
                      <p className="text-xs font-semibold text-slate-900">{data.signataireNom}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE QUICK EDIT BOTTOM SHEET */}
      {selectedElement && (
        <div className="mobile-quick-sheet no-print">
          <div className="quick-sheet-header">
            <span className="quick-sheet-title">
              ✏️ Éditer {selectedElement === "client" ? "le Client" : selectedElement === "emetteur" ? "l'Émetteur" : selectedElement === "signataire" ? "le Signataire" : "la Facture"}
            </span>
            <button className="quick-sheet-close" onClick={() => setSelectedElement(null)}>✕</button>
          </div>

          <div className="quick-sheet-content">
            {selectedElement === "client" && (
              <div className="input-group">
                <label>Nom du Client</label>
                <input 
                  type="text" 
                  value={data.clientNom} 
                  onChange={setField("clientNom")}
                  autoFocus
                />
              </div>
            )}

            {selectedElement === "emetteur" && (
              <div className="input-group">
                <label>Nom de l'Entreprise / Émetteur</label>
                <input 
                  type="text" 
                  value={data.emetteurNom} 
                  onChange={setField("emetteurNom")}
                  autoFocus
                />
              </div>
            )}

            {selectedElement === "signataire" && (
              <div className="grid-2">
                <div className="input-group">
                  <label>Nom du Signataire</label>
                  <input 
                    type="text" 
                    value={data.signataireNom} 
                    onChange={setField("signataireNom")}
                  />
                </div>
                <div className="input-group">
                  <label>Titre / Fonction</label>
                  <input 
                    type="text" 
                    value={data.signataireTitre} 
                    onChange={setField("signataireTitre")}
                  />
                </div>
              </div>
            )}

            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: "10px" }}
                onClick={() => setSelectedElement(null)}
              >
                ✓ Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FLOATING BOTTOM ACTION BAR */}
      <div className="mobile-bottom-bar no-print">
        <button 
          className={`mobile-bottom-btn ${mobileView === "editor" ? "active" : ""}`}
          onClick={() => { setMobileView("editor"); setSelectedElement(null); }}
        >
          <span>✏️</span>
          <span>Saisie</span>
        </button>

        <button 
          className={`mobile-bottom-btn ${mobileView === "preview" && !dragMode ? "active" : ""}`}
          onClick={() => { setMobileView("preview"); setDragMode(false); }}
        >
          <span>👁️</span>
          <span>Aperçu</span>
        </button>

        <button 
          className={`mobile-bottom-btn ${dragMode ? "active" : ""}`}
          onClick={() => { setMobileView("preview"); setDragMode(!dragMode); }}
        >
          <span>🤏</span>
          <span>{dragMode ? "Posé ✓" : "Déplacer"}</span>
        </button>

        <button 
          className="mobile-bottom-btn"
          onClick={() => {
            const nextIdx = (THEMES.indexOf(activeTheme) + 1) % THEMES.length;
            setActiveTheme(THEMES[nextIdx]);
          }}
        >
          <span>🎨</span>
          <span>Thème</span>
        </button>

        <button 
          className="mobile-bottom-btn"
          onClick={handleExportPDF}
        >
          <span>📄</span>
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  );
}
