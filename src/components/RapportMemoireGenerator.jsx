import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, ArrowLeft, BookOpen, Plus, Trash2, RefreshCw, Layers, CheckCircle2, User, Award } from "./Icons.jsx";
import CoverPagePrestige from "./CoverPagePrestige.jsx";

const RAPPORT_PRESETS = [
  {
    name: "🩺 Exposé Paramédical & Santé (Planification Familiale)",
    coverStyle: "prestige_institutional",
    data: {
      instituteName: "Institut national de la formation supérieure paramédicale",
      instituteSubtitle: "SAHNOUNE LAKHDAR BECHAR",
      specialityLabel: "Spécialité",
      speciality: "1ᵉʳ année ASSP",
      exposeLabel: "Exposé sur",
      title: "La Planification familiale",
      preparedByLabel: "Préparé par",
      students: ["HAMADA ASMA", "HAIDAS MEBAREKA", "HAMIDAOUI MERIEM", "HOUCINI MOUNA"],
      professorLabel: "Prof",
      professor: "BENYOUCEF",
      yearLabel: "Année pédagogique",
      year: "2023/2024",
    },
    chapters: [
      {
        id: 1,
        title: "Chapitre 1 : Introduction et Définition de la Planification Familiale",
        content: `La planification familiale est l'ensemble des moyens et méthodes mis à la disposition des personnes et des couples pour leur permettre de choisir librement le moment d'avoir des enfants et d'espacer les naissances.\n\nDans le domaine paramédical et de la santé publique, la planification familiale joue un rôle crucial dans la réduction de la mortalité maternelle et infantile, l'amélioration de la santé des femmes et le bien-être économique des foyers.`,
      },
      {
        id: 2,
        title: "Chapitre 2 : Méthodes Contraceptives et Rôle des Soignants",
        content: `Les méthodes contraceptives se divisent principalement en plusieurs catégories :\n- Les méthodes hormonales (pilules, implants, injections).\n- Les méthodes de barrière (préservatifs, stérilets / DIU).\n- Les méthodes naturelles (observation du cycle).\n\nLe rôle des professionnels paramédicaux (soignants, infirmiers, sages-femmes) réside dans la sensibilisation, l'écoute sans jugement et le suivi adapté à chaque patiente.`,
      },
      {
        id: 3,
        title: "Chapitre 3 : Conclusion et Recommandations Sanitaires",
        content: `En conclusion, la promotion de la planification familiale constitue un pilier fondamental des politiques de santé publique.\n\nRecommandations principales :\n1. Renforcer l'éducation sanitaire dans les établissements scolaires et centres de santé.\n2. Assurer la disponibilité continue des contraceptifs dans les structures paramédicales.\n3. Former régulièrement les agents de santé aux nouvelles directives internationales.`,
      },
    ]
  },
  {
    name: "🎓 Mémoire de Master en Génie Logiciel",
    coverStyle: "prestige_institutional",
    data: {
      instituteName: "UNIVERSITÉ D'ABOMEY-CALAVI (UAC)",
      instituteSubtitle: "Institut de Formation et de Recherche en Informatique (IFRI)",
      specialityLabel: "Spécialité",
      speciality: "Master 2 Génie Logiciel & SI",
      exposeLabel: "Mémoire de fin d'études sur",
      title: "Conception d'une Plateforme de Génération de Documents Officiels",
      preparedByLabel: "Présenté par",
      students: ["TOSSA Afiavi Gbessito Honorine"],
      professorLabel: "Sous la direction de",
      professor: "Dr. Koffi MENSAH",
      yearLabel: "Année Académique",
      year: "2025/2026",
    },
    chapters: [
      {
        id: 1,
        title: "Chapitre 1 : Contexte et Problématique",
        content: `La gestion et la génération automatisée de documents officiels (attestations, certificats, factures, rapports) posent des défis majeurs d'authenticité et d'ergonomie.\n\nCe travail propose une architecture web moderne basée sur React 19 et Vite pour garantir une prévisualisation WYSIWYG en temps réel et un export PDF HD conforme aux normes internationales.`,
      },
      {
        id: 2,
        title: "Chapitre 2 : Déploiement et Résultats",
        content: `L'implémentation du studio créatif DocStudio a permis d'accélérer la production des documents officiels de 85% tout en maintenant un niveau d'esthétique de haute distinction.`,
      },
    ]
  }
];

