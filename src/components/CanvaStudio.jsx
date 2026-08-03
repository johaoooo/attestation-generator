import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getBrandKit } from "../utils/brandStore.js";
import {
  Layers, Palette, Type, ImageIcon, Sparkles, Download, ArrowLeft,
  Plus, Trash2, Sliders, ShieldCheck, Check, RefreshCw, QrCode,
  Copy, Eye, Building, Star, PenTool, Phone, Globe, Whatsapp, MessageCircle,
  ArrowUp, ArrowDown, ChevronUp, ChevronDown, FilePlus, Maximize2, Smartphone, Monitor
} from "./Icons.jsx";

// Formats prédéfinis pour le marketeur PME
const CANVA_FORMATS = [
  { id: "affiche_a4_portrait", label: "Affiche Événement A4 (Portrait)", width: 595, height: 842, ratio: "A4", desc: "210 × 297 mm", defaultOri: "portrait" },
  { id: "affiche_a4_landscape", label: "Affiche Événement A4 (Paysage)", width: 842, height: 595, ratio: "A4", desc: "297 × 210 mm", defaultOri: "landscape" },
  { id: "flyer_a5_portrait", label: "Flyer Promo A5 (Portrait)", width: 500, height: 707, ratio: "A5", desc: "148 × 210 mm", defaultOri: "portrait" },
  { id: "flyer_a5_landscape", label: "Flyer Promo A5 (Paysage)", width: 707, height: 500, ratio: "A5", desc: "210 × 148 mm", defaultOri: "landscape" },
  { id: "insta_story", label: "Story WhatsApp / Insta (Portrait 9:16)", width: 450, height: 800, ratio: "9:16", desc: "1080 × 1920 px", defaultOri: "portrait" },
  { id: "insta_post", label: "Post Carré Instagram / FB (1:1)", width: 600, height: 600, ratio: "1:1", desc: "1080 × 1080 px", defaultOri: "portrait" },
  { id: "banner_web", label: "Bannière Web / LinkedIn (Paysage 16:9)", width: 800, height: 450, ratio: "16:9", desc: "1200 × 675 px", defaultOri: "landscape" },
  { id: "carte_visite", label: "Carte de Visite PME (Paysage)", width: 600, height: 380, ratio: "Carte", desc: "85 × 55 mm", defaultOri: "landscape" }
];

