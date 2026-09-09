import React from 'react';
import { History, BarChart3 } from 'lucide-react';
import ScanHistory from '../components/ScanHistory.jsx';

export default function HistoryPage({ history, onViewScan, onDeleteScan, onClearHistory }) {
  const safeCount = (history || []).filter(item => (item.score >= 75)).length;
  const suspiciousCount = (history || []).filter(item => (item.score >= 40 && item.score < 75)).length;
  const highRiskCount = (history || []).filter(item => (item.score < 40)).length;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div className="hero-pill-badge">
          <History size={13} />
          <span>Audit Log</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2rem' }}>
          Scan History
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
          Review historical link evaluations and inspect past threat intelligence records.
        </p>
      </div>

      {/* Metrics Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="cyber-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span>TOTAL SCANS</span>
            <BarChart3 size={14} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, marginTop: '6px' }}>
            {history?.length || 0}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--risk-safe)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span>LOW RISK</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--risk-safe)', marginTop: '6px' }}>
            {safeCount}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--risk-warning)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span>SUSPICIOUS</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--risk-warning)', marginTop: '6px' }}>
            {suspiciousCount}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--risk-danger)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span>HIGH RISK</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--risk-danger)', marginTop: '6px' }}>
            {highRiskCount}
          </div>
        </div>
      </div>

      <ScanHistory
        history={history}
        onViewScan={onViewScan}
        onDeleteScan={onDeleteScan}
        onClearHistory={onClearHistory}
      />
    </div>
  );
}
