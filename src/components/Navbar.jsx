import React from "react";
import { 
  FileText, 
  Award, 
  Mail, 
  UserCheck, 
  BookOpen, 
  Home, 
  Layers,
  Receipt,
  ImageIcon
} from "./Icons.jsx";

export default function Navbar({ activeDocType, setActiveDocType }) {
  const navItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "attestation", label: "Attestation", icon: Award },
    { id: "courrier", label: "Courrier Officiel", icon: Mail },
    { id: "facture", label: "Facture", icon: Receipt },
    { id: "affiche", label: "Affiche & Poster", icon: ImageIcon },
    { id: "cv", label: "CV Professionnel", icon: UserCheck },
    { id: "rapport", label: "Rapport & Mémoire", icon: BookOpen },
  ];

  return (
    <header className="nav-header no-print">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveDocType("home")}
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

      {/* Navigation Links */}
      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeDocType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveDocType(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
