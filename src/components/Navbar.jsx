import React, { useState, useRef, useEffect } from "react";
import {
  Layers, Palette, Menu, X, Home, Sparkles, Layout, IdCard,
  Receipt, Mail, Award, Briefcase, BookOpen, ChevronDown, FileText
} from "./Icons.jsx";

export default function Navbar({ activeDocType, setActiveDocType, onOpenBrandKit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const studioRef = useRef(null);
  const docsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (studioRef.current && !studioRef.current.contains(e.target)) {
        setStudioOpen(false);
      }
      if (docsRef.current && !docsRef.current.contains(e.target)) {
        setDocsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    setActiveDocType(id);
    setStudioOpen(false);
    setDocsOpen(false);
    setMobileMenuOpen(false);
  };

  const isStudioActive = ["canva_studio", "carte_visite", "affiche"].includes(activeDocType);
  const isDocsActive = ["facture", "courrier", "attestation", "cv", "rapport"].includes(activeDocType);

  return (
    <header className="nav-header no-print" style={{ position: "sticky", top: 0, zIndex: 100, overflow: "visible" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1400px", margin: "0 auto", gap: "24px" }}>
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => handleNavClick("home")}
          className="nav-brand"
          style={{ flexShrink: 0 }}
        >
          <div className="nav-brand-logo">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex items-center">
            <span className="nav-brand-title">
              Doc<span>Studio</span>
            </span>
            <span className="nav-brand-sub desktop-only">PME All-in-One</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="nav-links desktop-only" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flex: 1, overflow: "visible" }}>
          
          {/* 1. Accueil */}
          <button
            onClick={() => handleNavClick("home")}
            className={`nav-item ${activeDocType === "home" ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Home className="w-4 h-4" />
            <span>Accueil</span>
          </button>

          {/* 2. Studio Marketing Dropdown */}
          <div
            ref={studioRef}
            style={{ position: "relative", zIndex: 110 }}
            onMouseEnter={() => setStudioOpen(true)}
            onMouseLeave={() => setStudioOpen(false)}
          >
            <button
              onClick={() => setStudioOpen(!studioOpen)}
              className={`nav-item ${isStudioActive ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Studio Marketing</span>
              <span style={{ fontSize: "9px", background: "#2563EB", color: "#FFFFFF", padding: "1px 5px", borderRadius: "4px", fontWeight: "800" }}>PRO</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${studioOpen ? "rotate-180" : ""}`} />
            </button>

            {studioOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: "4px",
                  width: "280px",
                  background: "#FFFFFF",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: "12px",
                  boxShadow: "0 14px 35px rgba(0,0,0,0.15)",
                  padding: "8px",
                  zIndex: 200
                }}
              >
                <button
                  onClick={() => handleNavClick("canva_studio")}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: activeDocType === "canva_studio" ? "#EFF6FF" : "transparent",
                    color: "#0F172A",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}
                >
                  <Palette className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "800", color: "#2563EB" }}>Canva & Photoshop Studio</span>
                    <span style={{ fontSize: "11px", color: "#64748B" }}>Visuels RS, Stories & Retouches</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick("carte_visite")}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: activeDocType === "carte_visite" ? "#EFF6FF" : "transparent",
                    color: "#0F172A",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}
                >
                  <IdCard className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "800", color: "#D97706" }}>Cartes de Visite PME</span>
                    <span style={{ fontSize: "11px", color: "#64748B" }}>Format 85×55 mm & Planche A4</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick("affiche")}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: activeDocType === "affiche" ? "#EFF6FF" : "transparent",
                    color: "#0F172A",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}
                >
                  <Layout className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "800", color: "#7C3AED" }}>Affiches & Posters</span>
                    <span style={{ fontSize: "11px", color: "#64748B" }}>Événements, foires & ateliers</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. Documents Dropdown */}
          <div
            ref={docsRef}
            style={{ position: "relative", zIndex: 110 }}
            onMouseEnter={() => setDocsOpen(true)}
            onMouseLeave={() => setDocsOpen(false)}
          >
            <button
              onClick={() => setDocsOpen(!docsOpen)}
              className={`nav-item ${isDocsActive ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Documents Officiels</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${docsOpen ? "rotate-180" : ""}`} />
            </button>

            {docsOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: "4px",
                  width: "260px",
                  background: "#FFFFFF",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: "12px",
                  boxShadow: "0 14px 35px rgba(0,0,0,0.15)",
                  padding: "8px",
                  zIndex: 200
                }}
              >
                {[
                  { id: "facture", title: "Factures & Proformas", desc: "Calculs HT/TVA/TTC & signature", icon: Receipt },
                  { id: "courrier", title: "Courriers Officiels", desc: "Lettres d'entreprise aux normes", icon: Mail },
                  { id: "attestation", title: "Attestations & Certificats", desc: "Sceaux de cire, dorures & CSV", icon: Award },
                  { id: "cv", title: "CV Professionnel", desc: "Curriculum Vitae moderne", icon: Briefcase },
                  { id: "rapport", title: "Rapports & Mémoires", desc: "Page de garde & sommaire A4", icon: BookOpen }
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background: activeDocType === item.id ? "#EFF6FF" : "transparent",
                        color: "#0F172A",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px"
                      }}
                    >
                      <IconComp className="w-4 h-4 text-slate-700 mt-0.5" />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700" }}>{item.title}</span>
                        <span style={{ fontSize: "10.5px", color: "#64748B" }}>{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* Right: Brand Kit Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={onOpenBrandKit}
            className="btn btn-primary"
            style={{ fontSize: "12px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Palette className="w-4 h-4 text-white" /> Charte PME
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Navigation PME</span>
            <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
              ✕
            </button>
          </div>
          <div className="mobile-drawer-items" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            <button
              onClick={() => handleNavClick("home")}
              className={`mobile-nav-item ${activeDocType === "home" ? "active" : ""}`}
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>

            <div style={{ padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#F59E0B", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                <Palette className="w-3.5 h-3.5" /> Studio Marketing
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                <button onClick={() => handleNavClick("canva_studio")} className={`mobile-nav-item ${activeDocType === "canva_studio" ? "active" : ""}`}>
                  <Palette className="w-4 h-4" /> Canva & Photoshop Studio
                </button>
                <button onClick={() => handleNavClick("carte_visite")} className={`mobile-nav-item ${activeDocType === "carte_visite" ? "active" : ""}`}>
                  <IdCard className="w-4 h-4" /> Cartes de Visite PME
                </button>
                <button onClick={() => handleNavClick("affiche")} className={`mobile-nav-item ${activeDocType === "affiche" ? "active" : ""}`}>
                  <Layout className="w-4 h-4" /> Affiches & Posters
                </button>
              </div>
            </div>

            <div style={{ padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#3B82F6", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                <FileText className="w-3.5 h-3.5" /> Documents Officiels
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                <button onClick={() => handleNavClick("facture")} className={`mobile-nav-item ${activeDocType === "facture" ? "active" : ""}`}>
                  <Receipt className="w-4 h-4" /> Factures & Proformas
                </button>
                <button onClick={() => handleNavClick("courrier")} className={`mobile-nav-item ${activeDocType === "courrier" ? "active" : ""}`}>
                  <Mail className="w-4 h-4" /> Courriers Officiels
                </button>
                <button onClick={() => handleNavClick("attestation")} className={`mobile-nav-item ${activeDocType === "attestation" ? "active" : ""}`}>
                  <Award className="w-4 h-4" /> Attestations & Certificats
                </button>
                <button onClick={() => handleNavClick("cv")} className={`mobile-nav-item ${activeDocType === "cv" ? "active" : ""}`}>
                  <Briefcase className="w-4 h-4" /> CV Professionnel
                </button>
                <button onClick={() => handleNavClick("rapport")} className={`mobile-nav-item ${activeDocType === "rapport" ? "active" : ""}`}>
                  <BookOpen className="w-4 h-4" /> Rapports & Mémoires
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
