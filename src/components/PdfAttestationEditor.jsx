import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Upload, FileText, CheckCircle2, Sparkles, Download, ArrowLeft,
  Plus, Trash2, Edit3, Type, Eye, Layers, ShieldCheck, RefreshCw,
  Move, CornerDownRight, Square, Image as ImageIcon, Award, AlertCircle,
  Maximize2, ZoomIn, ZoomOut, Check, Copy, Sliders, Stamp, Bold, Italic,
  Underline, Palette, Layers3, ArrowUp, ArrowDown, EyeOff, Wand2, PenTool,
  Lock, Unlock, RotateCw, Frame, Minus, Replace, MousePointer
} from "lucide-react";
import "./PdfAttestationEditor.css";

export default function PdfAttestationEditor({ onBack, onApplyToForm }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [pages, setPages] = useState([]); // [{ pageNum, canvasUrl, width, height, textItems }]
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Extracted Smart Data
  const [extractedData, setExtractedData] = useState({
    title: "Attestation de Formation",
    destinataire: "",
    formation: "",
    dateDelivrance: "",
    numero: "",
    signataire: "",
    ville: ""
  });

  // Canvas Overlay Elements for editing the PDF
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'fields' | 'layers'

  // Canvas Click Context Menu State
  const [canvasContextMenu, setCanvasContextMenu] = useState(null); // { x, y }

  // Signature Draw Pad State
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const sigCanvasRef = useRef(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [sigColor, setSigColor] = useState("#0b1f4b");

  // File Inputs
  const fileInputRef = useRef(null);
  const replaceImgInputRef = useRef(null);
  const editorRef = useRef(null);

  // Helper to ensure PDF.js is loaded with matching worker version 3.11.174
  const ensurePdfLib = async () => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      return window.pdfjsLib;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load PDF and process pages
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Veuillez sélectionner un fichier au format PDF.");
      return;
    }
    processPdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      processPdfFile(file);
    } else {
      alert("Veuillez déposer un fichier PDF valide.");
    }
  };

  const processPdfFile = async (file) => {
    setPdfFile(file);
    setFileName(file.name);
    setIsLoading(true);
    setLoadingText("Analyse et conversion vectorielle du PDF...");

    try {
      const pdfLib = await ensurePdfLib();
      const arrayBuffer = await file.arrayBuffer();

      // Load Document with Uint8Array data & slice(0) to prevent detached ArrayBuffer errors
      let pdf;
      try {
        const loadingTask = pdfLib.getDocument({
          data: new Uint8Array(arrayBuffer.slice(0)),
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true
        });
        pdf = await loadingTask.promise;
      } catch (errTask) {
        console.warn("Retrying PDF load with fallback parameters...", errTask);
        const fallbackTask = pdfLib.getDocument({
          data: new Uint8Array(arrayBuffer.slice(0))
        });
        pdf = await fallbackTask.promise;
      }

      const loadedPages = [];
      let fullTextCombined = "";
      const extractedTextBlocks = [];
      const extractedImageBlocks = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setLoadingText(`Extraction vectorielle de la page ${i} sur ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const scale = 2.5; // High resolution rendering scale
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const canvasUrl = canvas.toDataURL("image/png");

        // Extract Text Content
        const textContent = await page.getTextContent();
        const pageTextItems = (textContent.items || []).map((item) => {
          fullTextCombined += " " + (item.str || "");
          return {
            str: item.str || "",
            x: Math.round(item.transform[4] * (scale / 1.5)),
            y: Math.round((viewport.height - item.transform[5] * scale) / 1.5),
            fontSize: Math.round(Math.abs(item.transform[0] || 12) * 1.2),
            fontName: item.fontName
          };
        });

        extractedTextBlocks.push(...pageTextItems);

        // Detect PDF Embedded Images / Logos from Operator List
        try {
          const ops = await page.getOperatorList();
          const OPS = pdfLib.OPS;
          if (OPS && ops && ops.fnArray) {
            let transformStack = [];
            let currentTransform = [1, 0, 0, 1, 0, 0];

            for (let j = 0; j < ops.fnArray.length; j++) {
              const fn = ops.fnArray[j];
              const args = ops.argsArray[j];

              if (fn === OPS.save) {
                transformStack.push([...currentTransform]);
              } else if (fn === OPS.restore) {
                if (transformStack.length > 0) {
                  currentTransform = transformStack.pop();
                }
              } else if (fn === OPS.transform && args) {
                const [a, b, c, d, e, f] = args;
                const [a0, b0, c0, d0, e0, f0] = currentTransform;
                currentTransform = [
                  a0 * a + c0 * b,
                  b0 * a + d0 * b,
                  a0 * c + c0 * d,
                  b0 * c + d0 * d,
                  a0 * e + c0 * f + e0,
                  b0 * e + d0 * f + f0
                ];
              } else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
                const imgX = Math.round(currentTransform[4] * (scale / 1.5));
                const imgY = Math.round((viewport.height - currentTransform[5] * scale) / 1.5);
                const imgW = Math.round(Math.abs(currentTransform[0]) * (scale / 1.5));
                const imgH = Math.round(Math.abs(currentTransform[3]) * (scale / 1.5));

                if (imgW > 15 && imgH > 15 && imgW < viewport.width * 0.95 && imgH < viewport.height * 0.95) {
                  extractedImageBlocks.push({
                    id: "pdf-img-" + j,
                    type: "image",
                    x: Math.max(10, imgX),
                    y: Math.max(10, imgY),
                    width: Math.max(50, imgW),
                    height: Math.max(40, imgH),
                    bg: "#ffffff",
                    isPdfOriginalImage: true,
                    url: null, // Placeholder URL for replacing image
                    isLocked: false,
                    isHidden: false
                  });
                }
              }
            }
          }
        } catch (errImg) {
          console.log("Extraction images PDF:", errImg);
        }

        loadedPages.push({
          pageNum: i,
          canvasUrl,
          width: Math.round(viewport.width / (scale / 1.0)),
          height: Math.round(viewport.height / (scale / 1.0)),
          textItems: pageTextItems
        });
      }

      setPages(loadedPages);
      setCurrentPageIndex(0);

      // Smart Field Parser for Certificates
      setLoadingText("Analyse IA des champs d'attestation...");
      parseCertificateFields(fullTextCombined, extractedTextBlocks);

      // AUTOMATICALLY CONVERT ALL PDF TEXT & IMAGES INTO EDITABLE OVERLAY LAYERS
      const allEditableElements = [
        ...generateAllEditableOverlays(extractedTextBlocks, loadedPages[0]),
        ...extractedImageBlocks
      ];
      setElements(allEditableElements);

      setIsLoading(false);
    } catch (err) {
      console.error("Erreur détaillée lors de la lecture du PDF :", err);
      alert(`Erreur lors de la lecture du PDF (${err.message || 'Format invalide'}). Assurez-vous que le fichier n'est pas corrompu ou protégé.`);
      setIsLoading(false);
    }
  };

  // Heuristic parser to extract certificate data
  const parseCertificateFields = (fullText, textItems) => {
    let destinataire = "";
    let formation = "";
    let dateDelivrance = "";
    let numero = "";
    let title = "Attestation de Formation";
    let ville = "";

    const nameMatch = fullText.match(/(?:atteste que|certifie que|délivré à|nommé\(e\)|décerné à|récipiendaire)\s*:?\s*([A-ZÀ-Ÿa-z-'\s]{3,40})/i);
    if (nameMatch && nameMatch[1]) {
      destinataire = nameMatch[1].trim().replace(/\s+/g, " ");
    }

    const courseMatch = fullText.match(/(?:formation en|programme de|spécialité en|avec succès|assiduité le|intitulé)\s*:?\s*([A-ZÀ-Ÿa-z-',\s]{3,60})/i);
    if (courseMatch && courseMatch[1]) {
      formation = courseMatch[1].trim();
    }

    const dateMatch = fullText.match(/(?:\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})|(?:\d{2}[\/.-]\d{2}[\/.-]\d{4})/i);
    if (dateMatch) {
      dateDelivrance = dateMatch[0];
    }

    const numMatch = fullText.match(/(?:N°|n°|Ref|Réf|No|Matricule|Code)\s*:?\s*([A-Z0-9-/]{4,20})/i);
    if (numMatch && numMatch[1]) {
      numero = numMatch[1].trim();
    }

    setExtractedData({
      title,
      destinataire: destinataire || "M./Mme le Bénéficiaire",
      formation: formation || "Formation Professionnelle",
      dateDelivrance: dateDelivrance || new Date().toISOString().split("T")[0],
      numero: numero || "ATT-" + Math.floor(100000 + Math.random() * 900000),
      signataire: "Le Directeur Général",
      ville: ville || "Cotonou"
    });
  };

  // Convert EVERY SINGLE text line found on PDF into an interactive editable element
  const generateAllEditableOverlays = (textItems, page) => {
    if (!textItems || textItems.length === 0) return [];
    
    const grouped = [];
    let currentLine = null;

    textItems.forEach((item, index) => {
      const trimmed = (item.str || "").trim();
      if (!trimmed) return;

      if (!currentLine || Math.abs(item.y - currentLine.y) > 12) {
        if (currentLine && currentLine.text.length > 1) {
          grouped.push(currentLine);
        }
        currentLine = {
          id: "pdf-item-" + index,
          type: "text",
          text: trimmed,
          x: Math.max(10, item.x),
          y: Math.max(10, item.y),
          fontSize: Math.min(36, Math.max(12, item.fontSize || 16)),
          color: "#0f172a",
          bg: "#ffffff",
          fontFamily: "Montserrat",
          fontWeight: "600",
          align: "left",
          width: Math.max(120, trimmed.length * 9),
          height: Math.max(28, (item.fontSize || 16) * 1.5),
          isLocked: false,
          isHidden: false
        };
      } else {
        currentLine.text += " " + trimmed;
        currentLine.width = Math.max(currentLine.width, currentLine.text.length * 9);
      }
    });

    if (currentLine && currentLine.text.length > 1) {
      grouped.push(currentLine);
    }

    return grouped;
  };

  // Re-convert all PDF text with 1-click
  const convertAllPdfTextToEditable = () => {
    if (!pages[currentPageIndex]) return;
    const all = generateAllEditableOverlays(pages[currentPageIndex].textItems, pages[currentPageIndex]);
    setElements(all);
    if (all.length > 0) setSelectedId(all[0].id);
  };

  // Element controls
  const addTextElement = (type = "text", customX, customY) => {
    const newEl = {
      id: "el-" + Date.now(),
      type: "text",
      text: type === "title" ? "NOUVEAU TITRE D'ATTESTATION" : "Nouveau texte modifiable",
      x: customX !== undefined ? customX : 120,
      y: customY !== undefined ? customY : 160,
      fontSize: type === "title" ? 28 : 18,
      color: type === "title" ? "#1e3a8a" : "#0f172a",
      bg: "#ffffff",
      fontFamily: type === "title" ? "Cinzel" : "Montserrat",
      fontWeight: "700",
      align: "left",
      width: 320,
      height: 45,
      isLocked: false,
      isHidden: false
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
    setCanvasContextMenu(null);
  };

  const addMaskPatch = (customX, customY) => {
    const newMask = {
      id: "mask-" + Date.now(),
      type: "mask",
      text: "",
      x: customX !== undefined ? customX : 100,
      y: customY !== undefined ? customY : 130,
      width: 300,
      height: 44,
      bg: "#ffffff",
      color: "transparent",
      isLocked: false,
      isHidden: false
    };
    setElements([...elements, newMask]);
    setSelectedId(newMask.id);
    setCanvasContextMenu(null);
  };

  const addSealBadge = () => {
    const newBadge = {
      id: "badge-" + Date.now(),
      type: "badge",
      text: "SCEAU OFFICIEL",
      x: 220,
      y: 220,
      width: 140,
      height: 140,
      bg: "#d97706",
      color: "#ffffff",
      isLocked: false,
      isHidden: false
    };
    setElements([...elements, newBadge]);
    setSelectedId(newBadge.id);
  };

  const addImagePlaceholderBox = (customX, customY) => {
    const newImgBox = {
      id: "imgbox-" + Date.now(),
      type: "image",
      url: null,
      x: customX !== undefined ? customX : 150,
      y: customY !== undefined ? customY : 150,
      width: 160,
      height: 100,
      bg: "#ffffff",
      isLocked: false,
      isHidden: false
    };
    setElements([...elements, newImgBox]);
    setSelectedId(newImgBox.id);
    setCanvasContextMenu(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImg = {
          id: "img-" + Date.now(),
          type: "image",
          url: event.target.result,
          x: canvasContextMenu?.x !== undefined ? canvasContextMenu.x : 160,
          y: canvasContextMenu?.y !== undefined ? canvasContextMenu.y : 160,
          width: 160,
          height: 100,
          bg: "#ffffff",
          isLocked: false,
          isHidden: false
        };
        setElements([...elements, newImg]);
        setSelectedId(newImg.id);
        setCanvasContextMenu(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Replace selected image file handler
  const handleReplaceImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file && selectedId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSelectedElement("url", event.target.result);
        updateSelectedElement("bg", "#ffffff"); // Auto whiteout mask underneath to erase old image from PDF!
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerReplaceImagePicker = () => {
    replaceImgInputRef.current?.click();
  };

  // Canvas Click Handler to open quick context menu
  const handleCanvasClick = (e) => {
    if (!editorRef.current) return;
    setSelectedId(null);
    const bounds = editorRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - bounds.left) / zoom);
    const y = Math.round((e.clientY - bounds.top) / zoom);
    setCanvasContextMenu({ x, y });
  };

  // Handwritten Signature Pad Drawing Controls
  const startDrawingSig = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawingSig(true);
  };

  const drawSig = (e) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = sigColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawingSig = () => {
    setIsDrawingSig(false);
  };

  const clearSigCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveDrawnSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const newSig = {
      id: "sig-" + Date.now(),
      type: "image",
      url: dataUrl,
      x: 180,
      y: 220,
      width: 160,
      height: 80,
      bg: "#ffffff",
      isLocked: false,
      isHidden: false
    };
    setElements([...elements, newSig]);
    setSelectedId(newSig.id);
    setIsSignatureModalOpen(false);
  };

  const updateSelectedElement = (key, value) => {
    if (!selectedId) return;
    setElements(
      elements.map((el) => (el.id === selectedId ? { ...el, [key]: value } : el))
    );
  };

  const toggleLockSelectedElement = (id) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, isLocked: !el.isLocked } : el))
    );
  };

  const toggleHideSelectedElement = (id) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, isHidden: !el.isHidden } : el))
    );
  };

  const duplicateSelectedElement = () => {
    if (!selectedId) return;
    const orig = elements.find((el) => el.id === selectedId);
    if (orig) {
      const dup = {
        ...orig,
        id: "dup-" + Date.now(),
        x: orig.x + 20,
        y: orig.y + 20
      };
      setElements([...elements, dup]);
      setSelectedId(dup.id);
    }
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveLayerUp = (id) => {
    const idx = elements.findIndex((el) => el.id === id);
    if (idx < elements.length - 1) {
      const copy = [...elements];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      setElements(copy);
    }
  };

  const moveLayerDown = (id) => {
    const idx = elements.findIndex((el) => el.id === id);
    if (idx > 0) {
      const copy = [...elements];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      setElements(copy);
    }
  };

  // Drag & drop movement of elements on canvas
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, el) => {
    if (el.isLocked) return;
    e.stopPropagation();
    setSelectedId(el.id);
    setDraggingId(el.id);
    setCanvasContextMenu(null);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId || !editorRef.current) return;
    const bounds = editorRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.round((e.clientX - bounds.left) / zoom - dragOffset.x));
    const y = Math.max(0, Math.round((e.clientY - bounds.top) / zoom - dragOffset.y));

    setElements(
      elements.map((el) => (el.id === draggingId ? { ...el, x, y } : el))
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Export PDF or Image
  const exportAsPdf = async () => {
    if (!editorRef.current) return;
    setIsLoading(true);
    setLoadingText("Génération du document PDF Vectoriel HD...");

    try {
      const canvas = await html2canvas(editorRef.current, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width / 2.5, canvas.height / 2.5]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2.5, canvas.height / 2.5);
      pdf.save(`attestation_modifiee_${Date.now()}.pdf`);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur d'exportation PDF:", err);
      alert("Erreur lors de l'exportation du PDF.");
      setIsLoading(false);
    }
  };

  const exportAsPng = async () => {
    if (!editorRef.current) return;
    setIsLoading(true);
    setLoadingText("Exportation Image Haute Définition...");

    try {
      const canvas = await html2canvas(editorRef.current, { scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `attestation_modifiee_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert("Erreur d'exportation image.");
      setIsLoading(false);
    }
  };

  const selectedEl = elements.find((el) => el.id === selectedId);
  const currentPage = pages[currentPageIndex];

  return (
    <div className="pdf-studio-root">
      {/* Hidden File Input for Image Replacement */}
      <input
        type="file"
        ref={replaceImgInputRef}
        onChange={handleReplaceImageFile}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header Navbar */}
      <header className="pdf-studio-header">
        <div className="pdf-studio-title-box">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="h-6 w-px bg-slate-700" />
          <div className="flex items-center gap-3">
            <div className="pdf-studio-logo-icon">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-100 text-base">
                  Studio PDF Pro — Éditeur Visuel Intégral
                </h1>
                <span className="pdf-studio-badge-pro">CANVAS HD</span>
              </div>
              <p className="text-xs text-slate-400">
                {fileName ? `${fileName} (${elements.length} calques éditables)` : "Importez votre fichier PDF pour tout modifier à volonté"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {pdfFile && (
            <>
              <button
                onClick={convertAllPdfTextToEditable}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/40 transition"
                title="Reconvertir tous les textes du PDF en calques éditables"
              >
                <Wand2 className="w-4 h-4 text-amber-400" />
                🪄 Reconvertir Tout
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Autre PDF
              </button>

              <button
                onClick={exportAsPng}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 transition"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Image PNG HD
              </button>

              <button
                onClick={exportAsPdf}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition"
              >
                <Download className="w-4 h-4" />
                Télécharger le PDF Édité
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Workspace Area */}
      {!pdfFile ? (
        /* Empty Upload View */
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="pdf-upload-dropzone"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              className="hidden"
            />
            <div className="pdf-upload-icon-wrap">
              <Upload className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">
              Déposez votre Attestation PDF ici
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Importez n'importe quel document PDF d'attestation. Chaque mot, date, nom, image, logo ou bordure sera automatiquement converti en calque 100% modifiable, supprimable ou remplaçable à volonté.
            </p>
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/40 transition">
              <FileText className="w-5 h-5" />
              Parcourir mes fichiers PDF
            </div>
          </div>
        </div>
      ) : (
        /* PDF Loaded Studio Workspace */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Controls */}
          <aside className="pdf-studio-sidebar">
            <div className="pdf-studio-tabs">
              <button
                onClick={() => setActiveTab("editor")}
                className={`pdf-tab-btn ${activeTab === "editor" ? "active" : ""}`}
              >
                <Sliders className="w-4 h-4" />
                Outils & Retouche
              </button>

              <button
                onClick={() => setActiveTab("layers")}
                className={`pdf-tab-btn ${activeTab === "layers" ? "active" : ""}`}
              >
                <Layers className="w-4 h-4" />
                Tous les Éléments ({elements.length})
              </button>

              <button
                onClick={() => setActiveTab("fields")}
                className={`pdf-tab-btn ${activeTab === "fields" ? "active" : ""}`}
              >
                <Sparkles className="w-4 h-4" />
                Données IA
              </button>
            </div>

            {/* Tab Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeTab === "editor" && (
                <>
                  {/* Action Tools Grid */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                      Palette d'Outils d'Édition PDF
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button onClick={() => addTextElement("text")} className="pdf-tool-btn blue">
                        <Type className="w-4 h-4" />
                        Nouveau Texte
                      </button>

                      <button onClick={() => addTextElement("title")} className="pdf-tool-btn blue">
                        <Type className="w-4 h-4 font-bold" />
                        Titre Diplôme
                      </button>

                      <button onClick={addMaskPatch} className="pdf-tool-btn amber">
                        <Square className="w-4 h-4" />
                        Masque Correcteur
                      </button>

                      <button onClick={addImagePlaceholderBox} className="pdf-tool-btn purple">
                        <Replace className="w-4 h-4" />
                        Remplacer une Image
                      </button>

                      <button onClick={addSealBadge} className="pdf-tool-btn emerald">
                        <Award className="w-4 h-4" />
                        Tampon Doré
                      </button>

                      <button onClick={() => setIsSignatureModalOpen(true)} className="pdf-tool-btn purple">
                        <PenTool className="w-4 h-4" />
                        Dessiner Signature
                      </button>

                      <label className="pdf-tool-btn purple cursor-pointer">
                        <ImageIcon className="w-4 h-4" />
                        Logo / Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Selected Element Property Form */}
                  {selectedEl ? (
                    <div className="pdf-property-card">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                          <Sliders className="w-4 h-4" />
                          Propriétés du Calque
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleLockSelectedElement(selectedEl.id)}
                            className={`p-1 rounded transition ${selectedEl.isLocked ? "bg-amber-500/20 text-amber-400" : "hover:bg-slate-800 text-slate-400"}`}
                            title={selectedEl.isLocked ? "Déverrouiller" : "Verrouiller"}
                          >
                            {selectedEl.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={duplicateSelectedElement}
                            className="p-1 hover:bg-blue-500/20 text-blue-400 rounded transition"
                            title="Dupliquer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeElement(selectedEl.id)}
                            className="p-1 hover:bg-red-500/20 text-red-400 rounded transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Image Specific Action Controls */}
                      {selectedEl.type === "image" && (
                        <div className="mb-4 space-y-2">
                          <button
                            onClick={triggerReplaceImagePicker}
                            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
                          >
                            <Replace className="w-4 h-4" />
                            🖼️ Téléverser une autre image pour remplacer
                          </button>
                          <button
                            onClick={() => removeElement(selectedEl.id)}
                            className="w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            🗑️ Supprimer cette image du PDF
                          </button>
                        </div>
                      )}

                      {/* Text Edit Area */}
                      {selectedEl.type === "text" && (
                        <div className="mb-4">
                          <label className="text-xs text-slate-400 font-semibold block mb-1.5">Texte à afficher</label>
                          <textarea
                            value={selectedEl.text}
                            onChange={(e) => updateSelectedElement("text", e.target.value)}
                            rows={3}
                            className="pdf-input-field font-semibold text-slate-100"
                          />
                        </div>
                      )}

                      {/* Font Family Selector */}
                      {selectedEl.type === "text" && (
                        <div className="mb-4">
                          <label className="text-xs text-slate-400 font-semibold block mb-1.5">Police Typographique</label>
                          <select
                            value={selectedEl.fontFamily || "Montserrat"}
                            onChange={(e) => updateSelectedElement("fontFamily", e.target.value)}
                            className="pdf-input-field font-semibold cursor-pointer"
                          >
                            <option value="Montserrat">Montserrat (Moderne / Pro)</option>
                            <option value="Playfair Display">Playfair Display (Luxe / Titres)</option>
                            <option value="Cinzel">Cinzel (Diplôme Officiel)</option>
                            <option value="Cormorant Garamond">Cormorant Garamond (Classique)</option>
                            <option value="Great Vibes">Great Vibes (Manuscrit / Signature)</option>
                            <option value="Plus Jakarta Sans">Plus Jakarta Sans (Corporate)</option>
                            <option value="Times New Roman">Times New Roman (Académique)</option>
                            <option value="Arial">Arial (Standard)</option>
                          </select>
                        </div>
                      )}

                      {/* Font Size & Colors */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {selectedEl.fontSize !== undefined && (
                          <div>
                            <label className="text-xs text-slate-400 font-semibold block mb-1.5">Taille Texte (px)</label>
                            <input
                              type="number"
                              value={selectedEl.fontSize}
                              onChange={(e) => updateSelectedElement("fontSize", parseInt(e.target.value) || 12)}
                              className="pdf-input-field"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-xs text-slate-400 font-semibold block mb-1.5">Couleur Texte</label>
                          <input
                            type="color"
                            value={selectedEl.color || "#000000"}
                            onChange={(e) => updateSelectedElement("color", e.target.value)}
                            className="w-full h-10 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Background Correcteur Mask Color */}
                      <div className="mb-4">
                        <label className="text-xs text-slate-400 font-semibold block mb-1.5">Masquage du texte/fond original</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedEl.bg === "transparent" ? "#ffffff" : selectedEl.bg}
                            onChange={(e) => updateSelectedElement("bg", e.target.value)}
                            className="w-10 h-9 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer"
                          />
                          <button
                            onClick={() => updateSelectedElement("bg", "#ffffff")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                              selectedEl.bg === "#ffffff" ? "bg-blue-600 text-white border-blue-500" : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            Blanc (Effaceur)
                          </button>
                          <button
                            onClick={() => updateSelectedElement("bg", "transparent")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                              selectedEl.bg === "transparent" ? "bg-blue-600 text-white border-blue-500" : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            Sans masque
                          </button>
                        </div>
                      </div>

                      {/* Dimensions (Width / Height) */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold block mb-1.5">Largeur (px)</label>
                          <input
                            type="number"
                            value={selectedEl.width || 200}
                            onChange={(e) => updateSelectedElement("width", parseInt(e.target.value) || 50)}
                            className="pdf-input-field"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-semibold block mb-1.5">Hauteur (px)</label>
                          <input
                            type="number"
                            value={selectedEl.height || 40}
                            onChange={(e) => updateSelectedElement("height", parseInt(e.target.value) || 20)}
                            className="pdf-input-field"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pdf-property-card text-center p-6">
                      <Move className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Cliquez directement sur n'importe quelle image ou texte du PDF pour le remplacer, le supprimer ou modifier ses propriétés.
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "layers" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300">
                      Tous les Éléments ({elements.length})
                    </span>
                    <button
                      onClick={convertAllPdfTextToEditable}
                      className="text-xs text-blue-400 font-bold hover:underline"
                    >
                      🪄 Reconvertir tout
                    </button>
                  </div>

                  {elements.map((el) => (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                        selectedId === el.id
                          ? "bg-blue-600/20 border-blue-500 text-blue-200 font-bold"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                      } ${el.isHidden ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        {el.type === "text" && <Type className="w-4 h-4 text-blue-400 shrink-0" />}
                        {el.type === "mask" && <Square className="w-4 h-4 text-amber-400 shrink-0" />}
                        {el.type === "badge" && <Award className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {el.type === "image" && <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />}
                        <span className="truncate">
                          {el.type === "text"
                            ? el.text || "Texte vide"
                            : el.type === "image"
                            ? el.url ? "Image Importée" : "Image PDF / Logo"
                            : el.type === "mask"
                            ? "Masque Correcteur"
                            : el.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHideSelectedElement(el.id);
                          }}
                          className="p-1 hover:text-blue-400 text-slate-500 transition"
                          title={el.isHidden ? "Afficher" : "Masquer"}
                        >
                          {el.isHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerUp(el.id);
                          }}
                          className="p-1 hover:text-blue-400 text-slate-500 transition"
                          title="Monter"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerDown(el.id);
                          }}
                          className="p-1 hover:text-blue-400 text-slate-500 transition"
                          title="Descendre"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeElement(el.id);
                          }}
                          className="p-1 hover:text-red-400 text-slate-500 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "fields" && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-2xl text-xs text-blue-200">
                    <p className="font-extrabold mb-1 flex items-center gap-2 text-sm text-blue-400">
                      <Sparkles className="w-4 h-4" />
                      Données Extraites par IA
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      Champs d'attestation auto-détectés. Vous pouvez les synchroniser avec le modèle d'attestation officiel.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1.5">Nom du Bénéficiaire</label>
                      <input
                        type="text"
                        value={extractedData.destinataire}
                        onChange={(e) => setExtractedData({ ...extractedData, destinataire: e.target.value })}
                        className="pdf-input-field font-bold text-blue-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1.5">Intitulé de la Formation</label>
                      <input
                        type="text"
                        value={extractedData.formation}
                        onChange={(e) => setExtractedData({ ...extractedData, formation: e.target.value })}
                        className="pdf-input-field font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1.5">Date de délivrance</label>
                      <input
                        type="text"
                        value={extractedData.dateDelivrance}
                        onChange={(e) => setExtractedData({ ...extractedData, dateDelivrance: e.target.value })}
                        className="pdf-input-field font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1.5">Numéro d'Attestation / Référence</label>
                      <input
                        type="text"
                        value={extractedData.numero}
                        onChange={(e) => setExtractedData({ ...extractedData, numero: e.target.value })}
                        className="pdf-input-field font-semibold"
                      />
                    </div>
                  </div>

                  {onApplyToForm && (
                    <button
                      onClick={() => onApplyToForm(extractedData)}
                      className="w-full mt-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition"
                    >
                      <CornerDownRight className="w-4 h-4" />
                      Injecter dans le Générateur Standard
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Main Visual PDF Canvas Viewport */}
          <main className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
            {/* Toolbar Top Bar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold">Pages du PDF :</span>
                {pages.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      currentPageIndex === idx
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    Page {p.pageNum}
                  </button>
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="Zoom Arrière"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-300 font-black w-14 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="Zoom Avant"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg border border-slate-700 transition"
                >
                  100%
                </button>
              </div>
            </div>

            {/* Interactive Canvas Area */}
            <div
              className="pdf-canvas-board"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {currentPage && (
                <div
                  ref={editorRef}
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center top",
                    width: `${currentPage.width}px`,
                    height: `${currentPage.height}px`
                  }}
                  className="pdf-canvas-container"
                  onClick={handleCanvasClick}
                >
                  {/* Canvas Context Menu when clicking background */}
                  {canvasContextMenu && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${canvasContextMenu.x}px`,
                        top: `${canvasContextMenu.y}px`,
                        zIndex: 100
                      }}
                      className="bg-slate-900 border border-blue-500/50 rounded-xl p-2 shadow-2xl flex flex-col gap-1 text-xs font-bold animate-in fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => addTextElement("text", canvasContextMenu.x, canvasContextMenu.y)}
                        className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg text-blue-300 transition text-left"
                      >
                        <Type className="w-3.5 h-3.5 text-blue-400" />
                        Éditer / Ajouter du Texte ici
                      </button>
                      <button
                        onClick={() => addImagePlaceholderBox(canvasContextMenu.x, canvasContextMenu.y)}
                        className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg text-purple-300 transition text-left"
                      >
                        <Replace className="w-3.5 h-3.5 text-purple-400" />
                        Remplacer l'Image / Logo à cet endroit
                      </button>
                      <button
                        onClick={() => addMaskPatch(canvasContextMenu.x, canvasContextMenu.y)}
                        className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg text-amber-300 transition text-left"
                      >
                        <Square className="w-3.5 h-3.5 text-amber-400" />
                        Masquer / Effacer cette zone
                      </button>
                    </div>
                  )}

                  {/* Background PDF Image */}
                  <img
                    src={currentPage.canvasUrl}
                    alt="Page PDF"
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />

                  {/* Overlays */}
                  {elements.map((el) => {
                    if (el.isHidden) return null;
                    const isSelected = selectedId === el.id;

                    if (el.type === "mask") {
                      return (
                        <div
                          key={el.id}
                          onMouseDown={(e) => handleMouseDown(e, el)}
                          style={{
                            position: "absolute",
                            left: `${el.x}px`,
                            top: `${el.y}px`,
                            width: `${el.width || 200}px`,
                            height: `${el.height || 40}px`,
                            backgroundColor: el.bg || "#ffffff",
                            cursor: el.isLocked ? "default" : "move",
                            zIndex: isSelected ? 40 : 10
                          }}
                          className={`overlay-element-mask ${isSelected ? "overlay-element-selected" : ""}`}
                        >
                          {isSelected && (
                            <>
                              <span className="overlay-handle-pill">Masque Correcteur</span>
                              <div className="floating-format-bar" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="color"
                                  value={el.bg || "#ffffff"}
                                  onChange={(e) => updateSelectedElement("bg", e.target.value)}
                                  className="w-6 h-6 rounded cursor-pointer border-none"
                                  title="Couleur de masquage"
                                />
                                <button
                                  onClick={() => updateSelectedElement("bg", "#ffffff")}
                                  className="floating-btn"
                                >
                                  Blanc
                                </button>
                                <button onClick={duplicateSelectedElement} className="floating-btn">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => removeElement(el.id)} className="floating-btn text-red-400">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    }

                    if (el.type === "badge") {
                      return (
                        <div
                          key={el.id}
                          onMouseDown={(e) => handleMouseDown(e, el)}
                          style={{
                            position: "absolute",
                            left: `${el.x}px`,
                            top: `${el.y}px`,
                            width: `${el.width || 140}px`,
                            height: `${el.height || 140}px`,
                            backgroundColor: el.bg || "#d97706",
                            color: el.color || "#ffffff",
                            cursor: el.isLocked ? "default" : "move",
                            zIndex: isSelected ? 40 : 15
                          }}
                          className={`rounded-full flex flex-col items-center justify-center p-3 text-center shadow-2xl border-4 border-amber-300 ${
                            isSelected ? "overlay-element-selected" : ""
                          }`}
                        >
                          {isSelected && (
                            <>
                              <span className="overlay-handle-pill">Tampon Doré</span>
                              <div className="floating-format-bar" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={el.text}
                                  onChange={(e) => updateSelectedElement("text", e.target.value)}
                                  className="floating-select"
                                  style={{ width: "120px" }}
                                />
                                <button onClick={() => removeElement(el.id)} className="floating-btn text-red-400">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                          <Award className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-black tracking-tighter uppercase leading-tight">
                            {el.text || "OFFICIEL"}
                          </span>
                        </div>
                      );
                    }

                    if (el.type === "image") {
                      return (
                        <div
                          key={el.id}
                          onMouseDown={(e) => handleMouseDown(e, el)}
                          style={{
                            position: "absolute",
                            left: `${el.x}px`,
                            top: `${el.y}px`,
                            width: `${el.width || 160}px`,
                            height: `${el.height || 100}px`,
                            backgroundColor: el.bg || "#ffffff",
                            cursor: el.isLocked ? "default" : "move",
                            zIndex: isSelected ? 40 : 15
                          }}
                          className={`group rounded border ${
                            isSelected
                              ? "overlay-element-selected"
                              : el.isPdfOriginalImage
                              ? "border-purple-400/50 hover:border-purple-500 bg-purple-50/10"
                              : "border-transparent"
                          }`}
                        >
                          {isSelected && (
                            <>
                              <span className="overlay-handle-pill">
                                {el.isPdfOriginalImage ? "Image / Logo PDF Détecté" : "Image / Signature"}
                              </span>
                              {/* Floating Context Bar for Images */}
                              <div className="floating-format-bar" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={triggerReplaceImagePicker}
                                  className="floating-btn bg-purple-600 text-white font-bold"
                                  title="Téléverser une nouvelle image pour remplacer"
                                >
                                  <Replace className="w-3.5 h-3.5" />
                                  Remplacer Image
                                </button>

                                <button
                                  onClick={() => removeElement(el.id)}
                                  className="floating-btn text-red-400 font-bold"
                                  title="Supprimer cette image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Supprimer
                                </button>

                                <button onClick={duplicateSelectedElement} className="floating-btn" title="Dupliquer">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}

                          {el.url ? (
                            <img
                              src={el.url}
                              alt="Élément d'image"
                              className="w-full h-full object-contain pointer-events-none"
                            />
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(el.id);
                                triggerReplaceImagePicker();
                              }}
                              className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-purple-900/40 text-purple-200 border-2 border-dashed border-purple-400/70 rounded cursor-pointer hover:bg-purple-900/60 transition"
                            >
                              <Replace className="w-6 h-6 mb-1 text-purple-300" />
                              <span className="text-[10px] font-extrabold">Logo / Image PDF</span>
                              <span className="text-[8.5px] text-purple-300 font-semibold">Cliquer pour remplacer</span>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Text Overlay with Floating Context Toolbar
                    return (
                      <div
                        key={el.id}
                        onMouseDown={(e) => handleMouseDown(e, el)}
                        style={{
                          position: "absolute",
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          fontSize: `${el.fontSize || 16}px`,
                          color: el.color || "#0f172a",
                          backgroundColor: el.bg || "transparent",
                          fontFamily: el.fontFamily || "Montserrat",
                          fontWeight: el.fontWeight || "600",
                          width: el.width ? `${el.width}px` : "auto",
                          cursor: el.isLocked ? "default" : "move",
                          zIndex: isSelected ? 40 : 20
                        }}
                        className={`p-1 rounded transition ${isSelected ? "overlay-element-selected" : "hover:outline hover:outline-1 hover:outline-blue-400/60"}`}
                      >
                        {isSelected && (
                          <>
                            <span className="overlay-handle-pill">Texte Éditable</span>

                            {/* Floating Toolbar for Selected Text */}
                            <div className="floating-format-bar" onClick={(e) => e.stopPropagation()}>
                              {/* Inline Text Input */}
                              <input
                                type="text"
                                value={el.text}
                                onChange={(e) => updateSelectedElement("text", e.target.value)}
                                className="floating-select"
                                style={{ width: "160px", fontWeight: "700" }}
                                placeholder="Texte..."
                              />

                              {/* Font Selector */}
                              <select
                                value={el.fontFamily || "Montserrat"}
                                onChange={(e) => updateSelectedElement("fontFamily", e.target.value)}
                                className="floating-select"
                              >
                                <option value="Montserrat">Montserrat</option>
                                <option value="Playfair Display">Playfair</option>
                                <option value="Cinzel">Cinzel</option>
                                <option value="Cormorant Garamond">Cormorant</option>
                                <option value="Great Vibes">Great Vibes</option>
                                <option value="Times New Roman">Times</option>
                              </select>

                              {/* Font Size decrease / increase */}
                              <button
                                onClick={() => updateSelectedElement("fontSize", Math.max(8, (el.fontSize || 16) - 2))}
                                className="floating-btn"
                                title="Réduire taille"
                              >
                                -
                              </button>
                              <span className="text-[10px] font-bold text-slate-300">{el.fontSize || 16}</span>
                              <button
                                onClick={() => updateSelectedElement("fontSize", Math.min(72, (el.fontSize || 16) + 2))}
                                className="floating-btn"
                                title="Agrandir taille"
                              >
                                +
                              </button>

                              {/* Color Picker */}
                              <input
                                type="color"
                                value={el.color || "#0f172a"}
                                onChange={(e) => updateSelectedElement("color", e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer border-none"
                                title="Couleur de police"
                              />

                              {/* Correcteur Whiteout toggle */}
                              <button
                                onClick={() => updateSelectedElement("bg", el.bg === "transparent" ? "#ffffff" : "transparent")}
                                className={`floating-btn ${el.bg !== "transparent" ? "bg-amber-600 text-white" : ""}`}
                                title="Activer / Désactiver le masque blanc correcteur sous le texte"
                              >
                                Masque {el.bg !== "transparent" ? "ON" : "OFF"}
                              </button>

                              <button onClick={duplicateSelectedElement} className="floating-btn" title="Dupliquer">
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button onClick={() => removeElement(el.id)} className="floating-btn text-red-400" title="Supprimer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                        {el.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Signature Draw Pad Modal */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-400" />
                Dessiner une Signature Manuscrite
              </h3>
              <button
                onClick={() => setIsSignatureModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Dessinez votre signature manuscrite à la souris ou au doigt sur l'écran tactile.
            </p>

            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Couleur d'encre :</span>
              {["#0b1f4b", "#000000", "#1e40af", "#b3101a", "#047857"].map((c) => (
                <button
                  key={c}
                  onClick={() => setSigColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full border-2 transition ${sigColor === c ? "border-amber-400 scale-110" : "border-slate-700"}`}
                />
              ))}
            </div>

            <div className="bg-white border-2 border-dashed border-slate-600 rounded-xl overflow-hidden mb-5">
              <canvas
                ref={sigCanvasRef}
                width={440}
                height={180}
                onMouseDown={startDrawingSig}
                onMouseMove={drawSig}
                onMouseUp={stopDrawingSig}
                onMouseLeave={stopDrawingSig}
                className="w-full h-44 cursor-crosshair touch-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={clearSigCanvas}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Effacer le dessin
              </button>
              <button
                onClick={saveDrawnSignature}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/30 transition"
              >
                Insérer la Signature sur le PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-xl" />
          <h3 className="text-lg font-black text-slate-100">{loadingText}</h3>
          <p className="text-xs text-slate-400 mt-2 font-semibold">Traitement vectoriel en cours...</p>
        </div>
      )}
    </div>
  );
}
