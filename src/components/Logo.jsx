import React from 'react';

/**
 * Modern Geometric Startup Logo for AEGIS
 * Precision vector icon featuring a clean faceted shield and core vertex in Monkeytype accent.
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
      {/* Outer Geometric Hex-Shield Contour */}
      <path
        d="M16 3L28 8.5V17.5C28 23.8 22.8 28.5 16 30C9.2 28.5 4 23.8 4 17.5V8.5L16 3Z"
        stroke="#d1d0c5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Prism Intersection */}
      <path
        d="M16 3V30"
        stroke="rgba(209, 208, 197, 0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Dynamic Golden Center Core Accent */}
      <path
        d="M16 8L23 13V19L16 24L9 19V13L16 8Z"
        fill="rgba(226, 183, 20, 0.15)"
        stroke="#e2b714"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Central Vertex Dot */}
      <circle cx="16" cy="16" r="2" fill="#e2b714" />
    </svg>
  );
}
