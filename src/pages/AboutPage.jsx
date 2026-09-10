import React from 'react';
import { Cpu, Lock, Globe, KeyRound, Eye, Server } from 'lucide-react';
import Logo from '../components/Logo.jsx';

export default function AboutPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div className="hero-pill-badge">
          <Logo size={13} />
          <span>System Architecture</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2rem' }}>
          About LINKRADAR
        </h1>
        <div className="hero-tagline">Think Before You Click.</div>
        <p className="hero-description">
          LINKRADAR is an intelligent, explainable URL threat analysis and phishing detection platform built to help users evaluate suspicious links before interacting with them.
        </p>
      </div>

      {/* Core Mission Card */}
      <div className="cyber-card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
          <Cpu size={18} style={{ color: 'var(--accent)' }} />
          <span>Multi-Vector Heuristic Radar</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '12px' }}>
          Static blocklists are reactive and only flag malicious websites after victims have already been compromised.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
          LINKRADAR performs real-time structural, cryptographic, phonetic, and semantic analysis on URLs to identify potential phishing patterns, homoglyphs, and social engineering indicators dynamically.
        </p>
      </div>

      {/* The 6 Heuristic Layers */}
      <h2 className="section-heading">
        <Logo size={15} />
        <span>Analysis Layers</span>
      </h2>

      <div className="about-features-grid">
        <div className="cyber-card feature-box">
          <div className="feature-icon-wrapper">
            <Lock size={18} />
          </div>
          <h3 className="feature-title">1. HTTPS Security</h3>
          <p className="feature-desc">
            Verifies SSL/TLS encryption, flags plain-text HTTP protocol risks, and checks for non-standard ports.
          </p>
        </div>

        <div className="cyber-card feature-box">
          <div className="feature-icon-wrapper">
            <Globe size={18} />
          </div>
          <h3 className="feature-title">2. IP Address Detection</h3>
          <p className="feature-desc">
            Detects raw IPv4/IPv6 addresses and encoded notations used to bypass domain reputation systems.
          </p>
        </div>

        <div className="cyber-card feature-box">
          <div className="feature-icon-wrapper">
            <Cpu size={18} />
          </div>
          <h3 className="feature-title">3. Domain Structure & Entropy</h3>
          <p className="feature-desc">
            Calculates Shannon entropy for DGA detection, subdomain depth, excessive hyphens, and high-risk TLDs.
          </p>
        </div>

        <div className="cyber-card feature-box">
          <div className="feature-icon-wrapper">
            <Eye size={18} />
          </div>
          <h3 className="feature-title">4. Brand Impersonation</h3>
          <p className="feature-desc">
            Detects typo-squats and homoglyph substitutions (e.g. <code>paypa1</code>, <code>arnazon</code>, <code>g00gle</code>) against monitored brands.
          </p>
        </div>

        <div className="cyber-card feature-box">
          <div className="feature-icon-wrapper">
            <KeyRound size={18} />
          </div>
          <h3 className="feature-title">5. Suspicious Keywords</h3>
          <p className="feature-desc">
            Scans for credential and urgency tokens (<code>login</code>, <code>verify</code>, <code>wallet</code>, <code>urgent</code>).
          </p>
        </div>

        <div className="cyber-card feature-box">
          <div className="feature-icon-wrapper">
            <Server size={18} />
          </div>
          <h3 className="feature-title">6. Explainable Scoring</h3>
          <p className="feature-desc">
            Produces a 0–100 score with transparent, explainable indicators and recommendations.
          </p>
        </div>
      </div>

      {/* Threat Scoring Matrix */}
      <div className="cyber-card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title" style={{ marginBottom: '14px' }}>
          <span>Risk Classification</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--risk-safe)', fontWeight: 700, fontSize: '0.85rem' }}>LOW RISK (75 - 100)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Standard URL characteristics with valid HTTPS and no detectable brand spoofing.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--risk-warning)', fontWeight: 700, fontSize: '0.85rem' }}>POTENTIALLY SUSPICIOUS (40 - 74)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Atypical indicators such as disposable TLDs, multiple subdomains, or unencrypted HTTP.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--risk-danger)', fontWeight: 700, fontSize: '0.85rem' }}>HIGH RISK (0 - 39)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Strong correlation with credential harvesting, raw IP routing, or deceptive brand impersonation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
