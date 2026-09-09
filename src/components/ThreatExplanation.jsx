import React from 'react';
import { HelpCircle, AlertCircle, Check, Shield, Info } from 'lucide-react';

export default function ThreatExplanation({ report }) {
  if (!report) return null;

  const { status, statusColor, explanation, positiveHighlights, recommendation } = report;

  return (
    <div className="cyber-card explanation-card">
      <div className="card-title" style={{ marginBottom: '12px' }}>
        <HelpCircle size={15} style={{ color: 'var(--accent)' }} />
        <span>Analysis Summary</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        Classified as <strong style={{
          color: statusColor === 'safe' ? 'var(--risk-safe)' : (statusColor === 'suspicious' ? 'var(--risk-warning)' : 'var(--risk-danger)')
        }}>{status}</strong> based on the following indicators:
      </p>

      <ul className="explanation-bullets-list">
        {explanation && explanation.map((point, index) => (
          <li key={index} className="explanation-bullet-item">
            <div className="bullet-icon-wrapper">
              {statusColor === 'safe' ? (
                <Check size={14} style={{ color: 'var(--risk-safe)' }} />
              ) : (
                <AlertCircle size={14} style={{ color: statusColor === 'danger' ? 'var(--risk-danger)' : 'var(--risk-warning)' }} />
              )}
            </div>
            <span>{point}</span>
          </li>
        ))}

        {positiveHighlights && positiveHighlights.map((point, index) => (
          <li key={`pos-${index}`} className="explanation-bullet-item">
            <div className="bullet-icon-wrapper">
              <Check size={14} style={{ color: 'var(--risk-safe)' }} />
            </div>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Actionable Security Recommendation */}
      <div className={`recommendation-box ${statusColor}`}>
        <Shield size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div className="recommendation-title">Recommendation</div>
          <p className="recommendation-text">{recommendation}</p>
        </div>
      </div>

      {/* Subtle Disclaimer */}
      <div className="disclaimer-card" style={{ marginTop: '16px', marginBottom: 0 }}>
        <Info size={15} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
        <div>
          Automated heuristic assessment based on URL pattern detection. Does not guarantee safety or compromise.
        </div>
      </div>
    </div>
  );
}