// Presets de Modèles PME Pro
const TEMPLATES_PRESETS = [
  {
    id: "lancement_produit",
    name: "🚀 Lancement de Produit PME",
    format: "insta_post",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    elements: [
      { id: "el-1", type: "badge", text: "✨ NOUVEAU PRODUIT PME", x: 170, y: 40, color: "#ffffff", bg: "#d97706", fontSize: 13, fontWeight: "800", rotation: 0, opacity: 1 },
      { id: "el-2", type: "title", text: "REVOLUTIONNEZ VOTRE BUSINESS", x: 40, y: 110, color: "#ffffff", fontSize: 26, fontWeight: "900", fontFamily: "Plus Jakarta Sans", align: "center", rotation: 0, opacity: 1, hasShadow: true },
      { id: "el-3", type: "text", text: "Solution complète conçue par des experts PME", x: 60, y: 180, color: "#94a3b8", fontSize: 14, fontWeight: "500", fontFamily: "Plus Jakarta Sans", align: "center", rotation: 0, opacity: 1 },
      { id: "el-4", type: "badge", text: "⚡ -30% DE RÉDUCTION PROMO", x: 180, y: 240, color: "#ffffff", bg: "#dc2626", fontSize: 15, fontWeight: "800", rotation: -3, opacity: 1 },
      { id: "el-5", type: "cta_whatsapp", text: "Contactez-nous dès aujourd'hui !", x: 130, y: 460, color: "#ffffff", bg: "#25D366", fontSize: 15, fontWeight: "700", fontFamily: "Plus Jakarta Sans", rotation: 0, opacity: 1 },
      { id: "el-6", type: "brand_logo", x: 40, y: 520, width: 120, height: 50 },
      { id: "el-7", type: "qrcode", text: "https://votre-pme.bj", x: 460, y: 480, size: 90 }
    ]
  },
  {
    id: "solde_promo",
    name: "🔥 Offre Spéciale & Promo PME",
    format: "insta_story",
    bg: "linear-gradient(180deg, #1e3a8a 0%, #0284c7 100%)",
    elements: [
      { id: "el-10", type: "badge", text: "OFFRE LIMITÉE PME", x: 120, y: 50, color: "#ffffff", bg: "#dc2626", fontSize: 14, fontWeight: "800" },
      { id: "el-11", type: "title", text: "GRANDES SOLDES", x: 40, y: 150, color: "#fef08a", fontSize: 32, fontWeight: "900", fontFamily: "Montserrat", hasShadow: true },
      { id: "el-12", type: "badge", text: "-50% SUR TOUT LE STOCK", x: 100, y: 260, color: "#ffffff", bg: "#ef4444", fontSize: 18, fontWeight: "900" },
      { id: "el-13", type: "text", text: "Valable jusqu'au 31 du mois !", x: 80, y: 500, color: "#ffffff", fontSize: 16, fontWeight: "600" },
      { id: "el-14", type: "brand_stamp", x: 175, y: 580, size: 100 }
    ]
  },
  {
    id: "atelier_formation",
    name: "🎓 Atelier & Masterclass PME",
    format: "affiche_a4_portrait",
    bg: "#ffffff",
    elements: [
      { id: "el-20", type: "title", text: "ATELIER DE FORMATION PRATIQUE PME", x: 50, y: 60, color: "#1e3a8a", fontSize: 24, fontWeight: "800", fontFamily: "Plus Jakarta Sans" },
      { id: "el-21", type: "text", text: "Maîtrisez les Stratégies Marketing & Digitales", x: 50, y: 120, color: "#475569", fontSize: 16, fontWeight: "600" },
      { id: "el-22", type: "badge", text: "ATTESTATION REMISE A CHACUN", x: 50, y: 180, color: "#1e3a8a", bg: "#dbeafe", fontSize: 14, fontWeight: "700" },
      { id: "el-23", type: "badge", text: "INSCRIPTIONS OUVERTES", x: 180, y: 350, color: "#ffffff", bg: "#f59e0b", fontSize: 16, fontWeight: "800" },
      { id: "el-24", type: "brand_logo", x: 50, y: 720, width: 160, height: 60 },
      { id: "el-25", type: "brand_signature", x: 380, y: 710, width: 150, height: 70 }
    ]
  },
  {
    id: "conference_prestige",
    name: "👑 Conférence & Gala d'Excellence",
    format: "affiche_a4_landscape",
    bg: "linear-gradient(135deg, #0b1f4b 0%, #050b18 100%)",
    elements: [
      { id: "el-30", type: "badge", text: "ÉVÉNEMENT PRESTIGE PME", x: 280, y: 40, color: "#fbbf24", bg: "#1e293b", fontSize: 14, fontWeight: "800" },
      { id: "el-31", type: "title", text: "GRAND GALA DES ENTREPRENEURS", x: 100, y: 110, color: "#ffffff", fontSize: 30, fontWeight: "900", fontFamily: "Playfair Display", align: "center", hasShadow: true },
      { id: "el-32", type: "text", text: "Une soirée exclusive d'échanges et de networking haut de gamme", x: 160, y: 190, color: "#cbd5e1", fontSize: 16, fontWeight: "500" },
      { id: "el-33", type: "badge", text: "SÉANCES DE NETWORKING VIP", x: 260, y: 260, color: "#ffffff", bg: "#d97706", fontSize: 15, fontWeight: "800" },
      { id: "el-34", type: "brand_stamp", x: 80, y: 390, size: 110 },
      { id: "el-35", type: "cta_whatsapp", text: "Réservez votre pass VIP sur WhatsApp", x: 380, y: 410, color: "#ffffff", bg: "#25D366", fontSize: 15, fontWeight: "800" }
    ]
  }
];

