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
function renderFormattedText(text) {
  if (!text) return null;
  const regex = /(<b>.*?<\/b>|TOSSA Afiavi Gbessito Honorine|Macramé|macrame|Teinture de pagne|teinture de pagne|ONG ESPOIR ET NATURE|ong espoir et nature|Maison AFI COLLECTION du Bénin|Maison AFI COLLECTION du Benin|ONG Internationale ALIMEN-TERRE|ALIMEN-TERRE|ALIMEN-Terre|AJeDSAC|Association des Jeunes Dynamiques pour le Développement Socioéconomique de l’Arrondissement de Colli|AFI COLLECTION|afi collection)/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith("<b>") && part.endsWith("</b>")) {
      return <b key={index}>{part.slice(3, -4)}</b>;
    }
    const lower = part.toLowerCase();
    if (
      lower === "tossa afiavi gbessito honorine" ||
      lower === "macramé" || lower === "macrame" ||
      lower === "teinture de pagne" ||
      lower === "ong espoir et nature" ||
      lower === "maison afi collection du bénin" || lower === "maison afi collection du benin" ||
      lower === "ong internationale alimen-terre" || lower === "alimen-terre" ||
      lower === "ajedsac" ||
      lower === "afi collection"
    ) {
      return <b key={index}>{part}</b>;
    }
    return part;
  });
}

const DEFAULT_DATA = {
  title: "Attestation",
  introText: "Je soussignée Mme <b>TOSSA Afiavi Gbessito Honorine</b>, atteste que le/la nommé(e) :",
  destinataire: "",
  bodyText: "a suivi avec succès et une assiduité le programme de formation en <b>Macramé</b> et <b>Teinture de pagne</b>,",
  partnershipText: "Organisées par la <b>Maison AFI COLLECTION du Benin</b> en partenariat avec l’<b>ONG Internationale ALIMEN-TERRE</b> et l’<b>Association des Jeunes Dynamiques pour le Développement Socioéconomique de l’Arrondissement de Colli (AJeDSAC)</b>.",
  closingText: "En foi de quoi, la présente <b>attestation </b> lui est délivrée pour <b>servir et valoir ce que de droit</b>.",
  villeDelivrance: "Colli",
  dateDelivrance: "2026-07-31",
  numero: "AP-2026-0104",
  signataire: "La Directrice",
  fonction: "(Maison AFI COLLECTION du Bénin)",
  signataire2: "La Présidente",
  fonction2: "(ONG Internationale ALIMEN-Terre)",
  signataire3: "Le Représentant",
  fonction3: "(AJeDSAC)",
};

function ExcellenceShield() {
  return (
    <svg width="64" height="78" viewBox="0 0 64 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* gold outline */}
      <path
        d="M32 2 L58 10 V34 C58 52 46 64 32 70 C18 64 6 52 6 34 V10 Z"
        fill="#c9a227"
      />
      {/* red inner shield */}
      <path
        d="M32 6 L54 13 V34 C54 49.5 43.5 60 32 65.5 C20.5 60 10 49.5 10 34 V13 Z"
        fill="#b3101a"
      />
      {/* ribbon */}
      <path d="M18 66 L32 60 L46 66 L44 78 L32 71 L20 78 Z" fill="#c9a227" />
    </svg>
  );
}

