import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SecurityScore({ score, status, statusColor }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let current = 0;
    const stepTime = 800 / (score || 1);
    const timer = setInterval(() => {
      current += 1;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, Math.max(10, stepTime));

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="cyber-card score-card">
      <div className="target-label">SECURITY SCORE</div>

      <div className="score-gauge-wrapper">
        <svg className="score-gauge-svg" viewBox="0 0 140 140">
          <circle
            className="score-gauge-bg"
            cx="70"
            cy="70"
            r={radius}
          />
          <circle
            className={`score-gauge-fill ${statusColor}`}
            cx="70"
            cy="70"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="score-center-value">
          <span className="score-number" style={{
            color: statusColor === 'safe' ? 'var(--risk-safe)' : (statusColor === 'suspicious' ? 'var(--risk-warning)' : 'var(--risk-danger)')
          }}>
            {animatedScore}
          </span>
          <span className="score-max">/ 100</span>
        </div>
      </div>

      <div className={`verdict-badge ${statusColor}`}>
        {statusColor === 'safe' && <ShieldCheck size={14} />}
        {statusColor === 'suspicious' && <AlertTriangle size={14} />}
        {statusColor === 'danger' && <ShieldAlert size={14} />}
        <span>{status}</span>
      </div>
    </div>
  );
}
