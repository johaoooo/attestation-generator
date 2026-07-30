import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, ArrowLeft, UserCheck, Plus, Trash2, RefreshCw, Mail, Phone, MapPin, CheckCircle2, Sparkles, Layers } from "./Icons.jsx";

const CV_LAYOUTS = [
  { id: "sidebar", name: "📐 Layout 1 : Barre Latérale Luxe" },
  { id: "banner", name: "📊 Layout 2 : Entête Bandeau Exécutif" },
  { id: "prestige", name: "⚜️ Layout 3 : Classique Prestige & Dorures" }
];

const CV_PRESETS = [
  {
    name: "💻 CV Tech & Développeur Full Stack",
    personal: {
      name: "AFI Gbessito",
      title: "Développeur Full Stack & Lead Tech",
      email: "contact@aficollection.bj",
      phone: "+229 01 97 00 00 00",
      location: "Cotonou, Bénin",
      summary: "Ingénieur logiciel passionné comptant plus de 5 ans d'expérience dans le développement d'architectures web évolutives, la création d'APIs REST/GraphQL et la gestion d'infrastructures cloud.",
    },
    experiences: [
      {
        id: 1,
        role: "Lead Développeur Frontend",
        company: "Maison AFI COLLECTION",
        period: "2023 - Présent",
        desc: "Conception de la suite de génération de documents officiels en React 19 et Vite. Optimisation du rendu A4 et exportation PDF en direct.",
      },
      {
        id: 2,
        role: "Développeur Full Stack",
        company: "Tech Benin Solutions",
        period: "2021 - 2023",
        desc: "Intégration de passerelles de paiement (KKiaPay, FedaPay) et développement de microservices avec Node.js et PostgreSQL.",
      },
    ],
    education: [
      { id: 1, degree: "Master en Génie Logiciel", school: "Université d'Abomey-Calavi (IFRI)", year: "2021" },
      { id: 2, degree: "Licence en Informatique", school: "Institut AFI", year: "2019" },
    ],
    skills: ["React.js", "Node.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker", "Git", "REST APIs"]
  },
  {
    name: "📊 CV Chef de Projet & Manager",
    personal: {
      name: "TOSSA Gbessito",
      title: "Chef de Projet Digital & Transformation Numérique",
      email: "manager@aficollection.bj",
      phone: "+229 01 95 00 00 00",
      location: "Cotonou, Bénin",
      summary: "Manager de projet expérimenté spécialisé dans la conduite du changement, le déploiement de solutions logicielles d'entreprise et la gestion d'équipes pluridisciplinaires.",
    },
    experiences: [
      {
        id: 1,
        role: "Directrice des Projets Numériques",
        company: "ONG ESPOIR ET NATURE",
        period: "2022 - Présent",
        desc: "Supervision du déploiement des programmes de formation professionnelle et gestion du partenariat avec la Maison AFI COLLECTION.",
      },
      {
        id: 2,
        role: "Chef de Projet Agile",
        company: "Consulting BENIN",
        period: "2020 - 2022",
        desc: "Planification des livrables, animation des réunions Scrum et suivi de la satisfaction client.",
      },
    ],
    education: [
      { id: 1, degree: "Master en Management des SI", school: "ENAM Cotonou", year: "2020" },
      { id: 2, degree: "Certification PMP & Scrum Master", school: "PMI International", year: "2021" },
    ],
    skills: ["Gestion de Projet", "Méthodes Agiles / Scrum", "Leadership", "Analyse Fonctionnelle", "Conduite du Changement", "Jira & Trello"]
  }
];

const CV_THEMES = [
  {
    id: "executive-navy",
    name: "Bleu Exécutif",
    headerBg: "#0F172A",
    headerText: "#FFFFFF",
    accentText: "#2563EB",
    badgeBg: "#EFF6FF",
    badgeText: "#1D4ED8",
    badgeBorder: "#BFDBFE"
  },
  {
    id: "emerald-pro",
    name: "Émeraude Pro",
    headerBg: "#064E3B",
    headerText: "#FFFFFF",
    accentText: "#059669",
    badgeBg: "#ECFDF5",
    badgeText: "#047857",
    badgeBorder: "#A7F3D0"
  },
  {
    id: "bordeaux-royal",
    name: "Bordeaux Prestige",
    headerBg: "#450A0A",
    headerText: "#FFFFFF",
    accentText: "#B91C1C",
    badgeBg: "#FEF2F2",
    badgeText: "#991B1B",
    badgeBorder: "#FECACA"
  },
  {
    id: "slate-clean",
    name: "Gris Épuré",
    headerBg: "#1E293B",
    headerText: "#FFFFFF",
    accentText: "#475569",
    badgeBg: "#F8FAFC",
    badgeText: "#334155",
    badgeBorder: "#E2E8F0"
  }
];

