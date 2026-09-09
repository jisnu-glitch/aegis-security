/**
 * Hybrid API Service
 * Connects to the Express backend for server-side DNS and heuristics analysis,
 * with zero-latency client-side engine fallback if backend is unreachable.
 */
import { analyzeTargetURL } from './ThreatAnalyzer.js';
import { StorageService } from './StorageService.js';

const API_BASE = '/api';

export const ApiService = {
  // Check backend connectivity
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return { isOnline: true, status: data.status, details: data };
      }
    } catch (e) {
      // Backend not running or timeout
    }
    return { isOnline: false, status: 'Client Heuristic Engine Active' };
  },

  // Perform full URL security analysis
  async analyzeURL(url) {
    try {
      // Try backend first
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(3500)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.report) {
          // Save in client storage as well
          StorageService.saveScan(data.report);
          return { success: true, report: data.report, source: 'backend' };
        }
      }
    } catch (err) {
      console.info('Backend API unavailable, utilizing in-browser Heuristic Threat Engine:', err.message);
    }

    // Client-side fallback analysis
    try {
      const report = analyzeTargetURL(url);
      StorageService.saveScan(report);
      return { success: true, report, source: 'client-fallback' };
    } catch (clientErr) {
      return { success: false, error: clientErr.message };
    }
  },

  // Get scan history
  async getHistory() {
    try {
      const res = await fetch(`${API_BASE}/history`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.history) return data.history;
      }
    } catch (e) {
      // Fallback
    }
    return StorageService.getHistory();
  },

  // Delete scan item
  async deleteHistoryItem(id) {
    try {
      await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(2000) });
    } catch (e) {}
    return StorageService.deleteScan(id);
  },

  // Clear all scan history
  async clearAllHistory() {
    try {
      await fetch(`${API_BASE}/history`, { method: 'DELETE', signal: AbortSignal.timeout(2000) });
    } catch (e) {}
    return StorageService.clearHistory();
  }
};
