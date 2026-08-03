import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDFModule, { jsPDF as jsPDFNamed } from "jspdf";
import LettreOfficielle from "./LettreOfficielle.jsx";
import {
  Download, ArrowLeft, Mail, FileText, RefreshCw, CheckCircle2, Sparkles, Layers, Plus, Trash2, ImageIcon,
  Palette, Star, Sliders, PenTool, Building, User, Smartphone, Monitor, Printer, Check
} from "./Icons.jsx";

const DEFAULT_COURRIER_DATA = {
  logoUrl: null,
  logoLeftUrl: null,
  logoRightUrl: null,
  expediteurNom: "COORDIONNATION FIMA-PN",
  expediteurAdresse: "Porto-Novo, République du Bénin",
  expediteurContact: "Tél: +229 01 97 00 00 00 | Email: contact@fima-pn.bj",
  expediteurLegal: "Coordination Internationale de la Foire Internationale de Madingo-Kayes / Pointe-Noire",
  destinataireNom: "Monsieur le Président de la Chambre des Métiers",
  destinataireEntreprise: "de l'Artisanat du Bénin.",
  destinataireAdresse: "Porto-Novo",
  villeDate: "Porto-Novo, le 15 juillet 2026",
  reference: "002/COMAFA/AMAF/FIMA-PN/2026",
  objetLabel: "Objet",
  objet: "Information et sollicitation d'accompagnement / Participation Foire Internationale de Madingo Kayes (Pointe-Noire)",
  salutation: "Monsieur le Président,",
  corps: "J'ai l'honneur de porter à votre haute connaissance que, depuis trois (3) ans, j'ai été nommée Coordonnatrice de la Foire Internationale de Madingo-Kayes/Pointe-Noire, dont vous aviez reçu le courrier pour une large diffusion.\n\nJe tiens à vous remercier pour votre dynamisme et votre sens de l'écoute dans la vulgarisation de cette information au sein de toutes les confédérations. Que Dieu vous bénisse.\n\nCompte tenu du coût du billet et des frais de séjour liés à ce voyage, plusieurs personnes ayant manifesté le désir d'y aller, par des appels téléphoniques, ont dû désister.\n\nVu l'importance de cette rencontre, qui constitue un véritable carrefour des innovations en Afrique, je sollicite votre accompagnement de tout genre afin de révéler, à ce rendez-vous, le patrimoine culturel et artisanal béninois.\n\nDans l'espoir que vous ne ménagerez aucun effort pour répondre favorablement à ma demande, recevez, Monsieur le Président, l'expression de mes salutations distinguées.",
  signataireNom: "TOSSA Afiavi G. Honorine",
  signataireTitre: "La Coordonnatrice",
  faitA: "Fait à Porto-Novo le 15 juillet 2026"
};

