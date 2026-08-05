import React from "react";
import { CertificateCorner } from "./CertificateAFI.jsx";

/**
 * PlacableMotifs
 * Allows placing, moving (X/Y), scaling (20px to 800px), rotating (0-360°),
 * and anchoring ultra-pro motifs cleanly in any of the 4 corners or center of the document.
 */
export default function PlacableMotifs({
  motifs = [],
  selectedElement = null,
  setSelectedElement = () => {},
  handleTouchStart = () => {},
  positions = {},
}) {
  if (!motifs || motifs.length === 0) return null;

  return (
    <>
      {motifs.map((motif, index) => {
        if (!motif.enabled || !motif.type || motif.type === "none") return null;
        const key = `motif_${motif.id || index}`;
        const pos = positions[key] || { x: motif.x || 0, y: motif.y || 0 };
        const isSelected = selectedElement === key;
        const size = motif.size || 200;
        const rotation = motif.rotation || 0;
        const opacity = motif.opacity !== undefined ? motif.opacity : 1;
        const corner = motif.corner || "top-right";

        let posStyles = { top: "0px", right: "0px", left: "auto", bottom: "auto" };
        if (corner === "top-left") {
          posStyles = { top: "0px", left: "0px", right: "auto", bottom: "auto" };
        } else if (corner === "bottom-left") {
          posStyles = { bottom: "0px", left: "0px", top: "auto", right: "auto" };
        } else if (corner === "bottom-right") {
          posStyles = { bottom: "0px", right: "0px", top: "auto", left: "auto" };
        } else if (corner === "center") {
          posStyles = { top: "50%", left: "50%", right: "auto", bottom: "auto" };
        }

        const isCenter = corner === "center";
        const transformStr = isCenter
          ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${rotation}deg)`
          : `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`;

        return (
          <div
            key={key}
            className={`placable-motif-box interactive-tappable touch-movable ${isSelected ? "active-selected" : ""}`}
            style={{
              position: "absolute",
              ...posStyles,
              width: `${size}px`,
              height: `${size}px`,
              transform: transformStr,
              transformOrigin: "center center",
              opacity: opacity,
              cursor: "grab",
              zIndex: 3,
              pointerEvents: "auto",
              boxSizing: "border-box",
              transition: "box-shadow 0.2s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(key);
            }}
            onMouseDown={(e) => handleTouchStart(key, e)}
            onTouchStart={(e) => handleTouchStart(key, e)}
          >
            <MotifSvgRenderer type={motif.type} color={motif.color || "#d4a017"} secondaryColor={motif.secondaryColor || "#1a6b3c"} />
          </div>
        );
      })}
    </>
  );
}

export function MotifSvgRenderer({ type, color = "#d4a017", secondaryColor = "#1a6b3c" }) {
  if (type === "afi-wave") {
    return <CertificateCorner className="w-full h-full" />;
  }

  if (type === "afi-gold-ribbon-curved" || type === "rosace-gold") {
    return (
      <svg viewBox="0 0 240 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 C120,40 180,100 240,240 L200,240 C150,120 100,60 0,20 Z" fill={secondaryColor} opacity="0.9" />
        <path d="M0,20 C100,60 150,120 200,240 L180,240 C130,130 90,80 0,35 Z" fill={color} />
        <path d="M0,0 C120,40 180,100 240,240" fill="none" stroke="#f0c95a" strokeWidth="3" />
        <path d="M0,35 C90,80 130,130 180,240" fill="none" stroke="#f0c95a" strokeWidth="2" strokeDasharray="5 3" />
        <circle cx="200" cy="200" r="16" fill={color} />
        <circle cx="200" cy="200" r="8" fill={secondaryColor} />
      </svg>
    );
  }

  if (type === "luxury-guilloche-filigree" || type === "baroque-filigree" || type === "laurel-wreath") {
    return (
      <svg viewBox="0 0 240 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,20 Q120,20 120,120 Q20,120 20,20 Z" fill={secondaryColor} opacity="0.15" />
        <path d="M20,20 C80,20 180,50 220,20 C190,60 190,160 220,220 C160,190 60,190 20,220 C50,180 50,80 20,20 Z" fill="none" stroke={color} strokeWidth="3" />
        <path d="M40,40 C90,40 160,70 190,40 C170,80 170,140 190,190 C140,170 80,170 40,190 C70,150 70,80 40,40 Z" fill="none" stroke="#f0c95a" strokeWidth="1.5" strokeDasharray="6 3" />
        <circle cx="120" cy="120" r="22" fill={color} />
        <circle cx="120" cy="120" r="12" fill={secondaryColor} />
        <circle cx="120" cy="120" r="5" fill="#f0c95a" />
      </svg>
    );
  }

  if (type === "imperial-shield") {
    return (
      <svg viewBox="0 0 200 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M100,10 L180,30 V110 C180,170 100,220 100,220 C100,220 20,170 20,110 V30 Z" fill={secondaryColor} stroke={color} strokeWidth="4" />
        <path d="M100,25 L165,42 V105 C165,155 100,198 100,198 C100,198 35,155 35,105 V42 Z" fill="none" stroke="#f0c95a" strokeWidth="2" />
        <polygon points="100,60 115,95 152,95 122,117 134,152 100,130 66,152 78,117 48,95 85,95" fill={color} />
      </svg>
    );
  }

  if (type === "art-deco-corner") {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 200,0 200,40 40,40 40,200 0,200" fill={color} />
        <polygon points="20,20 180,20 180,30 30,30 30,180 20,180" fill={secondaryColor} />
        <polygon points="50,50 90,50 90,90 50,90" fill="none" stroke={color} strokeWidth="3" transform="rotate(45 70 70)" />
        <line x1="0" y1="0" x2="160" y2="160" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (type === "sunburst-guilloche") {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 90 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={100 + 90 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.85"
          />
        ))}
        <circle cx="100" cy="100" r="50" fill={secondaryColor} stroke={color} strokeWidth="3" />
        <circle cx="100" cy="100" r="42" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="100,68 108,88 128,88 111,100 117,120 100,108 83,120 89,100 72,88 92,88" fill={color} />
      </svg>
    );
  }

  if (type === "fleur-de-lys-royal") {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100,20 C110,50 140,70 140,100 C140,130 110,140 100,180 C90,140 60,130 60,100 C60,70 90,50 100,20 Z"
          fill={color}
        />
        <path
          d="M100,100 C130,90 170,110 170,130 C170,155 140,165 115,145 C115,120 100,100 100,100 Z"
          fill={secondaryColor}
        />
        <path
          d="M100,100 C70,90 30,110 30,130 C30,155 60,165 85,145 C85,120 100,100 100,100 Z"
          fill={secondaryColor}
        />
        <rect x="70" y="130" width="60" height="12" rx="4" fill={color} />
      </svg>
    );
  }

  if (type === "wax-ribbon-seal") {
    return (
      <svg viewBox="0 0 200 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <polygon points="80,140 60,230 90,210 110,230 100,140" fill="#991b1b" />
        <polygon points="100,140 90,230 110,210 130,230 120,140" fill="#7f1d1d" />
        <circle cx="100" cy="90" r="75" fill="#991b1b" stroke="#7f1d1d" strokeWidth="4" />
        <circle cx="100" cy="90" r="62" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="6 3" />
        <circle cx="100" cy="90" r="48" fill="#b91c1c" />
        <polygon points="100,60 108,78 128,78 112,90 118,110 100,98 82,110 88,90 72,78 92,78" fill={color} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100" height="100" rx="10" fill={color} opacity="0.2" stroke={color} strokeDasharray="4 2" />
      <text x="50" y="55" textAnchor="middle" fill={color} fontSize="12" fontWeight="700">MOTIF</text>
    </svg>
  );
}
