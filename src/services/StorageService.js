/**
 * Scan History LocalStorage Manager
 */

const STORAGE_KEY = 'cybershield_scan_history_v1';

export const StorageService = {
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Return default seed scans
        return this.getSeedData();
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse localStorage history:', e);
      return this.getSeedData();
    }
  },

  saveScan(scanReport) {
    try {
      const history = this.getHistory();
      // Avoid duplicate consecutive entries
      const filtered = history.filter(item => item.url !== scanReport.url);
      const updated = [scanReport, ...filtered].slice(0, 50); // Keep latest 50
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save scan to localStorage:', e);
      return [];
    }
  },

  deleteScan(scanId) {
    try {
      const history = this.getHistory();
      const updated = history.filter(item => item.id !== scanId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete scan:', e);
      return [];
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    } catch (e) {
      console.error('Failed to clear history:', e);
      return [];
    }
  },

  getSeedData() {
    return [
      {
        id: 'CS-SEED-01',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        displayTime: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
        url: 'https://google.com',
        fullUrl: 'https://google.com/',
        hostname: 'google.com',
        score: 95,
        status: 'LOW RISK',
        statusBadge: '🟢 LOW RISK',
        statusColor: 'safe',
        overallRisk: 'Low',
        checks: {
          https: { title: 'HTTPS Security', result: 'Secure Connection', risk: 'Low', isSecure: true },
          urlLength: { title: 'URL Length Analysis', result: 'Safe', risk: 'Low', length: 18 },
          ipAddress: { title: 'IP Address Detection', result: 'Domain-Based Hostname', risk: 'Low', isIp: false },
          domain: { title: 'Domain Structure Analysis', result: 'Normal Domain Structure', risk: 'Low', subdomainsCount: 0, entropy: 2.1 },
          brandImpersonation: { title: 'Brand Impersonation Detection', result: 'Verified Google Domain', risk: 'Low', detected: false },
          suspiciousKeywords: { title: 'Suspicious Keyword Detection', result: 'No Suspicious Keywords Found', risk: 'Low', count: 0, keywords: [] }
        },
        deductions: [],
        explanation: ['Verified Google infrastructure with valid SSL/TLS encryption and legitimate TLD.'],
        recommendation: '✓ Exercise standard internet browsing caution.',
        radarDimensions: { protocolSecurity: 100, domainTrust: 98, brandSafety: 100, contentIntegrity: 100, structureHealth: 100 }
      },
      {
        id: 'CS-SEED-02',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        displayTime: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
        url: 'http://paypal-security-update.xyz/verify-account',
        fullUrl: 'http://paypal-security-update.xyz/verify-account',
        hostname: 'paypal-security-update.xyz',
        score: 42,
        status: 'POTENTIALLY SUSPICIOUS',
        statusBadge: '🟡 POTENTIALLY SUSPICIOUS',
        statusColor: 'suspicious',
        overallRisk: 'Medium',
        checks: {
          https: { title: 'HTTPS Security', result: 'Insecure HTTP Protocol', risk: 'High', isSecure: false },
          urlLength: { title: 'URL Length Analysis', result: 'Suspicious', risk: 'Medium', length: 54 },
          ipAddress: { title: 'IP Address Detection', result: 'Domain-Based Hostname', risk: 'Low', isIp: false },
          domain: { title: 'Domain Structure Analysis', result: 'Suspicious Attributes', risk: 'Medium', subdomainsCount: 0, entropy: 3.4 },
          brandImpersonation: { title: 'Brand Impersonation Detection', result: 'Possible PayPal Impersonation', risk: 'High', detected: true, targetBrand: 'PayPal' },
          suspiciousKeywords: { title: 'Suspicious Keyword Detection', result: '2 Keywords Detected', risk: 'Medium', count: 2, keywords: [{ word: 'security' }, { word: 'verify' }] }
        },
        deductions: [
          { category: 'HTTPS Security', penalty: 15, detail: 'Insecure unencrypted HTTP protocol used.' },
          { category: 'Brand Impersonation', penalty: 25, detail: 'Prefix Spoofing targeting PayPal' },
          { category: 'TLD Reputation', penalty: 12, detail: 'High risk .xyz extension' }
        ],
        explanation: [
          'The connection does not use HTTPS encryption.',
          'Possible PayPal brand impersonation detected via prefix spoofing.',
          'TLD .xyz is heavily associated with disposable phishing campaigns.'
        ],
        recommendation: '⚠ PROCEED WITH CAUTION: Do not provide personal credentials on unverified third-party domains.',
        radarDimensions: { protocolSecurity: 20, domainTrust: 45, brandSafety: 15, contentIntegrity: 65, structureHealth: 70 }
      },
      {
        id: 'CS-SEED-03',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        displayTime: new Date(Date.now() - 1000 * 60 * 90).toLocaleTimeString(),
        url: 'http://192.168.10.5/paypa1-login/verify-wallet-urgent',
        fullUrl: 'http://192.168.10.5/paypa1-login/verify-wallet-urgent',
        hostname: '192.168.10.5',
        score: 18,
        status: 'HIGH RISK',
        statusBadge: '🔴 HIGH RISK',
        statusColor: 'danger',
        overallRisk: 'High',
        checks: {
          https: { title: 'HTTPS Security', result: 'Insecure HTTP Protocol', risk: 'High', isSecure: false },
          urlLength: { title: 'URL Length Analysis', result: 'Suspicious', risk: 'Medium', length: 57 },
          ipAddress: { title: 'IP Address Detection', result: 'IP-Based URL Detected', risk: 'High', isIp: true },
          domain: { title: 'Domain Structure Analysis', result: 'High Risk Structure', risk: 'High', subdomainsCount: 0, entropy: 0 },
          brandImpersonation: { title: 'Brand Impersonation Detection', result: 'Possible PayPal Impersonation', risk: 'High', detected: true, targetBrand: 'PayPal' },
          suspiciousKeywords: { title: 'Suspicious Keyword Detection', result: '4 Keywords Detected', risk: 'High', count: 4, keywords: [{ word: 'login' }, { word: 'verify' }, { word: 'wallet' }, { word: 'urgent' }] }
        },
        deductions: [
          { category: 'HTTPS Security', penalty: 15, detail: 'Unencrypted HTTP' },
          { category: 'IP-Based Target', penalty: 25, detail: 'Raw IP address used' },
          { category: 'Brand Impersonation', penalty: 25, detail: 'Homoglyph: paypa1' },
          { category: 'Suspicious Keywords', penalty: 20, detail: 'login, verify, wallet, urgent' }
        ],
        explanation: [
          'The URL targets a raw IP address directly rather than a registered domain.',
          'Homoglyph typo-squatting paypa1 detected imitating PayPal.',
          'High concentration of urgency and financial phishing tokens.',
          'The connection does not use HTTPS encryption.'
        ],
        recommendation: '⚠ CRITICAL CAUTION: Do NOT visit this link. Active credential harvesting attack vector detected.',
        radarDimensions: { protocolSecurity: 20, domainTrust: 10, brandSafety: 10, contentIntegrity: 20, structureHealth: 25 }
      }
    ];
  }
};
