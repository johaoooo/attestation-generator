import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getBrandKit } from "../utils/brandStore.js";
import {
  ArrowLeft, Download, RefreshCw, Building, User, Phone, Mail, Globe, MapPin, QrCode, Sparkles,
  Palette, Sliders, Printer, ShieldCheck, Check, Layout, IdCard, Upload, SlidersHorizontal, Eye, Copy, Trash2,
  Linkedin, Instagram, Facebook, Twitter, Whatsapp
} from "./Icons.jsx";

// THÈMES DE HAUTE DIRECTION D'EXPERT
const MASTER_DESIGN_THEMES = [
  {
    id: "swiss-sapphire",
    name: "💎 Bleu Saphir & Cyan",
    navy: "#0F172A",
    blue1: "#1E3A8A",
    blue2: "#2563EB",
    blue3: "#38BDF8",
    bgCard: "#FFFFFF",
    textColor: "#1E293B",
    subtextColor: "#64748B"
  },
  {
    id: "emerald-gold",
    name: "👑 Émeraude & Or Impérial",
    navy: "#022C22",
    blue1: "#065F46",
    blue2: "#D97706",
    blue3: "#FBBF24",
    bgCard: "#FFFFFF",
    textColor: "#064E3B",
    subtextColor: "#78350F"
  },
  {
    id: "carbon-titanium",
    name: "🖤 Carbone & Titane",
    navy: "#020617",
    blue1: "#1E293B",
    blue2: "#475569",
    blue3: "#94A3B8",
    bgCard: "#FFFFFF",
    textColor: "#0F172A",
    subtextColor: "#64748B"
  },
  {
    id: "bordeaux-rose",
    name: "🍷 Bordeaux & Or Rose",
    navy: "#1C050C",
    blue1: "#881337",
    blue2: "#E11D48",
    blue3: "#FB7185",
    bgCard: "#FFFFFF",
    textColor: "#4C0519",
    subtextColor: "#9F1239"
  }
];

