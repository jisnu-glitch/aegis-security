import React from 'react';
import { cyberAudio } from '../utils/cyberAudio.js';

export const DEMO_PRESETS = [
  {
    id: 'safe',
    label: 'Safe Website',
    url: 'https://example.com',
    type: 'safe',
    description: 'Standard HTTPS domain'
  },
  {
    id: 'suspicious',
    label: 'Suspicious Website',
    url: 'http://secure-login-account.xyz/verify',
    type: 'suspicious',
    description: 'HTTP + Suspicious .xyz TLD + Keyword'
  },
  {
    id: 'danger',
    label: 'Phishing Attempt',
    url: 'http://192.168.10.5/paypa1-login/verify-account',
    type: 'danger',
    description: 'Raw IP + PayPal homoglyph (paypa1) + credential keywords'
  }
];

export default function DemoScenarios({ onSelectPreset }) {
  const handleClick = (preset) => {
    cyberAudio.playBeep(preset.type === 'danger' ? 440 : (preset.type === 'suspicious' ? 660 : 880), 0.03);
    onSelectPreset(preset.url);
  };

  return (
    <div className="demo-presets-container">
      <div className="demo-presets-label">
        <span>Presets:</span>
      </div>
      <div className="demo-buttons-group">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`demo-btn demo-btn-${preset.type}`}
            onClick={() => handleClick(preset)}
            title={preset.description}
          >
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
