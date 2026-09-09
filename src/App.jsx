import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import CyberBackground from './components/CyberBackground.jsx';
import Logo from './components/Logo.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AnalyzerPage from './pages/AnalyzerPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import { ApiService } from './services/apiService.js';
import { StorageService } from './services/StorageService.js';
import { cyberAudio } from './utils/cyberAudio.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [report, setReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTargetUrl, setActiveTargetUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ isOnline: true });
  const [pendingReport, setPendingReport] = useState(null);

  useEffect(() => {
    async function init() {
      const initialHistory = StorageService.getHistory();
      setHistory(initialHistory);
      if (initialHistory && initialHistory.length > 0) {
        setReport(initialHistory[0]);
      }

      const status = await ApiService.checkBackendHealth();
      setBackendStatus(status);
    }
    init();
  }, []);

  const handleAnalyze = async (url) => {
    setActiveTargetUrl(url);
    setIsScanning(true);

    const result = await ApiService.analyzeURL(url);
    if (result && result.success && result.report) {
      setPendingReport(result.report);
    } else {
      console.error('Analysis failed:', result?.error);
      setIsScanning(false);
    }
  };

  const handleProgressComplete = () => {
    if (pendingReport) {
      setReport(pendingReport);
      const updatedHistory = StorageService.getHistory();
      setHistory(updatedHistory);
      cyberAudio.playScanComplete(pendingReport.statusColor);
      setPendingReport(null);
    }
    setIsScanning(false);
  };

  const handleViewScan = (scanItem) => {
    setReport(scanItem);
    setActiveTab('dashboard');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleDeleteScan = async (id) => {
    const updated = await ApiService.deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = async () => {
    const updated = await ApiService.clearAllHistory();
    setHistory(updated);
  };

  return (
    <div className="app-container">
      <CyberBackground />

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
            onAnalyze={handleAnalyze}
            onProgressComplete={handleProgressComplete}
            onViewScan={handleViewScan}
            onDeleteScan={handleDeleteScan}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerPage
            report={report}
            isScanning={isScanning}
            activeTargetUrl={activeTargetUrl}
            onAnalyze={handleAnalyze}
            onProgressComplete={handleProgressComplete}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            history={history}
            onViewScan={handleViewScan}
            onDeleteScan={handleDeleteScan}
            onClearHistory={handleClearHistory}
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
