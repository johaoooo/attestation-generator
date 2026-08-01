import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDFModule, { jsPDF as jsPDFNamed } from "jspdf";

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDateFR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MOIS[m - 1]} ${y}`;
}

const DEFAULT_DATA = {
  title: "Attestation",
  introText: "Je soussignée Mme TOSSA Afiavi Gbessito Honorine, atteste que :",
  destinataire: "Mme / M. [Nom du Bénéficiaire]",
  bodyText: "a participé avec assiduité aux formations Macramé et Teinture de pagne",
  partnershipText: "Organisé par l'ONG ESPOIR ET NATURE en partenariat avec la Maison AFI COLLECTION du Bénin.",
  closingText: "En foi de quoi la présente attestation lui est délivrée pour servir et valoir ce que de droit.",
  villeDelivrance: "Houegbo",
  dateDelivrance: "2026-07-31",
  numero: "AP-2026-0104",
  signataire: "Le Directeur",
  fonction: "(ONG ESPOIR ET NATURE)",
  signataire2: "La Directrice",
  fonction2: "(Maison AFI COLLECTION du Bénin)",
};

const THEMES = [
  {
    id: "classic-gold",
    name: "Or Prestigieux",
    bg: "#FAF6EE",
    border: "#C59B27",
    borderSoft: "#EAD49B",
    primary: "#1B2430",
    accent: "#8B263E",
    gold: "#B8860B",
    sealBg: "#8B263E",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FAF6EE",
  },
  {
    id: "emerald-royal",
    name: "Émeraude Royale",
    bg: "#F4F8F5",
    border: "#1B4D3E",
    borderSoft: "#86BBA6",
    primary: "#0B2B22",
    accent: "#C59B27",
    gold: "#C59B27",
    sealBg: "#1B4D3E",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#F4F8F5",
  },
  {
    id: "midnight-dark",
    name: "Nuit Luxe (Sombre)",
    bg: "#0B1329",
    border: "#D4AF37",
    borderSoft: "#524316",
    primary: "#F8FAFC",
    accent: "#E2E8F0",
    gold: "#D4AF37",
    sealBg: "#991B1B",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#0B1329",
  },
  {
    id: "ruby-bordeaux",
    name: "Bordeaux Saphir",
    bg: "#FDF8F5",
    border: "#581820",
    borderSoft: "#D9A0A6",
    primary: "#2C0D11",
    accent: "#B8860B",
    gold: "#B8860B",
    sealBg: "#581820",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FDF8F5",
  },
  {
    id: "sapphire-blue",
    name: "Bleu Saphir & Or",
    bg: "#F0F4F8",
    border: "#0F2942",
    borderSoft: "#8CA2B8",
    primary: "#0A192F",
    accent: "#C59B27",
    gold: "#C59B27",
    sealBg: "#0F2942",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#F0F4F8",
  },
  {
    id: "rose-gold",
    name: "Rose Poudré & Or Rose",
    bg: "#FAF4F4",
    border: "#B76E79",
    borderSoft: "#E8C5C8",
    primary: "#3D2326",
    accent: "#B76E79",
    gold: "#B76E79",
    sealBg: "#B76E79",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FAF4F4",
  },
  {
    id: "vintage-parchment",
    name: "Parchemin Vintage",
    bg: "#F7F0DF",
    border: "#6B4C29",
    borderSoft: "#C9B293",
    primary: "#362413",
    accent: "#8C4A1A",
    gold: "#A8763E",
    sealBg: "#8C4A1A",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#F7F0DF",
  },
  {
    id: "modern-minimal",
    name: "Minimal Tech",
    bg: "#FFFFFF",
    border: "#1E293B",
    borderSoft: "#CBD5E1",
    primary: "#0F172A",
    accent: "#2563EB",
    gold: "#D97706",
    sealBg: "#1E293B",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FFFFFF",
  }
];

const FONTS_OPTIONS = [
  { label: "Great Vibes (Calligraphie Majestueuse)", value: "'Great Vibes', cursive" },
  { label: "Alex Brush (Calligraphie Fine)", value: "'Alex Brush', cursive" },
  { label: "Cinzel (Gravure Impériale)", value: "'Cinzel', serif" },
  { label: "Cormorant Garamond (Classique Prestige)", value: "'Cormorant Garamond', serif" },
  { label: "Playfair Display (Élégant Moderne)", value: "'Playfair Display', serif" },
  { label: "Times New Roman (Standard)", value: "'Times New Roman', Times, serif" },
  { label: "Montserrat (Moderne Épuré)", value: "'Montserrat', sans-serif" },
  { label: "Plus Jakarta Sans (Moderne Sans)", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Monospace (Police Chiffrée)", value: "monospace" },
];

export default function AttestationFormation({ onBack }) {
  const [data, setData] = useState({ ...DEFAULT_DATA });

  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [activeTab, setActiveTab] = useState("content");
  const [pageFormat, setPageFormat] = useState("landscape");
  const [sealType, setSealType] = useState("wax");
  const [watermark, setWatermark] = useState("rosace");
  
  // Responsive Zoom scale
  const [zoomScale, setZoomScale] = useState(0.8);

  // Sidebar Resize and Collapse States
  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Save Toast Feedback
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Logos (Haut gauche & droit)
  const [leftLogoImg, setLeftLogoImg] = useState(null);
  const [leftLogoSize, setLeftLogoSize] = useState(75);
  const [rightLogoImg, setRightLogoImg] = useState(null);
  const [rightLogoSize, setRightLogoSize] = useState(75);

  // Double Signatories & Visibility Toggles (Default: Empty spaces for physical signature)
  const [enableSecondSignatory, setEnableSecondSignatory] = useState(true);
  const [showSig1, setShowSig1] = useState(false);
  const [showSig2, setShowSig2] = useState(false);
  const [customSignatureImg2, setCustomSignatureImg2] = useState(null);

  // Background Image & Opacity
  const [customBgImg, setCustomBgImg] = useState(null);
  const [bgOpacity, setBgOpacity] = useState(0.18);

  // Border Customization State
  const [borderStyle, setBorderStyle] = useState("double");
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderInset, setBorderInset] = useState(16);
  const [customBorderColor, setCustomBorderColor] = useState("");
  const [cornerStyle, setCornerStyle] = useState("classic");

  // INDIVIDUAL FONT & SIZE CONTROLS FOR ALL ELEMENTS
  const [customTitleFont, setCustomTitleFont] = useState("'Great Vibes', cursive");
  const [customTitleSize, setCustomTitleSize] = useState(52);
  const [customTitleColor, setCustomTitleColor] = useState("");

  const [introFont, setIntroFont] = useState("'Times New Roman', Times, serif");
  const [introSize, setIntroSize] = useState(16.5);

  const [customNameFont, setCustomNameFont] = useState("'Times New Roman', Times, serif");
  const [customNameSize, setCustomNameSize] = useState(32);
  const [customNameColor, setCustomNameColor] = useState("");
  const [isNameBold, setIsNameBold] = useState(true);
  const [isNameItalic, setIsNameItalic] = useState(false);

  const [bodyFont, setBodyFont] = useState("'Times New Roman', Times, serif");
  const [bodySize, setBodySize] = useState(17);

  const [partnershipFont, setPartnershipFont] = useState("'Times New Roman', Times, serif");
  const [partnershipSize, setPartnershipSize] = useState(15.5);

  const [closingFont, setClosingFont] = useState("'Times New Roman', Times, serif");
  const [closingSize, setClosingSize] = useState(15.5);

  const [datePlaceFont, setDatePlaceFont] = useState("'Times New Roman', Times, serif");
  const [datePlaceSize, setDatePlaceSize] = useState(16);

  const [signatoryFont, setSignatoryFont] = useState("'Times New Roman', Times, serif");
  const [signatorySize, setSignatorySize] = useState(14);

  const [numeroFont, setNumeroFont] = useState("monospace");
  const [numeroSize, setNumeroSize] = useState(9.5);

  // DYNAMIC SIZING CONTROLS FOR SIGNATURES & STAMPS
  const [sig1Size, setSig1Size] = useState(55);
  const [sig2Size, setSig2Size] = useState(55);
  const [stampSize, setStampSize] = useState(85);

  // Custom Signatures & Stamps
  const [customSignatureImg, setCustomSignatureImg] = useState(null);
  const [customStampImg, setCustomStampImg] = useState(null);
  const [useCanvasSig, setUseCanvasSig] = useState(false);
  const [drawnSigUrl, setDrawnSigUrl] = useState(null);

  // Verification URL
  const [verifyBaseUrl, setVerifyBaseUrl] = useState("https://attestation-verifier.org/verify?id=");

  // Canvas & Export Refs
  const canvasRef = useRef(null);
  const certRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Signatures
  const [sig1Img, setSig1Img] = useState(null);
  const [sig2Img, setSig2Img] = useState(null);

  // Bulk Generation State
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkNamesText, setBulkNamesText] = useState("");
  const [bulkList, setBulkList] = useState([]);
  const [currentBulkIndex, setCurrentBulkIndex] = useState(0);

  // History & LocalStorage
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  // Adjust zoom automatically based on screen width
  useEffect(() => {
    const updateAutoZoom = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 860) {
        const targetPaperWidth = pageFormat === "landscape" ? 1123 : 794;
        const availableWidth = Math.max(260, w - 32);
        const autoZoom = Math.max(0.24, Math.min(0.95, availableWidth / targetPaperWidth));
        setZoomScale(Number(autoZoom.toFixed(2)));
      } else {
        setZoomScale(0.8);
      }
    };
    updateAutoZoom();
    window.addEventListener("resize", updateAutoZoom);
    return () => window.removeEventListener("resize", updateAutoZoom);
  }, [pageFormat]);

  // Load saved content from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem("attestation_saved_content");
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((d) => ({ ...d, ...parsed }));
      }
    } catch (e) {
      console.error("Error loading saved content:", e);
    }
  }, []);

  const setField = (key) => (e) => setData((d) => ({ ...d, [key]: e.target.value }));

  const activeBorderColor = customBorderColor || activeTheme.border;

  // SAVE CONTENT TO LOCAL STORAGE
  const handleSaveContent = () => {
    try {
      localStorage.setItem("attestation_saved_content", JSON.stringify(data));
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2500);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement des modifications.");
    }
  };

  // Canvas Drawing Methods for Signature Pad
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = activeTheme.primary;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setDrawnSigUrl(canvasRef.current.toDataURL("image/png"));
      setUseCanvasSig(true);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawnSigUrl(null);
      setUseCanvasSig(false);
    }
  };

  // Image upload handlers
  const handleLeftLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setLeftLogoImg(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRightLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setRightLogoImg(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCustomBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCustomBgImg(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCustomSignatureImg(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignature2Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCustomSignatureImg2(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStampUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCustomStampImg(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Actions
  const handlePrint = () => {
    saveToHistory();
    window.print();
  };

  const handleCelebrate = () => {
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 3000);
  };

  const handleCopyText = () => {
    const fullText = `${data.title}\n${data.introText}\n${data.destinataire}\n${data.bodyText}\n${data.partnershipText}\n${data.closingText}\n\nFait à ${data.villeDelivrance} le ${formatDateFR(data.dateDelivrance)}\n\n${data.signataire} ${data.fonction}\t\t${data.signataire2} ${data.fonction2}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToHistory = () => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString("fr-FR"),
      destinataire: data.destinataire,
      numero: data.numero,
      data: { ...data },
    };
    const updated = [newEntry, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem("attestation_history", JSON.stringify(updated));
  };

  // DIRECT PDF EXPORT
  const handleExportPDF = async () => {
    const element = certRef.current;
    if (!element) return;
    setIsDownloadingPDF(true);

    try {
      saveToHistory();
      if (document.fonts) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: activeTheme.cardBg || "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const isPortrait = pageFormat === "portrait";

      const JsPDFConstructor = jsPDFNamed || jsPDFModule?.jsPDF || jsPDFModule;
      const pdf = new JsPDFConstructor({
        orientation: isPortrait ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Attestation_${(data.destinataire || "Bénéficiaire").replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Export PDF Error:", err);
      alert(`Erreur lors de la génération du PDF : ${err?.message || err}`);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // HD PNG EXPORT
  const handleExportPNG = async () => {
    const element = certRef.current;
    if (!element) return;
    setIsDownloading(true);

    try {
      saveToHistory();
      if (document.fonts) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `Attestation_${(data.destinataire || "Bénéficiaire").replace(/\s+/g, "_")}.png`;
      a.href = pngUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export PNG Failed:", err);
      alert("Erreur lors de la création de l'image HD.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Parse CSV
  const parseCSV = () => {
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) return;
    const result = lines.slice(1).map(l => l.trim()).filter(Boolean);
    setBulkList(result);
    if (result.length > 0) applyBulkItem(result[0], 0);
  };

  const applyBulkItem = (name, idx) => {
    setCurrentBulkIndex(idx);
    setData((prev) => ({
      ...prev,
      destinataire: name,
      numero: `AP-2026-${String(idx + 1).padStart(4, "0")}`,
    }));
  };

  return (
    <div className="wrap">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .wrap {
          font-family: 'Times New Roman', Times, serif;
          background: #F1F5F9;
          min-height: 100vh;
          color: #0F172A;
          padding: 24px;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 1580px;
          display: grid;
          grid-template-columns: 440px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1100px) {
          .container { grid-template-columns: 1fr; }
        }

        /* SIDEBAR EDITOR PANEL */
        .editor-panel {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 48px);
          position: sticky;
          top: 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .editor-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #F1F5F9;
          background: #FAFAFA;
        }

        .editor-header h1 {
          font-size: 17px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0F172A;
        }

        .editor-header p {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }

        /* HIGH VISIBILITY MODIFICATION TABS */
        .tabs {
          display: flex;
          flex-wrap: wrap;
          background: #F8FAFC;
          padding: 10px 12px;
          gap: 6px;
          border-bottom: 2px solid #E2E8F0;
        }

        .tab-btn {
          padding: 8px 12px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .tab-btn:hover {
          border-color: #2563EB;
          color: #2563EB;
          background: #EFF6FF;
          transform: translateY(-1px);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #FFFFFF;
          border-color: #1D4ED8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        .tab-content {
          padding: 18px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* PRESETS BOX */
        .presets-box {
          background: #F8FAFC;
          border: 1px dashed #CBD5E1;
          border-radius: 8px;
          padding: 10px;
        }

        .presets-box label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
          display: block;
          margin-bottom: 6px;
        }

        .chip {
          font-size: 11px;
          padding: 4px 8px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s;
        }

        .chip.active, .chip:hover {
          border-color: #2563EB;
          color: #2563EB;
          background: #EFF6FF;
        }

        /* FORM INPUTS */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #475569;
        }

        .input-group input, .input-group select, .input-group textarea {
          padding: 8px 10px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 12.5px;
          font-family: inherit;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }

        /* THEME SELECTOR */
        .theme-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .theme-card {
          padding: 9px;
          border: 2px solid #E2E8F0;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
        }

        .theme-card.active {
          border-color: #2563EB;
          background: #EFF6FF;
        }

        .theme-swatch {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #FFF;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .theme-name {
          font-size: 11px;
          font-weight: 600;
        }

        /* SIGNATURE CANVAS */
        .canvas-container {
          border: 1px dashed #94A3B8;
          border-radius: 8px;
          background: #FAFAFA;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
        }

        canvas {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          cursor: crosshair;
          touch-action: none;
        }

        .canvas-actions {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 6px;
        }

        /* MAIN PREVIEW PANEL */
        .preview-area {
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
          flex-wrap: wrap;
          gap: 10px;
        }

        .format-selector-bar {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #F1F5F9;
          padding: 3px 6px;
          border-radius: 8px;
        }

        .format-bar-btn {
          border: none;
          background: transparent;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          color: #475569;
          transition: all 0.15s;
        }

        .format-bar-btn.active {
          background: #FFFFFF;
          color: #2563EB;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #F1F5F9;
          padding: 3px 6px;
          border-radius: 8px;
        }

        .zoom-btn {
          border: none;
          background: #FFFFFF;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          color: #334155;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .zoom-btn.active {
          background: #2563EB;
          color: #FFFFFF;
        }

        .btn-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        }

        .btn-sm {
          padding: 5px 10px;
          font-size: 11px;
        }

        .btn-secondary {
          background: #F1F5F9;
          color: #334155;
        }
        .btn-secondary:hover { background: #E2E8F0; }

        .btn-pdf {
          background: #DC2626;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
        .btn-pdf:hover { background: #B91C1C; transform: translateY(-1px); }

        .btn-download {
          background: #2563EB;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        .btn-download:hover { background: #1D4ED8; }

        .btn-celebrate {
          background: linear-gradient(135deg, #D53F8C, #805AD5);
          color: #FFFFFF;
        }
        .btn-celebrate:hover { opacity: 0.95; transform: scale(1.02); }

        .btn-save-content {
          background: #10B981;
          color: #FFFFFF;
          font-weight: 700;
          padding: 10px 16px;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        .btn-save-content:hover { background: #059669; transform: translateY(-1px); }

        /* CERTIFICATE CONTAINER & RESPONSIVE ZOOM */
        .preview-area { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; min-width: 0; }
        .cert-scroll {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: auto;
          text-align: center;
          background: #E2E8F0;
          border-radius: 14px;
          padding: 30px 20px;
          min-height: 520px;
        }

        .cert-scale-wrapper {
          display: inline-block;
          text-align: left;
          margin: 0 auto;
          transform: scale(${zoomScale});
          transform-origin: top center;
          transition: transform 0.2s ease;
        }

        /* LUXURY PRESTIGE FORMAT DYNAMICS */
        .certificate-sheet {
          background-color: ${activeTheme.cardBg};
          color: ${activeTheme.primary};
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-sizing: border-box;
          font-family: 'Times New Roman', Times, serif;
          font-size: 16px; /* 12pt */
        }

        .certificate-sheet.format-landscape {
          width: 960px;
          height: 678px;
          padding: 40px 52px;
        }

        .certificate-sheet.format-portrait {
          width: 678px;
          height: 960px;
          padding: 40px 52px;
        }

        .certificate-sheet.format-square {
          width: 780px;
          height: 780px;
          padding: 40px 52px;
        }

        /* CUSTOM BACKGROUND IMAGE */
        .custom-document-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: ${bgOpacity};
          pointer-events: none;
          z-index: 1;
        }

        /* CUSTOMIZABLE BORDER STYLES */
        .frame-layer-custom-outer {
          position: absolute;
          inset: ${borderInset}px;
          border-style: ${borderStyle === "dashed" ? "dashed" : "solid"};
          border-width: ${borderStyle === "none" ? "0px" : `${borderWidth}px`};
          border-color: ${activeBorderColor};
          pointer-events: none;
          z-index: 2;
        }

        .frame-layer-custom-inner {
          position: absolute;
          inset: ${borderInset + 8}px;
          border-style: ${borderStyle === "dashed" ? "dashed" : "solid"};
          border-width: ${borderStyle === "double" || borderStyle === "ornamental" ? "1px" : "0px"};
          border-color: ${activeTheme.borderSoft};
          pointer-events: none;
          z-index: 2;
        }

        .corner-ornament {
          position: absolute;
          width: 48px;
          height: 48px;
          pointer-events: none;
          z-index: 2;
        }
        .corner-ornament.top-left { top: ${borderInset - 6}px; left: ${borderInset - 6}px; }
        .corner-ornament.top-right { top: ${borderInset - 6}px; right: ${borderInset - 6}px; transform: rotate(90deg); }
        .corner-ornament.bottom-left { top: auto; bottom: ${borderInset - 6}px; left: ${borderInset - 6}px; transform: rotate(270deg); }
        .corner-ornament.bottom-right { top: auto; bottom: ${borderInset - 6}px; right: ${borderInset - 6}px; transform: rotate(180deg); }

        /* WATERMARK BACKGROUND */
        .watermark-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 360px;
          height: 360px;
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }

        /* INNER CONTENT FLEX LAYOUT */
        .cert-inner-content {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }

        /* HEADER SECTION WITH MOVED-DOWN ELEGANT TITLE */
        .cert-header-layout {
          width: 100%;
          display: grid;
          grid-template-columns: 130px 1fr 130px;
          align-items: center;
          padding-top: 16px;
        }

        .header-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-logo-img-left {
          max-width: ${leftLogoSize}px;
          max-height: ${leftLogoSize}px;
          object-fit: contain;
        }

        .header-logo-img-right {
          max-width: ${rightLogoSize}px;
          max-height: ${rightLogoSize}px;
          object-fit: contain;
        }

        .cert-header-center {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* PRESTIGIOUS TITLE STYLING */
        .main-title {
          font-family: ${customTitleFont || "'Great Vibes', cursive"};
          font-size: ${customTitleSize}px;
          font-weight: 700;
          color: ${customTitleColor || activeTheme.primary};
          line-height: 1.15;
          margin-top: 8px;
          margin-bottom: 2px;
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 4px 0;
        }

        .divider-line {
          width: 110px;
          height: 1px;
          background: ${activeBorderColor};
          opacity: 0.6;
        }

        .divider-icon {
          color: ${activeTheme.gold};
          font-size: 14px;
        }

        /* BODY SECTION - DYNAMIC FONTS & SIZES FOR ALL ELEMENTS */
        .cert-body-flow {
          width: 100%;
          max-width: 840px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin: 6px 0;
        }

        .intro-phrase {
          font-family: ${introFont};
          font-size: ${introSize}px;
          color: ${activeTheme.primary};
          line-height: 1.45;
        }

        .recipient-name-block {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 4px 0;
        }

        .recipient-name {
          font-family: ${customNameFont};
          font-size: ${customNameSize}px;
          font-weight: ${isNameBold ? "700" : "400"};
          font-style: ${isNameItalic ? "italic" : "normal"};
          color: ${customNameColor || activeTheme.primary};
          line-height: 1.25;
          padding: 4px 28px;
          border-bottom: 2px solid ${activeTheme.primary};
          min-width: 440px;
          text-align: center;
          letter-spacing: 0.03em;
        }

        .body-phrase {
          font-family: ${bodyFont};
          font-size: ${bodySize}px;
          color: ${activeTheme.primary};
          line-height: 1.5;
          max-width: 800px;
          text-align: center;
          font-weight: 400;
        }

        .partnership-phrase {
          font-family: ${partnershipFont};
          font-size: ${partnershipSize}px;
          font-style: italic;
          color: ${activeTheme.primary};
          max-width: 760px;
          line-height: 1.4;
          opacity: 0.95;
        }

        .closing-phrase {
          font-family: ${closingFont};
          font-size: ${closingSize}px;
          color: ${activeTheme.primary};
          line-height: 1.4;
        }

        /* FAIT À HOUEGBO LE 31 JUILLET 2026 */
        .date-place-tag {
          font-family: ${datePlaceFont};
          font-size: ${datePlaceSize}px;
          font-style: italic;
          font-weight: 600;
          color: ${activeTheme.primary};
          margin-top: 6px;
        }

        /* FOOTER SECTION & DOUBLE SIGNATORIES IN LOWER LEFT & RIGHT CORNERS */
        .cert-footer {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 130px 1fr;
          align-items: flex-end;
          gap: 16px;
        }

        .signature-corner-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .signature-corner-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
        }

        .signature-display {
          display: flex;
          align-items: flex-end;
          margin-bottom: 2px;
        }

        .signature-img {
          object-fit: contain;
          transform: rotate(-2deg);
        }

        .signature-handwriting {
          font-family: 'Great Vibes', cursive;
          color: ${activeTheme.primary};
          line-height: 1;
          transform: rotate(-3deg);
        }

        .signature-line-corner {
          width: 160px;
          height: 1px;
          background: ${activeTheme.primary};
          opacity: 0.4;
          margin-bottom: 4px;
        }

        .signatory-name {
          font-family: ${signatoryFont};
          font-size: ${signatorySize}px;
          font-weight: 700;
          color: ${activeTheme.primary};
        }

        .signatory-title {
          font-family: ${signatoryFont};
          font-size: ${signatorySize - 2}px;
          color: ${activeTheme.primary};
        }

        /* SEAL AREA AT CENTER */
        .seal-center-footer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2px;
        }

        .custom-stamp-img {
          object-fit: contain;
        }

        .auth-num-footer {
          font-family: ${numeroFont};
          font-size: ${numeroSize}px;
          letter-spacing: 0.05em;
          opacity: 0.75;
          font-weight: 600;
        }

        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: #FFF;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 999;
          animation: slideIn 0.3s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .celebrate-banner {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #EC4899, #8B5CF6);
          color: #FFF;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(236, 72, 153, 0.3);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 999;
          animation: slideIn 0.3s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* PRINT STYLES */
        @media print {
          @page {
            size: ${pageFormat === "portrait" ? "A4 portrait" : "A4 landscape"};
            margin: 0;
          }
          body, html, .wrap {
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          .container {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
          }
          .editor-panel, .action-bar, .celebrate-banner, .toast-notification {
            display: none !important;
          }
          .cert-scroll {
            padding: 0 !important;
            overflow: visible !important;
            background: #FFF !important;
          }
          .cert-scale-wrapper {
            transform: none !important;
          }
          .certificate-sheet {
            width: 100vw !important;
            height: 100vh !important;
            min-width: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            box-sizing: border-box !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {showSaveToast && (
        <div className="toast-notification">
          <IconCheck color="#FFFFFF" />
          <span>Modifications enregistrées avec succès ! 💾</span>
        </div>
      )}

      {celebrated && (
        <div className="celebrate-banner">
          <IconSparkles />
          <span>Félicitations pour cette belle réussite ! 🎉</span>
        </div>
      )}

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
        {/* ================= EDITING SIDEBAR ================= */}
        <aside className={`editor-panel ${isMobile && mobileView === "preview" ? "mobile-hide-editor" : ""}`} style={{ width: "100%", overflow: "hidden" }}>
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
                  <h1>
                    <IconAward color="#D4AF37" />
                    Attestation de Formation
                  </h1>
                  <p>ONG ESPOIR ET NATURE & Maison AFI COLLECTION</p>
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

          <div className="tabs">
            <button className={`tab-btn ${activeTab === "content" ? "active" : ""}`} onClick={() => setActiveTab("content")}>
              <IconText /> Contenu
            </button>
            <button className={`tab-btn ${activeTab === "style" ? "active" : ""}`} onClick={() => setActiveTab("style")}>
              <IconSliders /> Format & Thèmes
            </button>
            <button className={`tab-btn ${activeTab === "logos" ? "active" : ""}`} onClick={() => setActiveTab("logos")}>
              <IconImage /> Logos & Fond
            </button>
            <button className={`tab-btn ${activeTab === "signature" ? "active" : ""}`} onClick={() => setActiveTab("signature")}>
              <IconPen /> Signataires & Cachet
            </button>
            <button className={`tab-btn ${activeTab === "border" ? "active" : ""}`} onClick={() => setActiveTab("border")}>
              <IconBorder /> Bordures
            </button>
            <button className={`tab-btn ${activeTab === "typography" ? "active" : ""}`} onClick={() => setActiveTab("typography")}>
              <IconFont /> Polices
            </button>
            <button className={`tab-btn ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
              <IconUsers /> Masse
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 1: CONTENT WITH SAVE BUTTON */}
            {activeTab === "content" && (
              <>
                <button className="btn btn-save-content" onClick={handleSaveContent} style={{ width: "100%", justifyContent: "center", marginBottom: "4px" }}>
                  💾 Enregistrer les modifications
                </button>

                <div className="input-group">
                  <label>Titre du Document</label>
                  <input type="text" value={data.title} onChange={setField("title")} />
                </div>

                <div className="input-group">
                  <label>Phrase d'Introduction</label>
                  <textarea rows={2} value={data.introText} onChange={setField("introText")} />
                </div>

                <div className="input-group">
                  <label>Nom du Bénéficiaire</label>
                  <input type="text" value={data.destinataire} onChange={setField("destinataire")} placeholder="Nom et Prénoms" />
                </div>

                <div className="input-group">
                  <label>Phrase de Participation & Formations</label>
                  <textarea rows={2} value={data.bodyText} onChange={setField("bodyText")} />
                </div>

                <div className="input-group">
                  <label>Partenariat / Organisation</label>
                  <textarea rows={2} value={data.partnershipText} onChange={setField("partnershipText")} />
                </div>

                <div className="input-group">
                  <label>Phrase de Clôture Légale</label>
                  <textarea rows={2} value={data.closingText} onChange={setField("closingText")} />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Lieu de délivrance</label>
                    <input type="text" value={data.villeDelivrance} onChange={setField("villeDelivrance")} />
                  </div>
                  <div className="input-group">
                    <label>Date de délivrance</label>
                    <input type="date" value={data.dateDelivrance} onChange={setField("dateDelivrance")} />
                  </div>
                </div>

                <div className="input-group">
                  <label>N° Attestation (Optionnel)</label>
                  <input type="text" value={data.numero} onChange={setField("numero")} placeholder="(Laisser vide pour ne pas afficher)" />
                </div>
              </>
            )}

            {/* TAB 2: STYLES & FORMATS */}
            {activeTab === "style" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>📐 Format de la Page (Orientation)</label>
                  <div className="grid-3" style={{ marginTop: "4px" }}>
                    <button
                      className={`chip ${pageFormat === "landscape" ? "active" : ""}`}
                      onClick={() => setPageFormat("landscape")}
                    >
                      📐 Paysage (A4)
                    </button>
                    <button
                      className={`chip ${pageFormat === "portrait" ? "active" : ""}`}
                      onClick={() => setPageFormat("portrait")}
                    >
                      📱 Portrait (A4)
                    </button>
                    <button
                      className={`chip ${pageFormat === "square" ? "active" : ""}`}
                      onClick={() => setPageFormat("square")}
                    >
                      ⬛ Carré (1:1)
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

                <div className="input-group">
                  <label>Thème Visuel ({THEMES.length} Modèles)</label>
                  <div className="theme-grid">
                    {THEMES.map((theme) => (
                      <div
                        key={theme.id}
                        className={`theme-card ${activeTheme.id === theme.id ? "active" : ""}`}
                        onClick={() => setActiveTheme(theme)}
                      >
                        <div className="theme-swatch" style={{ background: theme.border }} />
                        <span className="theme-name">{theme.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label>Style du Tampon / Sceau</label>
                  <select value={sealType} onChange={(e) => setSealType(e.target.value)}>
                    <option value="wax">Sceau Officiel en Cire & Ruban</option>
                    <option value="star">Médaille D'Or Étoilée</option>
                    <option value="badge">Badge Sécurisé Certifié</option>
                    <option value="qr">Code QR de Vérification</option>
                  </select>
                </div>
              </>
            )}

            {/* TAB 3: LOGOS & BACKGROUND */}
            {activeTab === "logos" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>👈 Logo Haut-Gauche (ex: ONG ESPOIR ET NATURE)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Téléverser Logo Gauche (PNG / JPEG)</label>
                    <input type="file" accept="image/*" onChange={handleLeftLogoUpload} />
                  </div>

                  <div className="input-group">
                    <label>Taille du Logo Gauche ({leftLogoSize}px)</label>
                    <input
                      type="range"
                      min={30}
                      max={180}
                      value={leftLogoSize}
                      onChange={(e) => setLeftLogoSize(Number(e.target.value))}
                    />
                  </div>

                  {leftLogoImg && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setLeftLogoImg(null)} style={{ marginTop: "6px" }}>
                      Supprimer logo gauche
                    </button>
                  )}
                </div>

                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#2563EB" }}>👉 Logo Haut-Droit (ex: Maison AFI COLLECTION)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Téléverser Logo Droit (PNG / JPEG)</label>
                    <input type="file" accept="image/*" onChange={handleRightLogoUpload} />
                  </div>

                  <div className="input-group">
                    <label>Taille du Logo Droit ({rightLogoSize}px)</label>
                    <input
                      type="range"
                      min={30}
                      max={180}
                      value={rightLogoSize}
                      onChange={(e) => setRightLogoSize(Number(e.target.value))}
                    />
                  </div>

                  {rightLogoImg && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setRightLogoImg(null)} style={{ marginTop: "6px" }}>
                      Supprimer logo droit
                    </button>
                  )}
                </div>

                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#805AD5" }}>🖼️ Image de Fond du Document (Filigrane/Texture)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Téléverser l'Image de Fond</label>
                    <input type="file" accept="image/*" onChange={handleCustomBgUpload} />
                    {customBgImg && (
                      <button className="btn btn-secondary btn-sm" onClick={() => setCustomBgImg(null)} style={{ marginTop: "4px" }}>
                        Supprimer l'image de fond
                      </button>
                    )}
                  </div>

                  {customBgImg && (
                    <div className="input-group">
                      <label>Opacité du Fond ({Math.round(bgOpacity * 100)}%)</label>
                      <input
                        type="range"
                        min={0.05}
                        max={1.0}
                        step={0.05}
                        value={bgOpacity}
                        onChange={(e) => setBgOpacity(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 4: SIGNATORIES & STAMPS WITH HIDE/SHOW TOGGLES & SIZING CONTROLS */}
            {activeTab === "signature" && (
              <>
                {/* SIGNATORY 1 */}
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>✍️ Signataire Gauche (Le Directeur)</label>
                  
                  {/* VISIBILITY TOGGLE FOR SIGNATURE 1 */}
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <button
                      className={`chip ${showSig1 ? "active" : ""}`}
                      onClick={() => setShowSig1(!showSig1)}
                      style={{ padding: "6px 12px", fontSize: "11.5px" }}
                    >
                      {showSig1 ? "👁️ Signature Gauche : Visible" : "🚫 Signature Gauche : Masquée (Espace vierge)"}
                    </button>
                  </div>

                  <div className="grid-2" style={{ marginBottom: "8px" }}>
                    <div className="input-group">
                      <label>Titre / Fonction</label>
                      <input type="text" value={data.signataire} onChange={setField("signataire")} />
                    </div>
                    <div className="input-group">
                      <label>Structure</label>
                      <input type="text" value={data.fonction} onChange={setField("fonction")} />
                    </div>
                  </div>

                  {showSig1 && (
                    <>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Image de Signature 1 (PNG)</label>
                        <input type="file" accept="image/*" onChange={handleSignatureUpload} />
                        {customSignatureImg && (
                          <button className="btn btn-secondary btn-sm" onClick={() => setCustomSignatureImg(null)} style={{ marginTop: "4px" }}>
                            Supprimer Signature 1
                          </button>
                        )}
                      </div>

                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label style={{ color: "#2563EB" }}>📏 Taille Signature 1 ({sig1Size}px)</label>
                        <input
                          type="range"
                          min={30}
                          max={160}
                          value={sig1Size}
                          onChange={(e) => setSig1Size(Number(e.target.value))}
                        />
                      </div>

                      <div className="input-group">
                        <label>Ou Signature Tactile au Doigt / Souris</label>
                        <div className="canvas-container">
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={90}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                          />
                          <div className="canvas-actions">
                            <button className="btn btn-secondary btn-sm" onClick={clearCanvas}>
                              Effacer
                            </button>
                            <span style={{ fontSize: "10.5px", color: "#64748B" }}>
                              {useCanvasSig ? "✓ Tactile activée" : "Tracez la signature"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* SIGNATORY 2 */}
                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#805AD5" }}>✍️ Signataire Droit (La Directrice)</label>

                  {/* VISIBILITY TOGGLE FOR SIGNATURE 2 */}
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <button
                      className={`chip ${showSig2 ? "active" : ""}`}
                      onClick={() => setShowSig2(!showSig2)}
                      style={{ padding: "6px 12px", fontSize: "11.5px" }}
                    >
                      {showSig2 ? "👁️ Signature Droite : Visible" : "🚫 Signature Droite : Masquée (Espace vierge)"}
                    </button>
                  </div>

                  <div className="grid-2" style={{ marginBottom: "8px" }}>
                    <div className="input-group">
                      <label>Titre / Fonction</label>
                      <input type="text" value={data.signataire2 || ""} onChange={setField("signataire2")} />
                    </div>
                    <div className="input-group">
                      <label>Structure</label>
                      <input type="text" value={data.fonction2 || ""} onChange={setField("fonction2")} />
                    </div>
                  </div>

                  {showSig2 && (
                    <>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Image de Signature 2 (PNG)</label>
                        <input type="file" accept="image/*" onChange={handleSignature2Upload} />
                        {customSignatureImg2 && (
                          <button className="btn btn-secondary btn-sm" onClick={() => setCustomSignatureImg2(null)} style={{ marginTop: "4px" }}>
                            Supprimer Signature 2
                          </button>
                        )}
                      </div>

                      <div className="input-group">
                        <label style={{ color: "#805AD5" }}>📏 Taille Signature 2 ({sig2Size}px)</label>
                        <input
                          type="range"
                          min={30}
                          max={160}
                          value={sig2Size}
                          onChange={(e) => setSig2Size(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* STAMP / CACHET SIZING CONTROL */}
                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#10B981" }}>💮 Tampon / Cachet Officiel</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Téléverser Tampon (PNG)</label>
                    <input type="file" accept="image/*" onChange={handleStampUpload} />
                    {customStampImg && (
                      <button className="btn btn-secondary btn-sm" onClick={() => setCustomStampImg(null)} style={{ marginTop: "4px" }}>
                        Supprimer le tampon
                      </button>
                    )}
                  </div>

                  <div className="input-group">
                    <label style={{ color: "#10B981" }}>📏 Taille du Tampon / Sceau ({stampSize}px)</label>
                    <input
                      type="range"
                      min={40}
                      max={200}
                      value={stampSize}
                      onChange={(e) => setStampSize(Number(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB 5: BORDER */}
            {activeTab === "border" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>🖼️ Style du Cadre / Bordure</label>
                  <div className="grid-2" style={{ marginBottom: "8px" }}>
                    <button className={`chip ${borderStyle === "double" ? "active" : ""}`} onClick={() => setBorderStyle("double")}>
                      👑 Double Cadre Royal
                    </button>
                    <button className={`chip ${borderStyle === "single" ? "active" : ""}`} onClick={() => setBorderStyle("single")}>
                      🔲 Cadre Simple
                    </button>
                    <button className={`chip ${borderStyle === "dashed" ? "active" : ""}`} onClick={() => setBorderStyle("dashed")}>
                      ✂️ Pointillé Premium
                    </button>
                    <button className={`chip ${borderStyle === "ornamental" ? "active" : ""}`} onClick={() => setBorderStyle("ornamental")}>
                      ⚜️ Ornemental
                    </button>
                    <button className={`chip ${borderStyle === "none" ? "active" : ""}`} onClick={() => setBorderStyle("none")}>
                      🚫 Sans Bordure
                    </button>
                  </div>

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Épaisseur du trait ({borderWidth}px)</label>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Marge de retrait interne ({borderInset}px)</label>
                    <input
                      type="range"
                      min={8}
                      max={36}
                      value={borderInset}
                      onChange={(e) => setBorderInset(Number(e.target.value))}
                    />
                  </div>

                  <div className="input-group">
                    <label>Couleur de Bordure Personnalisée</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={activeBorderColor}
                        onChange={(e) => setCustomBorderColor(e.target.value)}
                        style={{ height: "36px", padding: "2px", cursor: "pointer", flex: 1 }}
                      />
                      {customBorderColor && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setCustomBorderColor("")}>
                          Réinitialiser
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#2563EB" }}>⚜️ Style des Coins Ornementaux (8 Modèles de Prestige)</label>
                  <div className="grid-2">
                    <button className={`chip ${cornerStyle === "classic" ? "active" : ""}`} onClick={() => setCornerStyle("classic")}>
                      ✨ Coins Classiques
                    </button>
                    <button className={`chip ${cornerStyle === "artdeco" ? "active" : ""}`} onClick={() => setCornerStyle("artdeco")}>
                      🔷 Art Déco
                    </button>
                    <button className={`chip ${cornerStyle === "gothic" ? "active" : ""}`} onClick={() => setCornerStyle("gothic")}>
                      🏛️ Gothique
                    </button>
                    <button className={`chip ${cornerStyle === "fleurdelys" ? "active" : ""}`} onClick={() => setCornerStyle("fleurdelys")}>
                      ⚜️ Fleur de Lys
                    </button>
                    <button className={`chip ${cornerStyle === "laurel" ? "active" : ""}`} onClick={() => setCornerStyle("laurel")}>
                      🌿 Lauriers d'Or
                    </button>
                    <button className={`chip ${cornerStyle === "baroque" ? "active" : ""}`} onClick={() => setCornerStyle("baroque")}>
                      📜 Baroque Volutes
                    </button>
                    <button className={`chip ${cornerStyle === "diamond" ? "active" : ""}`} onClick={() => setCornerStyle("diamond")}>
                      💎 Diamant Étoilé
                    </button>
                    <button className={`chip ${cornerStyle === "none" ? "active" : ""}`} onClick={() => setCornerStyle("none")}>
                      🚫 Sans Coins
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB 6: FULL TYPOGRAPHY & SIZE STUDIO FOR ALL ELEMENTS */}
            {activeTab === "typography" && (
              <>
                {/* 1. TITRE DU DOCUMENT */}
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>📜 1. Titre du Document (ex: Attestation)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police du Titre</label>
                    <select value={customTitleFont} onChange={(e) => setCustomTitleFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille du Titre ({customTitleSize}px)</label>
                    <input
                      type="range"
                      min={20}
                      max={72}
                      value={customTitleSize}
                      onChange={(e) => setCustomTitleSize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 2. PHRASE D'INTRODUCTION */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>📝 2. Phrase d'Introduction (ex: Je soussignée...)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police de l'Introduction</label>
                    <select value={introFont} onChange={(e) => setIntroFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille de l'Introduction ({introSize}px)</label>
                    <input
                      type="range"
                      min={11}
                      max={28}
                      step={0.5}
                      value={introSize}
                      onChange={(e) => setIntroSize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 3. NOM DU BÉNÉFICIAIRE */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>👤 3. Nom du Bénéficiaire</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police du Nom</label>
                    <select value={customNameFont} onChange={(e) => setCustomNameFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille du Nom ({customNameSize}px)</label>
                    <input
                      type="range"
                      min={18}
                      max={56}
                      value={customNameSize}
                      onChange={(e) => setCustomNameSize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 4. FORMATIONS & CORPS DU TEXTE */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>🎓 4. Formations & Corps du Texte</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police des Formations</label>
                    <select value={bodyFont} onChange={(e) => setBodyFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille du Texte ({bodySize}px)</label>
                    <input
                      type="range"
                      min={11}
                      max={28}
                      step={0.5}
                      value={bodySize}
                      onChange={(e) => setBodySize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 5. PARTENARIAT */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>🤝 5. Partenariat / Organisation</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police du Partenariat</label>
                    <select value={partnershipFont} onChange={(e) => setPartnershipFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille du Partenariat ({partnershipSize}px)</label>
                    <input
                      type="range"
                      min={10}
                      max={26}
                      step={0.5}
                      value={partnershipSize}
                      onChange={(e) => setPartnershipSize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 6. CLÔTURE LÉGALE */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>📜 6. Phrase de Clôture Légale</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police de Clôture</label>
                    <select value={closingFont} onChange={(e) => setClosingFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille de Clôture ({closingSize}px)</label>
                    <input
                      type="range"
                      min={10}
                      max={26}
                      step={0.5}
                      value={closingSize}
                      onChange={(e) => setClosingSize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 7. LIEU & DATE */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>📍 7. Lieu & Date de Délivrance</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police Lieu & Date</label>
                    <select value={datePlaceFont} onChange={(e) => setDatePlaceFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille Lieu & Date ({datePlaceSize}px)</label>
                    <input
                      type="range"
                      min={10}
                      max={26}
                      step={0.5}
                      value={datePlaceSize}
                      onChange={(e) => setDatePlaceSize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 8. SIGNATAIRES */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>✍️ 8. Signataires (Titres & Fonctions)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police des Signataires</label>
                    <select value={signatoryFont} onChange={(e) => setSignatoryFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille des Signataires ({signatorySize}px)</label>
                    <input
                      type="range"
                      min={9}
                      max={22}
                      step={0.5}
                      value={signatorySize}
                      onChange={(e) => setSignatorySize(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 9. NUMÉRO D'ATTESTATION */}
                <div className="presets-box" style={{ marginTop: "8px" }}>
                  <label style={{ color: "#2563EB" }}>🔢 9. N° d'Attestation</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Police du N° Attestation</label>
                    <select value={numeroFont} onChange={(e) => setNumeroFont(e.target.value)}>
                      {FONTS_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taille du N° ({numeroSize}px)</label>
                    <input
                      type="range"
                      min={7}
                      max={18}
                      step={0.5}
                      value={numeroSize}
                      onChange={(e) => setNumeroSize(Number(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB 7: BULK CSV IMPORT */}
            {activeTab === "bulk" && (
              <>
                <div className="input-group">
                  <label>Coller les Noms des Bénéficiaires (Un par ligne)</label>
                  <textarea
                    rows={6}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Madame AKAKPO Chantal&#10;Monsieur SOSSOU Boris"
                  />
                  <button className="btn btn-primary" onClick={parseCSV} style={{ marginTop: "6px" }}>
                    🚀 Générer le lot d'attestations
                  </button>
                </div>

                {bulkList.length > 0 && (
                  <div className="presets-box" style={{ marginTop: "10px" }}>
                    <label>Bénéficiaire sélectionné ({bulkList.length}) :</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "160px", overflowY: "auto" }}>
                      {bulkList.map((name, idx) => (
                        <button
                          key={idx}
                          className={`chip ${currentBulkIndex === idx ? "active" : ""}`}
                          onClick={() => applyBulkItem(name, idx)}
                          style={{ textAlign: "left" }}
                        >
                          #{idx + 1} - {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
            </>
          )}
        </aside>

        {/* ================= PREVIEW AREA ================= */}
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

            {/* ORIENTATION TOGGLE (PAYSAGE / PORTRAIT) */}
            <div className="format-selector-bar">
              <button
                className={`format-bar-btn ${pageFormat === "landscape" ? "active" : ""}`}
                onClick={() => setPageFormat("landscape")}
              >
                📐 Paysage
              </button>
              <button
                className={`format-bar-btn ${pageFormat === "portrait" ? "active" : ""}`}
                onClick={() => setPageFormat("portrait")}
              >
                📱 Portrait
              </button>
            </div>

            {/* RESPONSIVE ZOOM CONTROLS */}
            <div className="zoom-controls">
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginRight: "4px" }}>Zoom :</span>
              <button className={`zoom-btn ${zoomScale === 0.5 ? "active" : ""}`} onClick={() => setZoomScale(0.5)}>50%</button>
              <button className={`zoom-btn ${zoomScale === 0.65 ? "active" : ""}`} onClick={() => setZoomScale(0.65)}>65%</button>
              <button className={`zoom-btn ${zoomScale === 0.8 ? "active" : ""}`} onClick={() => setZoomScale(0.8)}>80%</button>
              <button className={`zoom-btn ${zoomScale === 1.0 ? "active" : ""}`} onClick={() => setZoomScale(1.0)}>100%</button>
            </div>

            <div className="btn-group">
              <button className="btn btn-secondary" onClick={handleCopyText}>
                {copied ? <IconCheck color="#10B981" /> : <IconCopy />}
                {copied ? "Copie !" : "Copier"}
              </button>

              {/* DIRECT PDF DOWNLOAD BUTTON */}
              <button className="btn btn-pdf" onClick={handleExportPDF} disabled={isDownloadingPDF}>
                {isDownloadingPDF ? "⏳ PDF..." : "📄 Télécharger PDF"}
              </button>

              {/* HD PNG DOWNLOAD BUTTON */}
              <button className="btn btn-download" onClick={handleExportPNG} disabled={isDownloading}>
                {isDownloading ? "⏳ PNG..." : "📸 Image HD (PNG)"}
              </button>

              <button className="btn btn-celebrate" onClick={handleCelebrate}>
                <IconSparkles />
                Célébrer !
              </button>

              <button className="btn btn-primary" onClick={handlePrint}>
                <IconPrinter />
                Imprimer
              </button>
            </div>
          </div>

          <div className="cert-scroll">
            <div className="cert-scale-wrapper">
              <div ref={certRef} className={`certificate-sheet format-${pageFormat}`}>
                {/* CUSTOM BACKGROUND IMAGE */}
                {customBgImg && (
                  <img src={customBgImg} alt="Fond sur-mesure" className="custom-document-bg" />
                )}

                {/* ORNAMENTAL FRAMES */}
                <div className="frame-layer-custom-outer" />
                <div className="frame-layer-custom-inner" />

                {/* 8 LUXURY CORNER STYLES RENDERING */}
                {cornerStyle === "classic" && (
                  <>
                    <CornerSvg className="top-left" color={activeBorderColor} />
                    <CornerSvg className="top-right" color={activeBorderColor} />
                    <CornerSvg className="bottom-left" color={activeBorderColor} />
                    <CornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {cornerStyle === "artdeco" && (
                  <>
                    <ArtDecoCornerSvg className="top-left" color={activeBorderColor} />
                    <ArtDecoCornerSvg className="top-right" color={activeBorderColor} />
                    <ArtDecoCornerSvg className="bottom-left" color={activeBorderColor} />
                    <ArtDecoCornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {cornerStyle === "gothic" && (
                  <>
                    <GothicCornerSvg className="top-left" color={activeBorderColor} />
                    <GothicCornerSvg className="top-right" color={activeBorderColor} />
                    <GothicCornerSvg className="bottom-left" color={activeBorderColor} />
                    <GothicCornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {cornerStyle === "fleurdelys" && (
                  <>
                    <FleurDeLysCornerSvg className="top-left" color={activeBorderColor} />
                    <FleurDeLysCornerSvg className="top-right" color={activeBorderColor} />
                    <FleurDeLysCornerSvg className="bottom-left" color={activeBorderColor} />
                    <FleurDeLysCornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {cornerStyle === "laurel" && (
                  <>
                    <LaurelCornerSvg className="top-left" color={activeBorderColor} />
                    <LaurelCornerSvg className="top-right" color={activeBorderColor} />
                    <LaurelCornerSvg className="bottom-left" color={activeBorderColor} />
                    <LaurelCornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {cornerStyle === "baroque" && (
                  <>
                    <BaroqueCornerSvg className="top-left" color={activeBorderColor} />
                    <BaroqueCornerSvg className="top-right" color={activeBorderColor} />
                    <BaroqueCornerSvg className="bottom-left" color={activeBorderColor} />
                    <BaroqueCornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {cornerStyle === "diamond" && (
                  <>
                    <DiamondCornerSvg className="top-left" color={activeBorderColor} />
                    <DiamondCornerSvg className="top-right" color={activeBorderColor} />
                    <DiamondCornerSvg className="bottom-left" color={activeBorderColor} />
                    <DiamondCornerSvg className="bottom-right" color={activeBorderColor} />
                  </>
                )}

                {/* WATERMARK BACKGROUND SVG */}
                {!customBgImg && watermark === "rosace" && <RosaceWatermark color={activeTheme.gold} />}
                {!customBgImg && watermark === "shield" && <ShieldWatermark color={activeTheme.gold} />}

                {/* INNER CONTENT WITH FULL DYNAMIC TYPOGRAPHY */}
                <div className="cert-inner-content">
                  {/* HEADER & LOGOS */}
                  <header className="cert-header-layout">
                    <div className="header-logo-box">
                      {leftLogoImg && (
                        <img
                          src={leftLogoImg}
                          alt="Logo Gauche"
                          className="header-logo-img-left"
                        />
                      )}
                    </div>

                    <div className="cert-header-center">
                      <h1 className="main-title">{data.title || "Attestation"}</h1>
                      
                      <div className="divider-ornament">
                        <span className="divider-line" />
                        <div className="divider-icon">◆</div>
                        <span className="divider-line" />
                      </div>
                    </div>

                    <div className="header-logo-box">
                      {rightLogoImg && (
                        <img
                          src={rightLogoImg}
                          alt="Logo Droit"
                          className="header-logo-img-right"
                        />
                      )}
                    </div>
                  </header>

                  {/* BODY CONTENT - EACH ELEMENT USES ITS CUSTOM FONT & SIZE */}
                  <div className="cert-body-flow">
                    <p className="intro-phrase">
                      Je soussignée <b>Mme TOSSA Afiavi Gbessito Honorine</b>, atteste que :
                    </p>

                    <div className="recipient-name-block">
                      <div className="recipient-name">
                        {data.destinataire || "______________________________________________"}
                      </div>
                    </div>

                    <p className="body-phrase">
                      a participé avec assiduité aux formations <b>Macramé</b> et <b>Teinture de pagne</b>
                    </p>

                    <p className="partnership-phrase">
                      Organisé par l'<b>ONG ESPOIR ET NATURE</b> en partenariat avec la <b>Maison AFI COLLECTION du Bénin</b>.
                    </p>

                    <p className="closing-phrase">
                      En foi de quoi la présente <b>attestation</b> lui est délivrée pour <b>servir et valoir ce que de droit</b>.
                    </p>

                    {/* LOCATION & DATE */}
                    <div className="date-place-tag">
                      Fait à <b>{data.villeDelivrance || "Houegbo"}</b> le <b>{formatDateFR(data.dateDelivrance) || "31 juillet 2026"}</b>
                    </div>
                  </div>

                  {/* FOOTER & SIGNATORIES IN LOWER LEFT & RIGHT CORNERS */}
                  <footer className="cert-footer">
                    {/* CORNER LOWER LEFT: SIGNATORY 1 */}
                    <div className="signature-corner-left">
                      <div className="signature-display" style={{ height: `${Math.max(sig1Size, 36)}px` }}>
                        {showSig1 ? (
                          customSignatureImg ? (
                            <img src={customSignatureImg} alt="Signature 1" className="signature-img" style={{ maxHeight: `${sig1Size}px` }} />
                          ) : useCanvasSig && drawnSigUrl ? (
                            <img src={drawnSigUrl} alt="Signature manuscrite 1" className="signature-img" style={{ maxHeight: `${sig1Size}px` }} />
                          ) : (
                            <div className="signature-handwriting" style={{ fontSize: `${Math.round(sig1Size * 0.55 + 10)}px` }}>
                              {data.signataire || "Signature"}
                            </div>
                          )
                        ) : null}
                      </div>

                      <div className="signature-line-corner" />
                      <div className="signatory-name">{data.signataire || "Le Directeur"}</div>
                      <div className="signatory-title">{data.fonction || "(ONG ESPOIR ET NATURE)"}</div>
                    </div>

                    {/* CENTER: OFFICIAL SEAL & AUTH NUMBER WITH CUSTOM SIZE */}
                    <div className="seal-center-footer">
                      {customStampImg ? (
                        <img
                          src={customStampImg}
                          alt="Cachet Officiel"
                          className="custom-stamp-img"
                          style={{ maxWidth: `${stampSize}px`, maxHeight: `${stampSize}px` }}
                        />
                      ) : (
                        <div style={{ transform: `scale(${stampSize / 70})`, transformOrigin: "bottom center" }}>
                          {sealType === "wax" && <WaxSeal sealBg={activeTheme.sealBg} goldColor={activeTheme.gold} />}
                          {sealType === "star" && <StarBadge goldColor={activeTheme.gold} />}
                          {sealType === "badge" && <SecurityBadge primaryColor={activeTheme.primary} goldColor={activeTheme.gold} />}
                          {sealType === "qr" && <QrCodeStamp verifyUrl={`${verifyBaseUrl}${data.numero}`} />}
                        </div>
                      )}
                      {data.numero ? <div className="auth-num-footer">N° {data.numero}</div> : null}
                    </div>

                    {/* CORNER LOWER RIGHT: SIGNATORY 2 */}
                    <div className="signature-corner-right">
                      <div className="signature-display" style={{ height: `${Math.max(sig2Size, 36)}px` }}>
                        {showSig2 ? (
                          customSignatureImg2 ? (
                            <img src={customSignatureImg2} alt="Signature 2" className="signature-img" style={{ maxHeight: `${sig2Size}px` }} />
                          ) : (
                            <div className="signature-handwriting" style={{ fontSize: `${Math.round(sig2Size * 0.55 + 10)}px` }}>
                              {data.signataire2 || "Signature 2"}
                            </div>
                          )
                        ) : null}
                      </div>

                      <div className="signature-line-corner" />
                      <div className="signatory-name">{data.signataire2 || "La Directrice"}</div>
                      <div className="signatory-title">{data.fonction2 || "(Maison AFI COLLECTION du Bénin)"}</div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ================= INLINE SVG ICONS =================

function IconText() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function IconPen() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19 7-7 3 3-7 7-3-3z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="m2 2 7.586 7.586" />
    </svg>
  );
}

function IconBorder() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function IconFont() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPrinter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function IconAward({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconCheck({ color = "currentColor" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ================= 8 LUXURY ORNAMENTAL CORNER SVG COMPONENTS =================

function CornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 50 50" fill="none" width="100%" height="100%">
        <path d="M 4 4 L 4 30 L 7 30 L 7 7 L 30 7 L 30 4 Z" fill={color} />
        <path d="M 12 12 L 12 24 L 14 24 L 14 14 L 24 14 L 24 12 Z" fill={color} opacity="0.6" />
        <circle cx="4" cy="4" r="3" fill={color} />
      </svg>
    </div>
  );
}

function ArtDecoCornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 50 50" fill="none" width="100%" height="100%">
        <polygon points="4,4 4,28 10,28 10,10 28,10 28,4" fill={color} />
        <polygon points="14,14 14,24 18,24 18,18 24,18 24,14" fill={color} opacity="0.7" />
        <rect x="2" y="2" width="5" height="5" fill={color} />
      </svg>
    </div>
  );
}

function GothicCornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 50 50" fill="none" width="100%" height="100%">
        <path d="M 2 2 C 15 2, 25 12, 25 25 C 25 15, 35 2, 48 2 L 48 6 C 35 6, 28 18, 28 28 L 2 2 Z" fill={color} />
      </svg>
    </div>
  );
}

function FleurDeLysCornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
        <path d="M 6 6 L 6 36 L 9 36 L 9 9 L 36 9 L 36 6 Z" fill={color} />
        <path d="M 18 18 C 22 24 28 24 32 18 C 26 32 18 32 18 18 Z" fill={color} />
        <path d="M 24 10 C 26 18 24 24 16 28 C 24 26 26 20 24 10 Z" fill={color} />
        <path d="M 10 24 C 18 26 24 24 28 16 C 26 24 20 26 10 24 Z" fill={color} />
        <circle cx="6" cy="6" r="3.5" fill={color} />
      </svg>
    </div>
  );
}

function LaurelCornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
        <path d="M 6 6 L 6 36 L 9 36 L 9 9 L 36 9 L 36 6 Z" fill={color} />
        <path d="M 12 24 C 16 20 24 18 28 12 C 20 16 16 24 12 24 Z" fill={color} />
        <path d="M 24 12 C 20 16 18 24 12 28 C 16 20 24 16 24 12 Z" fill={color} opacity="0.8" />
        <path d="M 14 14 C 18 10 26 8 30 2 C 22 6 18 14 14 14 Z" fill={color} />
        <path d="M 2 30 C 6 22 14 18 14 14 C 10 18 2 22 2 30 Z" fill={color} />
        <circle cx="6" cy="6" r="3" fill={color} />
      </svg>
    </div>
  );
}

function BaroqueCornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
        <path d="M 4 4 L 4 34 L 7 34 L 7 7 L 34 7 L 34 4 Z" fill={color} />
        <path d="M 12 12 Q 28 12 28 28 Q 12 28 12 12 Z" fill="none" stroke={color} strokeWidth="2" opacity="0.75" />
        <circle cx="20" cy="20" r="4" fill={color} />
        <circle cx="4" cy="4" r="3" fill={color} />
      </svg>
    </div>
  );
}

function DiamondCornerSvg({ className, color }) {
  return (
    <div className={`corner-ornament ${className}`}>
      <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
        <path d="M 4 4 L 4 32 L 7 32 L 7 7 L 32 7 L 32 4 Z" fill={color} />
        <polygon points="18,6 24,18 18,30 12,18" fill={color} opacity="0.85" />
        <polygon points="6,18 18,24 30,18 18,12" fill={color} opacity="0.85" />
        <circle cx="18" cy="18" r="3" fill="#FFFFFF" />
        <circle cx="4" cy="4" r="3" fill={color} />
      </svg>
    </div>
  );
}

function RosaceWatermark({ color }) {
  return (
    <svg className="watermark-bg" viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="1" />
      <path d="M 100 10 C 120 60, 140 60, 190 100 C 140 140, 120 140, 100 190 C 80 140, 60 140, 10 100 C 60 60, 80 60, 100 10 Z" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function ShieldWatermark({ color }) {
  return (
    <svg className="watermark-bg" viewBox="0 0 200 200" fill="none">
      <path d="M 100 20 L 170 50 V 110 C 170 155, 100 185, 100 185 C 100 185, 30 155, 30 110 V 50 Z" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function WaxSeal({ sealBg, goldColor }) {
  return (
    <div style={{ position: "relative", width: "70px", height: "70px" }}>
      <svg width="70" height="85" viewBox="0 0 80 95" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d="M25 50 L15 90 L32 82 L45 92 L38 50 Z" fill={sealBg} opacity="0.85" />
        <path d="M55 50 L42 92 L55 82 L68 90 L58 50 Z" fill={sealBg} opacity="0.75" />
      </svg>
      <svg width="70" height="70" viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx="50" cy="50" r="46" fill={sealBg} />
        <circle cx="50" cy="50" r="40" fill="none" stroke={goldColor} strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="50" cy="50" r="34" fill="none" stroke={goldColor} strokeWidth="1" />
        <path d="M50 28 L54 40 L66 40 L57 48 L60 60 L50 53 L40 60 L43 48 L34 40 L46 40 Z" fill={goldColor} />
      </svg>
    </div>
  );
}

function StarBadge({ goldColor }) {
  return (
    <svg width="65" height="65" viewBox="0 0 100 100">
      <polygon points="50,5 63,25 86,18 80,41 100,55 77,66 77,90 50,78 23,90 23,66 0,55 20,41 14,18 37,25" fill={goldColor} />
      <circle cx="50" cy="50" r="28" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="24" fill="none" stroke={goldColor} strokeWidth="2" />
      <path d="M50 34 L53 43 L62 43 L55 49 L58 58 L50 52 L42 58 L45 49 L38 43 L47 43 Z" fill={goldColor} />
    </svg>
  );
}

function SecurityBadge({ primaryColor, goldColor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", opacity: 0.95 }}>
      <svg width="50" height="50" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill={primaryColor} />
        <circle cx="50" cy="50" r="38" fill="none" stroke={goldColor} strokeWidth="3" />
        <path d="M35 50 L45 60 L68 36" fill="none" stroke={goldColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: "7.5px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px", color: goldColor }}>VERIFIED</span>
    </div>
  );
}

function QrCodeStamp({ verifyUrl }) {
  return (
    <a href={verifyUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ background: "#FFF", padding: "4px", borderRadius: "6px", border: "1px solid #CBD5E1", boxShadow: "0 2px 4px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", opacity: "0.9", alignItems: "center" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          <path d="M14 14h3v3h-3z" /><path d="M18 18h3v3h-3z" /><path d="M14 21h3" /><path d="M21 14v3" />
        </svg>
        <span style={{ fontSize: "7.5px", fontWeight: "700", fontFamily: "monospace", marginTop: "2px", color: "#64748B" }}>SCAN VERIFY</span>
      </div>
    </a>
  );
}
