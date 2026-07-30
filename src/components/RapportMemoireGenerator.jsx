import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, ArrowLeft, BookOpen, Plus, Trash2, RefreshCw, Layers, CheckCircle2 } from "./Icons.jsx";

const RAPPORT_PRESETS = [
  {
    name: "🎓 Mémoire de Master en Génie Logiciel",
    data: {
      institution: "UNIVERSITÉ D'ABOMEY-CALAVI (UAC)",
      faculte: "Institut de Formation et de Recherche en Informatique (IFRI)",
      titre: "CONCEPTION ET MISE EN ŒUVRE D'UNE PLATEFORME INTELLIGENTE DE GÉNÉRATION ET DE VALIDATION DE DOCUMENTS OFFICIELS",
      soustitre: "Mémoire de fin de cycle pour l'obtention du diplôme de Master en Génie Logiciel",
      auteur: "Présenté par : TOSSA Afiavi Gbessito Honorine",
      encadrant: "Sous la direction de : Dr. Koffi MENSAH (Maître de Conférences)",
      annee: "Année Académique : 2025 - 2026",
      lieuDate: "Cotonou, Bénin",
    },
    chapters: [
      {
        id: 1,
        title: "Chapitre 1 : Introduction Générale et Contexte",
        content: `Dans le contexte de la transformation numérique moderne, la gestion sécurisée et automatisée des documents officiels est devenue un enjeu stratégique pour les institutions d'enseignement et les organisations d'Afrique de l'Ouest.\n\nCe mémoire examine les défis liés à l'émission rapide, l'authentification et l'archivage d'attestations de formation, de courriers administratifs et de rapports académiques. L'objectif principal est d'apporter une solution logicielle performante, intuitive et hautement personnalisable.`,
      },
      {
        id: 2,
        title: "Chapitre 2 : Analyse des Besoins et Architecture Système",
        content: `L'analyse des besoins fonctionnels fait ressortir la nécessité d'une interface WYSIWYG (What You See Is What You Get) permettant la prévisualisation en temps réel de tous les types de documents.\n\nDu point de vue de l'architecture, la solution s'appuie sur React.js et Vite pour le rendu côté client, couplé à une suite d'exportation vectorielle et d'outils de manipulation HTML2Canvas et jsPDF pour une fidélité absolue des rendus A4.`,
      },
      {
        id: 3,
        title: "Chapitre 3 : Résultats, Tests et Perspectives",
        content: `Les tests d'utilisabilité menés auprès d'un panel de directeurs de formation ont démontré une réduction de 85% du temps de traitement nécessaire à l'émission d'une attestation ou d'un rapport complet.\n\nEn perspective, l'intégration de puces NFC et de signatures numériques cryptographiques permettra d'offrir une traçabilité totale contre les falsifications.`,
      },
    ]
  },
  {
    name: "💼 Rapport de Stage de Fin d'Études",
    data: {
      institution: "INSTITUT AFI COLLECTION DU BÉNIN",
      faculte: "Département des Sciences Informatiques & Digitales",
      titre: "RAPPORT DE STAGE : DÉVELOPPEMENT ET DÉPLOIEMENT D'UNE APPLICATION DE GESTION DES ATTESTATIONS",
      soustitre: "Rapport de fin de stage professionnel effectué au sein du studio créatif DocStudio",
      auteur: "Rédigé par : AFI Gbessito Honorine",
      encadrant: "Maître de stage : M. Johao DOSSEH (Directeur Technique)",
      annee: "Période du Stage : Février - Juillet 2026",
      lieuDate: "Cotonou, Bénin",
    },
    chapters: [
      {
        id: 1,
        title: "Chapitre 1 : Présentation de la Structure d'Accueil",
        content: `La Maison AFI COLLECTION est une entreprise spécialisée dans l'ingénierie numérique et l'accompagnement des organisations dans la gestion des processus administratifs.\n\nAu cours de ce stage de 6 mois, j'ai été intégrée au pôle Développement Web & UI/UX avec pour mission principale la création du module de génération dynamique d'attestations et de documents administratifs.`,
      },
      {
        id: 2,
        title: "Chapitre 2 : Travaux Réalisés et Difficultés Rencontrées",
        content: `Mes activités principales ont porté sur :\n1. Le développement des composants de prévisualisation A4 en direct avec React.js.\n2. La mise en place du système d'exportation PDF haute définition via HTML2Canvas.\n3. L'optimisation des performances de rendu pour garantir un affichage fluide à 60 FPS.`,
      },
    ]
  }
];