const RAPPORT_THEMES = [
  {
    id: "violet-prestige",
    name: "⚜️ Violet Impérial & Volutes (#8f7bc4)",
    primaryColor: "#4A7FC1",
    accentColor: "#4A7FC1",
    ornamentColor: "#8F7BC4",
    fontHeader: "'Times New Roman', serif",
  },
  {
    id: "classic-navy",
    name: "👑 Bleu Exécutif & Or (#0b1f4b)",
    primaryColor: "#0B1F4B",
    accentColor: "#0B1F4B",
    ornamentColor: "#D4AF37",
    fontHeader: "'Times New Roman', serif",
  },
  {
    id: "emerald-univ",
    name: "🌲 Émeraude Royale (#064e3b)",
    primaryColor: "#064E3B",
    accentColor: "#064E3B",
    ornamentColor: "#10B981",
    fontHeader: "'Times New Roman', serif",
  },
  {
    id: "bordeaux-royal",
    name: "🍷 Bordeaux Prestige (#581820)",
    primaryColor: "#581820",
    accentColor: "#581820",
    ornamentColor: "#B8860B",
    fontHeader: "'Times New Roman', serif",
  }
];

export default function RapportMemoireGenerator({ onBack }) {
  const [data, setData] = useState({ ...RAPPORT_PRESETS[0].data });
  const [chapters, setChapters] = useState([ ...RAPPORT_PRESETS[0].chapters ]);
  const [newStudent, setNewStudent] = useState("");

  const [activeTab, setActiveTab] = useState("cover");
  const [activeTheme, setActiveTheme] = useState(RAPPORT_THEMES[0]);
  const [customAccentColor, setCustomAccentColor] = useState("");
  const [customOrnamentColor, setCustomOrnamentColor] = useState("");
  
  // Logos
  const [logoImg, setLogoImg] = useState(null);
  const [logoLeftImg, setLogoLeftImg] = useState(null);
  const [logoRightImg, setLogoRightImg] = useState(null);
  const [logoSize, setLogoSize] = useState(80);
  const [establishmentMarginTop, setEstablishmentMarginTop] = useState(15);
  
  // Customization of Cover Page
  const [bgImage, setBgImage] = useState(null);
  const [bgOpacity, setBgOpacity] = useState(0.15);
  const [bgFit, setBgFit] = useState("contain");
  const [borderStyle, setBorderStyle] = useState("double");
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderInset, setBorderInset] = useState(26);
  const [showVolutes, setShowVolutes] = useState(true);
  
  // Theme Box / Title Banner Sizing
  const [titleRadius, setTitleRadius] = useState(16);
  const [titleFontSize, setTitleFontSize] = useState(32);
  const [titleBoxPaddingV, setTitleBoxPaddingV] = useState(28);
  const [titleBoxMinHeight, setTitleBoxMinHeight] = useState(100);
  const [verticalGap, setVerticalGap] = useState(20);

  const [zoomScale, setZoomScale] = useState(0.75);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [mobileView, setMobileView] = useState("editor");
  const isMobile = windowWidth < 860;
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const updateAutoZoom = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 860) {
        const availableWidth = Math.max(260, w - 32);
        const autoZoom = Math.max(0.3, Math.min(0.95, availableWidth / 794));
        setZoomScale(Number(autoZoom.toFixed(2)));
      } else {
        setZoomScale(0.75);
      }
    };
    updateAutoZoom();
    window.addEventListener("resize", updateAutoZoom);
    return () => window.removeEventListener("resize", updateAutoZoom);
  }, []);

  const previewContainerRef = useRef(null);

  const accentColor = customAccentColor || activeTheme.accentColor;
  const ornamentColor = customOrnamentColor || activeTheme.ornamentColor;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loadPreset = (preset) => {
    setData({ ...preset.data });
    setChapters([ ...preset.chapters ]);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setLogoImg(uploadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoLeftUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setLogoLeftImg(uploadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRightUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setLogoRightImg(uploadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setBgImage(uploadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addStudent = () => {
    if (newStudent.trim()) {
      const current = Array.isArray(data.students) ? data.students : [];
      setData({ ...data, students: [...current, newStudent.trim()] });
      setNewStudent("");
    }
  };

  const removeStudent = (idx) => {
    const current = Array.isArray(data.students) ? data.students : [];
    setData({ ...data, students: current.filter((_, i) => i !== idx) });
  };

  const addChapter = () => {
    const num = chapters.length + 1;
    setChapters([
      ...chapters,
      {
        id: Date.now(),
        title: `Chapitre ${num} : Nouveau Chapitre`,
        content: `Rédigez ici le contenu détaillé de votre chapitre...`,
      },
    ]);
  };

  const removeChapter = (id) => {
    setChapters(chapters.filter((c) => c.id !== id));
  };

  const updateChapter = (id, field, value) => {
    setChapters(chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const exportPDF = async () => {
    if (!previewContainerRef.current) return;
    setIsExporting(true);
    try {
      const pageElements = previewContainerRef.current.querySelectorAll(".report-page");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            const svgs = clonedDoc.querySelectorAll("svg");
            svgs.forEach((svg) => {
              svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            });
          }
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Rapport_${(data.title || "Document").slice(0, 20).replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF Rapport:", err);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const studentsList = Array.isArray(data.students) ? data.students : [data.auteur || "Étudiant"];

  return (
    <div className="wrap">
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
          Aperçu Rapport ({Math.round(zoomScale * 100)}%)
        </button>
      </div>

      <div className={`workspace ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* LEFT SIDEBAR CONTROLS */}
        <aside className={`sidebar ${isMobile && mobileView !== "editor" ? "mobile-hidden" : ""}`}>
          <div className="sidebar-header">
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" /> Hub
            </button>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen style={{ width: "20px", height: "20px", color: "#2563eb" }} /> Studio Rapports Multi-Pages
            </h2>
          </div>

          {/* TABS HEADER */}
          <div className="sidebar-tabs">
            <button className={`tab-btn ${activeTab === "presets" ? "active" : ""}`} onClick={() => setActiveTab("presets")}>
              ✨ Presets
            </button>
            <button className={`tab-btn ${activeTab === "cover" ? "active" : ""}`} onClick={() => setActiveTab("cover")}>
              🖼️ Couverture
            </button>
            <button className={`tab-btn ${activeTab === "logos" ? "active" : ""}`} onClick={() => setActiveTab("logos")}>
              🛡️ Logos & Position
            </button>
            <button className={`tab-btn ${activeTab === "theme_box" ? "active" : ""}`} onClick={() => setActiveTab("theme_box")}>
              📐 Espace du Thème
            </button>
            <button className={`tab-btn ${activeTab === "students" ? "active" : ""}`} onClick={() => setActiveTab("students")}>
              👥 Auteurs
            </button>
            <button className={`tab-btn ${activeTab === "chapters" ? "active" : ""}`} onClick={() => setActiveTab("chapters")}>
              📑 Chapitres
            </button>
          </div>

          <div className="sidebar-content">
            {/* TAB 1: PRESETS */}
            {activeTab === "presets" && (
              <div className="presets-box">
                <label style={{ color: "#2563eb", fontWeight: "700" }}>🚀 Modèles & Exposés Prêts à l'Emploi</label>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 12px 0" }}>
                  Sélectionnez un modèle pré-rempli pour vous inspirer et générer votre rapport avec page de garde.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {RAPPORT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chip"
                      onClick={() => loadPreset(p)}
                      style={{ textAlign: "left", padding: "10px 14px", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span>{p.name}</span>
                      <span style={{ fontSize: "10px", color: "#2563eb" }}>Charger</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: COVER PAGE TEXTS */}
            {activeTab === "cover" && (
              <>
                <div className="input-group">
                  <label>Nom de l'Établissement / Institut</label>
                  <textarea rows={2} name="instituteName" value={data.instituteName || data.institution || ""} onChange={handleChange} placeholder="ex: Institut national de la formation supérieure paramédicale" />
                </div>

                <div className="input-group">
                  <label>Sous-titre Établissement / Ville</label>
                  <input type="text" name="instituteSubtitle" value={data.instituteSubtitle || data.faculte || ""} onChange={handleChange} placeholder="ex: SAHNOUNE LAKHDAR BECHAR" />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Label Spécialité</label>
                    <input type="text" name="specialityLabel" value={data.specialityLabel || "Spécialité"} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Nom de la Spécialité</label>
                    <input type="text" name="speciality" value={data.speciality || "1ᵉʳ année ASSP"} onChange={handleChange} />
                  </div>
                </div>

                <div className="input-group">
                  <label>Label du Sujet / Titre (Centré)</label>
                  <input type="text" name="exposeLabel" value={data.exposeLabel || "THÈME :"} onChange={handleChange} placeholder="ex: THÈME :" />
                </div>

                <div className="input-group">
                  <label>Titre Principal du Rapport / Exposé</label>
                  <textarea rows={2} name="title" value={data.title || data.titre || ""} onChange={handleChange} placeholder="ex: La Planification familiale" style={{ fontWeight: "700" }} />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Professeur / Encadrant</label>
                    <input type="text" name="professor" value={data.professor || data.encadrant || ""} onChange={handleChange} placeholder="ex: BENYOUCEF" />
                  </div>
                  <div className="input-group">
                    <label>Année Pédagogique</label>
                    <input type="text" name="year" value={data.year || data.annee || ""} onChange={handleChange} placeholder="ex: 2023/2024" />
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: LOGOS GAUCHE / DROIT & POSITION ÉTABLISSEMENT */}
            {activeTab === "logos" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🛡️ Logos Haut-Gauche & Haut-Droit</label>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 10px 0" }}>
                    Insérez 2 logos côte à côte (ex: Ministère à gauche, Université à droite).
                  </p>

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>1. Logo Haut-Gauche</label>
                    <input type="file" accept="image/*" onChange={handleLogoLeftUpload} />
                  </div>
                  {logoLeftImg && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLogoLeftImg(null)} style={{ marginBottom: "10px" }}>
                      Supprimer Logo Gauche
                    </button>
                  )}

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>2. Logo Haut-Droit</label>
                    <input type="file" accept="image/*" onChange={handleLogoRightUpload} />
                  </div>
                  {logoRightImg && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLogoRightImg(null)} style={{ marginBottom: "10px" }}>
                      Supprimer Logo Droit
                    </button>
                  )}

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>3. Logo Central (Optionnel si pas de logos G/D)</label>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} />
                  </div>

                  <div className="input-group">
                    <label>Taille des Logos ({logoSize}px)</label>
                    <input type="range" min={50} max={280} value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} />
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                      {[
                        { label: "Moyen", size: 80 },
                        { label: "Grand", size: 130 },
                        { label: "Géant", size: 180 },
                        { label: "XXL", size: 230 },
                        { label: "Maxi XL", size: 280 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          className={`chip ${logoSize === preset.size ? "active" : ""}`}
                          onClick={() => setLogoSize(preset.size)}
                          style={{ padding: "3px 8px", fontSize: "11px" }}
                        >
                          {preset.label} ({preset.size}px)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>⬇️ Position du Nom de l'Établissement</label>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 10px 0" }}>
                    Ramenez légèrement en bas le nom de l'établissement par rapport aux logos.
                  </p>
                  <div className="input-group">
                    <label>Décalage vers le bas ({establishmentMarginTop}px)</label>
                    <input type="range" min={0} max={80} value={establishmentMarginTop} onChange={(e) => setEstablishmentMarginTop(Number(e.target.value))} />
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: THEME BOX SIZING & BORDERS */}
            {activeTab === "theme_box" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>📐 Agrandir l'Espace du Thème (Bannière de Titre)</label>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 10px 0" }}>
                    Agrandissez à volonté l'espace du bloc de titre et son épaisseur.
                  </p>

                  <div className="input-group">
                    <label>Hauteur minimale du Thème ({titleBoxMinHeight}px)</label>
                    <input type="range" min={60} max={250} value={titleBoxMinHeight} onChange={(e) => setTitleBoxMinHeight(Number(e.target.value))} />
                  </div>

                  <div className="input-group">
                    <label>Épaisseur / Marge interne verticale ({titleBoxPaddingV}px)</label>
                    <input type="range" min={10} max={80} value={titleBoxPaddingV} onChange={(e) => setTitleBoxPaddingV(Number(e.target.value))} />
                  </div>

                  <div className="input-group">
                    <label>Taille de la Police du Titre ({titleFontSize}px)</label>
                    <input type="range" min={20} max={54} value={titleFontSize} onChange={(e) => setTitleFontSize(Number(e.target.value))} />
                  </div>

                  <div className="input-group">
                    <label>Arrondi du Cadre ({titleRadius}px)</label>
                    <input type="range" min={0} max={40} value={titleRadius} onChange={(e) => setTitleRadius(Number(e.target.value))} />
                  </div>
                </div>

                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🖼️ Bordures & Volutes</label>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
                    <input type="checkbox" id="volutesCheck" checked={showVolutes} onChange={(e) => setShowVolutes(e.target.checked)} />
                    <label htmlFor="volutesCheck" style={{ fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                      ⚜️ Volutes d'Angle Ornementales
                    </label>
                  </div>

                  <div className="input-group">
                    <label>Style & Forme de Bordure Graphique</label>
                    <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)}>
                      <option value="double">Double Royal (Filet Double + Volutes)</option>
                      <option value="triple">Triple Prestige (Trois Filets D'Honneur)</option>
                      <option value="art_deco">Art Déco 1920 (Angles Sculptés & Biseautés)</option>
                      <option value="guilloche">Guilloché Banque (Gravure & Rosaces)</option>
                      <option value="baroque">Baroque Sculpté (Fleurots d'Angle)</option>
                      <option value="solid">Simple Épuré</option>
                      <option value="dashed">Pointillé Luxe (Rangée Perlée)</option>
                      <option value="groove">Groove 3D Sculpté</option>
                      <option value="ridge">Ridge 3D Relief</option>
                      <option value="none">Sans Bordure</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Épaisseur de Bordure ({borderWidth}px)</label>
                    <input type="range" min={1} max={8} value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} />
                  </div>

                  <div className="input-group">
                    <label>Retrait de la Bordure ({borderInset}px)</label>
                    <input type="range" min={15} max={45} value={borderInset} onChange={(e) => setBorderInset(Number(e.target.value))} />
                  </div>
                </div>

                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🖼️ Image de Fond / Filigrane</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Charger une Image de Fond (PNG / JPG)</label>
                    <input type="file" accept="image/*" onChange={handleBgUpload} />
                  </div>
                  {bgImage && (
                    <>
                      <div className="input-group">
                        <label>Opacité ({Math.round(bgOpacity * 100)}%)</label>
                        <input type="range" min={0.05} max={1} step={0.05} value={bgOpacity} onChange={(e) => setBgOpacity(Number(e.target.value))} />
                      </div>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setBgImage(null)}>
                        Supprimer l'image de fond
                      </button>
                    </>
                  )}
                </div>

                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🎨 Couleurs du Thème</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px", marginBottom: "12px" }}>
                    {RAPPORT_THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className={`chip ${activeTheme.id === th.id && !customAccentColor ? "active" : ""}`}
                        onClick={() => { setActiveTheme(th); setCustomAccentColor(""); setCustomOrnamentColor(""); }}
                        style={{ padding: "8px", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: th.primaryColor, border: "1px solid #ffffff", display: "inline-block" }} />
                        <span style={{ fontSize: "11px", fontWeight: "700" }}>{th.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Couleur du Cadre de Titre</label>
                    <input type="color" value={accentColor} onChange={(e) => setCustomAccentColor(e.target.value)} style={{ height: "36px", cursor: "pointer", width: "100%" }} />
                  </div>

                  <div className="input-group">
                    <label>Couleur des Volutes / Bordures</label>
                    <input type="color" value={ornamentColor} onChange={(e) => setCustomOrnamentColor(e.target.value)} style={{ height: "36px", cursor: "pointer", width: "100%" }} />
                  </div>
                </div>
              </>
            )}

            {/* TAB 5: STUDENTS & AUTHORS */}
            {activeTab === "students" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>👥 Liste des Élèves / Rédacteurs ("Préparé par")</label>
                  <div className="input-group" style={{ marginTop: "6px", marginBottom: "8px" }}>
                    <label>Label de la section</label>
                    <input type="text" name="preparedByLabel" value={data.preparedByLabel || "Préparé par"} onChange={handleChange} />
                  </div>

                  <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                    <input type="text" value={newStudent} onChange={(e) => setNewStudent(e.target.value)} placeholder="Nom et Prénom de l'élève..." onKeyDown={(e) => e.key === "Enter" && addStudent()} />
                    <button type="button" className="btn btn-secondary" onClick={addStudent}>+ Ajouter</button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {studentsList.map((s, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontWeight: "700", fontSize: "13px" }}>• {s}</span>
                        <button type="button" onClick={() => removeStudent(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 6: CHAPTERS */}
            {activeTab === "chapters" && (
              <>
                <div className="presets-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ color: "#2563eb", fontWeight: "700" }}>📑 Chapitres & Contenu du Rapport</label>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addChapter}>
                      <Plus className="w-3.5 h-3.5" /> Chapitre
                    </button>
                  </div>

                  {chapters.map((ch) => (
                    <div key={ch.id} style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "6px" }}>
                        <input type="text" value={ch.title} onChange={(e) => updateChapter(ch.id, "title", e.target.value)} style={{ fontWeight: "700" }} placeholder="Titre du Chapitre" />
                        <button type="button" onClick={() => removeChapter(ch.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea rows={4} value={ch.content} onChange={(e) => updateChapter(ch.id, "content", e.target.value)} placeholder="Contenu du chapitre..." />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ padding: "16px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
            <button className="btn btn-primary" onClick={exportPDF} disabled={isExporting} style={{ width: "100%", justifyContent: "center" }}>
              <Download className="w-4 h-4" /> Export PDF HD Multi-Pages
            </button>
          </div>
        </aside>

        {/* RIGHT PREVIEW CANVAS WORKSPACE */}
        <main className={`preview-area ${isMobile && mobileView !== "preview" ? "mobile-hidden" : ""}`}>
          <div className="preview-toolbar no-print">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{ fontSize: "11.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {sidebarCollapsed ? "▶ Déplier le Studio" : "◀ Plier le Studio"}
              </button>

              <div className="zoom-controls" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#475569", marginRight: "4px" }}>Zoom:</span>
                {[
                  { label: "50%", scale: 0.50 },
                  { label: "75%", scale: 0.75 },
                  { label: "100%", scale: 1.00 },
                  { label: "120%", scale: 1.20 }
                ].map((z) => (
                  <button
                    key={z.label}
                    type="button"
                    className={`zoom-btn ${Math.abs(zoomScale - z.scale) < 0.02 ? "active" : ""}`}
                    onClick={() => setZoomScale(z.scale)}
                    style={{ padding: "4px 8px", fontSize: "11px" }}
                  >
                    {z.label}
                  </button>
                ))}
                <button className="zoom-btn" onClick={() => setZoomScale(Math.max(0.3, Number((zoomScale - 0.05).toFixed(2))))}>-</button>
                <button className="zoom-btn" onClick={() => setZoomScale(Math.min(1.4, Number((zoomScale + 0.05).toFixed(2))))}>+</button>
              </div>
            </div>

            <div className="btn-group">
              <button className="btn btn-primary btn-sm" onClick={exportPDF} disabled={isExporting}>
                <Download className="w-4 h-4" /> PDF Multi-Pages
              </button>
            </div>
          </div>

          {/* THE MULTI-PAGE REPORT PREVIEW CONTAINER */}
          <div className="cert-scroll" ref={previewContainerRef}>
            <div className="cert-scale-wrapper" style={{ transform: `scale(${zoomScale})`, transformOrigin: "top center", display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* PAGE 1: COVER PAGE PRESTIGE */}
              <div className="report-page">
                <CoverPagePrestige
                  data={{
                    ...data,
                    students: studentsList,
                    logoUrl: logoImg || data.logoUrl,
                    logoLeftUrl: logoLeftImg,
                    logoRightUrl: logoRightImg
                  }}
                  accentColor={accentColor}
                  ornamentColor={ornamentColor}
                  bgImage={bgImage}
                  bgOpacity={bgOpacity}
                  bgFit={bgFit}
                  borderStyle={borderStyle}
                  borderWidth={borderWidth}
                  borderInset={borderInset}
                  showVolutes={showVolutes}
                  titleRadius={titleRadius}
                  titleFontSize={titleFontSize}
                  titleBoxPaddingV={titleBoxPaddingV}
                  titleBoxMinHeight={titleBoxMinHeight}
                  establishmentMarginTop={establishmentMarginTop}
                  logoSize={logoSize}
                  verticalGap={verticalGap}
                />
              </div>

              {/* PAGES 2+: CHAPTERS & CONTENT */}
              {chapters.map((ch, idx) => (
                <div 
                  key={ch.id}
                  className="report-page"
                  style={{
                    width: "794px",
                    minHeight: "1123px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    borderRadius: "2px",
                    padding: "60px 50px",
                    fontFamily: "'Times New Roman', Times, serif",
                    position: "relative",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  {/* Page Header */}
                  <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontStyle: "italic", color: "#64748b" }}>{data.title || data.titre}</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: accentColor }}>{data.instituteSubtitle || "Rapport Officiel"}</span>
                  </div>

                  {/* Chapter Body */}
                  <div style={{ flex: 1, padding: "30px 0" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: accentColor, marginBottom: "20px", borderLeft: `4px solid ${ornamentColor}`, paddingLeft: "12px" }}>
                      {ch.title}
                    </h2>
                    <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#334155", whitespace: "pre-wrap" }}>
                      {ch.content}
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
                    <span>{data.instituteName ? data.instituteName.slice(0, 45) + "..." : "DocStudio"}</span>
                    <span>Page {idx + 2} sur {chapters.length + 1}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
