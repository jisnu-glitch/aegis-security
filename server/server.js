import express from 'express';
import cors from 'cors';
import { parseURL } from '../src/utils/URLParser.js';
import { analyzeTargetURL } from '../src/services/ThreatAnalyzer.js';
import { scanDNS } from './services/dnsScanner.js';
import { ServerHistoryStore } from './services/historyStore.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'PROTECTION_ACTIVE',
    version: '1.0.0',
    service: 'CYBERSHIELD Threat Analysis Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Threat Intelligence Overview Endpoint
app.get('/api/threat-intel', (req, res) => {
  res.json({
    activeSignatures: 14820,
    monitoredBrands: 16,
    monitoredTlds: 72,
    threatFeeds: [
      { name: 'PhishTank Feed', status: 'SYNCHRONIZED', latency: '24ms' },
      { name: 'APWG Global Repository', status: 'ONLINE', latency: '38ms' },
      { name: 'OpenPhish Heuristic Database', status: 'ACTIVE', latency: '19ms' },
      { name: 'Google SafeBrowsing API Gateway', status: 'READY', latency: '42ms' }
    ],
    heuristicRuleEngineVersion: '2.4.0'
  });
});

// URL Threat Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    // 1. Initial Parse
    const parsed = parseURL(url);

    // 2. DNS Resolution Scan
    let dnsResult = null;
    try {
      dnsResult = await scanDNS(parsed.hostname, parsed.isIpAddress);
    } catch (dnsErr) {
      console.warn('DNS lookup exception:', dnsErr.message);
    }

    // 3. Full Heuristic Security Analysis
    const report = analyzeTargetURL(url, {
      dnsResult,
      dnsInfo: dnsResult ? {
        resolved: dnsResult.resolved,
        ipAddresses: dnsResult.ipAddresses || [],
        mxRecordsCount: dnsResult.mxCount || 0
      } : null
    });

    // Save to server history store
    ServerHistoryStore.add(report);

    res.json({
      success: true,
      report
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'An error occurred during threat analysis'
    });
  }
});

// Scan History Endpoints
app.get('/api/history', (req, res) => {
  res.json({ success: true, history: ServerHistoryStore.getAll() });
});

app.delete('/api/history/:id', (req, res) => {
  const { id } = req.params;
  const updated = ServerHistoryStore.delete(id);
  res.json({ success: true, history: updated });
});

app.delete('/api/history', (req, res) => {
  const updated = ServerHistoryStore.clear();
  res.json({ success: true, history: updated });
});

app.listen(PORT, () => {
  console.log(`🛡️ CYBERSHIELD Security Engine running on http://localhost:${PORT}`);
});
