/**
 * Domain Structure and Heuristics Engine
 * Checks entropy, subdomains, hyphen/digit density, and suspicious extensions.
 */
import { getTLDRisk } from '../data/tldRiskList.js';

// Calculate Shannon entropy of a string (measures randomness/algorithmic DGA)
export function calculateShannonEntropy(str) {
  if (!str || str.length === 0) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

export function analyzeDomainHeuristics(parsedUrl) {
  const { hostname, mainDomain, subdomains, tld, isIpAddress, pathname } = parsedUrl;

  if (isIpAddress) {
    return {
      subdomainsCount: 0,
      subdomainRisk: 'High',
      entropy: 0,
      isHighEntropy: false,
      excessiveHyphens: false,
      excessiveDigits: false,
      doubleExtension: false,
      tldRisk: { level: 'High', penalty: 25, reason: 'Raw IP address used instead of legitimate domain name' },
      domainRisk: 'High',
      totalPenalty: 25,
      reasons: ['URL targets a raw IP address directly, bypassing standard DNS reputation mechanisms.']
    };
  }

  const sld = mainDomain ? mainDomain.split('.')[0] : hostname;
  const entropy = calculateShannonEntropy(sld);
  const reasons = [];
  let totalPenalty = 0;

  // 1. TLD Risk
  const tldRisk = getTLDRisk(tld);
  if (tldRisk.penalty > 0) {
    totalPenalty += tldRisk.penalty;
    reasons.push(tldRisk.reason);
  }

  // 2. Subdomain Depth Analysis
  const subCount = subdomains.length;
  let subdomainRisk = 'Low';
  if (subCount >= 3) {
    subdomainRisk = 'High';
    totalPenalty += 12;
    reasons.push(`Excessive subdomain nesting (${subCount} subdomains: '${subdomains.join('.')}'). Often used to disguise true root domain.`);
  } else if (subCount === 2) {
    subdomainRisk = 'Medium';
    totalPenalty += 5;
    reasons.push(`Multiple subdomains detected (${subCount}).`);
  }

  // 3. Shannon Entropy / DGA Randomness (Domain Generation Algorithms)
  // Normal English words have entropy ~2.5 - 3.5. Random strings like "xj83kzm10a" have > 3.8
  const isHighEntropy = entropy > 3.75 && sld.length > 8;
  if (isHighEntropy) {
    totalPenalty += 10;
    reasons.push(`High domain randomness / Shannon entropy (${entropy}). Possible Algorithmically Generated Domain (DGA).`);
  }

  // 4. Excessive Hyphens
  const hyphenCount = (hostname.match(/-/g) || []).length;
  const excessiveHyphens = hyphenCount >= 3 || hostname.includes('--');
  if (excessiveHyphens) {
    totalPenalty += 8;
    reasons.push(`Excessive hyphens detected in domain (${hyphenCount} hyphens). Common in typosquatting and brand evasion.`);
  }

  // 5. Excessive Digits
  const digitCount = (hostname.match(/\d/g) || []).length;
  const excessiveDigits = digitCount >= 4 && !isIpAddress;
  if (excessiveDigits) {
    totalPenalty += 6;
    reasons.push(`High density of numeric digits in hostname (${digitCount} digits).`);
  }

  // 6. Double File Extension Detection in Path
  const doubleExtRegex = /\.(pdf|doc|docx|xls|xlsx|zip|rar|tar|png|jpg|jpeg)\.(exe|scr|bat|cmd|vbs|js|apk|msi|ps1|sh)$/i;
  const doubleExtension = doubleExtRegex.test(pathname);
  if (doubleExtension) {
    totalPenalty += 20;
    reasons.push('Deceptive double file extension detected in URL path (e.g. .pdf.exe executable payload disguising).');
  }

  // Overall Domain Risk calculation
  let domainRisk = 'Low';
  if (totalPenalty >= 18 || isHighEntropy || subCount >= 3) {
    domainRisk = 'High';
  } else if (totalPenalty >= 8 || subCount === 2 || tldRisk.level === 'Medium') {
    domainRisk = 'Medium';
  }

  return {
    domainLength: hostname.length,
    subdomainsCount: subCount,
    subdomainsList: subdomains,
    subdomainRisk,
    entropy,
    isHighEntropy,
    excessiveHyphens,
    hyphenCount,
    excessiveDigits,
    digitCount,
    doubleExtension,
    tldRisk,
    domainRisk,
    totalPenalty,
    reasons: reasons.length > 0 ? reasons : ['Domain structure appears standard and well-formed.']
  };
}
