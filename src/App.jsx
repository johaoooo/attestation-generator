import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import HomeHub from "./components/HomeHub.jsx";
import AttestationFormation from "./AttestationFormation.jsx";
import CourrierGenerator from "./components/CourrierGenerator.jsx";
import FactureGenerator from "./components/FactureGenerator.jsx";
import AfficheGenerator from "./components/AfficheGenerator.jsx";
import CvGenerator from "./components/CvGenerator.jsx";
import RapportMemoireGenerator from "./components/RapportMemoireGenerator.jsx";

export default function App() {
  const [activeDocType, setActiveDocType] = useState("home");

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <Navbar activeDocType={activeDocType} setActiveDocType={setActiveDocType} />

      {/* Main Content Area depending on user choice */}
      <main className="transition-all duration-300">
        {activeDocType === "home" && (
          <HomeHub setActiveDocType={setActiveDocType} />
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