export default function CarteVisiteGenerator({ onBack }) {
  const [brand, setBrand] = useState(getBrandKit());
  const [activeTab, setActiveTab] = useState("identity"); // identity, contacts, layout, style, qr, export
  const [cardSide, setCardSide] = useState("dual"); // recto, verso, dual
  const [activeTheme, setActiveTheme] = useState(MASTER_DESIGN_THEMES[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // DONNÉES DU TITULAIRE DE LA CARTE (AVEC TOUTES LES COORDONNÉES)
  const [holderData, setHolderData] = useState({
    fullName: "Jonh Henry",
    title: "BUSINESS MANAGER",
    companyName: brand.pmeName || "AFRIQUE INNOVATION PME",
    tagline: "",
    phone: brand.pmePhone || "+229 90 00 00 00",
    phone2: "",
    whatsapp: "+229 90 00 00 00",
    email: brand.pmeEmail || "contact@pme.bj",
    facebook: "facebook.com/jonhhenry",
    website: brand.pmeWebsite || "www.pme.bj",
    address1: "Cotonou, République du Bénin"
  });

  // RÉGLAGES D'EXPERT (PARFAITEMENT ÉQUILIBRÉS EN HAUT ET EN BAS)
  const [contentPaddingTop, setContentPaddingTop] = useState(20);
  const [contentPaddingBottom, setContentPaddingBottom] = useState(20);
  const [contentPaddingLeft, setContentPaddingLeft] = useState(24);
  const [contentWidthPercent, setContentWidthPercent] = useState(68);

  const [nameFontSize, setNameFontSize] = useState(19);
  const [titleFontSize, setTitleFontSize] = useState(10);
  const [contactFontSize, setContactFontSize] = useState(10);
  const [contactRowGap, setContactRowGap] = useState(6);
  const [contactMarginTop, setContactMarginTop] = useState(10);
  const [contactOffsetX, setContactOffsetX] = useState(0);

  const [qrPositionRight, setQrPositionRight] = useState(20);
  const [qrPositionBottom, setQrPositionBottom] = useState(18);
  const [qrSize, setQrSize] = useState(44);

  const [showQr, setShowQr] = useState(true);
  const [showFooterTagline, setShowFooterTagline] = useState(true);

  const [leftLogoImg, setLeftLogoImg] = useState(brand.pmeLogo || null);
  const [logoSize, setLogoSize] = useState(60); // Taille ajustable du logo (30px à 120px)
  const [navyColor, setNavyColor] = useState(MASTER_DESIGN_THEMES[0].navy);
  const [blue1, setBlue1] = useState(MASTER_DESIGN_THEMES[0].blue1);
  const [blue2, setBlue2] = useState(MASTER_DESIGN_THEMES[0].blue2);
  const [blue3, setBlue3] = useState(MASTER_DESIGN_THEMES[0].blue3);

  const rectoRef = useRef(null);
  const versoRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("docstudio_carte_visite_geometric");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.holderData) {
          setHolderData({
            fullName: parsed.holderData.fullName || "Jonh Henry",
            title: parsed.holderData.title || "BUSINESS MANAGER",
            companyName: parsed.holderData.companyName || "AFRIQUE INNOVATION PME",
            tagline: "",
            phone: parsed.holderData.phone || "+229 90 00 00 00",
            phone2: parsed.holderData.phone2 || "",
            whatsapp: parsed.holderData.whatsapp || "+229 90 00 00 00",
            email: parsed.holderData.email || "contact@pme.bj",
            facebook: parsed.holderData.facebook || "facebook.com/jonhhenry",
            website: parsed.holderData.website || "www.pme.bj",
            address1: parsed.holderData.address1 || "Cotonou, République du Bénin"
          });
        }
        if (parsed.showQr !== undefined) setShowQr(parsed.showQr);
        if (parsed.showFooterTagline !== undefined) setShowFooterTagline(parsed.showFooterTagline);
        if (parsed.navyColor) setNavyColor(parsed.navyColor);
        if (parsed.blue1) setBlue1(parsed.blue1);
        if (parsed.blue2) setBlue2(parsed.blue2);
        if (parsed.blue3) setBlue3(parsed.blue3);
        if (parsed.leftLogoImg) setLeftLogoImg(parsed.leftLogoImg);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveCard = () => {
    try {
      const cardState = {
        holderData,
        showQr,
        showFooterTagline,
        contentPaddingTop,
        contentPaddingBottom,
        contentPaddingLeft,
        contentWidthPercent,
        nameFontSize,
        titleFontSize,
        contactFontSize,
        contactRowGap,
        contactMarginTop,
        contactOffsetX,
        qrPositionRight,
        qrPositionBottom,
        qrSize,
        navyColor,
        blue1,
        blue2,
        blue3,
        leftLogoImg
      };
      localStorage.setItem("docstudio_carte_visite_geometric", JSON.stringify(cardState));
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefaults = () => {
    setContentPaddingTop(20);
    setContentPaddingBottom(20);
    setContentPaddingLeft(24);
    setContentWidthPercent(68);
    setNameFontSize(19);
    setTitleFontSize(10);
    setContactFontSize(10);
    setContactRowGap(7);
    setContactMarginTop(12);
    setContactOffsetX(0);
  };

  const applyTheme = (theme) => {
    setActiveTheme(theme);
    setNavyColor(theme.navy);
    setBlue1(theme.blue1);
    setBlue2(theme.blue2);
    setBlue3(theme.blue3);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLeftLogoImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const exportPng = async (refTarget, suffix) => {
    if (!refTarget.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(refTarget.current, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `Carte_Visite_PME_${holderData.fullName.replace(/\s+/g, "_")}_${suffix}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
      alert("Erreur d'exportation PNG.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportSheetPdf = async () => {
    if (!rectoRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(rectoRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("portrait", "mm", "a4");
      const cardWidth = 85;
      const cardHeight = 55;
      const marginX = 15;
      const marginY = 12;
      const gapX = 10;
      const gapY = 4;

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 2; col++) {
          const x = marginX + col * (cardWidth + gapX);
          const y = marginY + row * (cardHeight + gapY);
          pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
          
          pdf.setDrawColor(220, 220, 220);
          pdf.setLineWidth(0.1);
          pdf.rect(x, y, cardWidth, cardHeight);
        }
      }

      pdf.save(`Planche_A4_10Cartes_${holderData.fullName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Erreur PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(holderData.website || "https://www.pme.bj")}`;

  return (
    <div className="wrap relative">
      
      {/* TOAST SAUVEGARDE NOTIFICATION */}
      {showSaveToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-bold text-sm">
          <Check className="w-5 h-5" /> Carte de Visite enregistrée avec succès !
        </div>
      )}

      <div
        className="container"
        style={{
          gridTemplateColumns: isSidebarCollapsed ? "50px 1fr" : `${sidebarWidth}px 1fr`,
          transition: "grid-template-columns 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        {/* LEFT SIDEBAR EDITOR PANEL */}
        <div className="editor-panel">
          
          {/* Header */}
          <div className="editor-header flex items-center justify-between pb-3 border-b border-slate-200">
            {!isSidebarCollapsed && (
              <div>
                <h1 className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                  <button onClick={onBack} className="btn btn-secondary text-xs p-1 px-2">
                    ← Hub
                  </button>
                  Studio Cartes de Visite
                </h1>
                <p style={{ fontSize: "10.5px", color: "#64748B" }}>Normes d'entreprise ISO 85 × 55 mm</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <button
                  onClick={handleSaveCard}
                  className="btn btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow"
                >
                  💾 Enregistrer
                </button>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="btn btn-secondary text-xs"
              >
                {isSidebarCollapsed ? "▶" : "◀ Masquer"}
              </button>
            </div>
          </div>

          {!isSidebarCollapsed && (
            <>
              {/* TABS DE NAVIGATION STYLISÉS (RETOURS CSS D'ORIGINE DU PROJET) */}
              <div className="tabs">
                <button
                  onClick={() => setActiveTab("identity")}
                  className={`tab-btn ${activeTab === "identity" ? "active" : ""}`}
                >
                  👤 1. Identité
                </button>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`tab-btn ${activeTab === "contacts" ? "active" : ""}`}
                >
                  🌐 2. Contacts
                </button>
                <button
                  onClick={() => setActiveTab("layout")}
                  className={`tab-btn ${activeTab === "layout" ? "active" : ""}`}
                >
                  📐 3. Marges
                </button>
                <button
                  onClick={() => setActiveTab("style")}
                  className={`tab-btn ${activeTab === "style" ? "active" : ""}`}
                >
                  🎨 4. Thèmes
                </button>
                <button
                  onClick={() => setActiveTab("qr")}
                  className={`tab-btn ${activeTab === "qr" ? "active" : ""}`}
                >
                  📱 5. Code QR
                </button>
                <button
                  onClick={() => setActiveTab("export")}
                  className={`tab-btn ${activeTab === "export" ? "active" : ""}`}
                >
                  💾 6. Export
                </button>
              </div>

              {/* CONTENU DE L'ONGLET SÉLECTIONNÉ */}
              {activeTab === "identity" && (
                <div className="tab-content">
                  <div className="presets-box space-y-2">
                    <p style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>
                      👤 Identité du Titulaire
                    </p>
                  </div>

                  <div className="input-group">
                    <label>Nom & Prénom</label>
                    <input
                      type="text"
                      value={holderData.fullName}
                      onChange={(e) => setHolderData({ ...holderData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label>Fonction / Poste (ex: BUSINESS MANAGER)</label>
                    <input
                      type="text"
                      value={holderData.title}
                      onChange={(e) => setHolderData({ ...holderData, title: e.target.value })}
                    />
                  </div>

                  <div className="presets-box space-y-2">
                    <label className="font-bold text-xs block">Logo Officiel (Verso de la Carte)</label>
                    {leftLogoImg ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2">
                            <img src={leftLogoImg} alt="Preview Logo" style={{ height: "28px", maxHeight: "28px", objectFit: "contain" }} />
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>Logo Importé</span>
                          </div>
                          <button
                            onClick={() => setLeftLogoImg(null)}
                            className="btn btn-secondary text-xs p-1 px-2 text-red-600"
                          >
                            ✕ Retirer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="btn btn-secondary text-xs cursor-pointer w-full justify-center">
                        <Upload className="w-4 h-4" /> Importer un Logo (PNG, JPG, SVG)
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}

                    <div className="input-group pt-2">
                      <label>🔍 Taille du Logo Verso ({logoSize} px)</label>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        value={logoSize}
                        onChange={(e) => setLogoSize(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "contacts" && (
                <div className="tab-content">
                  <div className="presets-box space-y-2">
                    <p style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>
                      🌐 Coordonnées Professionnelles
                    </p>
                  </div>

                  <div className="input-group">
                    <label>📞 Téléphone Direct</label>
                    <input
                      type="text"
                      value={holderData.phone}
                      onChange={(e) => setHolderData({ ...holderData, phone: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label>✉️ Adresse Email</label>
                    <input
                      type="email"
                      value={holderData.email}
                      onChange={(e) => setHolderData({ ...holderData, email: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label>💬 WhatsApp Pro</label>
                    <input
                      type="text"
                      value={holderData.whatsapp}
                      onChange={(e) => setHolderData({ ...holderData, whatsapp: e.target.value })}
                      placeholder="+229 90 00 00 00"
                    />
                  </div>

                  <div className="input-group">
                    <label>🔵 Page Facebook</label>
                    <input
                      type="text"
                      value={holderData.facebook}
                      onChange={(e) => setHolderData({ ...holderData, facebook: e.target.value })}
                      placeholder="facebook.com/votrepage"
                    />
                  </div>

                  <div className="input-group">
                    <label>📍 Adresse Physique</label>
                    <input
                      type="text"
                      value={holderData.address1}
                      onChange={(e) => setHolderData({ ...holderData, address1: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label>🌐 Site Web / Footer</label>
                    <input
                      type="text"
                      value={holderData.website}
                      onChange={(e) => setHolderData({ ...holderData, website: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label>Affichage de la Ligne Footer</label>
                    <button
                      onClick={() => setShowFooterTagline(!showFooterTagline)}
                      className={`btn ${showFooterTagline ? "btn-primary" : "btn-secondary"} w-full justify-center`}
                    >
                      {showFooterTagline ? "Footer Visible en Bas" : "Footer Masqué"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "layout" && (
                <div className="tab-content">
                  <div className="presets-box space-y-3">
                    <div className="flex items-center justify-between">
                      <p style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>
                        📐 Marges & Équilibre Visuel
                      </p>
                      <button onClick={resetToDefaults} className="btn btn-secondary text-xs p-1 px-2">
                        <RefreshCw className="w-3 h-3" /> Reset
                      </button>
                    </div>

                    <div className="input-group">
                      <label>⬆️ Marge Supérieure (`padding-top`: {contentPaddingTop} px)</label>
                      <input
                        type="range"
                        min="12"
                        max="32"
                        value={contentPaddingTop}
                        onChange={(e) => setContentPaddingTop(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="input-group">
                      <label>⬇️ Marge Inférieure (`padding-bottom`: {contentPaddingBottom} px)</label>
                      <input
                        type="range"
                        min="12"
                        max="36"
                        value={contentPaddingBottom}
                        onChange={(e) => setContentPaddingBottom(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="input-group">
                      <label>⬅️ Marge Latérale Gauche ({contentPaddingLeft} px)</label>
                      <input
                        type="range"
                        min="16"
                        max="36"
                        value={contentPaddingLeft}
                        onChange={(e) => setContentPaddingLeft(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="input-group">
                      <label>🔤 Taille du Nom ({nameFontSize} px)</label>
                      <input
                        type="range"
                        min="16"
                        max="24"
                        value={nameFontSize}
                        onChange={(e) => setNameFontSize(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="input-group">
                      <label>↕ Espacement des Coordonnées ({contactRowGap} px)</label>
                      <input
                        type="range"
                        min="4"
                        max="14"
                        value={contactRowGap}
                        onChange={(e) => setContactRowGap(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "style" && (
                <div className="tab-content">
                  <div className="input-group">
                    <label className="font-extrabold text-xs text-slate-900">🎨 Thèmes Graphiques d'Expert</label>
                    <div className="theme-grid pt-2">
                      {MASTER_DESIGN_THEMES.map((theme) => (
                        <div
                          key={theme.id}
                          onClick={() => applyTheme(theme)}
                          className={`theme-card ${activeTheme.id === theme.id ? "active" : ""}`}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="theme-swatch" style={{ background: `linear-gradient(135deg, ${theme.blue1}, ${theme.blue2})` }} />
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: "11.5px", fontWeight: "700", color: "#0F172A", margin: 0 }} className="truncate">
                              {theme.name}
                            </p>
                          </div>
                          {activeTheme.id === theme.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="presets-box mt-4 space-y-3">
                    <p style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>
                      🎨 Couleurs Personnalisées (Charte PME)
                    </p>

                    <div className="input-group">
                      <label>Couleur Fond Nuit Verso</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={navyColor}
                          onChange={(e) => setNavyColor(e.target.value)}
                          style={{ width: "36px", height: "36px", padding: 0, border: "none", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={navyColor}
                          onChange={(e) => setNavyColor(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Couleur Gradient Ruban 1</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blue1}
                          onChange={(e) => setBlue1(e.target.value)}
                          style={{ width: "36px", height: "36px", padding: 0, border: "none", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={blue1}
                          onChange={(e) => setBlue1(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Couleur Gradient Ruban 2</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={blue2}
                          onChange={(e) => setBlue2(e.target.value)}
                          style={{ width: "36px", height: "36px", padding: 0, border: "none", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={blue2}
                          onChange={(e) => setBlue2(e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "qr" && (
                <div className="tab-content">
                  <div className="input-group">
                    <label>Affichage du Code QR</label>
                    <button
                      onClick={() => setShowQr(!showQr)}
                      className={`btn ${showQr ? "btn-primary" : "btn-secondary"} w-full justify-center`}
                    >
                      {showQr ? "Code QR Visible" : "Code QR Masqué"}
                    </button>
                  </div>

                  {showQr && (
                    <div className="input-group pt-2">
                      <label>Taille du Code QR ({qrSize} px)</label>
                      <input
                        type="range"
                        min="35"
                        max="60"
                        value={qrSize}
                        onChange={(e) => setQrSize(parseInt(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "export" && (
                <div className="tab-content">
                  <div className="presets-box space-y-2 bg-emerald-50 border-emerald-200">
                    <p style={{ fontSize: "12px", fontWeight: "800", color: "#065F46" }}>💾 Enregistrer la Carte</p>
                    <button
                      onClick={handleSaveCard}
                      className="btn btn-primary w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl shadow"
                    >
                      💾 Enregistrer la Carte
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => exportPng(rectoRef, "Recto")}
                      disabled={isExporting}
                      className="btn btn-secondary w-full justify-center"
                    >
                      <Download className="w-4 h-4" /> Export PNG (Face Recto)
                    </button>
                    <button
                      onClick={() => exportPng(versoRef, "Verso")}
                      disabled={isExporting}
                      className="btn btn-secondary w-full justify-center"
                    >
                      <Download className="w-4 h-4" /> Export PNG (Face Verso)
                    </button>
                    <button
                      onClick={exportSheetPdf}
                      disabled={isExporting}
                      className="btn btn-primary w-full justify-center p-3"
                    >
                      <Printer className="w-4 h-4" /> Planche A4 PDF (10 Cartes)
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* RIGHT PREVIEW WORKSPACE */}
        <div className="preview-area flex flex-col items-center">
          
          {/* Zoom & Side Bar */}
          <div className="zoom-bar flex items-center gap-3 mb-4">
            <label>Affichage :</label>
            <button
              onClick={() => setCardSide("recto")}
              className={`btn ${cardSide === "recto" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              Recto
            </button>
            <button
              onClick={() => setCardSide("verso")}
              className={`btn ${cardSide === "verso" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              Verso
            </button>
            <button
              onClick={() => setCardSide("dual")}
              className={`btn ${cardSide === "dual" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              Les Deux (Côte à Côte)
            </button>

            <span style={{ width: "1px", height: "16px", background: "#CBD5E1", margin: "0 4px" }} />

            <label>Zoom :</label>
            <input
              type="range"
              min="0.6"
              max="1.3"
              step="0.05"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
              style={{ width: "90px" }}
            />
            <span style={{ fontSize: "11px", fontWeight: "700" }}>{Math.round(zoomScale * 100)}%</span>
          </div>

          {/* CANVAS PREVIEW WRAPPER */}
          <div 
            className="canvas-wrapper"
            style={{ 
              transform: `scale(${zoomScale})`, 
              transformOrigin: "top center",
              display: "flex",
              flexDirection: cardSide === "dual" ? "row" : "column",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "48px",
              padding: "36px"
            }}
          >
            
            {/* FACE RECTO */}
            {(cardSide === "recto" || cardSide === "dual") && (
              <div className="flex flex-col items-center gap-2">
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Face Recto (Norme ISO 85 × 55 mm)
                </span>

                <div
                  ref={rectoRef}
                  style={{
                    width: "380px",
                    height: "216px",
                    background: "#ffffff",
                    borderRadius: "18px",
                    boxSizing: "border-box",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 22px 45px rgba(15, 30, 45, 0.25)",
                    flex: "0 0 auto",
                    fontFamily: "'Poppins', 'Montserrat', Arial, sans-serif"
                  }}
                  className="select-none text-left"
                >
                  {/* DESIGN DROITE SIMPLE ET PRO (MINIMALISME EXECUTIVE SUISSE) */}
                  {/* FOND DIAGONAL DE COULEUR PRINCIPALE */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, right: 0,
                      width: "48%", height: "100%",
                      background: navyColor,
                      clipPath: "polygon(100% 0%, 35% 0%, 100% 100%)",
                      zIndex: 1
                    }}
                  />

                  {/* BANDE BLEUE ACCENTUÉE DE SÉPARATION ÉLÉGANTE */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, right: 0,
                      width: "48%", height: "100%",
                      background: `linear-gradient(180deg, ${blue1}, ${blue2})`,
                      clipPath: "polygon(35% 0%, 30% 0%, 95% 100%, 100% 100%)",
                      zIndex: 1
                    }}
                  />

                  {/* CONTENEUR PRINCIPAL ALIGNÉ AVEC MARGES HAUTE & BASSE */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      paddingTop: `${contentPaddingTop}px`,
                      paddingBottom: `${contentPaddingBottom}px`,
                      paddingLeft: `${contentPaddingLeft}px`,
                      width: `${contentWidthPercent}%`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxSizing: "border-box"
                    }}
                  >
                    {/* EN-TÊTE : NOM EN RUBAN 3D ET POSTE EN CAPITALE */}
                    <div>
                      <div
                        style={{
                          background: `linear-gradient(90deg, ${blue1}, ${blue2})`,
                          color: "#ffffff",
                          fontSize: `${nameFontSize}px`,
                          fontWeight: "700",
                          padding: "6px 14px 6px 4px",
                          width: "96%",
                          letterSpacing: "-0.01em",
                          clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                      >
                        {holderData.fullName}
                      </div>

                      <div
                        style={{
                          borderBottom: `1.5px solid ${blue2}`,
                          width: "86%",
                          paddingBottom: "3px",
                          marginTop: "4px"
                        }}
                      >
                        <span style={{ fontSize: `${titleFontSize}px`, color: "#475569", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          {holderData.title}
                        </span>
                      </div>
                    </div>

                    {/* COORDONNÉES PROFESSIONNELLES COMPLETES - DISSOCIATION HORIZONTALE RIGIDE (ICÔNE + TEXTE SUR LA MÊME LIGNE) */}
                    <div
                      style={{
                        marginTop: `${contactMarginTop}px`,
                        transform: `translateX(${contactOffsetX}px)`,
                        transition: "transform 0.15s ease"
                      }}
                    >
                      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {/* TÉLÉPHONE */}
                        {holderData.phone && (
                          <li 
                            style={{ 
                              display: "flex", 
                              flexDirection: "row", 
                              alignItems: "center", 
                              gap: "8px", 
                              marginBottom: `${contactRowGap}px`,
                              whiteSpace: "nowrap"
                            }}
                          >
                            <div
                              style={{
                                flex: "0 0 auto",
                                width: "17px", height: "17px",
                                borderRadius: "4px",
                                background: `linear-gradient(135deg, ${blue1}, ${blue2})`,
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.14)"
                              }}
                            >
                              <Phone className="w-3 h-3 text-white shrink-0" style={{ width: "10px", height: "10px" }} />
                            </div>
                            <span style={{ fontSize: `${contactFontSize}px`, color: "#1E293B", fontWeight: "600", display: "inline-block" }}>
                              {holderData.phone}
                            </span>
                          </li>
                        )}

                        {/* EMAIL */}
                        {holderData.email && (
                          <li 
                            style={{ 
                              display: "flex", 
                              flexDirection: "row", 
                              alignItems: "center", 
                              gap: "8px", 
                              marginBottom: `${contactRowGap}px`,
                              whiteSpace: "nowrap"
                            }}
                          >
                            <div
                              style={{
                                flex: "0 0 auto",
                                width: "17px", height: "17px",
                                borderRadius: "4px",
                                background: `linear-gradient(135deg, ${blue1}, ${blue2})`,
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.14)"
                              }}
                            >
                              <Mail className="w-3 h-3 text-white shrink-0" style={{ width: "10px", height: "10px" }} />
                            </div>
                            <span style={{ fontSize: `${contactFontSize}px`, color: "#1E293B", fontWeight: "600", display: "inline-block" }}>
                              {holderData.email}
                            </span>
                          </li>
                        )}

                        {/* WHATSAPP */}
                        {holderData.whatsapp && (
                          <li 
                            style={{ 
                              display: "flex", 
                              flexDirection: "row", 
                              alignItems: "center", 
                              gap: "8px", 
                              marginBottom: `${contactRowGap}px`,
                              whiteSpace: "nowrap"
                            }}
                          >
                            <div
                              style={{
                                flex: "0 0 auto",
                                width: "17px", height: "17px",
                                borderRadius: "4px",
                                background: `linear-gradient(135deg, ${blue1}, ${blue2})`,
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.14)"
                              }}
                            >
                              <Whatsapp className="w-3 h-3 text-white shrink-0" style={{ width: "10px", height: "10px" }} />
                            </div>
                            <span style={{ fontSize: `${contactFontSize}px`, color: "#1E293B", fontWeight: "600", display: "inline-block" }}>
                              {holderData.whatsapp}
                            </span>
                          </li>
                        )}

                        {/* FACEBOOK */}
                        {holderData.facebook && (
                          <li 
                            style={{ 
                              display: "flex", 
                              flexDirection: "row", 
                              alignItems: "center", 
                              gap: "8px", 
                              marginBottom: `${contactRowGap}px`,
                              whiteSpace: "nowrap"
                            }}
                          >
                            <div
                              style={{
                                flex: "0 0 auto",
                                width: "17px", height: "17px",
                                borderRadius: "4px",
                                background: `linear-gradient(135deg, ${blue1}, ${blue2})`,
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.14)"
                              }}
                            >
                              <Facebook className="w-3 h-3 text-white shrink-0" style={{ width: "10px", height: "10px" }} />
                            </div>
                            <span style={{ fontSize: `${contactFontSize}px`, color: "#1E293B", fontWeight: "600", display: "inline-block" }}>
                              {holderData.facebook}
                            </span>
                          </li>
                        )}

                        {/* ADRESSE */}
                        {holderData.address1 && (
                          <li 
                            style={{ 
                              display: "flex", 
                              flexDirection: "row", 
                              alignItems: "center", 
                              gap: "8px", 
                              marginBottom: `${contactRowGap}px`,
                              whiteSpace: "nowrap"
                            }}
                          >
                            <div
                              style={{
                                flex: "0 0 auto",
                                width: "17px", height: "17px",
                                borderRadius: "4px",
                                background: `linear-gradient(135deg, ${blue1}, ${blue2})`,
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.14)"
                              }}
                            >
                              <MapPin className="w-3 h-3 text-white shrink-0" style={{ width: "10px", height: "10px" }} />
                            </div>
                            <span style={{ fontSize: `${contactFontSize}px`, color: "#1E293B", fontWeight: "600", display: "inline-block" }}>
                              {holderData.address1}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* FOOTER : SITE WEB */}
                    {showFooterTagline && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <Globe className="w-3 h-3 shrink-0" style={{ width: "11px", height: "11px", color: blue1 }} />
                        <span style={{ fontSize: "9.5px", fontWeight: "700", color: blue1, letterSpacing: "0.08em", textTransform: "lowercase" }}>
                          {holderData.website}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* CODE QR ANCRÉ EN BAS À DROITE */}
                  {showQr && (
                    <div
                      style={{
                        position: "absolute",
                        right: `${qrPositionRight}px`,
                        bottom: `${qrPositionBottom}px`,
                        width: `${qrSize}px`,
                        height: `${qrSize}px`,
                        zIndex: 3,
                        background: "#ffffff",
                        padding: "3px",
                        borderRadius: "6px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                        overflow: "hidden"
                      }}
                    >
                      <img
                        src={qrImageUrl}
                        alt="Code QR"
                        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* FACE VERSO */}
            {(cardSide === "verso" || cardSide === "dual") && (
              <div className="flex flex-col items-center gap-2">
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Face Verso (Identité de Marque)
                </span>

                <div
                  ref={versoRef}
                  style={{
                    width: "380px",
                    height: "216px",
                    background: navyColor,
                    borderRadius: "18px",
                    boxSizing: "border-box",
                    boxShadow: "0 22px 45px rgba(15, 30, 45, 0.25)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                    fontFamily: "'Poppins', 'Montserrat', Arial, sans-serif"
                  }}
                  className="select-none text-center"
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: "auto",
                      width: "42%", height: "100%",
                      background: navyColor,
                      clipPath: "polygon(0 0, 62% 0, 100% 100%, 0 100%)"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: 0, right: 0, left: "auto",
                      width: "42%", height: "100%",
                      background: navyColor,
                      clipPath: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "auto", bottom: 0, left: 0, right: "auto",
                      width: "42%", height: "100%",
                      background: `linear-gradient(135deg, ${blue2}, ${blue1})`,
                      clipPath: "polygon(0 0, 62% 100%, 0 100%)"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "auto", bottom: 0, right: 0, left: "auto",
                      width: "42%", height: "100%",
                      background: `linear-gradient(135deg, ${blue1}, ${blue2})`,
                      clipPath: "polygon(38% 100%, 100% 0, 100% 100%)"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      margin: "auto",
                      width: "64%", height: "94%",
                      background: "#ffffff",
                      clipPath: "polygon(18% 0, 82% 0, 100% 50%, 82% 100%, 18% 100%, 0% 50%)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.14)",
                      zIndex: 1
                    }}
                  />

                  {/* LOGO CENTRAL ET SLOGAN PME (GARANTIE DE VISIBILITÉ NIVEAU 10) */}
                  <div 
                    style={{
                      position: "relative",
                      zIndex: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "0 24px"
                    }}
                  >
                    {leftLogoImg ? (
                      <img 
                        src={leftLogoImg} 
                        alt="Logo Verso" 
                        style={{ 
                          maxHeight: `${logoSize}px`, 
                          maxWidth: `${logoSize * 3}px`, 
                          objectFit: "contain",
                          display: "block",
                          transition: "all 0.15s ease"
                        }} 
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <svg width={Math.round(logoSize * 0.45)} height={Math.round(logoSize * 0.45)} viewBox="0 0 40 40">
                          <polygon points="4,34 16,4 22,4 10,34" fill={navyColor} />
                          <polygon points="20,34 30,10 36,10 26,34" fill={blue2} />
                        </svg>
                        <span style={{ fontSize: `${Math.round(logoSize * 0.35)}px`, fontWeight: "800", letterSpacing: "1px", color: navyColor }}>
                          {(holderData.companyName || "PME").split(" ")[0]}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
