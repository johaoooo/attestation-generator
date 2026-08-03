// Central Brand Kit store for PME in DocStudio
const STORAGE_KEY = "docstudio_pme_brand_kit";

export const DEFAULT_BRAND_KIT = {
  pmeName: "AFRIQUE INNOVATION PME",
  pmeSlogan: "L'Excellence Technologique & Marketing au Service de la Croissance",
  pmeLogo: "",
  pmePrimaryColor: "#1e3a8a", // Blue navy
  pmeSecondaryColor: "#0284c7", // Sky blue
  pmeAccentColor: "#d97706", // Amber gold
  pmeFontFamily: "Plus Jakarta Sans",
  pmeIfu: "320261198273645",
  pmeRccm: "RB/COT/26 B 9876",
  pmePhone: "+229 97 88 77 66 / 95 11 22 33",
  pmeEmail: "contact@afrique-innovation.bj",
  pmeAddress: "Avenue Steinmetz, Immeuble Horizon 3E, Cotonou - Bénin",
  pmeWebsite: "www.afrique-innovation.bj",
  pmeStamp: "",
  pmeSignature: "",
  pmeRib: "BJ660 01001 001234567890 22 (BOA Bénin)",
  pmeMomo: "+229 97 88 77 66 (MTN MoMo / KKiaPay)",
  pmeSocial: "@afrique_innovation_pme"
};

export const getBrandKit = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_BRAND_KIT, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.error("Erreur chargement Brand Kit:", err);
  }
  return DEFAULT_BRAND_KIT;
};

export const saveBrandKit = (brandData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brandData));
    window.dispatchEvent(new CustomEvent("brandKitUpdated", { detail: brandData }));
    return true;
  } catch (err) {
    console.error("Erreur sauvegarde Brand Kit:", err);
    return false;
  }
};

export const resetBrandKit = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("brandKitUpdated", { detail: DEFAULT_BRAND_KIT }));
    return DEFAULT_BRAND_KIT;
  } catch (err) {
    console.error("Erreur réinitialisation Brand Kit:", err);
    return DEFAULT_BRAND_KIT;
  }
};
