/**
 * Risk Calculator and Security Verdict Synthesizer
 * Formulates final 0-100 score, categorical risk verdict, explainability points, and recommendations.
 */

export function calculateRiskScore(parsedUrl, brandResult, keywordResult, domainResult, dnsResult = null) {
  let score = 100;
  const deductions = [];
  const explanationPoints = [];
  const positiveHighlights = [];

  // 1. HTTPS Security Check
  if (!parsedUrl.isHttps) {
    const penalty = 15;
    score -= penalty;
    deductions.push({
      category: 'HTTPS Security',
      penalty,
      detail: 'Insecure unencrypted HTTP protocol used.'
    });
    explanationPoints.push('The connection does not use HTTPS encryption (data transmission is vulnerable to interception).');
  } else {
    positiveHighlights.push('Valid HTTPS connection protocol utilized.');
  }

  // 2. IP Address in Hostname
  if (parsedUrl.isIpAddress) {
    const penalty = 25;
    score -= penalty;
    deductions.push({
      category: 'IP-Based Target',
      penalty,
      detail: 'Direct numeric IP address in URL instead of verified domain.'
    });
    explanationPoints.push('The URL targets a raw IP address directly rather than a registered domain name (frequently used in C2 and untracked phishing nodes).');
  }

  // 3. URL Length
  if (parsedUrl.lengthAssessment.penalty > 0) {
    const penalty = parsedUrl.lengthAssessment.penalty;
    score -= penalty;
    deductions.push({
      category: 'URL Length',
      penalty,
      detail: parsedUrl.lengthAssessment.reason
    });
    explanationPoints.push(parsedUrl.lengthAssessment.reason);
  }

  // 4. Suspicious Keywords
  if (keywordResult.penalty > 0) {
    score -= keywordResult.penalty;
    deductions.push({
      category: 'Suspicious Keywords',
      penalty: keywordResult.penalty,
      detail: `Detected keywords: ${keywordResult.keywords.map(k => k.word).join(', ')}`
    });
    explanationPoints.push(`URL contains ${keywordResult.count} credential or urgency-related keyword(s): [${keywordResult.keywords.map(k => k.word).join(', ')}].`);
  }

  // 5. Brand Impersonation
  if (brandResult.detected) {
    const penalty = brandResult.penalty;
    score -= penalty;
    deductions.push({
      category: 'Brand Impersonation',
      penalty,
      detail: `${brandResult.type}: Target Brand is ${brandResult.brand}`
    });
    explanationPoints.push(`Possible ${brandResult.brand} brand impersonation detected via ${brandResult.type.toLowerCase()}.`);
  } else if (brandResult.isLegitimateBrandDomain) {
    positiveHighlights.push(`Verified official domain for ${brandResult.brand}.`);
  }

  // 6. Domain Structure & TLD Heuristics
  if (domainResult.tldRisk && domainResult.tldRisk.penalty > 0) {
    score -= domainResult.tldRisk.penalty;
    deductions.push({
      category: 'TLD Reputation',
      penalty: domainResult.tldRisk.penalty,
      detail: domainResult.tldRisk.reason
    });
    explanationPoints.push(domainResult.tldRisk.reason);
  }

  if (domainResult.isHighEntropy) {
    score -= 10;
    deductions.push({
      category: 'DGA Randomness',
      penalty: 10,
      detail: `High Shannon entropy (${domainResult.entropy}) indicates machine-generated domain.`
    });
    explanationPoints.push(`Domain name exhibits high mathematical randomness (entropy: ${domainResult.entropy}), characteristic of automated botnet algorithms.`);
  }

  if (domainResult.subdomainsCount >= 3) {
    score -= 10;
    deductions.push({
      category: 'Subdomain Nesting',
      penalty: 10,
      detail: `High subdomain depth (${domainResult.subdomainsCount} subdomains).`
    });
    explanationPoints.push(`Deep subdomain nesting (${domainResult.subdomainsCount} levels) detected.`);
  }

  if (domainResult.excessiveHyphens) {
    score -= 8;
    deductions.push({
      category: 'Hyphen Density',
      penalty: 8,
      detail: `${domainResult.hyphenCount} hyphens detected in hostname.`
    });
    explanationPoints.push(`Excessive hyphenation (${domainResult.hyphenCount} hyphens) in domain name.`);
  }

  if (domainResult.doubleExtension) {
    score -= 20;
    deductions.push({
      category: 'Double Extension',
      penalty: 20,
      detail: 'Disguised executable file extension in URL path.'
    });
    explanationPoints.push('Deceptive double extension detected in URL path (high-risk payload vector).');
  }

  // 7. Non-standard port deduction
  if (parsedUrl.hasNonStandardPort) {
    score -= 8;
    deductions.push({
      category: 'Non-Standard Port',
      penalty: 8,
      detail: `Connecting via non-standard port :${parsedUrl.port}`
    });
    explanationPoints.push(`Non-standard service port :${parsedUrl.port} utilized.`);
  }

  // 8. Server DNS heuristics (if available from backend)
  if (dnsResult && dnsResult.hasDnsWarning) {
    score -= 10;
    deductions.push({
      category: 'DNS Resolution',
      penalty: 10,
      detail: dnsResult.dnsWarning
    });
    explanationPoints.push(dnsResult.dnsWarning);
  }

  // Ensure score stays bounded within [0, 100]
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Status classification
  let status = 'LOW RISK';
  let statusColor = 'safe'; // 'safe' | 'suspicious' | 'danger'
  let statusBadge = '🟢 LOW RISK';
  let overallRisk = 'Low';
  let recommendation = '✓ Exercise standard internet browsing caution. No critical heuristic red flags observed.';

  if (finalScore < 40) {
    status = 'HIGH RISK';
    statusColor = 'danger';
    statusBadge = '🔴 HIGH RISK';
    overallRisk = 'High';
    recommendation = '⚠ CAUTION: Do NOT click this link or submit personal credentials, passwords, or financial information. Multiple high-severity threat markers detected.';
  } else if (finalScore < 75) {
    status = 'POTENTIALLY SUSPICIOUS';
    statusColor = 'suspicious';
    statusBadge = '🟡 POTENTIALLY SUSPICIOUS';
    overallRisk = 'Medium';
    recommendation = '⚠ PROCEED WITH CAUTION: Inspect the domain spelling carefully before entering credentials. Verify sender authenticity through an independent channel.';
  }

  if (explanationPoints.length === 0) {
    explanationPoints.push('No significant threat patterns or malicious indicators detected during heuristic inspection.');
  }

  return {
    score: finalScore,
    status,
    statusBadge,
    statusColor,
    overallRisk,
    deductions,
    explanationPoints,
    positiveHighlights,
    recommendation
  };
}