export default function CanvaStudio({ onBack }) {
  const [brand, setBrand] = useState(getBrandKit());
  const [selectedFormat, setSelectedFormat] = useState(CANVA_FORMATS[0]);
  const [orientation, setOrientation] = useState("portrait"); // "portrait" | "landscape"
  const [elements, setElements] = useState(TEMPLATES_PRESETS[0].elements);
  const [canvasBg, setCanvasBg] = useState(TEMPLATES_PRESETS[0].bg);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);

  const canvasRef = useRef(null);

  // Calcul dynamique garanti de la largeur et hauteur selon le bouton Portrait / Paysage
  let canvasWidth = selectedFormat.width;
  let canvasHeight = selectedFormat.height;

  if (orientation === "landscape") {
    if (selectedFormat.width <= selectedFormat.height) {
      canvasWidth = Math.max(selectedFormat.width, selectedFormat.height);
      canvasHeight = Math.min(selectedFormat.width, selectedFormat.height);
      if (selectedFormat.width === selectedFormat.height) {
        canvasWidth = 780;
        canvasHeight = 520;
      }
    }
  } else {
    if (selectedFormat.width >= selectedFormat.height) {
      canvasWidth = Math.min(selectedFormat.width, selectedFormat.height);
      canvasHeight = Math.max(selectedFormat.width, selectedFormat.height);
      if (selectedFormat.width === selectedFormat.height) {
        canvasWidth = 600;
        canvasHeight = 600;
      }
    }
  }

  useEffect(() => {
    const handleBrandUpdate = (e) => setBrand(e.detail);
    window.addEventListener("brandKitUpdated", handleBrandUpdate);
    return () => window.removeEventListener("brandKitUpdated", handleBrandUpdate);
  }, []);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Charger une page vierge (Blanc ou Sombre)
  const handleNewBlankPage = (bg = "#ffffff") => {
    setElements([]);
    setCanvasBg(bg);
    setSelectedElementId(null);
  };

  // Charger un modèle pré-conçu
  const handleLoadPreset = (preset) => {
    const format = CANVA_FORMATS.find((f) => f.id === preset.format) || CANVA_FORMATS[0];
    setSelectedFormat(format);
    setCanvasBg(preset.bg);
    if (format.defaultOri) setOrientation(format.defaultOri);
    setElements(preset.elements.map((el) => ({ ...el, id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` })));
    setSelectedElementId(null);
  };

  // Fonctions d'Ordre des Calques (Style Photoshop)
  const bringToFront = (id) => {
    const el = elements.find((item) => item.id === id);
    if (!el) return;
    setElements([...elements.filter((item) => item.id !== id), el]);
  };

  const sendToBack = (id) => {
    const el = elements.find((item) => item.id === id);
    if (!el) return;
    setElements([el, ...elements.filter((item) => item.id !== id)]);
  };

  const moveUp = (id) => {
    const idx = elements.findIndex((item) => item.id === id);
    if (idx < elements.length - 1) {
      const copy = [...elements];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      setElements(copy);
    }
  };

  const moveDown = (id) => {
    const idx = elements.findIndex((item) => item.id === id);
    if (idx > 0) {
      const copy = [...elements];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      setElements(copy);
    }
  };

  // Ajouter un élément de texte ou CTA
  const addTextElement = (text = "Nouveau texte", type = "text", extra = {}) => {
    const newEl = {
      id: `el-${Date.now()}`,
      type,
      text,
      x: 100,
      y: 100,
      color: type === "badge" ? "#ffffff" : type === "cta_whatsapp" ? "#ffffff" : "#ffffff",
      bg: type === "badge" ? brand.pmePrimaryColor || "#2563eb" : type === "cta_whatsapp" ? "#25D366" : "transparent",
      fontSize: type === "title" ? 28 : type === "badge" ? 14 : 16,
      fontWeight: type === "title" ? "800" : "600",
      fontFamily: brand.pmeFontFamily || "Plus Jakarta Sans",
      rotation: 0,
      opacity: 1,
      hasShadow: false,
      hasOutline: false,
      ...extra
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Ajouter des visuels PME
  const addBrandAsset = (assetType) => {
    const newEl = {
      id: `el-${Date.now()}`,
      type: assetType,
      x: 150,
      y: 150,
      width: assetType === "qrcode" ? 100 : 150,
      height: assetType === "qrcode" ? 100 : 80,
      text: assetType === "qrcode" ? brand.pmeWebsite : "",
      rotation: 0,
      opacity: 1
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Upload d'image personnalisée
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImg = {
          id: `el-${Date.now()}`,
          type: "image",
          src: reader.result,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          borderRadius: 8,
          rotation: 0,
          opacity: 1
        };
        setElements([...elements, newImg]);
        setUploadedImages([...uploadedImages, reader.result]);
        setSelectedElementId(newImg.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSelectedElement = (field, value) => {
    if (!selectedElementId) return;
    setElements(
      elements.map((el) => (el.id === selectedElementId ? { ...el, [field]: value } : el))
    );
  };

  const duplicateSelectedElement = () => {
    if (!selectedElement) return;
    const duplicated = {
      ...selectedElement,
      id: `el-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20
    };
    setElements([...elements, duplicated]);
    setSelectedElementId(duplicated.id);
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setElements(elements.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const handleElementMouseDown = (e, id) => {
    e.stopPropagation();
    setSelectedElementId(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialEl = elements.find((el) => el.id === id);
    if (!initialEl) return;

    const handleMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / zoomLevel;
      const dy = (moveEvent.clientY - startY) / zoomLevel;
      setElements((prev) =>
        prev.map((el) =>
          el.id === id
            ? { ...el, x: Math.round(initialEl.x + dx), y: Math.round(initialEl.y + dy) }
            : el
        )
      );
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const exportAsImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
      });
      const link = document.createElement("a");
      link.download = `DocStudio_Visuel_PME_${selectedFormat.id}_${orientation}_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Erreur d'exportation PNG:", err);
      alert("Erreur lors de la création de l'image.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPdf = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "mm",
        format: selectedFormat.ratio === "A4" ? "a4" : [canvasWidth * 0.264, canvasHeight * 0.264]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DocStudio_Visuel_${selectedFormat.id}_${orientation}.pdf`);
    } catch (err) {
      console.error("Erreur d'exportation PDF:", err);
      alert("Erreur lors de l'exportation PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Top Header Bar */}
      <div style={{ backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "13px", fontWeight: "600", padding: "8px 14px", borderRadius: "8px", backgroundColor: "#1e293b", border: "1px solid #334155", cursor: "pointer" }}
          >
            <ArrowLeft className="w-4 h-4" /> Retour Hub
          </button>
          <div style={{ height: "20px", width: "1px", backgroundColor: "#334155" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sparkles style={{ width: "22px", height: "22px", color: "#fbbf24" }} />
            <h1 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", margin: 0 }}>
              Canva & Photoshop Studio PME <span style={{ fontSize: "12px", color: "#fbbf24", fontWeight: "600", marginLeft: "6px" }}>Pro Studio</span>
            </h1>
          </div>
        </div>

        {/* Format Selector & Export Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={selectedFormat.id}
            onChange={(e) => {
              const fmt = CANVA_FORMATS.find((f) => f.id === e.target.value);
              if (fmt) {
                setSelectedFormat(fmt);
                if (fmt.defaultOri) setOrientation(fmt.defaultOri);
              }
            }}
            style={{ backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#f8fafc", fontWeight: "600", cursor: "pointer" }}
          >
            {CANVA_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} ({f.desc})
              </option>
            ))}
          </select>

          <button
            onClick={exportAsImage}
            disabled={isExporting}
            style={{ padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, #0284c7, #2563eb)", color: "#ffffff", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
          >
            <Download className="w-4 h-4" /> Export PNG HD (Réseaux)
          </button>
          
          <button
            onClick={exportAsPdf}
            disabled={isExporting}
            style={{ padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#020617", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)" }}
          >
            <Download className="w-4 h-4" /> Export PDF Impression
          </button>
        </div>
      </div>

      {/* Main Studio Body: 3 Columns Grid */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "320px 1fr 280px", minHeight: "calc(100vh - 60px)", width: "100%", overflow: "hidden" }}>
        
        {/* LEFT PANEL: TOOLBOX & ASSETS */}
        <div style={{ backgroundColor: "#0f172a", borderRight: "1px solid #1e293b", padding: "16px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}>
          
          {/* Section 1: Page Vierge & Orientation */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Layers className="w-4 h-4" /> 1. Page Vierge & Orientation
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <button
                  onClick={() => handleNewBlankPage("#ffffff")}
                  style={{ padding: "8px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#0f172a", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <FilePlus className="w-3.5 h-3.5 text-slate-800" /> Page Blanc
                </button>
                <button
                  onClick={() => handleNewBlankPage("linear-gradient(135deg, #0f172a, #1e1b4b)")}
                  style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "8px", color: "#fbbf24", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <FilePlus className="w-3.5 h-3.5 text-amber-400" /> Page Sombre
                </button>
              </div>

              {/* Orientation Toggle Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <button
                  onClick={() => setOrientation("portrait")}
                  style={{ padding: "8px", backgroundColor: orientation === "portrait" ? "#2563eb" : "#020617", border: orientation === "portrait" ? "1px solid #3b82f6" : "1px solid #1e293b", borderRadius: "8px", color: "#ffffff", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Smartphone className="w-4 h-4" /> Mode Portrait
                </button>
                <button
                  onClick={() => setOrientation("landscape")}
                  style={{ padding: "8px", backgroundColor: orientation === "landscape" ? "#2563eb" : "#020617", border: orientation === "landscape" ? "1px solid #3b82f6" : "1px solid #1e293b", borderRadius: "8px", color: "#ffffff", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Monitor className="w-4 h-4" /> Mode Paysage
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Modèles PME Prêts à l'Emploi */}
          <div style={{ paddingTop: "14px", borderTop: "1px solid #1e293b" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Sparkles className="w-4 h-4" /> 2. Modèles PME Prêts à l'Emploi
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TEMPLATES_PRESETS.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleLoadPreset(tmpl)}
                  style={{ width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", backgroundColor: "#020617", border: "1px solid #1e293b", color: "#e2e8f0", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                >
                  <span>{tmpl.name}</span>
                  <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: "700" }}>Charger</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Textes, Badges & Boutons CTA */}
          <div style={{ paddingTop: "14px", borderTop: "1px solid #1e293b" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Type className="w-4 h-4" /> 3. Textes, Badges & Boutons CTA
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                onClick={() => addTextElement("GRAND TITRE IMPACTANT", "title")}
                style={{ padding: "10px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Plus className="w-3.5 h-3.5 text-sky-400" /> Grand Titre
              </button>
              <button
                onClick={() => addTextElement("Sous-titre descriptif", "text")}
                style={{ padding: "10px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" /> Paragraphe
              </button>
              <button
                onClick={() => addTextElement("OFFRE SPÉCIALE PME", "badge")}
                style={{ gridColumn: "span 2", padding: "10px", backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "8px", fontSize: "12px", fontWeight: "800", color: "#fbbf24", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Star className="w-4 h-4 text-amber-400" /> Badge d'Annonce Promo
              </button>
              <button
                onClick={() => addTextElement("WhatsApp: +229 90 00 00 00", "cta_whatsapp")}
                style={{ gridColumn: "span 2", padding: "10px", backgroundColor: "#25D366", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "800", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <Whatsapp className="w-4 h-4 text-white" /> Bouton Contact WhatsApp
              </button>
              <button
                onClick={() => addTextElement("Appeler: +229 97 00 00 00", "badge", { bg: "#2563eb", color: "#ffffff" })}
                style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "11px", fontWeight: "700", color: "#60a5fa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Appel
              </button>
              <button
                onClick={() => addTextElement("Visitez: www.ma-pme.bj", "badge", { bg: "#0f172a", color: "#f8fafc" })}
                style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "11px", fontWeight: "700", color: "#c084fc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" /> Site Web
              </button>
            </div>
          </div>

          {/* Section 4: Éléments PME */}
          <div style={{ paddingTop: "14px", borderTop: "1px solid #1e293b" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#34d399", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Building className="w-4 h-4" /> 4. Éléments PME ({brand.pmeName})
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => addBrandAsset("brand_logo")}
                style={{ width: "100%", padding: "10px 12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <span>Insérer Logo PME</span>
                <span style={{ fontSize: "10px", color: "#34d399", fontWeight: "700" }}>+ Logo</span>
              </button>
              <button
                onClick={() => addBrandAsset("brand_stamp")}
                style={{ width: "100%", padding: "10px 12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <span>Insérer Sceau / Tampon</span>
                <span style={{ fontSize: "10px", color: "#fbbf24", fontWeight: "700" }}>+ Tampon</span>
              </button>
              <button
                onClick={() => addBrandAsset("brand_signature")}
                style={{ width: "100%", padding: "10px 12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <span>Insérer Signature Direction</span>
                <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: "700" }}>+ Signature</span>
              </button>
              <button
                onClick={() => addBrandAsset("qrcode")}
                style={{ width: "100%", padding: "10px 12px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <span>Générer QR Code Dynamique</span>
                <QrCode style={{ width: "16px", height: "16px", color: "#c084fc" }} />
              </button>
            </div>
          </div>

          {/* Section 5: Photos & Media */}
          <div style={{ paddingTop: "14px", borderTop: "1px solid #1e293b" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#c084fc", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <ImageIcon className="w-4 h-4" /> 5. Images & Photos Produit
            </label>
            <label style={{ width: "100%", cursor: "pointer", backgroundColor: "#020617", border: "1.5px dashed #334155", padding: "14px", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", textAlign: "center" }}>
              <ImageIcon style={{ width: "24px", height: "24px", color: "#94a3b8" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>Importer une photo produit</span>
              <span style={{ fontSize: "10px", color: "#64748b" }}>PNG, JPG, WebP</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </label>
          </div>

          {/* Section 6: Background Canvas Style */}
          <div style={{ paddingTop: "14px", borderTop: "1px solid #1e293b" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Palette className="w-4 h-4" /> 6. Fond du Visuel (Gradients)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {[
                { label: "Sombre", bg: "linear-gradient(135deg, #0f172a, #1e1b4b)" },
                { label: "Blanc", bg: "#ffffff" },
                { label: "Bleu Marine", bg: "linear-gradient(135deg, #0b1f4b, #1e3a8a)" },
                { label: "Doré", bg: "linear-gradient(135deg, #f59e0b, #78350f)" },
                { label: "Émeraude", bg: "linear-gradient(135deg, #064e3b, #047857)" },
                { label: "Cyberpunk", bg: "linear-gradient(135deg, #4c1d95, #db2777)" },
                { label: "Coucher Soleil", bg: "linear-gradient(135deg, #9a3412, #ea580c)" },
                { label: "Marbre Gris", bg: "linear-gradient(135deg, #334155, #0f172a)" }
              ].map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => setCanvasBg(b.bg)}
                  style={{ background: b.bg, height: "36px", borderRadius: "8px", border: "1px solid #334155", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
                  title={b.label}
                />
              ))}
            </div>
          </div>

        </div>

        {/* CENTER PANEL: INTERACTIVE CANVAS WORKSPACE */}
        <div style={{ backgroundColor: "#030712", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "auto" }}>
          
          {/* Zoom & Format Info Controls */}
          <div style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "20px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", zIndex: 30 }}>
            <span style={{ color: "#38bdf8", fontWeight: "700" }}>{orientation === "landscape" ? "↔️ Mode Paysage (Horizontal)" : "↕️ Mode Portrait (Vertical)"} ({canvasWidth}×{canvasHeight}px)</span>
            <span style={{ color: "#94a3b8", fontWeight: "600" }}>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} style={{ background: "none", border: "none", color: "#f8fafc", cursor: "pointer", fontWeight: "bold" }}>-</button>
            <button onClick={() => setZoomLevel(1)} style={{ background: "none", border: "none", color: "#fbbf24", cursor: "pointer", fontWeight: "bold" }}>100%</button>
            <button onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))} style={{ background: "none", border: "none", color: "#f8fafc", cursor: "pointer", fontWeight: "bold" }}>+</button>
          </div>

          {/* THE CANVAS CONTAINER */}
          <div
            ref={canvasRef}
            onClick={() => setSelectedElementId(null)}
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              background: canvasBg,
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #334155",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              transition: "width 0.3s ease, height 0.3s ease",
              userSelect: "none"
            }}
          >
            {elements.map((el) => {
              const isSelected = el.id === selectedElementId;

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                  style={{
                    position: "absolute",
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    opacity: el.opacity ?? 1,
                    transform: `rotate(${el.rotation || 0}deg)`,
                    cursor: "move",
                    outline: isSelected ? "2px solid #fbbf24" : "none",
                    outlineOffset: "2px",
                    borderRadius: "4px",
                    zIndex: isSelected ? 40 : 10
                  }}
                >
                  {el.type === "title" || el.type === "text" ? (
                    <div
                      style={{
                        color: el.color || "#ffffff",
                        fontSize: `${el.fontSize}px`,
                        fontWeight: el.fontWeight || "600",
                        fontFamily: el.fontFamily || "Plus Jakarta Sans",
                        textAlign: el.align || "left",
                        textShadow: el.hasShadow ? "0 4px 12px rgba(0,0,0,0.8)" : "none",
                        WebkitTextStroke: el.hasOutline ? "1px #000000" : "none",
                        padding: "4px 8px",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.25"
                      }}
                    >
                      {el.text}
                    </div>
                  ) : el.type === "badge" || el.type === "cta_whatsapp" ? (
                    <div
                      style={{
                        color: el.color || "#ffffff",
                        background: el.bg || (el.type === "cta_whatsapp" ? "#25D366" : "#d97706"),
                        fontSize: `${el.fontSize}px`,
                        fontWeight: el.fontWeight || "800",
                        padding: "8px 16px",
                        borderRadius: "30px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      {el.type === "cta_whatsapp" && <Whatsapp className="w-4 h-4 text-white" />}
                      {el.text}
                    </div>
                  ) : el.type === "brand_logo" ? (
                    brand.pmeLogo ? (
                      <img src={brand.pmeLogo} alt="Logo PME" style={{ width: `${el.width || 120}px`, height: "auto" }} />
                    ) : (
                      <div style={{ color: brand.pmePrimaryColor || "#2563eb", fontWeight: "900", fontSize: "18px", backgroundColor: "rgba(255,255,255,0.9)", padding: "8px 16px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
                        {brand.pmeName}
                      </div>
                    )
                  ) : el.type === "brand_stamp" ? (
                    brand.pmeStamp ? (
                      <img src={brand.pmeStamp} alt="Sceau PME" style={{ width: `${el.width || 120}px` }} />
                    ) : (
                      <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "3px double #d97706", backgroundColor: "#fffbeb", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", textAlign: "center", padding: "8px" }}>
                        {brand.pmeName.substr(0, 15)}
                      </div>
                    )
                  ) : el.type === "brand_signature" ? (
                    brand.pmeSignature ? (
                      <img src={brand.pmeSignature} alt="Signature PME" style={{ width: `${el.width || 140}px` }} />
                    ) : (
                      <div style={{ fontFamily: "serif", fontStyle: "italic", color: "#d97706", fontWeight: "bold", borderBottom: "1px solid #d97706", padding: "4px 12px" }}>
                        Le Directeur Général
                      </div>
                    )
                  ) : el.type === "qrcode" ? (
                    <div style={{ backgroundColor: "#ffffff", padding: "8px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", textAlign: "center" }}>
                      <div style={{ width: "64px", height: "64px", backgroundColor: "#0f172a", color: "#ffffff", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: "monospace" }}>
                        [QR CODE]
                      </div>
                      <span style={{ fontSize: "9px", color: "#475569", display: "block", marginTop: "4px" }}>{brand.pmeWebsite}</span>
                    </div>
                  ) : el.type === "image" ? (
                    <img
                      src={el.src}
                      alt="Media"
                      style={{
                        width: `${el.width || 200}px`,
                        height: `${el.height || 200}px`,
                        borderRadius: `${el.borderRadius || 0}px`,
                        objectFit: "cover",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.3)"
                      }}
                    />
                  ) : null}

                  {isSelected && (
                    <div style={{ position: "absolute", top: "-22px", right: "-4px", backgroundColor: "#fbbf24", color: "#020617", fontSize: "9px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", pointerEvents: "none" }}>
                      Sélectionné
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT PANEL: SELECTED ELEMENT INSPECTOR & PHOTOSHOP LAYERS */}
        <div style={{ backgroundColor: "#0f172a", borderLeft: "1px solid #1e293b", padding: "16px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}>
          
          <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sliders className="w-4 h-4" /> Propriétés & Options du Calque
          </label>

          {selectedElement ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "12px" }}>
              
              {/* Text content input if applicable */}
              {(selectedElement.type === "text" || selectedElement.type === "title" || selectedElement.type === "badge" || selectedElement.type === "cta_whatsapp") && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ color: "#94a3b8", fontWeight: "600" }}>Texte du calque</label>
                  <textarea
                    rows={2}
                    value={selectedElement.text}
                    onChange={(e) => updateSelectedElement("text", e.target.value)}
                    style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px", color: "#f8fafc", fontSize: "12px" }}
                  />
                </div>
              )}

              {/* Color pickers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Couleur Texte</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#020617", padding: "6px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                    <input
                      type="color"
                      value={selectedElement.color || "#ffffff"}
                      onChange={(e) => updateSelectedElement("color", e.target.value)}
                      style={{ width: "24px", height: "24px", border: "none", cursor: "pointer", background: "none" }}
                    />
                    <span style={{ fontSize: "10px", color: "#cbd5e1", fontFamily: "monospace" }}>{selectedElement.color}</span>
                  </div>
                </div>

                {selectedElement.bg && (
                  <div>
                    <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Fond Badge</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#020617", padding: "6px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                      <input
                        type="color"
                        value={selectedElement.bg || "#2563eb"}
                        onChange={(e) => updateSelectedElement("bg", e.target.value)}
                        style={{ width: "24px", height: "24px", border: "none", cursor: "pointer", background: "none" }}
                      />
                      <span style={{ fontSize: "10px", color: "#cbd5e1", fontFamily: "monospace" }}>{selectedElement.bg}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Font Family & Weight Selector */}
              {(selectedElement.type === "text" || selectedElement.type === "title" || selectedElement.type === "badge") && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Police</label>
                    <select
                      value={selectedElement.fontFamily || "Plus Jakarta Sans"}
                      onChange={(e) => updateSelectedElement("fontFamily", e.target.value)}
                      style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px", color: "#f8fafc", fontSize: "11px" }}
                    >
                      <option value="Plus Jakarta Sans">Jakarta Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Alex Brush">Alex Brush</option>
                      <option value="Cinzel">Cinzel</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Épaisseur</label>
                    <select
                      value={selectedElement.fontWeight || "600"}
                      onChange={(e) => updateSelectedElement("fontWeight", e.target.value)}
                      style={{ width: "100%", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px", color: "#f8fafc", fontSize: "11px" }}
                    >
                      <option value="400">Normal (400)</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="800">Bold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Font Size & Rotation */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Taille ({selectedElement.fontSize || 16}px)</label>
                  <input
                    type="range"
                    min="10"
                    max="96"
                    value={selectedElement.fontSize || 16}
                    onChange={(e) => updateSelectedElement("fontSize", parseInt(e.target.value))}
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>

                <div>
                  <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Rotation ({selectedElement.rotation || 0}°)</label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={selectedElement.rotation || 0}
                    onChange={(e) => updateSelectedElement("rotation", parseInt(e.target.value))}
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Layer Ordering (Photoshop Style) */}
              <div style={{ paddingTop: "10px", borderTop: "1px solid #1e293b" }}>
                <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "6px" }}>Ordre des Calques (Photoshop)</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
                  <button
                    onClick={() => bringToFront(selectedElement.id)}
                    style={{ padding: "6px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", fontSize: "10px", color: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}
                    title="Mettre au tout premier plan"
                  >
                    <ChevronUp className="w-3 h-3 text-amber-400" /> Top
                  </button>
                  <button
                    onClick={() => moveUp(selectedElement.id)}
                    style={{ padding: "6px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", fontSize: "10px", color: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}
                    title="Monter d'un rang"
                  >
                    <ArrowUp className="w-3 h-3 text-sky-400" /> Monter
                  </button>
                  <button
                    onClick={() => moveDown(selectedElement.id)}
                    style={{ padding: "6px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", fontSize: "10px", color: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}
                    title="Descendre d'un rang"
                  >
                    <ArrowDown className="w-3 h-3 text-slate-400" /> Desc.
                  </button>
                  <button
                    onClick={() => sendToBack(selectedElement.id)}
                    style={{ padding: "6px", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "6px", fontSize: "10px", color: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}
                    title="Mettre à l'arrière-plan"
                  >
                    <ChevronDown className="w-3 h-3 text-slate-500" /> Fond
                  </button>
                </div>
              </div>

              {/* Opacity Slider */}
              <div>
                <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Opacité ({Math.round((selectedElement.opacity ?? 1) * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={selectedElement.opacity ?? 1}
                  onChange={(e) => updateSelectedElement("opacity", parseFloat(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Text Effects */}
              {(selectedElement.type === "text" || selectedElement.type === "title" || selectedElement.type === "badge" || selectedElement.type === "cta_whatsapp") && (
                <div style={{ paddingTop: "10px", borderTop: "1px solid #1e293b" }}>
                  <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "6px" }}>Effets de Texte (Canva Pro)</label>
                  <div style={{ display: "flex", gap: "14px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#cbd5e1" }}>
                      <input
                        type="checkbox"
                        checked={!!selectedElement.hasShadow}
                        onChange={(e) => updateSelectedElement("hasShadow", e.target.checked)}
                      />
                      <span>Ombre 3D</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#cbd5e1" }}>
                      <input
                        type="checkbox"
                        checked={!!selectedElement.hasOutline}
                        onChange={(e) => updateSelectedElement("hasOutline", e.target.checked)}
                      />
                      <span>Contour Liseré</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons: Duplicate & Delete */}
              <div style={{ paddingTop: "10px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <button
                  onClick={duplicateSelectedElement}
                  style={{ padding: "8px 12px", borderRadius: "6px", backgroundColor: "#1e293b", color: "#e2e8f0", border: "none", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                >
                  <Copy className="w-3.5 h-3.5" /> Dupliquer
                </button>
                <button
                  onClick={deleteSelectedElement}
                  style={{ padding: "8px 12px", borderRadius: "6px", backgroundColor: "rgba(244, 63, 94, 0.15)", color: "#fb7185", border: "none", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>

            </div>
          ) : (
            <div style={{ padding: "14px", backgroundColor: "rgba(2, 6, 23, 0.6)", border: "1px solid #1e293b", borderRadius: "10px", textAlign: "center", color: "#64748b", fontSize: "12px" }}>
              Cliquez sur n'importe quel texte ou élément sur l'affiche pour ajuster sa couleur, sa taille, son opacité et son ordre de calque.
            </div>
          )}

          {/* Layers List */}
          <div style={{ paddingTop: "14px", borderTop: "1px solid #1e293b" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Layers className="w-4 h-4" /> Liste des Calques ({elements.length})
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
              {elements.map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    backgroundColor: el.id === selectedElementId ? "rgba(245, 158, 11, 0.15)" : "#020617",
                    border: el.id === selectedElementId ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid #1e293b",
                    color: el.id === selectedElementId ? "#fbbf24" : "#cbd5e1"
                  }}
                >
                  <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "160px" }}>
                    {el.type === "badge" ? "Badge: " + el.text : el.type === "title" ? "Titre: " + el.text : el.type === "brand_logo" ? "Logo PME" : el.type === "brand_stamp" ? "Tampon Officiel" : (el.text || el.type)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setElements(elements.filter((item) => item.id !== el.id));
                    }}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
