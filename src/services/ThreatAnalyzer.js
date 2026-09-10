/**
 * Core Threat Analysis Engine Orchestrator
 * Performs full synchronous heuristic security evaluation on any target URL.
 */
import { parseURL } from '../utils/URLParser.js';
import { detectBrandImpersonation } from '../utils/BrandDetector.js';
import { detectSuspiciousKeywords } from '../utils/KeywordDetector.js';
import { analyzeDomainHeuristics } from '../utils/DomainHeuristics.js';
import { calculateRiskScore } from '../utils/RiskCalculator.js';

export function analyzeTargetURL(rawUrl, serverEnrichment = null) {
  // 1. Parse & validate URL structure
  const parsed = parseURL(rawUrl);

  // 2. Run heuristic modules
  const brandResult = detectBrandImpersonation(parsed);
  const keywordResult = detectSuspiciousKeywords(parsed);
  const domainResult = analyzeDomainHeuristics(parsed);

  // 3. Synthesize risk score & explainability
  const riskResult = calculateRiskScore(
    parsed,
    brandResult,
    keywordResult,
    domainResult,
    serverEnrichment?.dnsResult || null
  );

  // 4. Calculate multi-axis threat radar scores (0 to 100 per security dimension, 100 = safest)
  const radarDimensions = {
    protocolSecurity: parsed.isHttps ? 100 : 20,
    domainTrust: Math.max(10, 100 - (domainResult.totalPenalty * 3.5)),
    brandSafety: brandResult.detected ? 15 : 100,
    contentIntegrity: Math.max(10, 100 - (keywordResult.penalty * 3.5)),
    structureHealth: Math.max(10, 100 - (parsed.lengthAssessment.penalty * 5) - (parsed.isIpAddress ? 60 : 0))
  };

  const reportId = `RADAR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    id: reportId,
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleString(),
    url: parsed.rawUrl,
    fullUrl: parsed.fullUrl,
    hostname: parsed.hostname,
    score: riskResult.score,
    status: riskResult.status,
    statusBadge: riskResult.statusBadge,
    statusColor: riskResult.statusColor,
    overallRisk: riskResult.overallRisk,
    checks: {
      https: {
        title: 'HTTPS Security',
        result: parsed.isHttps ? 'Secure Connection' : 'Insecure HTTP Protocol',
        risk: parsed.isHttps ? 'Low' : 'High',
        protocol: parsed.protocol.toUpperCase(),
        isSecure: parsed.isHttps,
        detail: parsed.isHttps
          ? 'Traffic is encrypted with TLS/SSL protocol.'
          : 'Traffic is transmitted in plain text. Vulnerable to interception.'
      },
      urlLength: {
        title: 'URL Length Analysis',
        result: parsed.lengthAssessment.status,
        risk: parsed.lengthAssessment.risk,
        length: parsed.urlLength,
        detail: parsed.lengthAssessment.reason
      },
      ipAddress: {
        title: 'IP Address Detection',
        result: parsed.isIpAddress ? 'IP-Based URL Detected' : 'Domain-Based Hostname',
        risk: parsed.isIpAddress ? 'High' : 'Low',
        isIp: parsed.isIpAddress,
        detail: parsed.isIpAddress
          ? 'Targets a raw IP address directly, bypassing domain reputation systems.'
          : 'Uses standard registered domain name.'
      },
      domain: {
        title: 'Domain Structure Analysis',
        result: domainResult.domainRisk === 'Low' ? 'Normal Domain Structure' : (domainResult.domainRisk === 'Medium' ? 'Suspicious Attributes' : 'High Risk Structure'),
        risk: domainResult.domainRisk,
        subdomainsCount: domainResult.subdomainsCount,
        subdomains: domainResult.subdomainsList,
        tld: parsed.tld ? `.${parsed.tld}` : 'N/A',
        entropy: domainResult.entropy,
        isHighEntropy: domainResult.isHighEntropy,
        hyphenCount: domainResult.hyphenCount,
        digitCount: domainResult.digitCount,
        doubleExtension: domainResult.doubleExtension,
        reasons: domainResult.reasons
      },
      brandImpersonation: {
        title: 'Brand Impersonation Detection',
        result: brandResult.detected
          ? `Possible ${brandResult.brand} Impersonation`
          : (brandResult.isLegitimateBrandDomain ? `Verified ${brandResult.brand} Domain` : 'No Brand Impersonation Detected'),
        risk: brandResult.risk,
        detected: brandResult.detected,
        targetBrand: brandResult.brand,
        type: brandResult.type,
        detail: brandResult.reason
      },
      suspiciousKeywords: {
        title: 'Suspicious Keyword Detection',
        result: keywordResult.count > 0 ? `${keywordResult.count} Keyword(s) Detected` : 'No Suspicious Keywords Found',
        risk: keywordResult.risk,
        count: keywordResult.count,
        keywords: keywordResult.keywords,
        categories: keywordResult.categories,
        detail: keywordResult.reason
      }
    },
    deductions: riskResult.deductions,
    explanation: riskResult.explanationPoints,
    positiveHighlights: riskResult.positiveHighlights,
    recommendation: riskResult.recommendation,
    radarDimensions,
    dnsInfo: serverEnrichment?.dnsInfo || null,
    source: serverEnrichment ? 'hybrid-backend' : 'client-engine'
  };
}
