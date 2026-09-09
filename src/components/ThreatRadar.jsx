import React from 'react';
import { Radar } from 'lucide-react';

export default function ThreatRadar({ radarData }) {
  const dimensions = [
    { key: 'protocolSecurity', label: 'Protocol', value: radarData?.protocolSecurity ?? 80 },
    { key: 'domainTrust', label: 'Domain', value: radarData?.domainTrust ?? 75 },
    { key: 'brandSafety', label: 'Brand', value: radarData?.brandSafety ?? 90 },
    { key: 'contentIntegrity', label: 'Content', value: radarData?.contentIntegrity ?? 85 },
    { key: 'structureHealth', label: 'Structure', value: radarData?.structureHealth ?? 95 }
  ];

  const size = 220;
  const center = size / 2;
  const radius = 75;
  const count = dimensions.length;

  const getCoordinates = (index, valuePercent) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const rings = [0.33, 0.66, 1.0];

  const polygonPoints = dimensions
    .map((dim, i) => {
      const { x, y } = getCoordinates(i, dim.value);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="cyber-card radar-card">
      <div className="radar-header">
        <div className="card-title">
          <Radar size={15} style={{ color: 'var(--accent)' }} />
          <span>Threat Vectors</span>
        </div>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          5-Point Analysis
        </span>
      </div>

      <div className="radar-chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background web rings */}
          {rings.map((factor, idx) => {
            const ringPoints = Array.from({ length: count })
              .map((_, i) => {
                const { x, y } = getCoordinates(i, factor * 100);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={idx}
                points={ringPoints}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial axis lines */}
          {dimensions.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled Threat Area */}
          <polygon
            points={polygonPoints}
            fill="var(--accent-subtle)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />

          {/* Node dots & Labels */}
          {dimensions.map((dim, i) => {
            const { x, y } = getCoordinates(i, dim.value);
            const labelCoord = getCoordinates(i, 122);

            return (
              <g key={dim.key}>
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="var(--accent)"
                  stroke="var(--bg-surface)"
                  strokeWidth="1"
                />
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--text-muted)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {dim.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="radar-legend">
        {dimensions.map((dim) => (
          <div key={dim.key} className="radar-legend-item">
            <span>{dim.label}:</span>
            <span className="radar-legend-val">{Math.round(dim.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
