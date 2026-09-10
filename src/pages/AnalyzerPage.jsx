import React, { useState } from 'react';
import { Terminal, Shield } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import URLAnalyzer from '../components/URLAnalyzer.jsx';
import AnalysisProgress from '../components/AnalysisProgress.jsx';
import SecurityScore from '../components/SecurityScore.jsx';
import ThreatRadar from '../components/ThreatRadar.jsx';
import SecurityCheckCard from '../components/SecurityCheckCard.jsx';
import ThreatExplanation from '../components/ThreatExplanation.jsx';
import ExportReportModal from '../components/ExportReportModal.jsx';

export default function AnalyzerPage({
  report,
  isScanning,
  activeTargetUrl,
  onAnalyze,
  onProgressComplete
}) {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div className="hero-pill-badge">
          <Logo size={13} />
          <span>Multi-Vector Heuristics</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2rem' }}>
          Link Threat Analyzer
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
          Inspect suspicious links, brand lookalikes, and unverified redirect patterns across 6 security vectors.
        </p>
      </div>

      <URLAnalyzer onAnalyze={onAnalyze} isAnalyzing={isScanning} />

      {isScanning && (
        <AnalysisProgress
          targetUrl={activeTargetUrl}
          onComplete={onProgressComplete}
        />
      )}

      {report && !isScanning && (
        <div className="report-dashboard">
          <div className="report-top-grid">
            <SecurityScore
              score={report.score}
              status={report.status}
              statusColor={report.statusColor}
            />
            <ThreatRadar radarData={report.radarDimensions} />
          </div>

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

          <ThreatExplanation report={report} />
        </div>
      )}

      {showExportModal && (
        <ExportReportModal
          report={report}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
