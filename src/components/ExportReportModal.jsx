import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio.js';

export default function ExportReportModal({ report, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handlePrint = () => {
    cyberAudio.playBeep(750, 0.03);
    window.print();
  };

  const handleDownloadJSON = () => {
    cyberAudio.playBeep(850, 0.03);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `linkradar_${report.id || 'scan'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const textSummary = `LINKRADAR SECURITY DOSSIER
URL: ${report.url}
Verdict: ${report.status} (${report.score}/100)
Time: ${report.displayTime || report.timestamp}
Key Checks:
- HTTPS: ${report.checks.https.result}
- Domain: ${report.checks.domain.result}
- Brand Impersonation: ${report.checks.brandImpersonation.result}
- Keywords: ${report.checks.suspiciousKeywords.result}
Recommendation: ${report.recommendation}`;

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    cyberAudio.playBeep(900, 0.03);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="card-title">
            <FileText size={16} style={{ color: 'var(--accent)' }} />
            <span>Export Report // {report.id}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: '18px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Target:</div>
          <div style={{ color: 'var(--text-main)', wordBreak: 'break-all', marginBottom: '12px' }}>{report.url}</div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '4px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Score: </span>
              <strong style={{ color: report.statusColor === 'safe' ? 'var(--risk-safe)' : (report.statusColor === 'suspicious' ? 'var(--risk-warning)' : 'var(--risk-danger)') }}>
                {report.score}/100
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Verdict: </span>
              <span>{report.status}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Time: </span>
              <span>{report.displayTime || report.timestamp}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="action-btn-pill" onClick={handleCopySummary}>
            {copied ? <Check size={13} style={{ color: 'var(--risk-safe)' }} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button className="action-btn-pill" onClick={handleDownloadJSON}>
            <Download size={13} />
            Download JSON
          </button>
          <button className="analyze-button" style={{ padding: '0 16px', fontSize: '0.85rem' }} onClick={handlePrint}>
            <Printer size={14} />
            Print / PDF
          </button>
        </div>
      </div>
    </div>
  );
}
