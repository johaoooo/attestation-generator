import React, { useState } from "react";
import { Layers } from "./Icons.jsx";

export default function Navbar({ activeDocType, setActiveDocType }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Accueil" },
    { id: "attestation", label: "Attestation" },
    { id: "courrier", label: "Courrier Officiel" },
    { id: "facture", label: "Facture" },
    { id: "affiche", label: "Affiche & Poster" },
    { id: "cv", label: "CV Professionnel" },
    { id: "rapport", label: "Rapport & Mémoire" },
  ];

  const handleNavClick = (id) => {
    setActiveDocType(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav-header no-print">
      {/* Brand Logo */}
      <div 
        onClick={() => handleNavClick("home")}
        className="nav-brand"
      >
        <div className="nav-brand-logo">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex items-center">
          <span className="nav-brand-title">
            Doc<span>Studio</span>
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="nav-links desktop-only">
        {navItems.map((item) => {
          const isActive = activeDocType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span>{mobileMenuOpen ? "Fermer" : "Menu"}</span>
      </button>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Choisir un document</span>
            <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
              ✕
            </button>
          </div>
          <div className="mobile-drawer-items">
            {navItems.map((item) => {
              const isActive = activeDocType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}


