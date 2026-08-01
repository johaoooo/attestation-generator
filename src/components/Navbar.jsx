import React, { useState } from "react";
import { 
  FileText, 
  Award, 
  Mail, 
  UserCheck, 
  BookOpen, 
  Home, 
  Layers,
  Receipt,
  ImageIcon,
  Menu,
  X
} from "./Icons.jsx";

export default function Navbar({ activeDocType, setActiveDocType }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "attestation", label: "Attestation", icon: Award },
    { id: "courrier", label: "Courrier Officiel", icon: Mail },
    { id: "facture", label: "Facture", icon: Receipt },
    { id: "affiche", label: "Affiche & Poster", icon: ImageIcon },
    { id: "cv", label: "CV Professionnel", icon: UserCheck },
    { id: "rapport", label: "Rapport & Mémoire", icon: BookOpen },
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
          const Icon = item.icon;
          const isActive = activeDocType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
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
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Choisir un document</span>
            <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mobile-drawer-items">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeDocType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon className="w-5 h-5" />
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