const THEMES = [
  {
    id: "navy-gold-excellence",
    name: "👑 Certificate of Excellence (Bleu & Or)",
    bg: "#FFFFFF",
    border: "#0b1f4b",
    borderSoft: "#d4af37",
    primary: "#0b1f4b",
    accent: "#d4af37",
    gold: "#d4af37",
    sealBg: "#b3101a",
    fontHeader: "'Playfair Display', serif",
    fontBody: "'Playfair Display', serif",
    cardBg: "#FFFFFF",
    hasShield: true,
    hasCornerBrackets: true,
  },
  {
    id: "classic-gold",
    name: "🏆 Or Prestigieux & Parchemin",
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
    name: "🌲 Émeraude Royale & Or Ancien",
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
    name: "🌌 Nuit Luxe Obsidienne (Sombre)",
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
    name: "🍷 Bordeaux Saphir & Rubis",
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
    name: "💎 Bleu Saphir & Argent Impérial",
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
    name: "🌸 Rose Poudré & Or Rose",
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
    name: "📜 Parchemin Authentique Vintage",
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
    name: "💻 Minimaliste Tech & Slate",
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
  },
  {
    id: "black-diamond",
    name: "🏛️ Diamant Noir & Platine (Sombre)",
    bg: "#090A0F",
    border: "#94A3B8",
    borderSoft: "#334155",
    primary: "#F1F5F9",
    accent: "#CBD5E1",
    gold: "#E2E8F0",
    sealBg: "#1E293B",
    fontHeader: "'Cinzel', serif",
    fontBody: "'Cinzel', serif",
    cardBg: "#090A0F",
  },
  {
    id: "sage-gold",
    name: "🌿 Vert Sauge & Doré Végétal",
    bg: "#F2F5F3",
    border: "#2C4A3E",
    borderSoft: "#A3B8B0",
    primary: "#1A3027",
    accent: "#D4AF37",
    gold: "#D4AF37",
    sealBg: "#2C4A3E",
    fontHeader: "'Cormorant Garamond', serif",
    fontBody: "'Cormorant Garamond', serif",
    cardBg: "#F2F5F3",
  },
  {
    id: "imperial-purple",
    name: "⚜️ Violet Impérial & Feuille d'Or",
    bg: "#FAF5FF",
    border: "#4C1D95",
    borderSoft: "#C084FC",
    primary: "#2E1065",
    accent: "#F59E0B",
    gold: "#F59E0B",
    sealBg: "#581C87",
    fontHeader: "'Playfair Display', serif",
    fontBody: "'Playfair Display', serif",
    cardBg: "#FAF5FF",
  },
  {
    id: "amber-sunfire",
    name: "☀️ Ambre Doré & Terre Sienne",
    bg: "#FFFBEB",
    border: "#B45309",
    borderSoft: "#FDE68A",
    primary: "#78350F",
    accent: "#D97706",
    gold: "#F59E0B",
    sealBg: "#9A3412",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FFFBEB",
  },
  {
    id: "arctic-platinum",
    name: "❄️ Arctique Platine & Argent",
    bg: "#F8FAFC",
    border: "#475569",
    borderSoft: "#CBD5E1",
    primary: "#0F172A",
    accent: "#0284C7",
    gold: "#64748B",
    sealBg: "#334155",
    fontHeader: "'Montserrat', sans-serif",
    fontBody: "'Montserrat', sans-serif",
    cardBg: "#F8FAFC",
  },
  {
    id: "terracotta-prestige",
    name: "🎭 Terracotta & Cuivre Antique",
    bg: "#FDF6F0",
    border: "#9A3412",
    borderSoft: "#FDBA74",
    primary: "#431407",
    accent: "#C2410C",
    gold: "#D97706",
    sealBg: "#7C2D12",
    fontHeader: "'Cinzel', serif",
    fontBody: "'Cinzel', serif",
    cardBg: "#FDF6F0",
  },
  {
    id: "ocean-turquoise",
    name: "🌊 Turquoise Océan & Bronze",
    bg: "#F0FDFA",
    border: "#0F766E",
    borderSoft: "#99F6E4",
    primary: "#042F2C",
    accent: "#D97706",
    gold: "#CA8A04",
    sealBg: "#115E59",
    fontHeader: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    cardBg: "#F0FDFA",
  },
  {
    id: "bronze-executive",
    name: "🛡️ Bronze Exécutif & Brun",
    bg: "#FDFBF7",
    border: "#78350F",
    borderSoft: "#D97706",
    primary: "#451A03",
    accent: "#B45309",
    gold: "#D97706",
    sealBg: "#78350F",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FDFBF7",
  },
  {
    id: "champagne-luxe",
    name: "✨ Champagne & Ivoire Royal",
    bg: "#FFFDF9",
    border: "#EAB308",
    borderSoft: "#FEF08A",
    primary: "#713F12",
    accent: "#CA8A04",
    gold: "#EAB308",
    sealBg: "#854D0E",
    fontHeader: "'Playfair Display', serif",
    fontBody: "'Playfair Display', serif",
    cardBg: "#FFFDF9",
  },
  {
    id: "cyber-neon-gold",
    name: "🔮 Cyber Nuit Néon (Sombre)",
    bg: "#05050B",
    border: "#F59E0B",
    borderSoft: "#3B0764",
    primary: "#FAFAF9",
    accent: "#38BDF8",
    gold: "#F59E0B",
    sealBg: "#6B21A8",
    fontHeader: "'Montserrat', sans-serif",
    fontBody: "'Montserrat', sans-serif",
    cardBg: "#05050B",
  },
  {
    id: "academic-crimson",
    name: "🎓 Rouge Académique & Sceau d'État",
    bg: "#FFF8F8",
    border: "#991B1B",
    borderSoft: "#FCA5A5",
    primary: "#450A0A",
    accent: "#D97706",
    gold: "#D97706",
    sealBg: "#7F1D1D",
    fontHeader: "'Times New Roman', Times, serif",
    fontBody: "'Times New Roman', Times, serif",
    cardBg: "#FFF8F8",
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
  
  // Responsive Zoom scale & Mobile View states
  const [zoomScale, setZoomScale] = useState(0.8);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [mobileView, setMobileView] = useState("editor");
  const isMobile = windowWidth < 860;

  // Sidebar Resize and Collapse States
  const [sidebarWidth, setSidebarWidth] = useState(440);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Save Toast Feedback
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Logos (Haut Gauche, Centre & Droit)
  const [leftLogoImg, setLeftLogoImg] = useState(null);
  const [leftLogoSize, setLeftLogoSize] = useState(75);
  const [centerLogoImg, setCenterLogoImg] = useState(null);
  const [centerLogoSize, setCenterLogoSize] = useState(75);
  const [rightLogoImg, setRightLogoImg] = useState(null);
  const [rightLogoSize, setRightLogoSize] = useState(75);

  // Triple Signatories & Visibility Toggles
  const [enableSecondSignatory, setEnableSecondSignatory] = useState(true);
  const [showSig1, setShowSig1] = useState(false);
  const [showSig2, setShowSig2] = useState(false);
  const [showSig3, setShowSig3] = useState(false);
  const [customSignatureImg2, setCustomSignatureImg2] = useState(null);
  const [customSignatureImg3, setCustomSignatureImg3] = useState(null);
  const [sig3Size, setSig3Size] = useState(70);

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
  const [customTitleFont, setCustomTitleFont] = useState("'Times New Roman', Times, serif");
  const [customTitleSize, setCustomTitleSize] = useState(52);
  const [customTitleColor, setCustomTitleColor] = useState("");

  const [introFont, setIntroFont] = useState("'Times New Roman', Times, serif");
  const [introSize, setIntroSize] = useState(20);

  const [customNameFont, setCustomNameFont] = useState("'Times New Roman', Times, serif");
  const [customNameSize, setCustomNameSize] = useState(34);
  const [customNameColor, setCustomNameColor] = useState("");
  const [isNameBold, setIsNameBold] = useState(true);
  const [isNameItalic, setIsNameItalic] = useState(false);

  const [bodyFont, setBodyFont] = useState("'Times New Roman', Times, serif");
  const [bodySize, setBodySize] = useState(20);

  const [partnershipFont, setPartnershipFont] = useState("'Times New Roman', Times, serif");
  const [partnershipSize, setPartnershipSize] = useState(20);

  const [closingFont, setClosingFont] = useState("'Times New Roman', Times, serif");
  const [closingSize, setClosingSize] = useState(20);

  const [datePlaceFont, setDatePlaceFont] = useState("'Times New Roman', Times, serif");
  const [datePlaceSize, setDatePlaceSize] = useState(20);

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

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

  // Touch Drag & Interactive Direct Edit States
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragMode, setDragMode] = useState(false);
  const [positions, setPositions] = useState({
    seal: { x: 0, y: 0 },
    sig1: { x: 0, y: 0 },
    sig2: { x: 0, y: 0 },
    stamp: { x: 0, y: 0 },
    logoLeft: { x: 0, y: 0 },
    logoRight: { x: 0, y: 0 },
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

  const handleCenterLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCenterLogoImg(evt.target.result);
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
      reader.onload = (evt) => {
        setCustomSignatureImg(evt.target.result);
        setShowSig1(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignature2Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCustomSignatureImg2(evt.target.result);
        setShowSig2(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignature3Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCustomSignatureImg3(evt.target.result);
        setShowSig3(true);
      };
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,500&family=Alex+Brush&display=swap');
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
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
          opacity: ${bgOpacity};
          pointer-events: none;
          z-index: 1;
        }

        /* 20 CUSTOMIZABLE PRO BORDER STYLES */
        .frame-layer-custom-outer {
          position: absolute;
          inset: ${borderInset}px;
          border-style: ${
            borderStyle === "dashed" || borderStyle === "dashed_double" ? "dashed" :
            borderStyle === "dotted" ? "dotted" :
            borderStyle === "groove" ? "groove" :
            borderStyle === "ridge" ? "ridge" :
            borderStyle === "inset" ? "inset" :
            borderStyle === "outset" ? "outset" :
            borderStyle === "double" || borderStyle === "triple" || borderStyle === "ornamental" || borderStyle === "vintage" || borderStyle === "baroque_gold" || borderStyle === "academic" ? "double" :
            borderStyle === "none" ? "none" : "solid"
          };
          border-width: ${
            borderStyle === "none" ? "0px" :
            borderStyle === "diplomat" ? `${borderWidth + 6}px` :
            borderStyle === "double" || borderStyle === "baroque_gold" ? `${borderWidth + 4}px` :
            borderStyle === "triple" || borderStyle === "vintage" ? `${borderWidth + 6}px` :
            borderStyle === "art_deco" ? `${borderWidth + 3}px` : `${borderWidth}px`
          };
          border-color: ${activeBorderColor};
          pointer-events: none;
          z-index: 2;
          box-shadow: ${
            borderStyle === "glow_neon" ? `0 0 20px ${activeBorderColor}, inset 0 0 15px ${activeBorderColor}aa` :
            borderStyle === "ornamental" || borderStyle === "vintage" || borderStyle === "baroque_gold" ? `0 0 14px ${activeBorderColor}44` : "none"
          };
          border-radius: ${borderStyle === "art_deco" ? "12px" : "0px"};
        }

        .frame-layer-custom-inner {
          position: absolute;
          inset: ${borderInset + 8}px;
          border-style: ${borderStyle === "dashed" || borderStyle === "dashed_double" ? "dashed" : "solid"};
          border-width: ${
            borderStyle === "double" || borderStyle === "triple" || borderStyle === "ornamental" || borderStyle === "vintage" || borderStyle === "baroque_gold" || borderStyle === "diplomat" || borderStyle === "academic" || borderStyle === "guilloche" ? "1px" : "0px"
          };
          border-color: ${customBorderColor || activeTheme.borderSoft || activeBorderColor};
          pointer-events: none;
          z-index: 2;
          border-radius: ${borderStyle === "art_deco" ? "8px" : "0px"};
        }

        .frame-layer-custom-triple {
          position: absolute;
          inset: ${borderInset + 16}px;
          border-style: ${borderStyle === "guilloche" ? "dashed" : "solid"};
          border-width: ${borderStyle === "triple" || borderStyle === "vintage" || borderStyle === "baroque_gold" || borderStyle === "guilloche" ? "1px" : "0px"};
          border-color: ${activeBorderColor};
          pointer-events: none;
          z-index: 2;
          opacity: 0.7;
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

        /* HEADER SECTION WITH PERFECT BALANCED GRID & ADAPTIVE TITLE */
        .cert-header-layout {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(120px, 1fr) auto minmax(120px, 1fr);
          align-items: center;
          padding-top: 2px;
          gap: 16px;
          position: relative;
        }

        .header-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-logo-box.left {
          justify-content: flex-start;
        }

        .header-logo-box.right {
          justify-content: flex-end;
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
          justify-content: center;
          text-align: center;
        }

        /* PRESTIGIOUS TITLE STYLING WITH ADAPTIVE RESPONSIVE SIZING */
        .main-title {
          font-family: ${customTitleFont || "'Great Vibes', cursive"};
          font-size: ${activeTheme.id === "navy-gold-excellence" ? "clamp(36px, 5.5vw, 56px)" : `clamp(28px, 5vw, ${customTitleSize}px)`};
          font-weight: 700;
          color: ${customTitleColor || activeTheme.primary};
          line-height: 1.1;
          margin-top: 2px;
          margin-bottom: 2px;
          white-space: nowrap;
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 2px 0;
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
          gap: 3px;
          margin: -4px 0 2px 0;
          flex-grow: 1;
          justify-content: flex-start;
        }

        .intro-phrase {
          font-family: ${introFont};
          font-size: ${introSize}px;
          color: ${activeTheme.primary};
          line-height: 1.3;
        }

        .recipient-name-block {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 2px 0;
        }

        .recipient-name {
          font-family: ${customNameFont};
          font-size: ${customNameSize}px;
          font-weight: ${isNameBold ? "700" : "400"};
          font-style: ${isNameItalic ? "italic" : "normal"};
          color: ${customNameColor || activeTheme.primary};
          line-height: 1.2;
          padding: 2px 28px;
          border-bottom: 2px solid ${activeTheme.primary};
          min-width: 440px;
          text-align: center;
          letter-spacing: 0.03em;
        }

        .body-phrase {
          font-family: ${bodyFont};
          font-size: ${bodySize}px;
          color: ${activeTheme.primary};
          line-height: 1.35;
          max-width: 800px;
          text-align: center;
          font-weight: 400;
        }

        .partnership-phrase {
          font-family: ${partnershipFont};
          font-size: ${partnershipSize}px;
          font-style: normal;
          color: ${activeTheme.primary};
          max-width: 760px;
          line-height: 1.3;
          opacity: 0.95;
        }

        .closing-phrase {
          font-family: ${closingFont};
          font-size: ${closingSize}px;
          color: ${activeTheme.primary};
          line-height: 1.3;
        }

        /* FAIT À HOUEGBO LE 31 JUILLET 2026 */
        .date-place-tag {
          font-family: ${datePlaceFont};
          font-size: ${datePlaceSize}px;
          font-style: normal;
          font-weight: 600;
          color: ${activeTheme.primary};
          margin-top: 4px;
          margin-bottom: 4px;
        }

        /* FOOTER SECTION & TRIPLE SIGNATORIES */
        .cert-footer {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
          margin-top: auto;
          padding-bottom: 4px;
        }

        .signature-corner-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          position: relative;
          flex: 1;
        }

        .signature-corner-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          flex: 1;
        }

        .signature-corner-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          position: relative;
          flex: 1;
        }

        .signature-display {
          display: flex;
          align-items: flex-end;
          margin-bottom: 6px;
          height: 48px;
          width: 100%;
          position: relative;
        }

        .signature-img {
          position: absolute;
          bottom: -5px;
          object-fit: contain;
          transform: rotate(-2deg);
          z-index: 5;
          pointer-events: none;
        }
        .signature-corner-left .signature-img { left: 0; }
        .signature-corner-right .signature-img { right: 0; }

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
          <span>Modifications enregistrées avec succès !</span>
        </div>
      )}

      {celebrated && (
        <div className="celebrate-banner">
          <span>Félicitations pour cette belle réussite !</span>
        </div>
      )}

      {/* MOBILE VIEW TOGGLE SWITCHER (< 860px) */}
      <div className="mobile-view-tabs no-print">
        <button 
          type="button"
          className={`mobile-view-btn ${mobileView === "editor" ? "active" : ""}`}
          onClick={() => setMobileView("editor")}
        >
          Formulaire d'Édition
        </button>
        <button 
          type="button"
          className={`mobile-view-btn ${mobileView === "preview" ? "active" : ""}`}
          onClick={() => setMobileView("preview")}
        >
          Aperçu ({Math.round(zoomScale * 100)}%)
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
              Contenu
            </button>
            <button className={`tab-btn ${activeTab === "style" ? "active" : ""}`} onClick={() => setActiveTab("style")}>
              Format & Thèmes
            </button>
            <button className={`tab-btn ${activeTab === "logos" ? "active" : ""}`} onClick={() => setActiveTab("logos")}>
              Logos & Fond
            </button>
            <button className={`tab-btn ${activeTab === "signature" ? "active" : ""}`} onClick={() => setActiveTab("signature")}>
              Signataires & Cachet
            </button>
            <button className={`tab-btn ${activeTab === "border" ? "active" : ""}`} onClick={() => setActiveTab("border")}>
              Bordures
            </button>
            <button className={`tab-btn ${activeTab === "typography" ? "active" : ""}`} onClick={() => setActiveTab("typography")}>
              Polices
            </button>
            <button className={`tab-btn ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
              Masse
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 1: CONTENT WITH SAVE BUTTON */}
            {activeTab === "content" && (
              <>
                <button className="btn btn-save-content" onClick={handleSaveContent} style={{ width: "100%", justifyContent: "center", marginBottom: "4px" }}>
                  Enregistrer les modifications
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
                      max={380}
                      value={leftLogoSize}
                      onChange={(e) => setLeftLogoSize(Number(e.target.value))}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {[
                        { label: "Petit", size: 60 },
                        { label: "Moyen", size: 100 },
                        { label: "Grand", size: 160 },
                        { label: "Géant", size: 220 },
                        { label: "XXL", size: 280 },
                        { label: "Maxi XL", size: 350 }
                      ].map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          className={`chip ${leftLogoSize === p.size ? "active" : ""}`}
                          onClick={() => setLeftLogoSize(p.size)}
                          style={{ padding: "3px 8px", fontSize: "10px" }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {leftLogoImg && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setLeftLogoImg(null)} style={{ marginTop: "6px" }}>
                      Supprimer logo gauche
                    </button>
                  )}
                </div>

                {/* LOGO 2 CENTRE (ONG ALIMEN-TERRE) */}
                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#805AD5" }}>🏛️ Logo 2 : Haut-Centre (ex: ONG ALIMEN-TERRE)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Téléverser Logo Centre (PNG / JPEG)</label>
                    <input type="file" accept="image/*" onChange={handleCenterLogoUpload} />
                  </div>

                  <div className="input-group">
                    <label>Taille du Logo Centre ({centerLogoSize}px)</label>
                    <input
                      type="range"
                      min={30}
                      max={380}
                      value={centerLogoSize}
                      onChange={(e) => setCenterLogoSize(Number(e.target.value))}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {[
                        { label: "Petit", size: 60 },
                        { label: "Moyen", size: 100 },
                        { label: "Grand", size: 160 },
                        { label: "Géant", size: 220 },
                        { label: "XXL", size: 280 }
                      ].map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          className={`chip ${centerLogoSize === p.size ? "active" : ""}`}
                          onClick={() => setCenterLogoSize(p.size)}
                          style={{ padding: "3px 8px", fontSize: "10px" }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {centerLogoImg && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setCenterLogoImg(null)} style={{ marginTop: "6px" }}>
                      Supprimer logo centre
                    </button>
                  )}
                </div>

                {/* LOGO 3 DROIT (AJEDSAC) */}
                <div className="presets-box" style={{ marginTop: "10px" }}>
                  <label style={{ color: "#2563EB" }}>👉 Logo 3 : Haut-Droit (ex: AJeDSAC)</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Téléverser Logo Droit (PNG / JPEG)</label>
                    <input type="file" accept="image/*" onChange={handleRightLogoUpload} />
                  </div>

                  <div className="input-group">
                    <label>Taille du Logo Droit ({rightLogoSize}px)</label>
                    <input
                      type="range"
                      min={30}
                      max={380}
                      value={rightLogoSize}
                      onChange={(e) => setRightLogoSize(Number(e.target.value))}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {[
                        { label: "Petit", size: 60 },
                        { label: "Moyen", size: 100 },
                        { label: "Grand", size: 160 },
                        { label: "Géant", size: 220 },
                        { label: "XXL", size: 280 }
                      ].map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          className={`chip ${rightLogoSize === p.size ? "active" : ""}`}
                          onClick={() => setRightLogoSize(p.size)}
                          style={{ padding: "3px 8px", fontSize: "10px" }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
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
                {/* SIGNATORY 1 (DIRECTEUR) */}
                <div className="presets-box">
                  <label style={{ color: "#2563EB", fontWeight: "800", fontSize: "13px" }}>
                    ✍️ Signature du Directeur (Signataire Gauche)
                  </label>
                  
                  {/* UPLOAD BOX DIRECTEUR */}
                  <div className="input-group" style={{ margin: "8px 0", padding: "10px", border: "1.5px dashed #2563EB", borderRadius: "8px", background: "#F0F6FF" }}>
                    <label style={{ color: "#1D4ED8", fontWeight: "700" }}>📥 Importer Signature PNG (Directeur)</label>
                    <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{ marginTop: "4px" }} />
                    {customSignatureImg && (
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={customSignatureImg} alt="Aperçu Directeur" style={{ height: "36px", objectFit: "contain", background: "#fff", padding: "2px", borderRadius: "4px", border: "1px solid #CBD5E1" }} />
                        <button className="btn btn-secondary btn-sm" onClick={() => setCustomSignatureImg(null)}>
                          Supprimer
                        </button>
                      </div>
                    )}
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

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <button
                      type="button"
                      className={`chip ${showSig1 ? "active" : ""}`}
                      onClick={() => setShowSig1(!showSig1)}
                      style={{ padding: "6px 12px", fontSize: "11.5px", width: "100%", justifyContent: "center" }}
                    >
                      {showSig1 ? "👁️ Signature Directeur : Affichée" : "🚫 Signature Directeur : Masquée (Espace manuscrit)"}
                    </button>
                  </div>

                  {showSig1 && (
                    <>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label style={{ color: "#2563EB" }}>📏 Taille Signature Directeur ({sig1Size}px)</label>
                        <input
                          type="range"
                          min={30}
                          max={160}
                          value={sig1Size}
                          onChange={(e) => setSig1Size(Number(e.target.value))}
                        />
                      </div>

                      <div className="input-group">
                        <label>Ou Dessiner la Signature au Doigt / Souris</label>
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

                {/* SIGNATORY 2 (PRÉSIDENTE ALIMEN-TERRE) */}
                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <label style={{ color: "#805AD5", fontWeight: "800", fontSize: "13px" }}>
                    ✍️ Signature 2 : La Présidente (ONG ALIMEN-Terre)
                  </label>

                  {/* UPLOAD BOX PRÉSIDENTE */}
                  <div className="input-group" style={{ margin: "8px 0", padding: "10px", border: "1.5px dashed #805AD5", borderRadius: "8px", background: "#FAF5FF" }}>
                    <label style={{ color: "#6B21A8", fontWeight: "700" }}>📥 Importer Signature PNG (Présidente)</label>
                    <input type="file" accept="image/*" onChange={handleSignature2Upload} style={{ marginTop: "4px" }} />
                    {customSignatureImg2 && (
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={customSignatureImg2} alt="Aperçu Présidente" style={{ height: "36px", objectFit: "contain", background: "#fff", padding: "2px", borderRadius: "4px", border: "1px solid #CBD5E1" }} />
                        <button className="btn btn-secondary btn-sm" onClick={() => setCustomSignatureImg2(null)}>
                          Supprimer
                        </button>
                      </div>
                    )}
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

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <button
                      type="button"
                      className={`chip ${showSig2 ? "active" : ""}`}
                      onClick={() => setShowSig2(!showSig2)}
                      style={{ padding: "6px 12px", fontSize: "11.5px", width: "100%", justifyContent: "center" }}
                    >
                      {showSig2 ? "👁️ Signature Présidente : Affichée" : "🚫 Signature Présidente : Masquée (Espace manuscrit)"}
                    </button>
                  </div>

                  {showSig2 && (
                    <div className="input-group">
                      <label style={{ color: "#805AD5" }}>📏 Taille Signature Présidente ({sig2Size}px)</label>
                      <input
                        type="range"
                        min={30}
                        max={160}
                        value={sig2Size}
                        onChange={(e) => setSig2Size(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>

                {/* SIGNATORY 3 (REPRÉSENTANT AJEDSAC) */}
                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <label style={{ color: "#2563EB", fontWeight: "800", fontSize: "13px" }}>
                    ✍️ Signature 3 : Le Représentant (AJeDSAC)
                  </label>

                  {/* UPLOAD BOX REPRÉSENTANT */}
                  <div className="input-group" style={{ margin: "8px 0", padding: "10px", border: "1.5px dashed #2563EB", borderRadius: "8px", background: "#EFF6FF" }}>
                    <label style={{ color: "#1E40AF", fontWeight: "700" }}>📥 Importer Signature PNG (Représentant)</label>
                    <input type="file" accept="image/*" onChange={handleSignature3Upload} style={{ marginTop: "4px" }} />
                    {customSignatureImg3 && (
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={customSignatureImg3} alt="Aperçu Représentant" style={{ height: "36px", objectFit: "contain", background: "#fff", padding: "2px", borderRadius: "4px", border: "1px solid #CBD5E1" }} />
                        <button className="btn btn-secondary btn-sm" onClick={() => setCustomSignatureImg3(null)}>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid-2" style={{ marginBottom: "8px" }}>
                    <div className="input-group">
                      <label>Titre / Fonction</label>
                      <input type="text" value={data.signataire3 || ""} onChange={setField("signataire3")} placeholder="Le Représentant" />
                    </div>
                    <div className="input-group">
                      <label>Structure</label>
                      <input type="text" value={data.fonction3 || ""} onChange={setField("fonction3")} placeholder="(AJeDSAC)" />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <button
                      type="button"
                      className={`chip ${showSig3 ? "active" : ""}`}
                      onClick={() => setShowSig3(!showSig3)}
                      style={{ padding: "6px 12px", fontSize: "11.5px", width: "100%", justifyContent: "center" }}
                    >
                      {showSig3 ? "👁️ Signature Représentant : Affichée" : "🚫 Signature Représentant : Masquée (Espace manuscrit)"}
                    </button>
                  </div>

                  {showSig3 && (
                    <div className="input-group">
                      <label style={{ color: "#2563EB" }}>📏 Taille Signature Représentant ({sig3Size}px)</label>
                      <input
                        type="range"
                        min={30}
                        max={160}
                        value={sig3Size}
                        onChange={(e) => setSig3Size(Number(e.target.value))}
                      />
                    </div>
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

            {/* TAB 5: BORDER & CADRES PRO (20 STYLES) */}
            {activeTab === "border" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563EB" }}>🖼️ 20 Styles de Bordures Pro & d'Élite</label>
                  <div className="grid-2" style={{ marginBottom: "14px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
                    {[
                      { id: "double", label: "👑 Double Cadre Royal" },
                      { id: "triple", label: "⚜️ Triple Linéaire Prestige" },
                      { id: "single", label: "🔲 Cadre Simple Épuré" },
                      { id: "dashed", label: "✂️ Pointillé Luxe" },
                      { id: "groove", label: "🏛️ Sculpté 3D Groove" },
                      { id: "ridge", label: "✨ Moulure 3D Ridge" },
                      { id: "ornamental", label: "🏆 Ornemental Lumineux" },
                      { id: "vintage", label: "📜 Vintage Filigrané" },
                      { id: "inset", label: "💠 Inset 3D Encastré" },
                      { id: "outset", label: "🖼️ Outset 3D Saillant" },
                      { id: "dotted", label: "🌟 Perles & Points" },
                      { id: "dashed_double", label: "⚡ Mix Pointillé & Double" },
                      { id: "art_deco", label: "💎 Art Déco 1920" },
                      { id: "guilloche", label: "🌿 Guilloché Banque" },
                      { id: "diplomat", label: "🎖️ Diplomatique Épais" },
                      { id: "academic", label: "🎓 Académique National" },
                      { id: "shield_border", label: "🛡️ Armoirie & Équilibre" },
                      { id: "glow_neon", label: "🔮 Halo Néon Lumineux" },
                      { id: "baroque_gold", label: "⚜️ Baroque Feuille d'Or" },
                      { id: "none", label: "🚫 Sans Bordure" }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={`chip ${borderStyle === b.id ? "active" : ""}`}
                        onClick={() => setBorderStyle(b.id)}
                        style={{ padding: "6px 8px", fontSize: "11px", textAlign: "left" }}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  <label style={{ color: "#2563EB", marginTop: "10px" }}>🎨 Palette de Couleurs Pro Préréglées</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {[
                      { label: "👑 Doré Impérial", color: "#D4AF37" },
                      { label: "💙 Bleu Marine", color: "#0B1F4B" },
                      { label: "💎 Or Rose", color: "#E5B899" },
                      { label: "🌲 Émeraude Luxe", color: "#064E3B" },
                      { label: "🍷 Bordeau Royal", color: "#7F1D1D" },
                      { label: "🖤 Noir Obsidienne", color: "#0F172A" },
                      { label: "🥈 Argent Métallisé", color: "#94A3B8" }
                    ].map((swatch) => (
                      <button
                        key={swatch.label}
                        type="button"
                        className={`chip ${customBorderColor === swatch.color ? "active" : ""}`}
                        onClick={() => setCustomBorderColor(swatch.color)}
                        style={{ padding: "4px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}
                      >
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: swatch.color, border: "1px solid #ffffff", display: "inline-block" }} />
                        {swatch.label}
                      </button>
                    ))}
                  </div>

                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <label>Sélecteur de Couleur Sur-Mesure</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={activeBorderColor}
                        onChange={(e) => setCustomBorderColor(e.target.value)}
                        style={{ height: "38px", padding: "2px", cursor: "pointer", flex: 1, borderRadius: "6px" }}
                      />
                      {customBorderColor && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setCustomBorderColor("")}>
                          Couleur du Thème
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Épaisseur du trait ({borderWidth}px)</label>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                    />
                  </div>

                  <div className="input-group">
                    <label>Marge de retrait interne ({borderInset}px)</label>
                    <input
                      type="range"
                      min={6}
                      max={42}
                      value={borderInset}
                      onChange={(e) => setBorderInset(Number(e.target.value))}
                    />
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
                Paysage
              </button>
              <button
                className={`format-bar-btn ${pageFormat === "portrait" ? "active" : ""}`}
                onClick={() => setPageFormat("portrait")}
              >
                Portrait
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
                {copied ? "Copie !" : "Copier"}
              </button>

              {/* DIRECT PDF DOWNLOAD BUTTON */}
              <button className="btn btn-pdf" onClick={handleExportPDF} disabled={isDownloadingPDF}>
                {isDownloadingPDF ? "PDF..." : "Télécharger PDF"}
              </button>

              {/* HD PNG DOWNLOAD BUTTON */}
              <button className="btn btn-download" onClick={handleExportPNG} disabled={isDownloading}>
                {isDownloading ? "PNG..." : "Image HD (PNG)"}
              </button>

              <button className="btn btn-celebrate" onClick={handleCelebrate}>
                Célébrer !
              </button>

              <button className="btn btn-primary" onClick={handlePrint}>
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

                {/* NAVY & GOLD EXCELLENCE SPECIFIC ORNAMENTS */}
                {activeTheme.id === "navy-gold-excellence" && (
                  <>
                    {/* OUTER GOLD PERIMETER BORDER */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "18px",
                        border: "2px solid #d4af37",
                        pointerEvents: "none",
                        zIndex: 3
                      }}
                    />
                    {/* INNER NAVY PERIMETER BORDER */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "34px",
                        border: "1.5px solid #0b1f4b",
                        pointerEvents: "none",
                        zIndex: 3
                      }}
                    />

                    {/* TOP-LEFT NAVY BRACKET */}
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "6px",
                        width: "220px",
                        height: "90px",
                        borderTop: "16px solid #0b1f4b",
                        borderLeft: "16px solid #0b1f4b",
                        pointerEvents: "none",
                        zIndex: 4
                      }}
                    />
                    {/* GOLD DIAGONAL ACCENT TOP-LEFT */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-4px",
                        left: "-4px",
                        width: "60px",
                        height: "2px",
                        background: "#d4af37",
                        transform: "rotate(45deg)",
                        transformOrigin: "left top",
                        pointerEvents: "none",
                        zIndex: 4
                      }}
                    />

                    {/* BOTTOM-RIGHT NAVY BRACKET */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "6px",
                        width: "220px",
                        height: "90px",
                        borderBottom: "16px solid #0b1f4b",
                        borderRight: "16px solid #0b1f4b",
                        pointerEvents: "none",
                        zIndex: 4
                      }}
                    />
                    {/* GOLD DIAGONAL ACCENT BOTTOM-RIGHT */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-4px",
                        right: "-4px",
                        width: "60px",
                        height: "2px",
                        background: "#d4af37",
                        transform: "rotate(45deg)",
                        transformOrigin: "right bottom",
                        pointerEvents: "none",
                        zIndex: 4
                      }}
                    />
                  </>
                )}

                {/* WATERMARK BACKGROUND SVG */}
                {!customBgImg && watermark === "rosace" && <RosaceWatermark color={activeTheme.gold} />}
                {!customBgImg && watermark === "shield" && <ShieldWatermark color={activeTheme.gold} />}

                {/* INNER CONTENT WITH FULL DYNAMIC TYPOGRAPHY */}
                <div className="cert-inner-content">
                  {/* TOP 3 PARTNER LOGOS ROW */}
                  <div className="cert-header-logos-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 14px", marginBottom: "18px", minHeight: "80px" }}>
                    {/* LOGO 1 (GAUCHE - MAISON AFI) */}
                    <div className="header-logo-box left" style={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                      {leftLogoImg ? (
                        <img
                          src={leftLogoImg}
                          alt="Logo 1 (Maison AFI)"
                          className="header-logo-img-left"
                          style={{ maxHeight: `${leftLogoSize}px`, maxWidth: "170px", objectFit: "contain" }}
                        />
                      ) : (
                        <div style={{ border: "1.5px dashed #CBD5E1", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", color: "#64748B", fontWeight: "600", background: "#F8FAFC", textAlign: "center" }}>
                          🖼️ Logo 1 (Maison AFI)
                        </div>
                      )}
                    </div>

                    {/* LOGO 2 (CENTRE - ONG ALIMEN-TERRE) */}
                    <div className="header-logo-box center" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {centerLogoImg ? (
                        <img
                          src={centerLogoImg}
                          alt="Logo 2 (ALIMEN-TERRE)"
                          className="header-logo-img-center"
                          style={{ maxHeight: `${centerLogoSize}px`, maxWidth: "170px", objectFit: "contain" }}
                        />
                      ) : (
                        <div style={{ border: "1.5px dashed #805AD5", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", color: "#6B21A8", fontWeight: "600", background: "#FAF5FF", textAlign: "center" }}>
                          🏛️ Logo 2 (ALIMEN-TERRE)
                        </div>
                      )}
                    </div>

                    {/* LOGO 3 (DROIT - AJEDSAC) */}
                    <div className="header-logo-box right" style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      {rightLogoImg ? (
                        <img
                          src={rightLogoImg}
                          alt="Logo 3 (AJeDSAC)"
                          className="header-logo-img-right"
                          style={{ maxHeight: `${rightLogoSize}px`, maxWidth: "170px", objectFit: "contain" }}
                        />
                      ) : (
                        <div style={{ border: "1.5px dashed #2563EB", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", color: "#1E40AF", fontWeight: "600", background: "#EFF6FF", textAlign: "center" }}>
                          👉 Logo 3 (AJeDSAC)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MAIN TITLE ATTESTATION */}
                  <header className="cert-header-layout" style={{ justifyContent: "center", marginTop: "10px", marginBottom: "14px" }}>
                    <div 
                      className={`cert-header-center interactive-tappable ${selectedElement === "title" ? "active-selected" : ""}`}
                      onClick={() => setSelectedElement("title")}
                    >
                      <h1 
                        className="main-title"
                        style={{
                          fontSize: activeTheme.id === "navy-gold-excellence" ? "clamp(36px, 5.5vw, 56px)" : `clamp(28px, 5vw, ${customTitleSize}px)`,
                          letterSpacing: activeTheme.id === "navy-gold-excellence" ? "0.08em" : "normal",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          margin: 0
                        }}
                      >
                        {data.title || "ATTESTATION"}
                      </h1>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0 0 0", justifyContent: "center" }}>
                        <span style={{ width: "40px", height: "1px", background: "#d4af37" }} />
                        <span style={{ width: "6px", height: "6px", transform: "rotate(45deg)", backgroundColor: "#0b1f4b", display: "inline-block" }} />
                        <span style={{ width: "8px", height: "8px", transform: "rotate(45deg)", backgroundColor: "#d4af37", display: "inline-block" }} />
                        <span style={{ width: "6px", height: "6px", transform: "rotate(45deg)", backgroundColor: "#0b1f4b", display: "inline-block" }} />
                        <span style={{ width: "40px", height: "1px", background: "#d4af37" }} />
                      </div>
                    </div>
                  </header>

                  {/* BODY CONTENT - EACH ELEMENT USES ITS CUSTOM FONT & SIZE */}
                  <div className="cert-body-flow">
                    <p className="intro-phrase">
                      {renderFormattedText(data.introText || "Je soussignée Mme <b>TOSSA Afiavi Gbessito Honorine</b>, atteste que le/la nommé(e) :")}
                    </p>

                    <div 
                      className={`recipient-name-block interactive-tappable ${selectedElement === "destinataire" ? "active-selected" : ""}`}
                      onClick={() => setSelectedElement("destinataire")}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0", width: "100%" }}
                    >
                      <div className="recipient-name" style={{ minWidth: "480px", textAlign: "center", minHeight: "36px" }}>
                        {data.destinataire || ""}
                      </div>
                    </div>

                    <p className="body-phrase">
                      {renderFormattedText(data.bodyText || "a suivi avec succès et une assiduité le programme de formation en <b>Macramé</b> et <b>Teinture de pagne</b>,")}
                    </p>

                    <p className="partnership-phrase">
                      {renderFormattedText(data.partnershipText || "organisée par l'<b>ONG ESPOIR ET NATURE</b> en partenariat avec la <b>Maison AFI COLLECTION du Bénin</b>.")}
                    </p>

                    <p className="closing-phrase">
                      {renderFormattedText(data.closingText || "En foi de quoi, la présente <b>attestation </b> lui est délivrée pour <b>servir et valoir ce que de droit</b>.")}
                    </p>

                    {/* LOCATION, DATE & OFFICIAL SEAL */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <div 
                        className={`date-place-tag interactive-tappable ${selectedElement === "datePlace" ? "active-selected" : ""}`}
                        onClick={() => setSelectedElement("datePlace")}
                      >
                        Fait à <b>{data.villeDelivrance || "Colli"}</b> le <b>{formatDateFR(data.dateDelivrance) || "31 juillet 2026"}</b>
                      </div>

                      {/* OFFICIAL SEAL & AUTH NUMBER */}
                      <div 
                        className={`seal-center-footer interactive-tappable touch-movable ${selectedElement === "seal" ? "active-selected" : ""}`}
                        onClick={() => setSelectedElement("seal")}
                        onTouchStart={(e) => handleTouchStart('seal', e)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                          transform: `translate(${positions.seal?.x || 0}px, ${positions.seal?.y || 0}px)`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center"
                        }}
                      >
                        {customStampImg ? (
                          <img
                            src={customStampImg}
                            alt="Cachet Officiel"
                            className="custom-stamp-img"
                            style={{ maxWidth: `${stampSize}px`, maxHeight: `${stampSize}px` }}
                          />
                        ) : (
                          <div style={{ transform: `scale(${stampSize / 70})`, transformOrigin: "center center" }}>
                            {sealType === "wax" && <WaxSeal sealBg={activeTheme.sealBg} goldColor={activeTheme.gold} />}
                            {sealType === "star" && <StarBadge goldColor={activeTheme.gold} />}
                            {sealType === "badge" && <SecurityBadge primaryColor={activeTheme.primary} goldColor={activeTheme.gold} />}
                            {sealType === "qr" && <QrCodeStamp verifyUrl={`${verifyBaseUrl}${data.numero}`} />}
                          </div>
                        )}
                        {data.numero ? <div className="auth-num-footer" style={{ marginTop: "2px" }}>N° {data.numero}</div> : null}
                      </div>
                    </div>
                  </div>

                  {/* FOOTER & SIGNATORIES */}
                  <footer className="cert-footer">
                    {/* SIGNATORY 1 (LEFT) */}
                    <div 
                      className={`signature-corner-left interactive-tappable touch-movable ${selectedElement === "signataire" ? "active-selected" : ""}`}
                      onClick={() => setSelectedElement("signataire")}
                      onTouchStart={(e) => handleTouchStart('sig1', e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        transform: `translate(${positions.sig1?.x || 0}px, ${positions.sig1?.y || 0}px)`
                      }}
                    >
                      <div className="signature-display" style={{ height: "48px" }}>
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
                      <div className="signatory-name">{data.signataire || "La Directrice"}</div>
                      <div className="signatory-title">{data.fonction || "(Maison AFI COLLECTION du Bénin)"}</div>
                    </div>

                    {/* SIGNATORY 2 (CENTER) */}
                    <div 
                      className={`signature-corner-center interactive-tappable touch-movable ${selectedElement === "signataire" ? "active-selected" : ""}`}
                      onClick={() => setSelectedElement("signataire")}
                      onTouchStart={(e) => handleTouchStart('sig2', e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        transform: `translate(${positions.sig2?.x || 0}px, ${positions.sig2?.y || 0}px)`
                      }}
                    >
                      <div className="signature-display" style={{ height: "48px", justifyContent: "center" }}>
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

                      <div className="signature-line-corner" style={{ margin: "0 auto" }} />
                      <div className="signatory-name">{data.signataire2 || "La Présidente"}</div>
                      <div className="signatory-title">{data.fonction2 || "(ONG ALIMEN-Terre)"}</div>
                    </div>

                    {/* SIGNATORY 3 (RIGHT) */}
                    <div 
                      className={`signature-corner-right interactive-tappable touch-movable ${selectedElement === "signataire" ? "active-selected" : ""}`}
                      onClick={() => setSelectedElement("signataire")}
                      onTouchStart={(e) => handleTouchStart('sig3', e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        transform: `translate(${positions.sig3?.x || 0}px, ${positions.sig3?.y || 0}px)`
                      }}
                    >
                      <div className="signature-display" style={{ height: "48px" }}>
                        {showSig3 ? (
                          customSignatureImg3 ? (
                            <img src={customSignatureImg3} alt="Signature 3" className="signature-img" style={{ maxHeight: `${sig3Size}px` }} />
                          ) : (
                            <div className="signature-handwriting" style={{ fontSize: `${Math.round(sig3Size * 0.55 + 10)}px` }}>
                              {data.signataire3 || "Signature 3"}
                            </div>
                          )
                        ) : null}
                      </div>

                      <div className="signature-line-corner" />
                      <div className="signatory-name">{data.signataire3 || "Le Représentant"}</div>
                      <div className="signatory-title">{data.fonction3 || "(AJeDSAC)"}</div>
                    </div>
                  </footer>
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
              Éditer {selectedElement === "destinataire" ? "le Bénéficiaire" : selectedElement === "title" ? "le Titre" : selectedElement === "datePlace" ? "Lieu & Date" : selectedElement === "signataire" ? "le Signataire" : "Sceau & Tampon"}
            </span>
            <button className="quick-sheet-close" onClick={() => setSelectedElement(null)}>✕</button>
          </div>

          <div className="quick-sheet-content">
            {selectedElement === "destinataire" && (
              <div className="input-group">
                <label>Nom du Bénéficiaire</label>
                <input 
                  type="text" 
                  value={data.destinataire} 
                  onChange={(e) => setData(prev => ({ ...prev, destinataire: e.target.value }))}
                  placeholder="Ex: Madame AKAKPO Chantal"
                  autoFocus
                />
              </div>
            )}

            {selectedElement === "title" && (
              <div className="input-group">
                <label>Titre de l'Attestation</label>
                <input 
                  type="text" 
                  value={data.title} 
                  onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                  autoFocus
                />
              </div>
            )}

            {selectedElement === "datePlace" && (
              <div className="grid-2">
                <div className="input-group">
                  <label>Ville de Délivrance</label>
                  <input 
                    type="text" 
                    value={data.villeDelivrance} 
                    onChange={(e) => setData(prev => ({ ...prev, villeDelivrance: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label>Date de Délivrance</label>
                  <input 
                    type="date" 
                    value={data.dateDelivrance} 
                    onChange={(e) => setData(prev => ({ ...prev, dateDelivrance: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {selectedElement === "signataire" && (
              <div className="grid-2">
                <div className="input-group">
                  <label>Nom du Signataire</label>
                  <input 
                    type="text" 
                    value={data.signataire} 
                    onChange={(e) => setData(prev => ({ ...prev, signataire: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label>Titre / Fonction</label>
                  <input 
                    type="text" 
                    value={data.fonction} 
                    onChange={(e) => setData(prev => ({ ...prev, fonction: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {selectedElement === "seal" && (
              <div className="input-group">
                <label>Taille du Sceau / Tampon ({stampSize}px)</label>
                <input 
                  type="range"
                  min="40"
                  max="120"
                  value={stampSize}
                  onChange={(e) => setStampSize(parseInt(e.target.value))}
                />
              </div>
            )}

            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: "10px" }}
                onClick={() => setSelectedElement(null)}
              >
                Appliquer
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
          <span>Saisie</span>
        </button>

        <button 
          className={`mobile-bottom-btn ${mobileView === "preview" && !dragMode ? "active" : ""}`}
          onClick={() => { setMobileView("preview"); setDragMode(false); }}
        >
          <span>Aperçu</span>
        </button>

        <button 
          className={`mobile-bottom-btn ${dragMode ? "active" : ""}`}
          onClick={() => { setMobileView("preview"); setDragMode(!dragMode); }}
        >
          <span>{dragMode ? "Posé" : "Déplacer"}</span>
        </button>

        <button 
          className="mobile-bottom-btn"
          onClick={() => {
            const nextIdx = (THEMES.indexOf(activeTheme) + 1) % THEMES.length;
            setActiveTheme(THEMES[nextIdx]);
          }}
        >
          <span>Thème</span>
        </button>

        <button 
          className="mobile-bottom-btn"
          onClick={handleExportPDF}
        >
          <span>Export PDF</span>
        </button>
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

function ExecutiveProCrest({ goldColor = "#d4af37", primaryColor = "#0b1f4b" }) {
  return (
    <div style={{ position: "relative", width: "76px", height: "90px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* LUXURY SATIN RIBBONS */}
      <svg width="68" height="90" viewBox="0 0 80 100" style={{ position: "absolute", top: 0, left: 4 }}>
        <path d="M22 55 L12 96 L32 86 L45 98 L38 55 Z" fill={primaryColor} opacity="0.95" />
        <path d="M58 55 L42 98 L55 86 L68 96 L58 55 Z" fill={primaryColor} opacity="0.85" />
        <path d="M25 55 L15 96 L22 92 Z" fill={goldColor} opacity="0.75" />
        <path d="M55 55 L65 96 L58 92 Z" fill={goldColor} opacity="0.75" />
      </svg>
      {/* EMBOSSED GOLD & NAVY OFFICIAL SEAL */}
      <svg width="72" height="72" viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 2, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>
        <path d="M50 2 L56 8 L64 4 L68 12 L77 10 L79 19 L88 20 L87 29 L95 33 L91 41 L98 47 L92 53 L97 61 L89 65 L91 74 L82 76 L81 85 L72 85 L68 93 L60 91 L54 97 L48 93 L41 97 L37 91 L29 93 L26 85 L17 85 L16 76 L7 74 L9 65 L2 61 L6 53 L1 47 L7 41 L3 33 L11 29 L10 20 L19 19 L21 10 L30 12 L34 4 L42 8 Z" fill={goldColor} />
        <circle cx="50" cy="50" r="38" fill={primaryColor} />
        <circle cx="50" cy="50" r="34" fill="none" stroke={goldColor} strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke={goldColor} strokeWidth="1.5" />
        <path d="M50 32 L53 40 L62 40 L55 46 L58 55 L50 49 L42 55 L45 46 L38 40 L47 40 Z" fill={goldColor} />
      </svg>
    </div>
  );
}

function WaxSeal({ sealBg, goldColor }) {
  return <ExecutiveProCrest goldColor={goldColor} primaryColor={sealBg} />;
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
