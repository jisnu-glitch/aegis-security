import React from 'react';
import { Lock, Unlock, Globe, Hash, ShieldAlert, KeyRound, AlertTriangle, Check } from 'lucide-react';

export default function SecurityCheckCard({ checkKey, checkData }) {
  if (!checkData) return null;

  const riskClass = (checkData.risk || 'low').toLowerCase();

  const renderIcon = () => {
    switch (checkKey) {
      case 'https':
        return checkData.isSecure ? <Lock size={15} /> : <Unlock size={15} />;
      case 'urlLength':
        return <Hash size={15} />;
      case 'ipAddress':
        return checkData.isIp ? <ShieldAlert size={15} /> : <Globe size={15} />;
      case 'domain':
        return <Globe size={15} />;
      case 'brandImpersonation':
        return <ShieldAlert size={15} />;
      case 'suspiciousKeywords':
        return <KeyRound size={15} />;
      default:
        return <Check size={15} />;
    }
  };

  return (
    <div className="cyber-card check-card">
      <div>
        <div className="check-card-top">
          <div className="check-card-icon-title">
            <div className={`check-icon-box ${riskClass === 'high' ? 'danger' : (riskClass === 'medium' ? 'suspicious' : 'safe')}`}>
              {renderIcon()}
            </div>
            <div>
              <div className="check-title">{checkData.title}</div>
            </div>
          </div>
          <span className={`check-risk-tag ${riskClass}`}>
            {checkData.risk}
          </span>
        </div>

        <div className="check-result-text">
          <span>{checkData.result}</span>
        </div>

        <p className="check-description">{checkData.detail}</p>
      </div>

      <div>
        {checkKey === 'suspiciousKeywords' && checkData.keywords && checkData.keywords.length > 0 && (
          <div className="check-tags-cloud">
            {checkData.keywords.map((kw, i) => (
              <span key={i} className="check-chip danger">
                {kw.word}
              </span>
            ))}
          </div>
        )}

        {checkKey === 'domain' && (
          <div className="check-tags-cloud">
            <span className="check-chip">Subdomains: {checkData.subdomainsCount}</span>
            <span className="check-chip">TLD: {checkData.tld}</span>
            <span className="check-chip">Entropy: {checkData.entropy}</span>
            {checkData.isHighEntropy && <span className="check-chip warning">High Entropy</span>}
            {checkData.hyphenCount >= 3 && <span className="check-chip warning">{checkData.hyphenCount} Hyphens</span>}
            {checkData.doubleExtension && <span className="check-chip danger">Double Extension</span>}
          </div>
        )}

        {checkKey === 'brandImpersonation' && checkData.detected && (
          <div className="check-tags-cloud">
            <span className="check-chip danger">Brand: {checkData.targetBrand}</span>
            <span className="check-chip danger">{checkData.type}</span>
          </div>
        )}

        {checkKey === 'urlLength' && (
          <div className="check-tags-cloud">
            <span className="check-chip">Length: {checkData.length} chars</span>
          </div>
        )}
      </div>
    </div>
  );
}
