import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download, ArrowLeft, UserCheck, Plus, Trash2, RefreshCw, Mail, Phone, MapPin,
  CheckCircle2, Sparkles, Layers, Award, BookOpen, Globe, User, IdCard, Sliders, Type
} from "./Icons.jsx";

const CV_LAYOUTS = [
  { id: "teal_modern", name: "🩵 Teal Modern & Santé (Dr Smith Style)", desc: "Bande latérale turquoise (#3fb8c4) et en-têtes encadrés" },
  { id: "sidebar", name: "📐 Barre Latérale Luxe", desc: "Colonnes séparées avec profil sombre à gauche" },
  { id: "banner", name: "📊 Entête Bandeau Exécutif", desc: "En-tête large et épuré avec grille 2 colonnes" },
  { id: "prestige", name: "⚜️ Classique Prestige & Dorures", desc: "Format traditionnel serif pour cadres et dirigeants" },
  { id: "modern_grid", name: "💻 Moderne Tech & Dual Grid", desc: "Design épuré et cartes de compétences pour experts tech" },
  { id: "minimal_chic", name: "🎨 Minimaliste Chic", desc: "Lignes épurées et typographie élégante" },
  { id: "ceo_gala", name: "👑 Gala Exécutif & CEO", desc: "Structure haute distinction avec encadré d'honneur" }
];

const CV_PRESETS = [
  {
    name: "🩺 CV Médecin & Santé (Dr. Daniel Smith)",
    personal: {
      name: "Daniel Smith",
      title: "Medical Doctor / Médecin Généraliste",
      email: "daniel.smith@gmail.com",
      phone: "+1 987 654 321",
      location: "New York, USA",
      linkedin: "linkedin/in/daniel-smith",
      website: "daniel-smith-md.com",
      summary: "Compassionate doctor with 10+ years of experience in general medicine. Skilled in diagnosing and treating diverse conditions with a focus on patient care and wellness. Committed to continuous learning and medical advancements.",
    },
    experiences: [
      {
        id: 1,
        role: "Senior Physician",
        company: "XYZ Hospital, New York, NY",
        period: "Jan 2015 - Present",
        desc: "Diagnose and treat a variety of medical conditions. Lead a medical team to ensure high-quality patient care. Collaborate with specialists for comprehensive treatment.",
      },
      {
        id: 2,
        role: "General Practitioner",
        company: "ABC Hospital, Boston, MA",
        period: "Jul 2010 – Dec 2014",
        desc: "Provided primary care and managed chronic diseases. Developed patient relationships and ensured effective communication. Coordinated patient referrals and specialized care.",
      },
    ],
    education: [
      { id: 1, degree: "Doctor of Medicine (MD)", school: "Harvard Medical School, Boston, MA", year: "2010" },
      { id: 2, degree: "Bachelor of Science in Biology", school: "University of California, Los Angeles, CA", year: "2006" },
    ],
    skills: ["Clinical Diagnosis", "Patient Communication", "Critical Thinking", "Team Collaboration", "Continuous Learning"],
    languages: ["English (Native)", "French (Professional)"],
    certifications: ["Board Certified in Internal Medicine", "BLS & ACLS Certified"]
  },
  {
    name: "💻 CV Tech & Développeuse Full Stack",
    personal: {
      name: "TOSSA Afiavi Gbessito Honorine",
      title: "Ingénieure Logiciel & Lead Tech",
      email: "contact@aficollection.bj",
      phone: "+229 01 97 00 00 00",
      location: "Cotonou, Bénin",
      linkedin: "linkedin.com/in/tossa-honorine",
      website: "aficollection.bj",
      summary: "Ingénieure logiciel passionnée comptant plus de 5 ans d'expérience dans la conception d'applications web scalables, la gestion d'APIs REST/GraphQL et le développement d'architectures cloud modernes.",
    },
    experiences: [
      {
        id: 1,
        role: "Lead Développeuse Full Stack",
        company: "Maison AFI COLLECTION",
        period: "2023 - Présent",
        desc: "Supervision de l'architecture frontend et backend. Conduite du développement d'outils web d'automatisation de documents officiels en React et Node.js.",
      },
      {
        id: 2,
        role: "Développeuse Web & Mobile",
        company: "Tech Benin Solutions",
        period: "2021 - 2023",
        desc: "Intégration de passerelles de paiement sécurisées (KKiaPay, FedaPay), optimisation des requêtes PostgreSQL et déploiement CI/CD.",
      },
    ],
    education: [
      { id: 1, degree: "Master en Génie Logiciel & SI", school: "Université d'Abomey-Calavi (IFRI)", year: "2021" },
      { id: 2, degree: "Licence en Informatique", school: "Institut AFI du Bénin", year: "2019" },
    ],
    skills: ["React.js", "Node.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker", "Git / GitHub", "APIs REST"],
    languages: ["Français (Courant)", "Anglais (Professionnel)"],
    certifications: ["AWS Certified Developer", "Scrum Master PSM I"]
  },
  {
    name: "📊 CV Chef de Projet & Directrice Digital",
    personal: {
      name: "TOSSA Afiavi Gbessito Honorine",
      title: "Directrice des Projets Digital & Transformation",
      email: "direction@espoir-nature.org",
      phone: "+229 01 95 00 00 00",
      location: "Cotonou, Bénin",
      linkedin: "linkedin.com/in/tossa-manager",
      website: "espoir-nature.org",
      summary: "Manager de projet chevronnée spécialisée dans la conduite du changement, la stratégie digitale, et la direction de programmes de formation professionnelle et partenariats PME.",
    },
    experiences: [
      {
        id: 1,
        role: "Directrice Exécutive des Projets",
        company: "ONG ESPOIR ET NATURE",
        period: "2022 - Présent",
        desc: "Pilotage stratégique des formations en Macramé et Teinture de pagne. Coordination du partenariat d'excellence avec la Maison AFI COLLECTION.",
      },
      {
        id: 2,
        role: "Chef de Projet Senior Digital",
        company: "Global Consulting Afrique",
        period: "2019 - 2022",
        desc: "Planification des jalons, gestion des budgets projets et animation des comités de pilotage.",
      },
    ],
    education: [
      { id: 1, degree: "Master en Management des SI", school: "ENAM Cotonou", year: "2019" },
      { id: 2, degree: "Certification PMP®", school: "Project Management Institute (PMI)", year: "2021" },
    ],
    skills: ["Management de Projet", "Méthodes Agiles / Scrum", "Leadership & Stratégie", "Conduite du Changement", "Communication Institutionnelle", "Jira / Trello"],
    languages: ["Français (Langue maternelle)", "Anglais (Bilingue)"],
    certifications: ["Certification PMP® PMI", "Scrum Master Certified"]
  }
];