const PRESETS_LIST = [
  {
    name: "🏛️ Lettre Officielle FIMA-PN / Mairie (Bénin)",
    data: { ...DEFAULT_COURRIER_DATA }
  },
  {
    name: "✉️ Demande de Partenariat (AFI COLLECTION / ONG)",
    data: {
      ...DEFAULT_COURRIER_DATA,
      expediteurNom: "Maison AFI COLLECTION du Bénin",
      reference: "N/REF : AC/CR-2026/042",
      destinataireNom: "À l'attention de M. le Directeur Général",
      destinataireEntreprise: "ONG ESPOIR ET NATURE",
      destinataireAdresse: "Avenue Monseigneur Steinmetz, Cotonou",
      villeDate: "Cotonou, le 30 Juillet 2026",
      objet: "Confirmation de partenariat et émission des attestations de fin de formation",
      salutation: "Monsieur le Directeur,",
      corps: "J'ai l'honneur de venir par la présente solliciter votre haute bienveillance afin de faire le point sur la dernière session de formation en Macramé et Teinture de pagne tenue récemment.\n\nNous tenons à vous exprimer notre vive gratitude pour la qualité de la collaboration entre nos deux institutions. Conformément à nos engagements communs, veuillez trouver ci-joint les spécifications relatives à l'émission des attestations de fin de formation pour les lauréats.\n\nRestant à votre entière disposition pour tout renseignement complémentaire, nous vous prions d'agréer, Monsieur le Directeur, l'expression de nos salutations distinguées.",
      faitA: "Fait à Cotonou le 30 Juillet 2026",
      signataireNom: "TOSSA Afiavi Gbessito Honorine",
      signataireTitre: "La Directrice Générale",
    }
  },
  {
    name: "🎓 Demande de Stage Professionnel",
    data: {
      ...DEFAULT_COURRIER_DATA,
      expediteurNom: "HAMADA Asma",
      reference: "STG/2026/089",
      destinataireNom: "À l'attention de M. le Directeur des Ressources Humaines",
      destinataireEntreprise: "Centre Hospitalier Universitaire (CHU)",
      destinataireAdresse: "Béchar",
      villeDate: "Béchar, le 03 Août 2026",
      objet: "Demande de stage pratique au sein du service infirmier",
      salutation: "Monsieur le Directeur,",
      corps: "Actuellement en fin de cycle d'études supérieures paramédicales, j'ai l'honneur de solliciter votre bienveillance afin d'effectuer un stage professionnel pratique d'une durée de trois (03) mois au sein de votre prestigieux établissement hospitalier.\n\nCe stage me permettra de consolider mes connaissances théoriques et de développer mes aptitudes pratiques au contact de vos équipes d'experts.\n\nDans l'attente d'une suite favorable, veuillez agréer, Monsieur le Directeur, l'expression de mes salutations distinguées.",
      faitA: "Fait à Béchar le 03 Août 2026",
      signataireNom: "HAMADA Asma",
      signataireTitre: "La Candidate",
    }
  },
  {
    name: "📜 Lettre de Recommandation Officielle",
    data: {
      ...DEFAULT_COURRIER_DATA,
      expediteurNom: "ONG ESPOIR ET NATURE",
      reference: "REC/2026/EN-901",
      destinataireNom: "À qui de droit",
      destinataireEntreprise: "Attestation de Recommandation",
      destinataireAdresse: "Cotonou",
      villeDate: "Cotonou, le 03 Août 2026",
      objet: "Lettre de recommandation professionnelle",
      salutation: "Madame, Monsieur,",
      corps: "Nous soussignés, Direction de l'ONG ESPOIR ET NATURE, certifions et recommandons chaleureusement la candidature de l'intéressé(e) pour ses compétences exceptionnelles et son intégrité professionnelle.\n\nAu cours de ses missions au sein de notre organisme, il/elle a fait preuve d'une grande rigueur, de leadership et d'un professionnalisme exemplaire dans la gestion des programmes de formation.\n\nEn foi de quoi, la présente recommandation lui est délivrée pour servir et valoir ce que de droit.",
      faitA: "Fait à Cotonou le 03 Août 2026",
      signataireNom: "Mme TOSSA Afiavi Gbessito Honorine",
      signataireTitre: "La Directrice Générale",
    }
  },
  {
    name: "⚖️ Convocation & Notification Officielle",
    data: {
      ...DEFAULT_COURRIER_DATA,
      expediteurNom: "DIRECTION DES RESSOURCES HUMAINES",
      reference: "DRH/CONV-2026/012",
      destinataireNom: "À l'attention des Membres du Conseil d'Administration",
      destinataireEntreprise: "Maison AFI COLLECTION",
      destinataireAdresse: "Cotonou",
      villeDate: "Cotonou, le 03 Août 2026",
      objet: "Convocation à la réunion ordinaire du Conseil d'Administration",
      salutation: "Madame, Monsieur le Membre du Conseil,",
      corps: "Vous êtes prié(e) de bien vouloir assister à la Réunion Ordinaire du Conseil d'Administration qui se tiendra le Lundi 17 Août 2026 à 10h00 au siège social de l'institution.\n\nOrdre du jour :\n1. Examen et approbation du bilan d'étape des formations.\n2. Validation du partenariat stratégique international.\n3. Divers.\n\nVotre présence est vivement souhaitée.",
      faitA: "Fait à Cotonou le 03 Août 2026",
      signataireNom: "TOSSA Honorine",
      signataireTitre: "La Présidente du Conseil",
    }
  }
];

const FONTS_OPTIONS = [
  { label: "Georgia / Times (Classique)", value: "'Georgia', 'Times New Roman', serif" },
  { label: "Times New Roman (Administratif)", value: "'Times New Roman', Times, serif" },
  { label: "Cormorant Garamond (Prestige)", value: "'Cormorant Garamond', serif" },
  { label: "Playfair Display (Élégant)", value: "'Playfair Display', serif" },
  { label: "Plus Jakarta Sans (Moderne)", value: "'Plus Jakarta Sans', sans-serif" },
];