const RAPPORT_THEMES = [
  {
    id: "classic-navy",
    name: "Académique Navy",
    primaryColor: "#0F172A",
    accentColor: "#2563EB",
    fontHeader: "'Cinzel', serif",
  },
  {
    id: "prestige-bordeaux",
    name: "Prestige Bordeaux & Or",
    primaryColor: "#450A0A",
    accentColor: "#B8860B",
    fontHeader: "'Playfair Display', serif",
  },
  {
    id: "emerald-univ",
    name: "Universitaire Émeraude",
    primaryColor: "#064E3B",
    accentColor: "#059669",
    fontHeader: "'Cinzel', serif",
  }
];

export default function RapportMemoireGenerator({ onBack }) {
  const [data, setData] = useState({ ...RAPPORT_PRESETS[0].data });
  const [chapters, setChapters] = useState([ ...RAPPORT_PRESETS[0].chapters ]);

  const [activeTab, setActiveTab] = useState("presets");
  const [activeTheme, setActiveTheme] = useState(RAPPORT_THEMES[0]);
  const [showOrnaments, setShowOrnaments] = useState(true);
  const [watermarkText, setWatermarkText] = useState("");
  const [zoomScale, setZoomScale] = useState(0.75);

  const [logoImg, setLogoImg] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const previewContainerRef = useRef(null);

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
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Memoire_${data.titre.slice(0, 20).replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF Rapport:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = 2 + chapters.length;

  return (
    <div className="wrap">
      <div className="container">
        {/* Left Sidebar Editor Panel */}
        <div className="editor-panel no-print">
          <div className="editor-header">
            <h1>
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Générateur de Rapport & Mémoire</span>
            </h1>
            <p>Documents académiques multi-pages modifiables</p>
          </div>

          <div className="tabs">
            <button
              onClick={() => setActiveTab("presets")}
              className={`tab-btn ${activeTab === "presets" ? "active" : ""}`}
            >
              ⭐ Modèles
            </button>
            <button
              onClick={() => setActiveTab("garde")}
              className={`tab-btn ${activeTab === "garde" ? "active" : ""}`}
            >
              🎓 Garde
            </button>
            <button
              onClick={() => setActiveTab("chapitres")}
              className={`tab-btn ${activeTab === "chapitres" ? "active" : ""}`}
            >
              📖 Chapitres
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`tab-btn ${activeTab === "style" ? "active" : ""}`}
            >
              🎨 Style
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 0: Presets */}
            {activeTab === "presets" && (
              <div className="presets-box">
                <label>⭐ Modèles de Mémoires & Rapports</label>
                <div className="grid-1 gap-2" style={{ marginTop: "8px" }}>
                  {RAPPORT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadPreset(preset)}
                      className="chip hover-glow"
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

            {/* TAB 1: Page de garde */}
            {activeTab === "garde" && (
              <div className="presets-box">
                <label>🎓 Entête & Titre Académique</label>
                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Logo Établissement</label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} />
                </div>
                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Université / Institution</label>
                  <input type="text" name="institution" value={data.institution} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Faculté / Département</label>
                  <input type="text" name="faculte" value={data.faculte} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Titre du Mémoire</label>
                  <textarea rows={3} name="titre" value={data.titre} onChange={handleChange} style={{ fontWeight: "700" }} />
                </div>
                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Sous-titre / Diplôme</label>
                  <input type="text" name="soustitre" value={data.soustitre} onChange={handleChange} />
                </div>
                <div className="grid-2" style={{ marginBottom: "8px" }}>
                  <div className="input-group">
                    <label>Auteur</label>
                    <input type="text" name="auteur" value={data.auteur} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Encadrement</label>
                    <input type="text" name="encadrant" value={data.encadrant} onChange={handleChange} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Année académique</label>
                  <input type="text" name="annee" value={data.annee} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* TAB 2: Chapitres */}
            {activeTab === "chapitres" && (
              <div className="presets-box">
                <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                  <label style={{ margin: 0 }}>📖 Chapitres du Document</label>
                  <button onClick={addChapter} className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {chapters.map((chap) => (
                  <div key={chap.id} style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "8px", marginBottom: "8px", position: "relative" }}>
                    <button onClick={() => removeChapter(chap.id)} style={{ position: "absolute", top: "6px", right: "6px", border: "none", background: "none", color: "#EF4444", cursor: "pointer" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="input-group" style={{ marginBottom: "4px" }}>
                      <input type="text" value={chap.title} onChange={(e) => updateChapter(chap.id, "title", e.target.value)} style={{ fontWeight: "700" }} />
                    </div>
                    <textarea rows={5} value={chap.content} onChange={(e) => updateChapter(chap.id, "content", e.target.value)} />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Style & Ornements */}
            {activeTab === "style" && (
              <div className="presets-box">
                <label>🎨 Thème Académique & Ornements</label>
                <div className="theme-grid" style={{ marginBottom: "10px" }}>
                  {RAPPORT_THEMES.map((th) => (
                    <div
                      key={th.id}
                      onClick={() => setActiveTheme(th)}
                      className={`theme-card ${activeTheme.id === th.id ? "active" : ""}`}
                    >
                      <div className="theme-swatch" style={{ background: th.primaryColor }} />
                      <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#0F172A" }}>{th.name}</span>
                    </div>
                  ))}
                </div>

                <div className="input-group" style={{ marginBottom: "10px" }}>
                  <label>Filigrane de fond (Filigrane texte)</label>
                  <input
                    type="text"
                    placeholder="ex: PROJET DE MÉMOIRE / CONFIDENTIEL"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ornamentToggle"
                    checked={showOrnaments}
                    onChange={(e) => setShowOrnaments(e.target.checked)}
                  />
                  <label htmlFor="ornamentToggle" style={{ fontSize: "11.5px", fontWeight: "600", cursor: "pointer" }}>
                    Afficher les coins ornementaux (⚜️ Dorures)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Canvas Preview Area */}
        <div className="preview-area">
          {/* Zoom Control Bar */}
          <div className="zoom-bar no-print">
            <button onClick={onBack} className="btn btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </button>
            <div style={{ height: "16px", width: "1px", background: "#E2E8F0" }}></div>
            <label>🔍 Zoom :</label>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
            />
            <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#2563EB" }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <span className="chip active font-mono">
              Total : {totalPages} Pages A4
            </span>
            <div style={{ height: "16px", width: "1px", background: "#E2E8F0" }}></div>
            <button onClick={exportPDF} disabled={isExporting} className="btn btn-primary">
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Exporter PDF Multipages</span>
            </button>
          </div>

          {/* Interactive Canvas Wrapper */}
          <div className="canvas-wrapper">
            <div style={{ transform: `scale(${zoomScale})`, transformOrigin: "top center" }} className="space-y-8" ref={previewContainerRef}>
              {/* PAGE 1: Cover Page */}
              <div className="report-page w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-2xl flex flex-col justify-between font-serif relative border-2 border-slate-300 mx-auto text-center shrink-0">
                {showOrnaments && (
                  <>
                    <div className="corner-ornament corner-tl">⚜️</div>
                    <div className="corner-ornament corner-tr">⚜️</div>
                    <div className="corner-ornament corner-bl">⚜️</div>
                    <div className="corner-ornament corner-br">⚜️</div>
                  </>
                )}

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
                      textTransform: "uppercase"
                    }}
                  >
                    {watermarkText}
                  </div>
                )}
                <div>
                  {logoImg && (
                    <img src={logoImg} alt="Logo" className="h-20 mx-auto object-contain mb-4" />
                  )}
                  <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-1" style={{ fontFamily: activeTheme.fontHeader }}>{data.institution}</h2>
                  <p className="text-xs text-slate-600 font-sans tracking-wide uppercase mb-8">{data.faculte}</p>
                  <div className="w-24 h-1 mx-auto mb-12" style={{ backgroundColor: activeTheme.primaryColor }}></div>

                  <div className="my-12 px-6">
                    <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-950 leading-snug mb-6 border-y-2 py-6" style={{ borderColor: activeTheme.primaryColor, fontFamily: activeTheme.fontHeader }}>
                      {data.titre}
                    </h1>
                    <p className="text-sm italic text-slate-700 font-sans max-w-lg mx-auto">
                      {data.soustitre}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 text-left font-sans text-xs pt-8 border-t border-slate-300">
                  <div>
                    <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Auteur :</p>
                    <p className="text-slate-800 font-medium">{data.auteur}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Encadrement :</p>
                    <p className="text-slate-800 font-medium">{data.encadrant}</p>
                  </div>
                </div>

                <div className="font-sans text-xs text-slate-500 pt-6">
                  <p className="font-semibold text-slate-700">{data.annee}</p>
                  <p className="text-[11px]">{data.lieuDate}</p>
                  <span className="absolute bottom-4 right-8 text-[10px] text-slate-400">Page 1 / {totalPages}</span>
                </div>
              </div>

              {/* PAGE 2: Sommaire */}
              <div className="report-page w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-2xl flex flex-col justify-between font-serif relative border border-slate-200 mx-auto shrink-0">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-3 mb-8 text-center font-sans" style={{ borderColor: activeTheme.primaryColor }}>
                    Sommaire / Table des Matières
                  </h2>

                  <div className="space-y-4 font-sans text-sm">
                    <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-1">
                      <span className="font-bold text-slate-900">Page de Garde & Entête Académique</span>
                      <span className="font-semibold text-slate-600">Page 1</span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-1">
                      <span className="font-bold text-slate-900">Sommaire</span>
                      <span className="font-semibold text-slate-600">Page 2</span>
                    </div>

                    {chapters.map((chap, idx) => (
                      <div key={chap.id} className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-1">
                        <span className="font-semibold text-slate-800">{chap.title}</span>
                        <span className="font-semibold text-slate-600">Page {3 + idx}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="font-sans text-xs text-slate-400 flex justify-between border-t border-slate-200 pt-4">
                  <span>{data.titre.slice(0, 45)}...</span>
                  <span>Page 2 / {totalPages}</span>
                </div>
              </div>

              {/* PAGES 3+: Chapters */}
              {chapters.map((chap, idx) => {
                const pageNum = 3 + idx;
                return (
                  <div
                    key={chap.id}
                    className="report-page w-[210mm] min-h-[297mm] bg-white text-slate-900 p-16 shadow-2xl flex flex-col justify-between font-serif relative border border-slate-200 mx-auto shrink-0"
                  >
                    <div>
                      <div className="font-sans text-xs text-slate-400 border-b border-slate-200 pb-2 mb-8 flex justify-between">
                        <span className="uppercase tracking-wider font-semibold text-slate-900">{data.institution}</span>
                        <span>{chap.title}</span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-950 mb-6 font-sans border-l-4 pl-3" style={{ borderColor: activeTheme.primaryColor }}>
                        {chap.title}
                      </h2>

                      <div className="whitespace-pre-line text-sm text-slate-800 leading-relaxed text-justify">
                        {chap.content}
                      </div>
                    </div>

                    <div className="font-sans text-xs text-slate-400 flex justify-between border-t border-slate-200 pt-4">
                      <span>Mémoire : {data.auteur}</span>
                      <span className="font-bold text-slate-800">Page {pageNum} / {totalPages}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
