import React from 'react';

/**
 * Modern Vector Logo for LINKRADAR
 * Sleek precision icon combining a 360-degree radar target reticle with an interlocking link vertex.
 */
export default function Logo({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle' }}
    >
      {/* Outer Radar Contour Ring */}
      <circle
        cx="16"
        cy="16"
        r="13.5"
        stroke="#d1d0c5"
        strokeWidth="1.75"
        strokeDasharray="2 2.5"
      />
      
      {/* Inner Precision Radar Ring */}
      <circle
        cx="16"
        cy="16"
        r="8.5"
        stroke="rgba(209, 208, 197, 0.3)"
        strokeWidth="1.2"
      />

      {/* Crosshair Axes */}
      <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(209, 208, 197, 0.2)" strokeWidth="1" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="rgba(209, 208, 197, 0.2)" strokeWidth="1" />

      {/* Golden Active Radar Sweep Wedge / Interlocking Node */}
      <path
        d="M16 16L25 7A13.5 13.5 0 0 0 16 2.5V16Z"
        fill="rgba(226, 183, 20, 0.25)"
      />
      <line
        x1="16"
        y1="16"
        x2="25.5"
        y2="6.5"
        stroke="#e2b714"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Center Target Link Ping */}
      <circle cx="16" cy="16" r="2.5" fill="#e2b714" />
      <circle cx="21" cy="11" r="1.5" fill="#e2b714" />
    </svg>
  );
}
