import React, { useState } from 'react';
import { Globe, ArrowRight, X, Clipboard, Shield, AlertCircle } from 'lucide-react';
import DemoScenarios from './DemoScenarios.jsx';
import { cyberAudio } from '../utils/cyberAudio.js';

export default function URLAnalyzer({ onAnalyze, isAnalyzing }) {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleClear = () => {
    cyberAudio.playBeep(400, 0.03);
    setInputUrl('');
    setValidationError('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        cyberAudio.playBeep(700, 0.03);
        setInputUrl(text.trim());
        setValidationError('');
      }
    } catch (err) {
      console.warn('Clipboard read failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      cyberAudio.playBeep(300, 0.05);
      setValidationError('Please enter a target URL to analyze.');
      return;
    }
    setValidationError('');
    cyberAudio.playScanStart();
    onAnalyze(trimmed);
  };

  const handlePresetSelect = (url) => {
    setInputUrl(url);
    setValidationError('');
    cyberAudio.playScanStart();
    onAnalyze(url);
  };

  return (
    <div className="analyzer-container">
      <div className="analyzer-card">
        <div className="analyzer-header">
          <div className="analyzer-label">
            <Globe size={15} style={{ color: 'var(--accent)' }} />
            <span>Target URL</span>
          </div>
          <button
            type="button"
            className="action-btn-pill"
            onClick={handlePaste}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            <Clipboard size={12} />
            Paste
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="analyzer-input-group">
            <div className="url-input-wrapper">
              <Globe size={16} className="url-input-icon" />
              <input
                type="text"
                className="url-input"
                placeholder="https://example.com or http://target-domain.xyz/login"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (validationError) setValidationError('');
                }}
                disabled={isAnalyzing}
                autoFocus
              />
              {inputUrl && !isAnalyzing && (
                <button
                  type="button"
                  className="url-clear-btn"
                  onClick={handleClear}
                  title="Clear input"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="analyze-button"
              disabled={isAnalyzing}
            >
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze URL'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {validationError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--risk-danger)', fontSize: '0.8rem', marginTop: '8px' }}>
              <AlertCircle size={13} />
              <span>{validationError}</span>
            </div>
          )}

          <DemoScenarios onSelectPreset={handlePresetSelect} />
        </form>
      </div>
    </div>
  );
}
