/**
 * Top Level Domain (TLD) Risk Matrix
 * Categorized by historical reputation in abuse reports (Spamhaus, SURBL, APWG).
 * High risk TLDs are frequently abused for throwaway disposable phishing sites.
 */
export const TLD_RISK_MAP = {
  // High risk / heavily abused disposable TLDs
  high: [
    'xyz', 'top', 'click', 'gq', 'tk', 'ml', 'cf', 'ga', 'buzz', 'work',
    'rest', 'surf', 'loan', 'fit', 'racing', 'icu', 'cam', 'quest', 'bar',
    'monster', 'hair', 'beauty', 'skin', 'autos', 'boats', 'homes', 'motorcycles'
  ],
  // Medium risk / generic or dynamic TLDs
  medium: [
    'online', 'site', 'space', 'live', 'website', 'fun', 'store', 'shop',
    'club', 'vip', 'link', 'best', 'uno', 'bid', 'press', 'host', 'stream',
    'tech', 'info', 'cc', 'ws', 'to', 'is', 'su', 'ru', 'cn', 'pw'
  ],
  // Low risk / standard well-governed TLDs
  low: [
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'io', 'ai', 'app',
    'dev', 'co', 'uk', 'ca', 'de', 'fr', 'jp', 'au', 'in', 'us', 'eu'
  ]
};

export function getTLDRisk(tld) {
  if (!tld) return { level: 'Low', penalty: 0, reason: 'Standard domain extension' };
  const cleanTld = tld.toLowerCase().replace(/^\./, '');
  
  if (TLD_RISK_MAP.high.includes(cleanTld)) {
    return {
      level: 'High',
      penalty: 12,
      reason: `TLD '.${cleanTld}' has a high statistical prevalence in automated disposable phishing campaigns.`
    };
  }
  if (TLD_RISK_MAP.medium.includes(cleanTld)) {
    return {
      level: 'Medium',
      penalty: 6,
      reason: `TLD '.${cleanTld}' is frequently used in unverified generic registrar campaigns.`
    };
  }
  return {
    level: 'Low',
    penalty: 0,
    reason: `TLD '.${cleanTld}' is a recognized top-level domain.`
  };
}