const CV_THEMES = [
  {
    id: "teal-turquoise",
    name: "🩵 Turquoise Santé (#3fb8c4)",
    headerBg: "#3fb8c4",
    headerText: "#FFFFFF",
    accentText: "#3fb8c4",
    badgeBg: "#E0F2FE",
    badgeText: "#0284C7",
    badgeBorder: "#BAE6FD"
  },
  {
    id: "executive-navy",
    name: "👑 Bleu Exécutif & Or (#0f172a)",
    headerBg: "#0F172A",
    headerText: "#FFFFFF",
    accentText: "#1E3A8A",
    badgeBg: "#EFF6FF",
    badgeText: "#1D4ED8",
    badgeBorder: "#BFDBFE"
  },
  {
    id: "emerald-pro",
    name: "🌲 Émeraude Royale (#064e3b)",
    headerBg: "#064E3B",
    headerText: "#FFFFFF",
    accentText: "#059669",
    badgeBg: "#ECFDF5",
    badgeText: "#047857",
    badgeBorder: "#A7F3D0"
  },
  {
    id: "bordeaux-royal",
    name: "🍷 Bordeaux Prestige (#450a0a)",
    headerBg: "#450A0A",
    headerText: "#FFFFFF",
    accentText: "#B91C1C",
    badgeBg: "#FEF2F2",
    badgeText: "#991B1B",
    badgeBorder: "#FECACA"
  },
  {
    id: "slate-clean",
    name: "🖤 Noir Obsidienne (#1e293b)",
    headerBg: "#1E293B",
    headerText: "#FFFFFF",
    accentText: "#475569",
    badgeBg: "#F8FAFC",
    badgeText: "#334155",
    badgeBorder: "#E2E8F0"
  },
  {
    id: "purple-imperial",
    name: "⚜️ Violet Impérial (#4c1d95)",
    headerBg: "#4C1D95",
    headerText: "#FFFFFF",
    accentText: "#7C3AED",
    badgeBg: "#F5F3FF",
    badgeText: "#6D28D9",
    badgeBorder: "#DDD6FE"
  }
];

