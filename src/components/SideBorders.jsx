import React from "react";

/**
 * SideBorders
 * Renders decorative SVG side patterns on the left and right borders of the certificate.
 */
export default function SideBorders({ style = "royal-pillars", color = "#d4af37", accentColor = "#0b1f4b" }) {
  if (!style || style === "none") return null;

  const sideStyle = {
    position: "absolute",
    top: "30px",
    bottom: "30px",
    width: "24px",
    pointerEvents: "none",
    zIndex: 4,
  };

  return (
    <>
      {/* LEFT SIDE BORDER */}
      <div style={{ ...sideStyle, left: "14px" }}>
        <SidePatternSvg style={style} color={color} accentColor={accentColor} isLeft={true} />
      </div>

      {/* RIGHT SIDE BORDER */}
      <div style={{ ...sideStyle, right: "14px" }}>
        <SidePatternSvg style={style} color={color} accentColor={accentColor} isLeft={false} />
      </div>
    </>
  );
}

function SidePatternSvg({ style, color, accentColor, isLeft }) {
  if (style === "royal-pillars") {
    return (
      <svg width="24" height="100%" viewBox="0 0 24 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top Capital */}
        <rect x="2" y="2" width="20" height="8" rx="2" fill={color} />
        <rect x="4" y="10" width="16" height="4" fill={accentColor} />
        {/* Vertical Fluted Pillar Lines */}
        <line x1="6" y1="14" x2="6" y2="486" stroke={color} strokeWidth="1.5" strokeDasharray="6 3" />
        <line x1="12" y1="14" x2="12" y2="486" stroke={color} strokeWidth="2" />
        <line x1="18" y1="14" x2="18" y2="486" stroke={color} strokeWidth="1.5" strokeDasharray="6 3" />
        {/* Bottom Capital */}
        <rect x="4" y="486" width="16" height="4" fill={accentColor} />
        <rect x="2" y="490" width="20" height="8" rx="2" fill={color} />
      </svg>
    );
  }

  if (style === "greek-key") {
    // Repeating Meander pattern
    const items = Array.from({ length: 16 });
    return (
      <svg width="24" height="100%" viewBox="0 0 24 480" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {items.map((_, i) => {
          const y = i * 30;
          return (
            <path
              key={i}
              d={`M4,${y + 2} H20 V${y + 28} H4 V${y + 10} H14 V${y + 20} H10 V${y + 14}`}
              fill="none"
              stroke={color}
              strokeWidth="1.8"
            />
          );
        })}
      </svg>
    );
  }

  if (style === "diamonds") {
    const items = Array.from({ length: 14 });
    return (
      <svg width="24" height="100%" viewBox="0 0 24 490" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="5" x2="12" y2="485" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        {items.map((_, i) => {
          const cy = 20 + i * 34;
          return (
            <g key={i}>
              <polygon
                points={`12,${cy - 10} 20,${cy} 12,${cy + 10} 4,${cy}`}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
              />
              <circle cx="12" cy={cy} r="3" fill={accentColor} />
            </g>
          );
        })}
      </svg>
    );
  }

  if (style === "laurels") {
    const items = Array.from({ length: 12 });
    return (
      <svg width="24" height="100%" viewBox="0 0 24 480" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="10" x2="12" y2="470" stroke={color} strokeWidth="1.5" />
        {items.map((_, i) => {
          const cy = 25 + i * 38;
          return (
            <g key={i}>
              <ellipse cx="6" cy={cy - 6} rx="6" ry="3" fill={color} transform={`rotate(-25 6 ${cy - 6})`} />
              <ellipse cx="18" cy={cy - 6} rx="6" ry="3" fill={color} transform={`rotate(25 18 ${cy - 6})`} />
              <circle cx="12" cy={cy + 6} r="2" fill={accentColor} />
            </g>
          );
        })}
      </svg>
    );
  }

  if (style === "waves") {
    return (
      <svg width="24" height="100%" viewBox="0 0 24 480" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12,0 C22,40 2,80 12,120 C22,160 2,200 12,240 C22,280 2,320 12,360 C22,400 2,440 12,480"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M12,0 C2,40 22,80 12,120 C2,160 22,200 12,240 C2,280 22,320 12,360 C2,400 22,440 12,480"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
      </svg>
    );
  }

  return null;
}
