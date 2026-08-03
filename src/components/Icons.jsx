import React from "react";

const createIcon = (svgPath) => {
  return function IconComponent({ className = "", style = {}, size = 20, color, ...props }) {
    let parsedSize = size;
    if (className.includes("w-3.5") || className.includes("h-3.5")) parsedSize = 14;
    else if (className.includes("w-4") || className.includes("h-4")) parsedSize = 16;
    else if (className.includes("w-5") || className.includes("h-5")) parsedSize = 20;
    else if (className.includes("w-6") || className.includes("h-6")) parsedSize = 24;
    else if (className.includes("w-8") || className.includes("h-8")) parsedSize = 32;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={parsedSize}
        height={parsedSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{
          width: `${parsedSize}px`,
          height: `${parsedSize}px`,
          minWidth: `${parsedSize}px`,
          minHeight: `${parsedSize}px`,
          display: "inline-block",
          verticalAlign: "middle",
          flexShrink: 0,
          ...style
        }}
        {...props}
      >
        {svgPath}
      </svg>
    );
  };
};

export const Award = createIcon(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </>
);

export const Mail = createIcon(
  <>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </>
);

export const UserCheck = createIcon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </>
);

export const User = createIcon(
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
);

export const BookOpen = createIcon(
  <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </>
);

export const Home = createIcon(
  <>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>
);

export const Sparkles = createIcon(
  <>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </>
);

export const Layers = createIcon(
  <>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </>
);

export const FileText = createIcon(
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </>
);

export const ArrowRight = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>
);

export const ArrowLeft = createIcon(
  <>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </>
);

export const CheckCircle2 = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>
);

export const Check = createIcon(
  <>
    <polyline points="20 6 9 17 4 12" />
  </>
);

export const FileCheck = createIcon(
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="m9 15 2 2 4-4" />
    <polyline points="14 2 14 8 20 8" />
  </>
);

export const ShieldCheck = createIcon(
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </>
);

export const Zap = createIcon(
  <>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </>
);

export const Printer = createIcon(
  <>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </>
);

export const Download = createIcon(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </>
);

export const RefreshCw = createIcon(
  <>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </>
);

export const Plus = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>
);

export const Trash2 = createIcon(
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </>
);

export const MapPin = createIcon(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>
);

export const Phone = createIcon(
  <>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </>
);

export const Globe = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </>
);

export const Bookmark = createIcon(
  <>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </>
);

export const ImageIcon = createIcon(
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </>
);

export const Palette = createIcon(
  <>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.75 1.7-1.67 0-.42-.15-.81-.42-1.12-.26-.3-.42-.7-.42-1.14 0-.92.75-1.67 1.67-1.67H16c3.3 0 6-2.7 6-6 0-4.69-4.5-8.4-10-8.4z" />
  </>
);

export const Star = createIcon(
  <>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </>
);

export const Sliders = createIcon(
  <>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" />
    <line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </>
);

export const PenTool = createIcon(
  <>
    <path d="m12 19 7-7 3 3-7 7-3-3z" />
    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="m2 2 7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </>
);

export const Building = createIcon(
  <>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </>
);

export const Smartphone = createIcon(
  <>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </>
);

export const Monitor = createIcon(
  <>
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </>
);

export const Copy = createIcon(
  <>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </>
);

export const Receipt = createIcon(
  <>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6" />
    <path d="M16 12h-6" />
    <path d="M16 16h-6" />

  </>
);

export const CreditCard = createIcon(
  <>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </>
);

export const Menu = createIcon(
  <>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </>
);

export const X = createIcon(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
);

export const QrCode = createIcon(
  <>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3v3h3v-3zM10 21v-4h4v4h-4zM14 3v4h-4V3h4zM7 10h10v4H7v-4z" />
  </>
);

export const Type = createIcon(
  <>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="12" x2="12" y1="4" y2="20" />
    <line x1="9" x2="15" y1="20" y2="20" />
  </>
);

export const Eye = createIcon(
  <>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const Upload = createIcon(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </>
);

export const ChevronDown = createIcon(
  <>
    <polyline points="6 9 12 15 18 9" />
  </>
);

export const Briefcase = createIcon(
  <>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </>
);

export const Layout = createIcon(
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="3" x2="21" y1="9" y2="9" />
    <line x1="9" x2="9" y1="21" y2="9" />
  </>
);

export const Wand2 = createIcon(
  <>
    <path d="m15 4 5 5" />
    <path d="m2 22 10-10" />
    <path d="M20 9 9 20" />
    <path d="M15 9 9 15" />
  </>
);

export const Tag = createIcon(
  <>
    <path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.41L12 2z" />
    <circle cx="7" cy="7" r="2" />
  </>
);

export const IdCard = createIcon(
  <>
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M15 11h2" />
    <path d="M15 15h2" />
    <path d="M6 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
  </>
);

export const SlidersHorizontal = createIcon(
  <>
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </>
);

export const Linkedin = createIcon(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </>
);

export const Instagram = createIcon(
  <>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </>
);

export const Facebook = createIcon(
  <>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </>
);

export const Twitter = createIcon(
  <>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </>
);

export const Whatsapp = createIcon(
  <>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </>
);

export const MessageCircle = createIcon(
  <>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
  </>
);

export const ArrowUp = createIcon(
  <>
    <line x1="12" x2="12" y1="19" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </>
);

export const ArrowDown = createIcon(
  <>
    <line x1="12" x2="12" y1="5" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </>
);

export const ChevronUp = createIcon(
  <>
    <polyline points="18 15 12 9 6 15" />
  </>
);

export const FilePlus = createIcon(
  <>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" x2="12" y1="18" y2="12" />
    <line x1="9" x2="15" y1="15" y2="15" />
  </>
);

export const Maximize2 = createIcon(
  <>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" x2="14" y1="3" y2="10" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </>
);
