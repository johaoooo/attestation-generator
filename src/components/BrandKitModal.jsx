import React, { useState, useEffect } from "react";
import { getBrandKit, saveBrandKit, resetBrandKit } from "../utils/brandStore.js";
import { Building, Palette, Upload, Check, RefreshCw, X, ShieldCheck, FileText, Smartphone } from "./Icons.jsx";

export default function BrandKitModal({ isOpen, onClose }) {
  const [brand, setBrand] = useState(getBrandKit());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBrand(getBrandKit());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setBrand((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBrandKit(brand);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser la Charte Graphique PME aux valeurs par défaut ?")) {
      const defaultBrand = resetBrandKit();
      setBrand(defaultBrand);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Brand Kit & Charte Graphique PME
              </h2>
              <p className="text-xs text-slate-400">
                Ces informations s'injecteront automatiquement dans tous vos documents & affiches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Section 1: Identité PME */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Building className="w-4 h-4" /> Identité Principale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Nom de la PME / Entreprise</label>
                <input
                  type="text"
                  value={brand.pmeName}
                  onChange={(e) => handleChange("pmeName", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: AfriTech Solutions PME"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Slogan Officiel</label>
                <input
                  type="text"
                  value={brand.pmeSlogan}
                  onChange={(e) => handleChange("pmeSlogan", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: L'innovation au service de la croissance"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logo, Tampon & Signature */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Visuels Officiels (Logo, Sceau & Signature)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Logo */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-between text-center gap-2">
                <span className="font-semibold text-slate-300">Logo PME</span>
                {brand.pmeLogo ? (
                  <img src={brand.pmeLogo} alt="Logo PME" className="h-16 object-contain rounded" />
                ) : (
                  <div className="h-16 w-full rounded border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                    Aucun logo
                  </div>
                )}
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5" /> Choisir logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("pmeLogo", e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Cachet / Tampon */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-between text-center gap-2">
                <span className="font-semibold text-slate-300">Tampon / Sceau</span>
                {brand.pmeStamp ? (
                  <img src={brand.pmeStamp} alt="Tampon PME" className="h-16 object-contain rounded" />
                ) : (
                  <div className="h-16 w-full rounded border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                    Aucun tampon
                  </div>
                )}
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5" /> Choisir tampon
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("pmeStamp", e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Signature DG */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-between text-center gap-2">
                <span className="font-semibold text-slate-300">Signature DG</span>
                {brand.pmeSignature ? (
                  <img src={brand.pmeSignature} alt="Signature PME" className="h-16 object-contain rounded" />
                ) : (
                  <div className="h-16 w-full rounded border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                    Aucune signature
                  </div>
                )}
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5" /> Choisir signature
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("pmeSignature", e)}
                    className="hidden"
                  />
                </label>
              </div>

            </div>
          </div>

          {/* Section 3: Couleurs de la Marque */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Palette de Couleurs PME
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-300 block">Couleur Principale</span>
                  <span className="text-[10px] text-slate-500">{brand.pmePrimaryColor}</span>
                </div>
                <input
                  type="color"
                  value={brand.pmePrimaryColor}
                  onChange={(e) => handleChange("pmePrimaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-300 block">Couleur Secondaire</span>
                  <span className="text-[10px] text-slate-500">{brand.pmeSecondaryColor}</span>
                </div>
                <input
                  type="color"
                  value={brand.pmeSecondaryColor}
                  onChange={(e) => handleChange("pmeSecondaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-300 block">Couleur d'Accent</span>
                  <span className="text-[10px] text-slate-500">{brand.pmeAccentColor}</span>
                </div>
                <input
                  type="color"
                  value={brand.pmeAccentColor}
                  onChange={(e) => handleChange("pmeAccentColor", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Coordonnées & Mentions Légales */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Coordonnées & Mentions Légales PME
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Téléphone(s)</label>
                <input
                  type="text"
                  value={brand.pmePhone}
                  onChange={(e) => handleChange("pmePhone", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Email Professionnel</label>
                <input
                  type="email"
                  value={brand.pmeEmail}
                  onChange={(e) => handleChange("pmeEmail", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Adresse Physique</label>
                <input
                  type="text"
                  value={brand.pmeAddress}
                  onChange={(e) => handleChange("pmeAddress", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Site Web & Réseaux</label>
                <input
                  type="text"
                  value={brand.pmeWebsite}
                  onChange={(e) => handleChange("pmeWebsite", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">N° IFU Officiel</label>
                <input
                  type="text"
                  value={brand.pmeIfu}
                  onChange={(e) => handleChange("pmeIfu", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">N° RCCM Registre du Commerce</label>
                <input
                  type="text"
                  value={brand.pmeRccm}
                  onChange={(e) => handleChange("pmeRccm", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">RIB / IBAN Bancaire</label>
                <input
                  type="text"
                  value={brand.pmeRib}
                  onChange={(e) => handleChange("pmeRib", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Mobile Money (MoMo / KKiaPay)</label>
                <input
                  type="text"
                  value={brand.pmeMomo}
                  onChange={(e) => handleChange("pmeMomo", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-rose-500/10 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Réinitialiser
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" /> Enregistré !
                  </>
                ) : (
                  "Enregistrer la Charte PME"
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
