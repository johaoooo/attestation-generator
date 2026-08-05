import React from "react";

/**
 * CertificateOfAchievement
 * Certificat de Réussite / Distinction — Gabarit réutilisable SVG & React (Version raffinée).
 * Toutes les données (nom, titre, sous-titre, description, date, signatures, logos) passent en props.
 */
export default function CertificateOfAchievement({
  recipientName = "Carla Houston",
  title = "CERTIFICATE",
  subtitle = "OF ACHIEVEMENT",
  presentedToText = "Proudly Presented To",
  bodyTextLine1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy",
  bodyTextLine2 = "nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Wisi",
  bodyTextLine3 = "enim ad minim veniam, quis nostrud exerci tation ullamcorper",
  dateText = "15 juillet 2026",
  locationText = "Houègbo",
  signatoryText = "La Directrice",
  signatorySub = "(Maison AFI COLLECTION)",
  logoImg = null,
  customSignatureImg = null,
  positions = {},
  selectedElement = null,
  setSelectedElement = () => {},
  handleTouchStart = () => {},
}) {
  const NAVY = "#1B2A6B";
  const NAVY_DARK = "#16225a";
  const ORANGE = "#F5A93B";
  const GRAY_TEXT = "#64748b";
  const LIGHT_GRAY = "#dedede";

  // ---- Laurel wreath leaves (generated) ----
  const makeLeaves = (side) => {
    const leaves = [];
    const count = 6;
    const cx0 = 600;
    const cy0 = 578;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1); // 0 -> 1
      const angle = side === -1 ? 95 + t * (210 - 95) : 85 - t * (85 - -30);
      const rad = (angle * Math.PI) / 180;
      const radius = 46 + t * 16;
      const cx = cx0 + radius * Math.cos(rad);
      const cy = cy0 + radius * Math.sin(rad);
      const rx = 10 - t * 2;
      const ry = 4.2;
      leaves.push(
        <ellipse
          key={`${side}-${i}`}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={NAVY}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      );
    }
    return leaves;
  };

  // ---- 5 point star ----
  const starPoints = (cx, cy, rOuter, rInner) => {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? rOuter : rInner;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  };

  // ---- Corner fold decoration ----
  const FOLD_PATH =
    "M1000,0 L1000,356 C960,300 900,250 869,225 C830,205 795,175 809,152 " +
    "C845,95 910,15 940,0 Z";

  const CornerFold = ({ mirror = false }) => {
    const transform = mirror ? "translate(1000,700) rotate(180)" : undefined;
    return (
      <g transform={transform}>
        {/* scaled down toward the corner point so the shape stays compact */}
        <g transform="translate(1000,0) scale(0.55) translate(-1000,0)">
          {/* orange shadow copy, offset down-left, peeking out from behind */}
          <path d={FOLD_PATH} fill={ORANGE} transform="translate(-34,26)" />
          {/* main navy fold on top */}
          <path d={FOLD_PATH} fill={NAVY} />
          {/* thin gold line continuing the diagonal down to rejoin the border */}
          <path
            d="M1000,356 C955,395 930,430 926,470"
            fill="none"
            stroke={ORANGE}
            strokeWidth="2"
          />
        </g>
      </g>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        borderRadius: 6,
        overflow: "hidden",
        lineHeight: 0,
        fontFamily: "'Montserrat', 'Poppins', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Dancing+Script:wght@600;700&display=swap');
      `}</style>

      <div
        style={{
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 1000 700"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto", background: "#ffffff" }}
        >
          <defs>
            <clipPath id="cardClip">
              <rect x="0" y="0" width="1000" height="700" />
            </clipPath>
          </defs>

          {/* base */}
          <rect x="0" y="0" width="1000" height="700" fill="#ffffff" />

          {/* gold inner border */}
          <rect
            x="55"
            y="50"
            width="890"
            height="600"
            fill="none"
            stroke={ORANGE}
            strokeWidth="2"
          />

          {/* bottom faint decorative arcs */}
          <circle cx="15" cy="700" r="140" fill="none" stroke={LIGHT_GRAY} strokeWidth="1.5" />
          <circle cx="15" cy="700" r="110" fill="none" stroke={LIGHT_GRAY} strokeWidth="1.5" />
          <circle cx="985" cy="700" r="140" fill="none" stroke={LIGHT_GRAY} strokeWidth="1.5" />

          {/* corner folds */}
          <CornerFold />
          <CornerFold mirror />

          {/* logo ribbon placeholder / custom logo */}
          {logoImg ? (
            <image x="100" y="80" width="90" height="90" href={logoImg} preserveAspectRatio="xMidYMid meet" />
          ) : (
            <g>
              <path
                d="M108,92 H182 V158 L145,184 L108,158 Z"
                fill={NAVY}
              />
              <circle cx="145" cy="112" r="7" fill="#ffffff" opacity="0.9" />
              <text
                x="145"
                y="136"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                letterSpacing="1"
              >
                LOGO
              </text>
              <text
                x="145"
                y="150"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                letterSpacing="1"
              >
                HERE
              </text>
            </g>
          )}

          {/* decorative light-gray triangle accent, tucked beside the ribbon */}
          <polygon points="705,252 745,252 725,286" fill="#e4e4e4" />

          {/* Title */}
          <text
            x="580"
            y="170"
            textAnchor="middle"
            fill={ORANGE}
            fontSize="50"
            fontWeight="800"
            letterSpacing="4"
            fontFamily="'Montserrat', sans-serif"
          >
            {title}
          </text>

          {/* Ribbon banner: OF ACHIEVEMENT */}
          <g>
            <polygon points="415,205 415,247 445,226" fill={NAVY_DARK} />
            <rect x="415" y="205" width="340" height="42" fill={NAVY} />
            <polygon points="755,205 755,247 785,226" fill={NAVY_DARK} />
            <text
              x="585"
              y="232"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="19"
              fontWeight="600"
              letterSpacing="4"
              fontFamily="'Montserrat', sans-serif"
            >
              {subtitle}
            </text>
          </g>

          {/* Proudly presented to */}
          <text
            x="600"
            y="300"
            textAnchor="middle"
            fill={GRAY_TEXT}
            fontSize="17"
            letterSpacing="1"
            fontFamily="'Montserrat', sans-serif"
          >
            {presentedToText}
          </text>

          {/* Name */}
          <text
            x="600"
            y="365"
            textAnchor="middle"
            fill={ORANGE}
            fontSize="62"
            fontFamily="'Dancing Script', cursive"
            fontWeight="700"
          >
            {recipientName}
          </text>
          <line
            x1="420"
            y1="385"
            x2="780"
            y2="385"
            stroke={ORANGE}
            strokeWidth="1.5"
            strokeDasharray="1,5"
            strokeLinecap="round"
          />

          {/* Body Paragraph */}
          <text x="600" y="428" textAnchor="middle" fill={GRAY_TEXT} fontSize="13" fontFamily="'Montserrat', sans-serif">
            {bodyTextLine1}
          </text>
          <text x="600" y="450" textAnchor="middle" fill={GRAY_TEXT} fontSize="13" fontFamily="'Montserrat', sans-serif">
            {bodyTextLine2}
          </text>
          <text x="600" y="472" textAnchor="middle" fill={GRAY_TEXT} fontSize="13" fontFamily="'Montserrat', sans-serif">
            {bodyTextLine3}
          </text>

          {/* Laurel badge */}
          <g>
            {makeLeaves(-1)}
            {makeLeaves(1)}
            <polygon points={starPoints(600, 528, 13, 5.5)} fill={NAVY} />
            <text
              x="600"
              y="558"
              textAnchor="middle"
              fill={NAVY}
              fontSize="12"
              fontWeight="700"
              letterSpacing="1"
              fontFamily="'Montserrat', sans-serif"
            >
              BEST
            </text>
            <text
              x="600"
              y="574"
              textAnchor="middle"
              fill={NAVY}
              fontSize="12"
              fontWeight="700"
              letterSpacing="1"
              fontFamily="'Montserrat', sans-serif"
            >
              AWARD
            </text>
          </g>

          {/* Date */}
          <g transform={`translate(${positions.datePlace?.x || 0}, ${positions.datePlace?.y || 0})`}>
            <text x="185" y="625" fill={NAVY} fontSize="16" fontWeight="600" fontFamily="'Montserrat', sans-serif">
              Fait à {locationText}, le {dateText}
            </text>
          </g>

          {/* Signature */}
          <g transform={`translate(${positions.sig1?.x || 0}, ${positions.sig1?.y || 0})`}>
            {customSignatureImg ? (
              <image x="645" y="550" width="130" height="45" href={customSignatureImg} preserveAspectRatio="xMidYMid meet" />
            ) : null}
            <text x="635" y="625" fill={NAVY} fontSize="16" fontWeight="600" fontFamily="'Montserrat', sans-serif">
              {signatoryText} {signatorySub ? `(${signatorySub})` : ""}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
