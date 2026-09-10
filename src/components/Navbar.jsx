import React, { useState } from 'react';
import { Activity, History, Info, Volume2, VolumeX, Terminal } from 'lucide-react';
import Logo from './Logo.jsx';
import { cyberAudio } from '../utils/cyberAudio.js';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const [isMuted, setIsMuted] = useState(cyberAudio.getMuted());

  const handleAudioToggle = () => {
    const muted = cyberAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleNavClick = (tab) => {
    cyberAudio.playBeep(650, 0.03);
    setActiveTab(tab);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="nav-brand" onClick={() => handleNavClick('dashboard')}>
          <div className="brand-icon-wrapper">
            <Logo size={24} />
          </div>
          <div>
            <div className="brand-title">LINKRADAR</div>
            <div className="brand-subtitle">Think Before You Click</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button
            className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <Activity size={15} />
            Dashboard
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => handleNavClick('analyzer')}
          >
            <Terminal size={15} />
            Analyze URL
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleNavClick('history')}
          >
            <History size={15} />
            History
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            <Info size={15} />
            About
          </button>
        </nav>

        {/* Status and Audio */}
        <div className="nav-right-actions">
          <div className="system-status-indicator" title={backendStatus?.details?.service || 'Engine Active'}>
            <span className="status-pulse-dot" />
            <span>Protection Active</span>
          </div>

          <button
            className="audio-toggle-btn"
            onClick={handleAudioToggle}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