export default function CvGenerator({ onBack }) {
  const [personal, setPersonal] = useState({ ...CV_PRESETS[0].personal });
  const [experiences, setExperiences] = useState([ ...CV_PRESETS[0].experiences ]);
  const [education, setEducation] = useState([ ...CV_PRESETS[0].education ]);
  const [skills, setSkills] = useState([ ...CV_PRESETS[0].skills ]);
  const [newSkill, setNewSkill] = useState("");
  const [photoImg, setPhotoImg] = useState(null);

  const [activeTab, setActiveTab] = useState("presets");
  const [layoutMode, setLayoutMode] = useState("sidebar");
  const [activeTheme, setActiveTheme] = useState(CV_THEMES[0]);
  const [photoShape, setPhotoShape] = useState("circle");
  const [zoomScale, setZoomScale] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);

  const previewRef = useRef(null);

  const handlePersonalChange = (e) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const loadPreset = (preset) => {
    setPersonal({ ...preset.personal });
    setExperiences([ ...preset.experiences ]);
    setEducation([ ...preset.education ]);
    setSkills([ ...preset.skills ]);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setPhotoImg(uploadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { id: Date.now(), role: "Poste occupé", company: "Nom de l'entreprise", period: "2024 - Présent", desc: "Description des tâches et réalisations." }
    ]);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${personal.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF CV:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const getPhotoRadius = () => {
    if (photoShape === "circle") return "50%";
    if (photoShape === "rounded") return "16px";
    return "0px";
  };

  return (
    <div className="wrap">
      <div className="container">
        {/* Left Sidebar Editor Panel */}
        <div className="editor-panel no-print">
          <div className="editor-header">
            <h1>
              <UserCheck className="w-5 h-5 text-blue-600" />
              <span>Générateur de CV Professionnel</span>
            </h1>
            <p>Modèles métiers, 3 dispositions & personnalisation</p>
          </div>

          <div className="tabs">
            <button
              onClick={() => setActiveTab("presets")}
              className={`tab-btn ${activeTab === "presets" ? "active" : ""}`}
            >
              ⭐ Modèles
            </button>
            <button
              onClick={() => setActiveTab("layout")}
              className={`tab-btn ${activeTab === "layout" ? "active" : ""}`}
            >
              📐 Disposition
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
            >
              👤 Profil
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`tab-btn ${activeTab === "style" ? "active" : ""}`}
            >
              🎨 Thème
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 0: Presets */}
            {activeTab === "presets" && (
              <div className="presets-box">
                <label>⭐ Modèles de CV Métier</label>
                <div className="grid-1 gap-2" style={{ marginTop: "8px" }}>
                  {CV_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadPreset(preset)}
                      className="chip hover-glow"
                      style={{ textAlign: "left", padding: "10px 12px", width: "100%", borderRadius: "8px" }}
                    >
                      <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "12px" }}>{preset.name}</div>
                      <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                        {preset.personal.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 1: Layout Selection */}
            {activeTab === "layout" && (
              <div className="presets-box">
                <label>📐 Choix de la Mise en Page du CV</label>
                <div className="grid-1 gap-2" style={{ marginTop: "8px" }}>
                  {CV_LAYOUTS.map((lay) => (
                    <div
                      key={lay.id}
                      onClick={() => setLayoutMode(lay.id)}
                      className={`theme-card ${layoutMode === lay.id ? "active" : ""}`}
                    >
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A" }}>{lay.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Content */}
            {activeTab === "content" && (
              <>
                <div className="presets-box">
                  <label>👤 Identité</label>
                  <div className="grid-2" style={{ marginBottom: "8px" }}>
                    <div className="input-group">
                      <label>Nom Complet</label>
                      <input type="text" name="name" value={personal.name} onChange={handlePersonalChange} />
                    </div>
                    <div className="input-group">
                      <label>Titre / Métier</label>
                      <input type="text" name="title" value={personal.title} onChange={handlePersonalChange} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Résumé / Profil</label>
                    <textarea rows={3} name="summary" value={personal.summary} onChange={handlePersonalChange} />
                  </div>
                </div>

                <div className="presets-box">
                  <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
                    <label style={{ margin: 0 }}>💼 Expériences Professionnelles</label>
                    <button onClick={addExperience} className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px" }}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {experiences.map((exp) => (
                    <div key={exp.id} style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "8px", marginBottom: "8px", position: "relative" }}>
                      <button onClick={() => removeExperience(exp.id)} style={{ position: "absolute", top: "6px", right: "6px", border: "none", background: "none", color: "#EF4444", cursor: "pointer" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="input-group" style={{ marginBottom: "4px" }}>
                        <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} placeholder="Poste" style={{ fontWeight: "700" }} />
                      </div>
                      <div className="grid-2" style={{ marginBottom: "4px" }}>
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Entreprise" />
                        <input type="text" value={exp.period} onChange={(e) => updateExperience(exp.id, "period", e.target.value)} placeholder="Période" />
                      </div>
                      <textarea rows={2} value={exp.desc} onChange={(e) => updateExperience(exp.id, "desc", e.target.value)} placeholder="Description..." />
                    </div>
                  ))}
                </div>

                <div className="presets-box">
                  <label>⚡ Compétences Clés</label>
                  <div className="flex gap-2" style={{ marginBottom: "8px" }}>
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Nouvelle compétence..." style={{ flex: 1 }} />
                    <button onClick={addSkill} className="btn btn-secondary" style={{ padding: "6px 10px", fontSize: "11px" }}>Ajouter</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill) => (
                      <span key={skill} className="chip active flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} style={{ border: "none", background: "none", color: "#EF4444", cursor: "pointer", fontWeight: "bold" }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: Style & Photo */}
            {activeTab === "style" && (
              <div className="presets-box">
                <label>🎨 Thème de Couleur du CV</label>
                <div className="theme-grid" style={{ marginBottom: "10px" }}>
                  {CV_THEMES.map((th) => (
                    <div
                      key={th.id}
                      onClick={() => setActiveTheme(th)}
                      className={`theme-card ${activeTheme.id === th.id ? "active" : ""}`}
                    >
                      <div className="theme-swatch" style={{ background: th.headerBg }} />
                      <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#0F172A" }}>{th.name}</span>
                    </div>
                  ))}
                </div>

                <div className="input-group" style={{ marginBottom: "8px" }}>
                  <label>Photo de Profil</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                <div className="input-group">
                  <label>Forme de la Photo</label>
                  <select value={photoShape} onChange={(e) => setPhotoShape(e.target.value)}>
                    <option value="circle">Ronde / Circulaire</option>
                    <option value="rounded">Carré Arrondi</option>
                    <option value="square">Carré Standard</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Canvas Preview Area */}
        <div className="preview-area">
          {/* Zoom Bar */}
          <div className="zoom-bar no-print">
            <button onClick={onBack} className="btn btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </button>
            <div style={{ height: "16px", width: "1px", background: "#E2E8F0" }}></div>
            <label>🔍 Zoom :</label>
            <input
              type="range"
              min="0.5"
              max="1.1"
              step="0.05"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
            />
            <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#2563EB" }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <div style={{ height: "16px", width: "1px", background: "#E2E8F0" }}></div>
            <button onClick={exportPDF} disabled={isExporting} className="btn btn-primary">
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Exporter en PDF</span>
            </button>
          </div>

          {/* Interactive Paper Sheet */}
          <div className="canvas-wrapper">
            <div style={{ transform: `scale(${zoomScale})`, transformOrigin: "top center" }}>
              {/* LAYOUT 1: SIDEBAR LATÉRALE LUXE */}
              {layoutMode === "sidebar" && (
                <div
                  ref={previewRef}
                  className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl flex font-sans relative border border-slate-200 shrink-0"
                >
                  {/* Left Colored Sidebar */}
                  <div className="w-[72mm] p-8 flex flex-col justify-between" style={{ backgroundColor: activeTheme.headerBg, color: "#FFFFFF" }}>
                    <div>
                      {photoImg && (
                        <img
                          src={photoImg}
                          alt="Profil"
                          className="w-28 h-28 object-cover border-4 border-white/20 shadow-lg mx-auto mb-6"
                          style={{ borderRadius: getPhotoRadius() }}
                        />
                      )}
                      <h1 className="text-xl font-extrabold tracking-tight uppercase text-center mb-1">{personal.name}</h1>
                      <p className="text-xs font-medium tracking-wide text-center opacity-80 mb-6">{personal.title}</p>
                      
                      <div className="space-y-3 text-xs opacity-90 border-t border-white/10 pt-4 mb-6">
                        <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" /><span>{personal.email}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /><span>{personal.phone}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" /><span>{personal.location}</span></div>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-amber-300">Compétences Clés</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill) => (
                            <span key={skill} className="px-2 py-1 rounded bg-white/10 text-[11px] font-medium border border-white/10">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-white/50 text-center pt-4">DocStudio Executive CV</div>
                  </div>

                  {/* Right Main Content */}
                  <div className="flex-1 p-8 space-y-6">
                    {personal.summary && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: activeTheme.accentText }}>Profil Professionnel</h2>
                        <p className="text-xs text-slate-700 leading-relaxed border-l-2 border-slate-300 pl-3 italic">
                          {personal.summary}
                        </p>
                      </div>
                    )}

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: activeTheme.accentText }}>Expériences Professionnelles</h2>
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <div key={exp.id} className="text-xs border-b border-slate-100 pb-3">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-bold text-sm text-slate-900">{exp.role}</span>
                              <span className="text-slate-500 font-medium">{exp.period}</span>
                            </div>
                            <p className="font-semibold text-slate-700 mb-1">{exp.company}</p>
                            <p className="text-slate-600 leading-relaxed">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: activeTheme.accentText }}>Formations & Diplômes</h2>
                      <div className="space-y-3">
                        {education.map((edu) => (
                          <div key={edu.id} className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <p className="font-bold text-slate-900">{edu.degree}</p>
                            <p className="text-slate-600">{edu.school} — <span className="text-slate-400">{edu.year}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 2: BANNER HEADER */}
              {layoutMode === "banner" && (
                <div
                  ref={previewRef}
                  className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl flex flex-col justify-between font-sans relative border border-slate-200 shrink-0"
                >
                  <div className="p-8 flex items-center gap-6" style={{ backgroundColor: activeTheme.headerBg, color: activeTheme.headerText }}>
                    {photoImg && (
                      <img src={photoImg} alt="Profil" className="w-24 h-24 object-cover border-2 border-white shadow-md shrink-0" style={{ borderRadius: getPhotoRadius() }} />
                    )}
                    <div className="flex-1">
                      <h1 className="text-2xl font-extrabold tracking-tight uppercase">{personal.name}</h1>
                      <p className="text-sm font-medium tracking-wide opacity-90 mb-3">{personal.title}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs opacity-80">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{personal.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{personal.phone}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{personal.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex-1">
                    {personal.summary && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: activeTheme.accentText }}>Profil Professionnel</h2>
                        <p className="text-xs text-slate-700 leading-relaxed border-l-2 border-slate-300 pl-3 italic">{personal.summary}</p>
                      </div>
                    )}

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: activeTheme.accentText }}>Expériences Professionnelles</h2>
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <div key={exp.id} className="text-xs border-b border-slate-100 pb-3">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-bold text-sm text-slate-900">{exp.role}</span>
                              <span className="text-slate-500 font-medium">{exp.period}</span>
                            </div>
                            <p className="font-semibold text-slate-700 mb-1">{exp.company}</p>
                            <p className="text-slate-600 leading-relaxed">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: activeTheme.accentText }}>Compétences Clés</h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.badgeText, borderColor: activeTheme.badgeBorder }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 3: CLASSIQUE PRESTIGE */}
              {layoutMode === "prestige" && (
                <div
                  ref={previewRef}
                  className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl flex flex-col justify-between font-serif relative border-2 border-amber-500/50 p-12 shrink-0"
                >
                  <div>
                    <div className="text-center border-b-2 border-amber-600 pb-6 mb-8">
                      {photoImg && (
                        <img src={photoImg} alt="Profil" className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-600 mb-3 shadow-md" />
                      )}
                      <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-950 font-serif">{personal.name}</h1>
                      <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider mt-1">{personal.title}</p>
                      <p className="text-xs text-slate-500 font-sans mt-2">{personal.email} | {personal.phone} | {personal.location}</p>
                    </div>

                    {personal.summary && (
                      <div className="mb-6 font-sans">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-2">Profil</h2>
                        <p className="text-xs text-slate-700 italic">{personal.summary}</p>
                      </div>
                    )}

                    <div className="mb-6 font-sans">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-3">Parcours Professionnel</h2>
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <div key={exp.id} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{exp.role} — {exp.company}</span>
                              <span className="text-slate-500">{exp.period}</span>
                            </div>
                            <p className="text-slate-600 mt-1">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