export default function CvGenerator({ onBack }) {
  const [personal, setPersonal] = useState({ ...CV_PRESETS[0].personal });
  const [experiences, setExperiences] = useState([ ...CV_PRESETS[0].experiences ]);
  const [education, setEducation] = useState([ ...CV_PRESETS[0].education ]);
  const [skills, setSkills] = useState([ ...CV_PRESETS[0].skills ]);
  const [languages, setLanguages] = useState([ ...(CV_PRESETS[0].languages || []) ]);
  const [certifications, setCertifications] = useState([ ...(CV_PRESETS[0].certifications || []) ]);
  
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newCert, setNewCert] = useState("");
  const [photoImg, setPhotoImg] = useState(null);

  // Customization Options
  const [activeTab, setActiveTab] = useState("presets");
  const [layoutMode, setLayoutMode] = useState("teal_modern");
  const [activeTheme, setActiveTheme] = useState(CV_THEMES[0]);
  const [customPrimaryColor, setCustomPrimaryColor] = useState("");
  const [photoShape, setPhotoShape] = useState("circle");
  const [photoSize, setPhotoSize] = useState(110);
  const [fontFamily, setFontFamily] = useState("'Plus Jakarta Sans', sans-serif");
  const [fontSizeBase, setFontSizeBase] = useState(12);
  const [leftColRatio, setLeftColRatio] = useState(38);
  const [zoomScale, setZoomScale] = useState(0.85);
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
        const autoZoom = Math.max(0.32, Math.min(0.95, availableWidth / 794));
        setZoomScale(Number(autoZoom.toFixed(2)));
      } else {
        setZoomScale(0.85);
      }
    };
    updateAutoZoom();
    window.addEventListener("resize", updateAutoZoom);
    return () => window.removeEventListener("resize", updateAutoZoom);
  }, []);

  const previewRef = useRef(null);

  const primaryColor = customPrimaryColor || activeTheme.headerBg;

  const handlePersonalChange = (e) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const loadPreset = (preset) => {
    setPersonal({ ...preset.personal });
    setExperiences([ ...preset.experiences ]);
    setEducation([ ...preset.education ]);
    setSkills([ ...preset.skills ]);
    if (preset.languages) setLanguages([ ...preset.languages ]);
    if (preset.certifications) setCertifications([ ...preset.certifications ]);
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
      { id: Date.now(), role: "Poste occupé", company: "Entreprise / Hôpital", period: "2024 - Présent", desc: "Description des tâches et réalisations principales." }
    ]);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { id: Date.now(), degree: "Diplôme / Qualification", school: "Établissement / Université", year: "2023" }
    ]);
  };

  const removeEducation = (id) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id, field, value) => {
    setEducation(education.map((edu) => edu.id === id ? { ...edu, [field]: value } : edu));
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

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (langToRemove) => {
    setLanguages(languages.filter((l) => l !== langToRemove));
  };

  const addCert = () => {
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert("");
    }
  };

  const removeCert = (certToRemove) => {
    setCertifications(certifications.filter((c) => c !== certToRemove));
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
      alert("Erreur lors du téléchargement du CV en PDF.");
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
          Aperçu CV ({Math.round(zoomScale * 100)}%)
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
              <UserCheck style={{ width: "20px", height: "20px", color: "#2563eb" }} /> Studio CV Personnalisable
            </h2>
          </div>

          {/* TABS HEADER */}
          <div className="sidebar-tabs">
            <button className={`tab-btn ${activeTab === "presets" ? "active" : ""}`} onClick={() => setActiveTab("presets")}>
              ✨ Presets
            </button>
            <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
              👤 Profil
            </button>
            <button className={`tab-btn ${activeTab === "experiences" ? "active" : ""}`} onClick={() => setActiveTab("experiences")}>
              💼 Parcours
            </button>
            <button className={`tab-btn ${activeTab === "skills" ? "active" : ""}`} onClick={() => setActiveTab("skills")}>
              ⚡ Compétences
            </button>
            <button className={`tab-btn ${activeTab === "style" ? "active" : ""}`} onClick={() => setActiveTab("style")}>
              🎨 Style & Options
            </button>
          </div>

          <div className="sidebar-content">
            {/* TAB 1: PRESETS */}
            {activeTab === "presets" && (
              <div className="presets-box">
                <label style={{ color: "#2563eb", fontWeight: "700" }}>🚀 Modèles de CV Prêts à l'Emploi</label>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 12px 0" }}>
                  Sélectionnez un modèle pré-rempli pour générer votre CV professionnel.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {CV_PRESETS.map((p, idx) => (
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

            {/* TAB 2: PERSONAL INFO */}
            {activeTab === "info" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>📷 Photo & Image de Profil</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                  {photoImg && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <label style={{ fontSize: "11px" }}>Forme:</label>
                        <select value={photoShape} onChange={(e) => setPhotoShape(e.target.value)} style={{ padding: "4px 8px", fontSize: "11px", flex: 1 }}>
                          <option value="circle">Ronde (Cercle)</option>
                          <option value="rounded">Bords Arrondis</option>
                          <option value="square">Carrée</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <label style={{ fontSize: "11px" }}>Taille ({photoSize}px):</label>
                        <input type="range" min={80} max={160} value={photoSize} onChange={(e) => setPhotoSize(Number(e.target.value))} style={{ flex: 1 }} />
                      </div>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPhotoImg(null)}>
                        Supprimer la photo
                      </button>
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label>Nom & Prénom Complet</label>
                  <input type="text" name="name" value={personal.name} onChange={handlePersonalChange} placeholder="Ex: Daniel Smith" />
                </div>

                <div className="input-group">
                  <label>Intitulé du Poste / Profession</label>
                  <input type="text" name="title" value={personal.title} onChange={handlePersonalChange} placeholder="Ex: Medical Doctor" />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={personal.email} onChange={handlePersonalChange} placeholder="email@exemple.com" />
                  </div>
                  <div className="input-group">
                    <label>Téléphone</label>
                    <input type="text" name="phone" value={personal.phone} onChange={handlePersonalChange} placeholder="+1 987 654 321" />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Ville & Pays</label>
                    <input type="text" name="location" value={personal.location} onChange={handlePersonalChange} placeholder="New York, USA" />
                  </div>
                  <div className="input-group">
                    <label>LinkedIn</label>
                    <input type="text" name="linkedin" value={personal.linkedin || ""} onChange={handlePersonalChange} placeholder="linkedin/in/daniel-smith" />
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: "4px" }}>
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🔗 Lien Cliquable Portfolio & Projets</label>
                  <div className="grid-2">
                    <input
                      type="text"
                      name="portfolio"
                      value={personal.portfolio || ""}
                      onChange={handlePersonalChange}
                      placeholder="URL (ex: https://mon-portfolio.com)"
                    />
                    <input
                      type="text"
                      name="portfolioLabel"
                      value={personal.portfolioLabel || ""}
                      onChange={handlePersonalChange}
                      placeholder="Texte du lien (ex: Voir mon Portfolio ↗)"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Résumé / Bio Professionnelle (About Me)</label>
                  <textarea rows={4} name="summary" value={personal.summary} onChange={handlePersonalChange} placeholder="Compassionate doctor with 10+ years..." />
                </div>
              </>
            )}

            {/* TAB 3: EXPERIENCES & FORMATIONS */}
            {activeTab === "experiences" && (
              <>
                <div className="presets-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ color: "#2563eb", fontWeight: "700" }}>💼 Expériences Professionnelles</label>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addExperience}>
                      <Plus className="w-3.5 h-3.5" /> Ajouter
                    </button>
                  </div>

                  {experiences.map((exp) => (
                    <div key={exp.id} style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "6px" }}>
                        <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} style={{ fontWeight: "700" }} placeholder="Intitulé (ex: Senior Physician)" />
                        <button type="button" onClick={() => removeExperience(exp.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid-2" style={{ marginBottom: "6px" }}>
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Établissement / Hôpital" />
                        <input type="text" value={exp.period} onChange={(e) => updateExperience(exp.id, "period", e.target.value)} placeholder="Période (ex: Jan 2015 - Present)" />
                      </div>
                      <textarea rows={2} value={exp.desc} onChange={(e) => updateExperience(exp.id, "desc", e.target.value)} placeholder="Description des missions..." />
                    </div>
                  ))}
                </div>

                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ color: "#2563eb", fontWeight: "700" }}>🎓 Éducation & Diplômes</label>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addEducation}>
                      <Plus className="w-3.5 h-3.5" /> Ajouter
                    </button>
                  </div>

                  {education.map((edu) => (
                    <div key={edu.id} style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "6px" }}>
                        <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} style={{ fontWeight: "700" }} placeholder="Diplôme (ex: Doctor of Medicine)" />
                        <button type="button" onClick={() => removeEducation(edu.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid-2">
                        <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} placeholder="Université / Égalité" />
                        <input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} placeholder="Année" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB 4: SKILLS, LANGUAGES & CERTS */}
            {activeTab === "skills" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>⚡ Compétences Clés (Skills)</label>
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px", marginBottom: "8px" }}>
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Ajouter une compétence..." onKeyDown={(e) => e.key === "Enter" && addSkill()} />
                    <button type="button" className="btn btn-secondary" onClick={addSkill}>+ Add</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {skills.map((s, i) => (
                      <span key={i} style={{ backgroundColor: "#e0e7ff", color: "#3730a3", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} style={{ background: "none", border: "none", color: "#4338ca", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🌐 Langues Parlées</label>
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px", marginBottom: "8px" }}>
                    <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} placeholder="Ex: Anglais (Bilingue)..." onKeyDown={(e) => e.key === "Enter" && addLanguage()} />
                    <button type="button" className="btn btn-secondary" onClick={addLanguage}>+ Add</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {languages.map((l, i) => (
                      <span key={i} style={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        {l}
                        <button type="button" onClick={() => removeLanguage(l)} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>📜 Certifications & Accréditations</label>
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px", marginBottom: "8px" }}>
                    <input type="text" value={newCert} onChange={(e) => setNewCert(e.target.value)} placeholder="Ex: Board Certified..." onKeyDown={(e) => e.key === "Enter" && addCert()} />
                    <button type="button" className="btn btn-secondary" onClick={addCert}>+ Add</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {certifications.map((c, i) => (
                      <span key={i} style={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        {c}
                        <button type="button" onClick={() => removeCert(c)} style={{ background: "none", border: "none", color: "#15803d", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 5: STYLE & CUSTOMIZATION OPTIONS */}
            {activeTab === "style" && (
              <>
                <div className="presets-box">
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>📐 Disposition du CV (Layouts Pro)</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    {CV_LAYOUTS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        className={`chip ${layoutMode === l.id ? "active" : ""}`}
                        onClick={() => setLayoutMode(l.id)}
                        style={{ textAlign: "left", padding: "10px", display: "flex", flexDirection: "column", gap: "2px" }}
                      >
                        <span style={{ fontWeight: "800" }}>{l.name}</span>
                        <span style={{ fontSize: "10px", color: "#64748b" }}>{l.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🎨 Palette de Couleurs du CV</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px", marginBottom: "12px" }}>
                    {CV_THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className={`chip ${activeTheme.id === th.id && !customPrimaryColor ? "active" : ""}`}
                        onClick={() => { setActiveTheme(th); setCustomPrimaryColor(""); }}
                        style={{ padding: "8px", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: th.headerBg, border: "1px solid #ffffff", display: "inline-block" }} />
                        <span style={{ fontSize: "11px", fontWeight: "700" }}>{th.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="input-group">
                    <label>Sélecteur de Couleur Sur-Mesure</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setCustomPrimaryColor(e.target.value)}
                        style={{ height: "38px", padding: "2px", cursor: "pointer", flex: 1, borderRadius: "6px" }}
                      />
                      {customPrimaryColor && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setCustomPrimaryColor("")}>
                          Réinitialiser
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="presets-box" style={{ marginTop: "12px" }}>
                  <label style={{ color: "#2563eb", fontWeight: "700" }}>🔤 Typographie & Réglage des Polices</label>
                  <div className="input-group" style={{ marginTop: "8px" }}>
                    <label>Police de caractère</label>
                    <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                      <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Moderne)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Moderne Pro)</option>
                      <option value="'Playfair Display', serif">Playfair Display (Prestige Serif)</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman (Classique)</option>
                      <option value="'Cinzel', serif">Cinzel (Haut Dirigeant)</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ marginTop: "8px" }}>
                    <label>Taille de police globale ({fontSizeBase}px)</label>
                    <input type="range" min={10} max={15} value={fontSizeBase} onChange={(e) => setFontSizeBase(Number(e.target.value))} />
                  </div>

                  <div className="input-group" style={{ marginTop: "8px" }}>
                    <label>Largeur colonne de gauche ({leftColRatio}%)</label>
                    <input type="range" min={30} max={48} value={leftColRatio} onChange={(e) => setLeftColRatio(Number(e.target.value))} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ padding: "16px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
            <button className="btn btn-primary" onClick={exportPDF} disabled={isExporting} style={{ width: "100%", justifyContent: "center" }}>
              <Download className="w-4 h-4" /> Export CV PDF HD
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
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#475569", marginRight: "4px" }}>Zoom CV:</span>
                {[
                  { label: "50%", scale: 0.50 },
                  { label: "80%", scale: 0.80 },
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
                <Download className="w-4 h-4" /> PDF A4
              </button>
            </div>
          </div>

          {/* THE A4 CV SHEET CONTAINER */}
          <div className="cert-scroll">
            <div className="cert-scale-wrapper" style={{ transform: `scale(${zoomScale})`, transformOrigin: "top center" }}>
              
              <div 
                ref={previewRef}
                style={{
                  width: "794px",
                  minHeight: "1123px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  borderRadius: "2px",
                  fontFamily: fontFamily,
                  fontSize: `${fontSizeBase}px`,
                  color: "#1e293b",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* LAYOUT: TEAL MODERN */}
                {layoutMode === "teal_modern" && (
                  <div style={{ display: "grid", gridTemplateColumns: `${leftColRatio}% ${100 - leftColRatio}%`, minHeight: "1123px", height: "100%" }}>
                    {/* LEFT COLUMN (FULL HEIGHT & BALANCED SPACING) */}
                    <div style={{ background: primaryColor, color: "#ffffff", padding: "36px 20px 32px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "1123px", height: "100%", boxSizing: "border-box" }}>
                      {/* Photo & Name / Title */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: getPhotoRadius(), overflow: "hidden", margin: "0 auto", border: "4px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                          {photoImg ? (
                            <img src={photoImg} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                              <circle cx="50" cy="50" r="50" fill="#e2e8f0" />
                              <circle cx="50" cy="40" r="18" fill="#94a3b8" />
                              <path d="M15 92c3-20 20-32 35-32s32 12 35 32" fill="#94a3b8" />
                            </svg>
                          )}
                        </div>

                        <div style={{ textAlign: "center" }}>
                          <h1 style={{ fontSize: `${fontSizeBase + 10}px`, fontWeight: "700", lineHeight: "1.2", margin: 0, textTransform: "uppercase" }}>{personal.name || "Daniel Smith"}</h1>
                          <p style={{ fontSize: `${fontSizeBase + 2}px`, color: "rgba(255,255,255,0.9)", marginTop: "4px", margin: 0 }}>{personal.title || "Medical Doctor"}</p>
                        </div>
                      </div>

                      {/* About Me */}
                      {personal.summary && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "16px 0" }}>
                          <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 3}px`, letterSpacing: "0.02em", padding: "8px 0", border: "2px solid #ffffff", borderRadius: "2px" }}>
                            About Me
                          </div>
                          <p style={{ fontSize: `${fontSizeBase - 0.5}px`, lineHeight: "1.65", color: "rgba(255,255,255,0.95)", textAlign: "center", margin: 0 }}>
                            {personal.summary}
                          </p>
                        </div>
                      )}

                      {/* Contact */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0" }}>
                        <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 3}px`, letterSpacing: "0.02em", padding: "8px 0", border: "2px solid #ffffff", borderRadius: "2px" }}>
                          Contact
                        </div>
                        <div style={{ fontSize: `${fontSizeBase}px`, lineHeight: "1.5", display: "flex", flexDirection: "column", gap: "12px" }}>
                          {personal.phone && (
                            <div>
                              <p style={{ fontWeight: "700", margin: 0 }}>Phone</p>
                              <p style={{ color: "rgba(255,255,255,0.95)", margin: 0 }}>{personal.phone}</p>
                            </div>
                          )}
                          {personal.email && (
                            <div>
                              <p style={{ fontWeight: "700", margin: 0 }}>Email</p>
                              <p style={{ color: "rgba(255,255,255,0.95)", margin: 0 }}>{personal.email}</p>
                            </div>
                          )}
                          {personal.location && (
                            <div>
                              <p style={{ fontWeight: "700", margin: 0 }}>Address</p>
                              <p style={{ color: "rgba(255,255,255,0.95)", margin: 0 }}>{personal.location}</p>
                            </div>
                          )}
                          {personal.linkedin && (
                            <div>
                              <p style={{ fontWeight: "700", margin: 0 }}>LinkedIn</p>
                              <a
                                href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#ffffff", textDecoration: "underline", wordBreak: "break-all" }}
                              >
                                {personal.linkedin}
                              </a>
                            </div>
                          )}
                          {(personal.portfolio || personal.website) && (
                            <div>
                              <p style={{ fontWeight: "700", margin: 0 }}>Portfolio / Web</p>
                              <a
                                href={(personal.portfolio || personal.website).startsWith("http") ? (personal.portfolio || personal.website) : `https://${personal.portfolio || personal.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#ffffff", textDecoration: "underline", fontWeight: "700", wordBreak: "break-all" }}
                              >
                                {personal.portfolioLabel || personal.portfolio || personal.website} ↗
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      {languages.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "16px 0" }}>
                          <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 2}px`, letterSpacing: "0.02em", padding: "6px 0", border: "2px solid #ffffff", borderRadius: "2px" }}>
                            Languages
                          </div>
                          <ul style={{ fontSize: `${fontSizeBase}px`, listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                            {languages.map((l, i) => (
                              <li key={i} style={{ textAlign: "center", color: "rgba(255,255,255,0.95)" }}>• {l}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* BOTTOM FOOTER OF LEFT COLUMN */}
                      <div style={{ textAlign: "center", paddingTop: "14px", opacity: 0.75, borderTop: "1px solid rgba(255,255,255,0.25)", fontSize: `${fontSizeBase - 1.5}px` }}>
                        <span>© {new Date().getFullYear()} {personal.name ? personal.name.split(" ")[0] : "CV"}</span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                      {/* Skills */}
                      {skills.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 3}px`, letterSpacing: "0.02em", padding: "8px 0", borderRadius: "2px", background: primaryColor }}>
                            Skills
                          </div>
                          <ul style={{ fontSize: `${fontSizeBase}px`, color: "#262626", listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                            {skills.map((s, i) => (
                              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#262626", marginTop: "6px", flexShrink: 0 }} />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Work Experience */}
                      {experiences.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 3}px`, letterSpacing: "0.02em", padding: "8px 0", borderRadius: "2px", background: primaryColor }}>
                            Work Experience
                          </div>
                          {experiences.map((exp) => (
                            <div key={exp.id} style={{ marginBottom: "6px" }}>
                              <p style={{ fontWeight: "700", fontSize: `${fontSizeBase + 1.5}px`, color: "#171717", margin: 0 }}>{exp.role}</p>
                              <p style={{ fontSize: `${fontSizeBase - 1}px`, color: "#737373", margin: 0 }}>{exp.company}</p>
                              <p style={{ fontSize: `${fontSizeBase - 1}px`, color: "#737373", marginBottom: "4px", margin: 0 }}>{exp.period}</p>
                              {exp.desc && (
                                <ul style={{ fontSize: `${fontSizeBase - 0.5}px`, color: "#262626", listStyle: "none", padding: 0, margin: "4px 0 0 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  {exp.desc.split(".").filter(Boolean).map((sentence, idx) => (
                                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#262626", marginTop: "6px", flexShrink: 0 }} />
                                      <span>{sentence.trim()}.</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Education */}
                      {education.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 3}px`, letterSpacing: "0.02em", padding: "8px 0", borderRadius: "2px", background: primaryColor }}>
                            Education
                          </div>
                          {education.map((edu) => (
                            <div key={edu.id}>
                              <p style={{ fontWeight: "700", fontSize: `${fontSizeBase + 1.5}px`, color: "#171717", margin: 0 }}>{edu.degree}</p>
                              <p style={{ fontSize: `${fontSizeBase - 1}px`, color: "#737373", margin: 0 }}>{edu.school}</p>
                              <p style={{ fontSize: `${fontSizeBase - 1}px`, color: "#737373", margin: 0 }}>Graduated: {edu.year}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Certifications */}
                      {certifications.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ color: "#ffffff", textAlign: "center", fontWeight: "700", fontSize: `${fontSizeBase + 2}px`, letterSpacing: "0.02em", padding: "6px 0", borderRadius: "2px", background: primaryColor }}>
                            Certifications
                          </div>
                          <ul style={{ fontSize: `${fontSizeBase - 0.5}px`, color: "#262626", listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                            {certifications.map((c, i) => (
                              <li key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#262626" }} />
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* LAYOUT 1: SIDEBAR LAYOUT */}
                {layoutMode === "sidebar" && (
                  <div style={{ display: "grid", gridTemplateColumns: `${leftColRatio}% ${100 - leftColRatio}%`, minHeight: "1123px" }}>
                    <div style={{ backgroundColor: primaryColor, color: "#ffffff", padding: "36px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                      {photoImg && (
                        <div style={{ textAlign: "center" }}>
                          <img src={photoImg} alt="Profil" style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: getPhotoRadius(), objectFit: "cover", border: "3px solid #ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }} />
                        </div>
                      )}
                      <div>
                        <h4 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "12px", borderBottom: "1px solid #334155", paddingBottom: "4px" }}>Contact</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", opacity: 0.9 }}>
                          {personal.email && <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Mail className="w-3.5 h-3.5" /> <span>{personal.email}</span></div>}
                          {personal.phone && <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Phone className="w-3.5 h-3.5" /> <span>{personal.phone}</span></div>}
                          {personal.location && <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><MapPin className="w-3.5 h-3.5" /> <span>{personal.location}</span></div>}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div>
                        <h1 style={{ fontSize: "28px", fontWeight: "900", color: primaryColor, margin: 0, textTransform: "uppercase" }}>{personal.name || "Votre Nom"}</h1>
                        <h3 style={{ fontSize: "15px", fontWeight: "700", color: activeTheme.accentText, marginTop: "4px", margin: 0 }}>{personal.title || "Intitulé du Poste"}</h3>
                      </div>
                      {personal.summary && (
                        <div>
                          <h4 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: activeTheme.accentText, borderBottom: "2px solid #e2e8f0", paddingBottom: "4px", marginBottom: "8px" }}>Profil Professionnel</h4>
                          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", margin: 0 }}>{personal.summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* LAYOUT 2: BANNER LAYOUT */}
                {layoutMode !== "sidebar" && layoutMode !== "teal_modern" && (
                  <div style={{ padding: "0px" }}>
                    <div style={{ backgroundColor: primaryColor, color: "#ffffff", padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
                      <div>
                        <h1 style={{ fontSize: "30px", fontWeight: "900", margin: 0, textTransform: "uppercase" }}>{personal.name}</h1>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fbbf24", marginTop: "4px", margin: 0 }}>{personal.title}</h3>
                      </div>
                    </div>
                    <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>
                      {personal.summary && (
                        <div>
                          <h4 style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", color: activeTheme.accentText, borderBottom: "2px solid #e2e8f0", paddingBottom: "4px", marginBottom: "8px" }}>Profil</h4>
                          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", margin: 0 }}>{personal.summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
