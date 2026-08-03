import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import HomeHub from "./components/HomeHub.jsx";
import CanvaStudio from "./components/CanvaStudio.jsx";
import CarteVisiteGenerator from "./components/CarteVisiteGenerator.jsx";
import AttestationFormation from "./AttestationFormation.jsx";
import CourrierGenerator from "./components/CourrierGenerator.jsx";
import FactureGenerator from "./components/FactureGenerator.jsx";
import AfficheGenerator from "./components/AfficheGenerator.jsx";
import CvGenerator from "./components/CvGenerator.jsx";
import RapportMemoireGenerator from "./components/RapportMemoireGenerator.jsx";
import BrandKitModal from "./components/BrandKitModal.jsx";

export default function App() {
  const [activeDocType, setActiveDocType] = useState("home");
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header Navigation */}
      <Navbar
        activeDocType={activeDocType}
        setActiveDocType={setActiveDocType}
        onOpenBrandKit={() => setIsBrandKitOpen(true)}
      />

      {/* Brand Kit Modal for PME */}
      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
      />

      {/* Main Content Area depending on user choice */}
      <main className="transition-all duration-300">
        {activeDocType === "home" && (
          <HomeHub
            setActiveDocType={setActiveDocType}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
          />
        )}

        {activeDocType === "canva_studio" && (
          <CanvaStudio onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "carte_visite" && (
          <CarteVisiteGenerator onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "attestation" && (
          <AttestationFormation onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "courrier" && (
          <CourrierGenerator onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "facture" && (
          <FactureGenerator onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "affiche" && (
          <AfficheGenerator onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "cv" && (
          <CvGenerator onBack={() => setActiveDocType("home")} />
        )}

        {activeDocType === "rapport" && (
          <RapportMemoireGenerator onBack={() => setActiveDocType("home")} />
        )}
      </main>
    </div>
  );
}
