# 🛡️ AEGIS — Intelligent URL Threat Detection System

> **Think Before You Click.**  
> A modern, explainable URL security analysis platform designed to identify phishing, malicious domain structures, brand impersonation, and zero-day threat vectors before users interact with them.

---

## ✨ Key Features

- **🔒 HTTPS & Transport Security**: Verifies SSL/TLS encryption certificates, flags plain-text HTTP protocol risks, and inspects non-standard service ports.
- **📏 URL Length & Structural Inspection**: Detects obfuscated and payload-bloated URLs.
- **🌐 IP-Based Target Detection**: Identifies direct IPv4/IPv6 addresses, hex encodings, and octal notations used to bypass domain reputation systems.
- **🌐 Domain Structure & Shannon Entropy**: Calculates mathematical entropy to expose Algorithmically Generated Domains (DGA), deep subdomain nesting, and high-risk disposable TLDs (`.xyz`, `.top`, `.click`, `.gq`, `.tk`).
- **🎭 Brand Impersonation & Homoglyphs**: Leverages Levenshtein string distance and visual character substitution algorithms (e.g., `paypa1`, `arnazon`, `g00gle`, `rn` $\rightarrow$ `m`, `0` $\rightarrow$ `o`, `1` $\rightarrow$ `l`) across top global brands.
- **⚠ Suspicious Keywords & Urgency Tokens**: Scans for credential harvesting, financial urgency, and phishing bait triggers (`login`, `verify`, `password`, `wallet`, `urgent`, `reward`, `kyc`).
- **📊 Multi-Vector Threat Radar**: 5-axis visual spider chart assessing Protocol Security, Domain Trust, Brand Safety, Content Integrity, and Structure Health.
- **💡 Explainable Threat Scoring**: Synthesizes findings into a 0–100 score with transparent root-cause bullet points and actionable security recommendations.
- **⚡ Monkeytype-Inspired Minimal UI**: Built with a calm, developer-focused dark palette (`#323437` background, `#d1d0c5` text, and `#e2b714` yellow accent).
- **📋 Persistent Scan Audit Ledger**: LocalStorage history tracking with search filtering, view report, delete, and clear.
- **📄 Security Dossier Export**: One-click printable PDF dossier format and JSON export.

---

## 🏗️ Architecture

AEGIS utilizes a **Hybrid Full-Stack Architecture**:

```
├── server/
│   ├── server.js              # Express REST API (/api/analyze, /api/history, /api/health)
│   ├── services/
│   │   ├── dnsScanner.js      # Live DNS resolution & A-record inspection
│   │   └── historyStore.js    # Persistent server history store
├── src/
│   ├── components/            # Minimalist React UI components & Logo SVG
│   ├── pages/                 # Dashboard, Analyzer, History, About
│   ├── services/
│   │   ├── apiService.js      # Hybrid client caller with offline fallback
│   │   ├── ThreatAnalyzer.js  # Client-side heuristic analysis engine
│   │   └── StorageService.js  # LocalStorage audit ledger manager
│   ├── utils/
│   │   ├── URLParser.js       # URL normalization and IP parsing
│   │   ├── BrandDetector.js   # Levenshtein & homoglyph detection
│   │   ├── KeywordDetector.js # Suspicious token parser
│   │   ├── DomainHeuristics.js# Shannon entropy & structural checks
│   │   └── RiskCalculator.js  # Weighted scoring algorithm
│   └── index.css              # Monkeytype-inspired design system
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/aegis.git

# Navigate into project directory
cd aegis

# Install dependencies
npm install
```

### Running Locally

```bash
# Start both backend server (port 5000) and frontend client (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚖️ Disclaimer

AEGIS provides real-time heuristic security assessments based on structural and syntactic URL indicators. This automated detection system does not guarantee that a domain is entirely harmless or compromised. Always practice zero-trust verification.

---

## 📄 License

MIT License. Free to use for personal and commercial projects.
