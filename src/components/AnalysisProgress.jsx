import React, { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio.js';

export const SCAN_STAGES = [
  { id: 1, label: 'Parsing URL structure & protocol' },
  { id: 2, label: 'Validating HTTPS encryption & ports' },
  { id: 3, label: 'Analyzing domain entropy & TLD reputation' },
  { id: 4, label: 'Scanning for suspicious & urgency keywords' },
  { id: 5, label: 'Checking brand impersonation & lookalikes' },
  { id: 6, label: 'Calculating risk score & heuristics' }
];

export default function AnalysisProgress({ onComplete, targetUrl }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < SCAN_STAGES.length) {
        setCurrentStage(stage);
        cyberAudio.playStageTick();
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, 240);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.min(100, Math.round(((currentStage + 1) / SCAN_STAGES.length) * 100));

  return (
    <div className="progress-card">
      <div className="terminal-header">
        <div className="terminal-title">
          <span>Analyzing target: {targetUrl}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>
          {progressPercent}%
        </div>
      </div>

      <div className="cyber-progress-bar-container">
        <div
          className="cyber-progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="scan-stages-list">
        {SCAN_STAGES.map((stage, index) => {
          const isDone = index < currentStage;
          const isActive = index === currentStage;

          return (
            <div
              key={stage.id}
              className={`scan-stage-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
            >
              {isDone ? (
                <Check size={13} style={{ color: 'var(--risk-safe)' }} />
              ) : isActive ? (
                <Loader2 size={13} className="spin-animation" style={{ color: 'var(--accent)' }} />
              ) : (
                <span style={{ width: 13, height: 13, display: 'inline-block' }} />
              )}
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
