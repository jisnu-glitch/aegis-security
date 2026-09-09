import React, { useState } from 'react';
import { Copy, Check, RefreshCw, FileDown } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import URLAnalyzer from '../components/URLAnalyzer.jsx';
import AnalysisProgress from '../components/AnalysisProgress.jsx';
import SecurityScore from '../components/SecurityScore.jsx';
import ThreatRadar from '../components/ThreatRadar.jsx';
import SecurityCheckCard from '../components/SecurityCheckCard.jsx';
import ThreatExplanation from '../components/ThreatExplanation.jsx';
import ScanHistory from '../components/ScanHistory.jsx';
import ExportReportModal from '../components/ExportReportModal.jsx';
import { cyberAudio } from '../utils/cyberAudio.js';

export default function Dashboard({
  report,
  isScanning,
  activeTargetUrl,
  history,
  onAnalyze,
  onProgressComplete,
  onViewScan,
  onDeleteScan,
  onClearHistory
}) {
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleCopyUrl = () => {
    if (!report?.url) return;
    navigator.clipboard.writeText(report.url);
    setCopied(true);
    cyberAudio.playBeep(900, 0.03);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRescan = () => {
    if (report?.url) {
      cyberAudio.playScanStart();
      onAnalyze(report.url);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill-badge">
          <Logo size={13} />
          <span>Intelligent Threat Detection</span>
        </div>

        <h1 className="hero-title">
          AEGIS
        </h1>

        <div className="hero-tagline">Think Before You Click.</div>

        <p className="hero-description">
          Analyze URLs in real-time for phishing indicators, deceptive domain structures, brand impersonation, and hidden threats before interacting with them.
        </p>
      </section>

      {/* URL Input Analyzer */}
      <URLAnalyzer onAnalyze={onAnalyze} isAnalyzing={isScanning} />

      {/* Analysis Scanning Progress */}
      {isScanning && (
        <AnalysisProgress
          targetUrl={activeTargetUrl}
          onComplete={onProgressComplete}
        />
      )}

      {/* Active Security Report Dashboard */}
      {report && !isScanning && (
        <section className="report-dashboard">
          {/* Target Header Card */}
          <div className="cyber-card target-header-card">
            <div className="target-url-info">
              <span className="target-label">Target Link</span>
              <div className="target-url-text">
                <span>{report.url}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {report.id} • {report.displayTime || new Date(report.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="target-actions">
              <button className="action-btn-pill" onClick={handleCopyUrl}>
                {copied ? <Check size={13} style={{ color: 'var(--risk-safe)' }} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>

              <button className="action-btn-pill" onClick={handleRescan}>
                <RefreshCw size={13} />
                <span>Re-Analyze</span>
              </button>

              <button
                className="action-btn-pill"
                onClick={() => {
                  cyberAudio.playBeep(750, 0.03);
                  setShowExportModal(true);
                }}
              >
                <FileDown size={13} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Top Overview: Threat Score & Radar */}
          <div className="report-top-grid">
            <SecurityScore
              score={report.score}
              status={report.status}
              statusColor={report.statusColor}
            />

            <ThreatRadar radarData={report.radarDimensions} />
          </div>

          {/* 6 Core Security Checks */}
          <h2 className="section-heading">
            <Logo size={15} />
            <span>Security Checks</span>
          </h2>

          <div className="checks-grid">
            <SecurityCheckCard checkKey="https" checkData={report.checks.https} />
            <SecurityCheckCard checkKey="urlLength" checkData={report.checks.urlLength} />
            <SecurityCheckCard checkKey="ipAddress" checkData={report.checks.ipAddress} />
            <SecurityCheckCard checkKey="domain" checkData={report.checks.domain} />
            <SecurityCheckCard checkKey="brandImpersonation" checkData={report.checks.brandImpersonation} />
            <SecurityCheckCard checkKey="suspiciousKeywords" checkData={report.checks.suspiciousKeywords} />
          </div>

          {/* Threat Explanation & Recommendation */}
          <ThreatExplanation report={report} />
        </section>
      )}

      {/* Scan History Section */}
      <section style={{ marginTop: '40px' }}>
        <ScanHistory
          history={history}
          onViewScan={onViewScan}
          onDeleteScan={onDeleteScan}
          onClearHistory={onClearHistory}
        />
      </section>

      {/* Export Report Modal */}
      {showExportModal && (
        <ExportReportModal
          report={report}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
