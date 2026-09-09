import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Logo from './components/Logo.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AnalyzerPage from './pages/AnalyzerPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import { useThreatAnalysis } from './hooks/useThreatAnalysis.js';

/**
 * Main Application Component
 * Coordinates routing and passes threat analysis state down to view pages.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    report,
    isScanning,
    activeTargetUrl,
    history,
    backendStatus,
    analyze,
    onProgressComplete,
    viewHistoricalScan,
    deleteScan,
    clearHistory
  } = useThreatAnalysis();

  const handleViewScan = (scanItem) => {
    viewHistoricalScan(scanItem);
    setActiveTab('dashboard');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            report={report}
            isScanning={isScanning}
            activeTargetUrl={activeTargetUrl}
            history={history}
            onAnalyze={analyze}
            onProgressComplete={onProgressComplete}
            onViewScan={handleViewScan}
            onDeleteScan={deleteScan}
            onClearHistory={clearHistory}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerPage
            report={report}
            isScanning={isScanning}
            activeTargetUrl={activeTargetUrl}
            onAnalyze={analyze}
            onProgressComplete={onProgressComplete}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            history={history}
            onViewScan={handleViewScan}
            onDeleteScan={deleteScan}
            onClearHistory={clearHistory}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Logo size={14} />
            <span>AEGIS // Think Before You Click</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Threat Engine v2.4</span>
            <span>•</span>
            <span style={{ color: 'var(--risk-safe)' }}>● Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