const BANDEAU_PRESETS = [
  { name: "🇧🇯 Bénin (Vert/Jaune/Rouge)", colors: ["#0f9b4f", "#f4d02c", "#d61a2c"] },
  { name: "🇫🇷 France (Bleu/Blanc/Rouge)", colors: ["#002395", "#ffffff", "#ed2939"] },
  { name: "🔱 Or Prestige & Saphir", colors: ["#0F2942", "#C59B27", "#8B263E"] },
  { name: "🌿 Émeraude Royale", colors: ["#0B2B22", "#1B4D3E", "#C59B27"] },
  { name: "🔷 Bleu Corporate Mono", colors: ["#1E3A8A", "#3B82F6", "#93C5FD"] },
];

export default function CourrierGenerator({ onBack }) {
  const [data, setData] = useState({ ...DEFAULT_COURRIER_DATA });
  const [activeTab, setActiveTab] = useState("content");
  
  const [pageFormat, setPageFormat] = useState("portrait");
  const [zoomScale, setZoomScale] = useState(0.8);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [mobileView, setMobileView] = useState("editor");
  const isMobile = windowWidth < 860;

  const [fontBody, setFontBody] = useState("'Georgia', 'Times New Roman', serif");
  const [watermarkText, setWatermarkText] = useState("");

  const [logoLeftImg, setLogoLeftImg] = useState(null);
  const [logoRightImg, setLogoRightImg] = useState(null);
  const [logoSize, setLogoSize] = useState(68);
  
  const [bgImage, setBgImage] = useState(null);
  const [bgOpacity, setBgOpacity] = useState(0.15);
  const [bgFit, setBgFit] = useState("contain");

  const [stampImg, setStampImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const [footer, setFooter] = useState({
    ligne1: "AFI COLLECTION DU BÉNIN | RCCM RB/ABC/15 A 2297 | IFU 12013190056803",
    ligne2: "Ilot : 283, Parcelle : g-8, Maison : Kwami Alexandre TOSSA, Atlantique, Abomey-Calavi, Zoundja, Bénin",
    ligne3: "(+229) 61 68 40 40 / 63 61 71 71 / 63 63 16 16 | afiavitossa@gmail.com",
  });
  const [bandeauCouleurs, setBandeauCouleurs] = useState(["#0f9b4f", "#f4d02c", "#d61a2c"]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto zoom based on viewport width
  useEffect(() => {
    const updateAutoZoom = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 860) {
        const targetPaperWidth = pageFormat === "landscape" ? 960 : 678;
        const availableWidth = Math.max(260, w - 32);
        const autoZoom = Math.max(0.3, Math.min(0.95, availableWidth / targetPaperWidth));
        setZoomScale(Number(autoZoom.toFixed(2)));
      } else {
        setZoomScale(0.8);
      }
    };
    updateAutoZoom();
    window.addEventListener("resize", updateAutoZoom);
    return () => window.removeEventListener("resize", updateAutoZoom);
  }, [pageFormat]);

  const previewRef = useRef(null);

  const setField = (field) => (e) => {
    const val = e.target.value;
    setData((prev) => ({ ...prev, [field]: val }));
  };

  const setFooterField = (field) => (e) => {
    const val = e.target.value;
    setFooter((prev) => ({ ...prev, [field]: val }));
  };

  const handleImageUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Export PDF avec capture SVG parfaite
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsDownloadingPDF(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const svgs = clonedDoc.querySelectorAll("svg");
          svgs.forEach((svg) => {
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          });
        }
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const jsPDFConstructor = jsPDFModule?.jsPDF || jsPDFNamed || window.jspdf?.jsPDF;
      const isPort = pageFormat === "portrait";
      const pdf = new jsPDFConstructor(isPort ? "portrait" : "landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Lettre_Officielle_${(data.reference || "002_COMAFA").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erreur PDF Lettre Officielle:", err);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Export Word (.doc) 100% Éditable et Fidèle dans Microsoft Word
  const handleExportWord = () => {
    const fontFamilyClean = fontBody.replace(/'/g, "");

    const htmlHeader = `
      <html xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>${data.objet || "Lettre Officielle"}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 595.3pt 841.9pt;
            margin: 54.0pt 54.0pt 36.0pt 54.0pt;
            mso-header-margin: 36.0pt;
            mso-footer-margin: 36.0pt;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          body {
            font-family: ${fontFamilyClean};
            font-size: 11pt;
            line-height: 1.55;
            color: #1a1a1a;
          }
          p { margin: 0 0 10pt 0; }
          table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        </style>
      </head>
      <body>
      <div class="Section1">
    `;

    const destLines = Array.isArray(data.destinataire)
      ? data.destinataire
      : (typeof data.destinataire === "string" ? data.destinataire.split("\n") : [data.destinataireNom]);

    const paragraphes = data.corps ? data.corps.split("\n\n") : [];

    let bodyContent = `
      <!-- EN-TÊTE LOGOS -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100.0%;">
        <tr>
          <td width="50%" align="left" valign="top">
            ${logoLeftImg ? `<img src="${logoLeftImg}" height="${logoSize}" style="height:${logoSize}px; max-height:180px;" />` : `<div style="border:1.5pt dashed #cbd5e1; padding:8pt; width:60pt; text-align:center; font-size:9pt; font-weight:bold; color:#94a3b8;">LOGO G</div>`}
          </td>
          <td width="50%" align="right" valign="top">
            ${logoRightImg ? `<img src="${logoRightImg}" height="${logoSize}" style="height:${logoSize}px; max-height:180px;" />` : `<div style="border:1.5pt dashed #cbd5e1; padding:8pt; width:60pt; text-align:center; font-size:9pt; font-weight:bold; color:#94a3b8;">LOGO D</div>`}
          </td>
        </tr>
      </table>

      <!-- ESPACE ABAISSEMENT DE TEXTE -->
      <p style="margin-top:36pt; font-size:1pt;">&nbsp;</p>

      <!-- RÉFÉRENCE ET DESTINATAIRE ALIGNÉS SUR LA MÊME LIGNE -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100.0%;">
        <tr>
          <td width="42%" align="left" valign="top">
            <p style="font-size:10.5pt; font-weight:bold; margin:0;">RÉF. : ${data.reference || "002/COMAFA/AMAF/FIMA-PN/2026"}</p>
          </td>
          <td width="58%" align="left" valign="top">
            <p style="font-size:11pt; font-weight:bold; margin:0 0 6pt 0;">${data.villeDate || "Porto-Novo, le 15 juillet 2026"}</p>
            <p style="font-size:11pt; font-weight:bold; margin:6pt 0 2pt 0;">A</p>
            ${destLines.map(line => `<p style="font-size:11pt; margin:0;">${line}</p>`).join('')}
          </td>
        </tr>
      </table>

      <!-- OBJET -->
      <p style="font-weight:bold; margin-top:22pt; margin-bottom:16pt; font-size:11.5pt; line-height:1.4;">
        ${data.objetLabel || "Objet"} : ${data.objet || ""}
      </p>

      <!-- FORMULE D'APPEL -->
      <p style="font-weight:bold; margin-bottom:12pt; font-size:11pt;">
        ${data.salutation || "Monsieur le Président,"}
      </p>

      <!-- PARAGRAPHES JUSTIFIÉS -->
      <div>
        ${paragraphes.map(p => `<p align="justify" style="text-align:justify; text-justify:inter-word; margin-bottom:12pt; font-size:11pt; line-height:1.55;">${p}</p>`).join('')}
      </div>

      <!-- BLOC SIGNATURE & TAMPON ALIGNÉ À DROITE -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100.0%; margin-top:24pt;">
        <tr>
          <td width="50%">&nbsp;</td>
          <td width="50%" align="right" valign="top">
            <p style="font-style:italic; font-size:10.5pt; margin-bottom:10pt;">${data.faitA || `Fait à ${data.villeDate}`}</p>
            ${stampImg ? `<img src="${stampImg}" height="65" style="height:65px; margin-bottom:4pt;" /><br/>` : ''}
            ${signatureImg ? `<img src="${signatureImg}" height="50" style="height:50px; margin-bottom:4pt;" /><br/>` : ''}
            <table border="0" cellspacing="0" cellpadding="0" style="border:2pt solid #1b2a6b; display:inline-block; margin-top:4pt;">
              <tr>
                <td style="padding:3pt 10pt; font-weight:bold; font-size:10.5pt; color:#1b2a6b; font-family:${fontFamilyClean};">
                  ${data.signataireNom || "TOSSA Afiavi G. Honorine"}
                </td>
              </tr>
            </table>
            <p style="font-weight:bold; font-size:10.5pt; margin-top:6pt;">${data.signataireTitre || "La Coordonnatrice"}</p>
          </td>
        </tr>
      </table>

      <!-- PIED DE PAGE & BANDEAU TRICOLORE -->
      <br/><br/>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100.0%; border-top:1pt solid #cbd5e1; padding-top:10pt; margin-top:30pt;">
        <tr>
          <td align="center" style="font-size:8.5pt; color:#334155; text-align:center;">
            <p style="font-weight:bold; margin:0 0 2pt 0;">${footer.ligne1 || ""}</p>
            <p style="margin:0 0 2pt 0;">${footer.ligne2 || ""}</p>
            <p style="margin:0;">${footer.ligne3 || ""}</p>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100.0%; height:20pt; margin-top:10pt;">
        <tr height="24">
          <td width="33%" bgcolor="${bandeauCouleurs[0] || "#0f9b4f"}" style="background-color:${bandeauCouleurs[0] || "#0f9b4f"};">&nbsp;</td>
          <td width="33%" bgcolor="${bandeauCouleurs[1] || "#f4d02c"}" style="background-color:${bandeauCouleurs[1] || "#f4d02c"};">&nbsp;</td>
          <td width="34%" bgcolor="${bandeauCouleurs[2] || "#d61a2c"}" style="background-color:${bandeauCouleurs[2] || "#d61a2c"};">&nbsp;</td>
        </tr>
      </table>
    `;

    const htmlFooter = `</div></body></html>`;
    const sourceHTML = htmlHeader + bodyContent + htmlFooter;

    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lettre_Officielle_${(data.reference || "002_COMAFA").replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wrap">
      <style>{`
        .wrap { padding: 24px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 1580px; display: grid; grid-template-columns: 440px 1fr; gap: 24px; align-items: start; transition: grid-template-columns 0.25s ease; }
        .container.sidebar-collapsed { grid-template-columns: 0px 1fr !important; gap: 0px !important; }
        .container.sidebar-collapsed .editor-panel { display: none !important; }
        @media (max-width: 1100px) { .container { grid-template-columns: 1fr; } }
        
        .editor-panel { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 48px); position: sticky; top: 24px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .editor-header { padding: 18px 20px 14px; border-bottom: 1px solid #F1F5F9; background: #FAFAFA; }
        .editor-header h1 { font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: #0F172A; }
        .editor-header p { font-size: 12px; color: #64748B; margin-top: 2px; }
        
        .tabs { display: flex; flex-wrap: wrap; background: #F8FAFC; padding: 10px 12px; gap: 6px; border-bottom: 2px solid #E2E8F0; }
        .tab-btn { padding: 8px 12px; border: 1px solid #CBD5E1; background: #FFFFFF; font-size: 12px; font-weight: 700; color: #334155; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .tab-btn:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; transform: translateY(-1px); }
        .tab-btn.active { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF; border-color: #1D4ED8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); }
        .tab-content { padding: 18px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
        
        .presets-box { background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 10px; }
        .presets-box label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; display: block; margin-bottom: 6px; }
        .chip { font-size: 11px; padding: 6px 10px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 16px; cursor: pointer; font-weight: 600; transition: all 0.15s; }
        .chip.active, .chip:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; }
        
        .input-group { display: flex; flex-direction: column; gap: 4px; }
        .input-group label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #475569; }
        .input-group input, .input-group select, .input-group textarea { padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 12.5px; font-family: inherit; color: #0F172A; background: #FFFFFF; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-secondary { background: #F1F5F9; color: #334155; }
        .btn-secondary:hover { background: #E2E8F0; }
        .btn-pdf { background: #DC2626; color: #FFFFFF; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); }
        .btn-pdf:hover { background: #B91C1C; transform: translateY(-1px); }
        .btn-word { background: #1E40AF; color: #FFFFFF; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2); }
        .btn-word:hover { background: #1E3A8A; transform: translateY(-1px); }

        .preview-area { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; min-width: 0; }
        .action-bar { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 8px 16px; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); flex-wrap: wrap; }
        .format-selector-bar { display: flex; align-items: center; background: #F1F5F9; padding: 3px; border-radius: 8px; gap: 2px; }
        .format-bar-btn { border: none; background: transparent; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; color: #475569; transition: all 0.15s; }
        .format-bar-btn.active { background: #FFFFFF; color: #2563EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        
        .zoom-controls { display: flex; align-items: center; gap: 4px; background: #F1F5F9; padding: 3px 6px; border-radius: 8px; }
        .zoom-btn { border: none; background: #FFFFFF; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .zoom-btn.active { background: #2563EB; color: #FFFFFF; }
        
        .cert-scroll { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; overflow-y: auto; text-align: center; background: #CBD5E1; border-radius: 14px; padding: 30px 20px; min-height: 520px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.1); }
        .cert-scale-wrapper { display: inline-block; text-align: left; margin: 0 auto; transform-origin: top center; transition: transform 0.2s ease; }
      `}</style>

      {/* MOBILE VIEW TOGGLE SWITCHER (< 860px) */}
      <div className="mobile-view-tabs no-print">
        <button 
          type="button"
          className={`mobile-view-btn ${mobileView === "editor" ? "active" : ""}`}
          onClick={() => setMobileView("editor")}
        >
          ✏️ Édition
        </button>
        <button 
          type="button"
          className={`mobile-view-btn ${mobileView === "preview" ? "active" : ""}`}
          onClick={() => setMobileView("preview")}
        >
          👁️ Aperçu ({Math.round(zoomScale * 100)}%)
        </button>
      </div>

      <div className={`container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Left Sidebar Editor Panel */}
        <aside className={`editor-panel no-print ${isMobile && mobileView === "preview" ? "mobile-hide-editor" : ""}`}>
          <div className="editor-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>
                <Mail size={18} className="text-blue-600" />
                <span>Lettre Officielle A4</span>
              </h1>
              <p>Style Institutionnel & Administrative</p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(true)}
              className="btn btn-secondary"
              style={{ padding: "4px 8px", fontSize: "11px" }}
              title="Masquer le menu"
            >
              ◀ Plier le Studio
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
              onClick={() => setActiveTab("content")}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Texte & Corps</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "destinataire" ? "active" : ""}`}
              onClick={() => setActiveTab("destinataire")}
            >
              <User className="w-3.5 h-3.5" />
              <span>2. Destinataire & Réf</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "logos" ? "active" : ""}`}
              onClick={() => setActiveTab("logos")}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>3. Double Logos</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "footer" ? "active" : ""}`}
              onClick={() => setActiveTab("footer")}
            >
              <Building className="w-3.5 h-3.5" />
              <span>4. Pied de Page</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "presets" ? "active" : ""}`}
              onClick={() => setActiveTab("presets")}
            >
              <Star className="w-3.5 h-3.5" />
              <span>5. Modèles</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {/* TAB 1: TEXTE ET CORPS */}
            {activeTab === "content" && (
              <>
                <div className="input-group">
                  <label>Formule d'Appel (Salutation)</label>
                  <input type="text" value={data.salutation} onChange={setField("salutation")} placeholder="ex: Monsieur le Président," />
                </div>

                <div className="input-group">
                  <label>Objet de la Lettre</label>
                  <textarea rows={2} value={data.objet} onChange={setField("objet")} placeholder="ex: Information et sollicitation..." />
                </div>

                <div className="input-group">
                  <label>Paragraphes (Séparés par un double saut de ligne)</label>
                  <textarea
                    rows={12}
                    value={data.corps}
                    onChange={setField("corps")}
                    placeholder="Saisissez ici les paragraphes du courrier..."
                    style={{ lineHeight: "1.5" }}
                  />
                </div>

                <div className="input-group">
                  <label>Police de caractère</label>
                  <select value={fontBody} onChange={(e) => setFontBody(e.target.value)}>
                    {FONTS_OPTIONS.map((f, i) => (
                      <option key={i} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* TAB 2: DESTINATAIRE ET RÉFÉRENCES */}
            {activeTab === "destinataire" && (
              <>
                <div className="input-group">
                  <label>Numéro de Référence</label>
                  <input type="text" value={data.reference} onChange={setField("reference")} placeholder="ex: 002/COMAFA/AMAF/FIMA-PN/2026" />
                </div>

                <div className="input-group">
                  <label>Lieu et Date</label>
                  <input type="text" value={data.villeDate} onChange={setField("villeDate")} placeholder="ex: Porto-Novo, le 15 juillet 2026" />
                </div>

                <div className="input-group">
                  <label>Destinataire (Lignes séparées par un retour à la ligne)</label>
                  <textarea
                    rows={4}
                    value={Array.isArray(data.destinataire) ? data.destinataire.join("\n") : (data.destinataireEntreprise ? `${data.destinataireNom}\n${data.destinataireEntreprise}` : data.destinataireNom)}
                    onChange={(e) => setData(prev => ({ ...prev, destinataire: e.target.value.split("\n") }))}
                    placeholder="Monsieur le Président...\nde la Chambre des Métiers..."
                  />
                </div>

                <div className="input-group">
                  <label>Mention "Fait à..." (Pied de signature)</label>
                  <input type="text" value={data.faitA || ""} onChange={setField("faitA")} placeholder="ex: Fait à Porto-Novo le 15 juillet 2026" />
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Nom du Signataire</label>
                    <input type="text" value={data.signataireNom} onChange={setField("signataireNom")} placeholder="ex: TOSSA Afiavi G. Honorine" />
                  </div>
                  <div className="input-group">
                    <label>Titre / Fonction</label>
                    <input type="text" value={data.signataireTitre} onChange={setField("signataireTitre")} placeholder="ex: La Coordonnatrice" />
                  </div>
                </div>

                <div className="input-group">
                  <label>Filigrane texte (Fond de page)</label>
                  <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="ex: CONFIDENTIEL / URGENT" />
                </div>
              </>
            )}

            {/* TAB 3: DOUBLE LOGOS, FOND & SIGNATURES */}
            {activeTab === "logos" && (
              <>
                <div className="presets-box">
                  <label>🖼️ Double Logos d'En-tête</label>
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <label>Logo Haut-Gauche (Organisme Émetteur)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setLogoLeftImg)} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <label>Logo Haut-Droit (Ministère / Partenaire)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setLogoRightImg)} />
                  </div>
                  <div className="input-group">
                    <label>Taille des Logos : {logoSize}px</label>
                    <input
                      type="range"
                      min="40"
                      max="200"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {[50, 68, 100, 140, 180].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className={`chip ${logoSize === sz ? "active" : ""}`}
                          onClick={() => setLogoSize(sz)}
                          style={{ fontSize: "10.5px", padding: "3px 8px" }}
                        >
                          {sz === 50 ? "Petit 50px" : sz === 68 ? "Moyen 68px" : sz === 100 ? "Grand 100px" : sz === 140 ? "Géant 140px" : "Maxi 180px"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="presets-box">
                  <label>🌌 Image de Fond / Filigrane</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Image d'arrière-plan (Upload)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setBgImage)} />
                  </div>
                  {bgImage && (
                    <>
                      <div className="input-group" style={{ marginBottom: "8px" }}>
                        <label>Transparence / Opacité : {Math.round(bgOpacity * 100)}%</label>
                        <input
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={bgOpacity}
                          onChange={(e) => setBgOpacity(Number(e.target.value))}
                        />
                      </div>
                      <div className="input-group">
                        <label>Ajustement de l'image</label>
                        <select value={bgFit} onChange={(e) => setBgFit(e.target.value)}>
                          <option value="contain">Ajusté au centre (Contain)</option>
                          <option value="cover">Couvrir la feuille A4 (Cover)</option>
                          <option value="fill">Étirer (Fill)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="presets-box">
                  <label>✍️ Signature & Cachet Officiel</label>
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <label>Image de Signature Manuscrite</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setSignatureImg)} />
                  </div>
                  <div className="input-group">
                    <label>Image de Cachet / Tampon Officiel</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setStampImg)} />
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: PIED DE PAGE & DRAPEAU */}
            {activeTab === "footer" && (
              <>
                <div className="presets-box">
                  <label>🏢 Mentions Légales Pied de Page</label>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Ligne 1 (Raison Sociale, RCCM, IFU)</label>
                    <input type="text" value={footer.ligne1} onChange={setFooterField("ligne1")} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "8px" }}>
                    <label>Ligne 2 (Adresse Physiques & Siège)</label>
                    <input type="text" value={footer.ligne2} onChange={setFooterField("ligne2")} />
                  </div>
                  <div className="input-group">
                    <label>Ligne 3 (Téléphones & Emails)</label>
                    <input type="text" value={footer.ligne3} onChange={setFooterField("ligne3")} />
                  </div>
                </div>

                <div className="presets-box">
                  <label>🎨 Bandeau de Couleurs Bas de Page</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                    {BANDEAU_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        className="chip"
                        onClick={() => setBandeauCouleurs(p.colors)}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid-3">
                    <div className="input-group">
                      <label>Couleur 1</label>
                      <input type="color" value={bandeauCouleurs[0] || "#0f9b4f"} onChange={(e) => setBandeauCouleurs([e.target.value, bandeauCouleurs[1], bandeauCouleurs[2]])} />
                    </div>
                    <div className="input-group">
                      <label>Couleur 2</label>
                      <input type="color" value={bandeauCouleurs[1] || "#f4d02c"} onChange={(e) => setBandeauCouleurs([bandeauCouleurs[0], e.target.value, bandeauCouleurs[2]])} />
                    </div>
                    <div className="input-group">
                      <label>Couleur 3</label>
                      <input type="color" value={bandeauCouleurs[2] || "#d61a2c"} onChange={(e) => setBandeauCouleurs([bandeauCouleurs[0], bandeauCouleurs[1], e.target.value])} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 5: PRESETS ET MODÈLES */}
            {activeTab === "presets" && (
              <div className="presets-box">
                <label>⭐ Modèles de Lettres Officielle Prêtes à l'Emploi</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                  {PRESETS_LIST.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chip"
                      style={{ textAlign: "left", padding: "10px 12px", borderRadius: "8px" }}
                      onClick={() => setData({ ...preset.data })}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* PREVIEW AREA */}
        <main className={`preview-area ${isMobile && mobileView === "editor" ? "mobile-hide-preview" : ""}`}>
          <div className="action-bar">
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="btn btn-primary"
                style={{ fontSize: "11.5px", padding: "6px 12px" }}
              >
                ▶ Ouvrir le menu d'édition
              </button>
            )}

            <div className="format-selector-bar">
              <button
                type="button"
                className={`format-bar-btn ${pageFormat === "portrait" ? "active" : ""}`}
                onClick={() => setPageFormat("portrait")}
              >
                📱 Portrait A4
              </button>
            </div>

            <div className="zoom-controls">
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginRight: "4px" }}>Zoom :</span>
              <button type="button" className={`zoom-btn ${zoomScale === 0.5 ? "active" : ""}`} onClick={() => setZoomScale(0.5)}>50%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 0.65 ? "active" : ""}`} onClick={() => setZoomScale(0.65)}>65%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 0.8 ? "active" : ""}`} onClick={() => setZoomScale(0.8)}>80%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 1.0 ? "active" : ""}`} onClick={() => setZoomScale(1.0)}>100%</button>
              <button type="button" className={`zoom-btn ${zoomScale === 1.2 ? "active" : ""}`} onClick={() => setZoomScale(1.2)}>120%</button>
            </div>

            <div className="btn-group">
              {onBack && (
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                  ← Accueil
                </button>
              )}

              <button type="button" className="btn btn-word" onClick={handleExportWord}>
                📝 Télécharger Word (.doc)
              </button>

              <button type="button" className="btn btn-pdf" onClick={handleExportPDF} disabled={isDownloadingPDF}>
                {isDownloadingPDF ? "⏳ PDF..." : "📄 Télécharger PDF"}
              </button>
            </div>
          </div>

          <div className="cert-scroll">
            <div className="cert-scale-wrapper" style={{ transform: `scale(${zoomScale})` }}>
              <div ref={previewRef}>
                <LettreOfficielle
                  fontFamily={fontBody}
                  logoSize={logoSize}
                  bgImage={bgImage}
                  bgOpacity={bgOpacity}
                  bgFit={bgFit}
                  data={{
                    logoUrl: logoLeftImg,
                    logoLeftUrl: logoLeftImg,
                    logoRightUrl: logoRightImg,
                    reference: data.reference,
                    lieuDate: data.villeDate,
                    destinataire: Array.isArray(data.destinataire) ? data.destinataire : (typeof data.destinataire === "string" ? data.destinataire.split("\n") : [data.destinataireNom, data.destinataireEntreprise].filter(Boolean)),
                    objetLabel: data.objetLabel || "Objet",
                    objet: data.objet ? data.objet.replace(/^Objet\s*:\s*/i, "") : "Information et sollicitation",
                    formuleAppel: data.salutation,
                    paragraphes: data.corps ? data.corps.split("\n\n") : [],
                    faitA: data.faitA || `Fait à ${data.villeDate}`,
                    signataireNom: data.signataireNom,
                    signataireTitre: data.signataireTitre,
                    signatureUrl: signatureImg,
                    stampUrl: stampImg,
                    watermarkText: watermarkText,
                    footer: footer,
                    bandeauCouleurs: bandeauCouleurs
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
