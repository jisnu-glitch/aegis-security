import React, { useState } from 'react';
import { History, Search, Trash2, Eye } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio.js';

export default function ScanHistory({ history, onViewScan, onDeleteScan, onClearHistory }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = (history || []).filter(item =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (e, id) => {
    e.stopPropagation();
    cyberAudio.playBeep(350, 0.04);
    onDeleteScan(id);
  };

  const handleClear = () => {
    if (window.confirm('Clear all scan history logs?')) {
      cyberAudio.playBeep(300, 0.06);
      onClearHistory();
    }
  };

  return (
    <div className="cyber-card" style={{ padding: '20px 24px' }}>
      <div className="history-controls">
        <div className="card-title">
          <History size={16} style={{ color: 'var(--accent)' }} />
          <span>Recent Scans ({filteredHistory.length})</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="history-search-input"
              placeholder="Filter by URL or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '28px' }}
            />
          </div>

          {history && history.length > 0 && (
            <button
              className="action-btn-pill"
              onClick={handleClear}
              style={{ color: 'var(--risk-danger)', borderColor: 'var(--risk-danger-border)' }}
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)' }}>
          <p>No recorded scans match your query.</p>
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Target URL</th>
                <th>Score</th>
                <th>Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const color = item.statusColor || (item.score >= 75 ? 'safe' : (item.score >= 40 ? 'suspicious' : 'danger'));

                return (
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => onViewScan(item)}>
                    <td>
                      <span className={`history-score-badge ${color}`}>
                        {item.status || (color === 'safe' ? 'LOW RISK' : (color === 'suspicious' ? 'SUSPICIOUS' : 'HIGH RISK'))}
                      </span>
                    </td>
                    <td className="history-url-cell" title={item.url}>
                      {item.url}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {item.score}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.displayTime || new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="history-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="icon-btn"
                          title="View Report"
                          onClick={(e) => {
                            e.stopPropagation();
                            cyberAudio.playBeep(700, 0.03);
                            onViewScan(item);
                          }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="icon-btn danger"
                          title="Delete Scan"
                          onClick={(e) => handleDelete(e, item.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
