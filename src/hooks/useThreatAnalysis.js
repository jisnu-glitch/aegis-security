import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/apiService.js';
import { StorageService } from '../services/StorageService.js';
import { cyberAudio } from '../utils/cyberAudio.js';

/**
 * Custom hook to manage URL threat analysis workflow,
 * scanning animations, audit history, and backend health.
 */
export function useThreatAnalysis() {
  const [report, setReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTargetUrl, setActiveTargetUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ isOnline: true });
  const [pendingReport, setPendingReport] = useState(null);

  // Initialize history and check backend connectivity
  useEffect(() => {
    async function initialize() {
      const initialHistory = StorageService.getHistory();
      setHistory(initialHistory);
      if (initialHistory && initialHistory.length > 0) {
        setReport(initialHistory[0]);
      }

      const status = await ApiService.checkBackendHealth();
      setBackendStatus(status);
    }
    initialize();
  }, []);

  // Initiate scan for a given URL
  const analyze = useCallback(async (url) => {
    setActiveTargetUrl(url);
    setIsScanning(true);

    const result = await ApiService.analyzeURL(url);
    if (result?.success && result?.report) {
      setPendingReport(result.report);
    } else {
      console.error('Threat analysis failed:', result?.error);
      setIsScanning(false);
    }
  }, []);

  // Finalize report when scan animation completes
  const onProgressComplete = useCallback(() => {
    if (pendingReport) {
      setReport(pendingReport);
      const updatedHistory = StorageService.getHistory();
      setHistory(updatedHistory);
      cyberAudio.playScanComplete(pendingReport.statusColor);
      setPendingReport(null);
    }
    setIsScanning(false);
  }, [pendingReport]);

  // Load a historical scan into view
  const viewHistoricalScan = useCallback((scanItem) => {
    setReport(scanItem);
  }, []);

  // Delete an item from history
  const deleteScan = useCallback(async (id) => {
    const updated = await ApiService.deleteHistoryItem(id);
    setHistory(updated);
  }, []);

  // Clear all history
  const clearHistory = useCallback(async () => {
    const updated = await ApiService.clearAllHistory();
    setHistory(updated);
  }, []);

  return {
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
  };
}
