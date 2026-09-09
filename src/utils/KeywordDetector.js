/**
 * Suspicious Keyword and Social Engineering Token Detector
 */
import { SUSPICIOUS_KEYWORDS, ALL_KEYWORDS_LIST } from '../data/suspiciousKeywords.js';

export function detectSuspiciousKeywords(parsedUrl) {
  const { hostname, pathname, search, hash } = parsedUrl;
  
  // Combine all URL components into a tokenized search text
  const fullText = `${hostname} ${pathname} ${search} ${hash}`.toLowerCase();
  // Split on common delimiters
  const tokens = fullText.split(/[/\\?&=_\-.+:@%#]/).filter(Boolean);

  const matchedKeywords = [];
  const detectedCategories = new Set();

  for (const item of ALL_KEYWORDS_LIST) {
    const word = item.word.toLowerCase();
    
    // Check if token matches or is contained in specific sub-segments
    const isTokenMatch = tokens.includes(word);
    const isSubMatch = tokens.some(t => t.length > word.length && t.includes(word) && !t.includes('javascript') && !t.includes('stylesheet'));

    if (isTokenMatch || isSubMatch) {
      if (!matchedKeywords.some(m => m.word === word)) {
        matchedKeywords.push({
          word,
          category: item.category,
          exact: isTokenMatch
        });
        detectedCategories.add(item.category);
      }
    }
  }

  const keywordCount = matchedKeywords.length;
  let risk = 'Low';
  let penalty = 0;
  let reason = 'No suspicious or social engineering keywords found.';

  if (keywordCount >= 3) {
    risk = 'High';
    penalty = Math.min(25, keywordCount * 5);
    reason = `Multiple high-urgency/phishing keywords detected (${keywordCount} keywords across ${detectedCategories.size} categories).`;
  } else if (keywordCount >= 1) {
    risk = 'Medium';
    penalty = keywordCount * 5;
    reason = `Suspicious keywords found in URL path/query (${matchedKeywords.map(k => k.word).join(', ')}).`;
  }

  return {
    detected: keywordCount > 0,
    count: keywordCount,
    keywords: matchedKeywords,
    categories: Array.from(detectedCategories),
    risk,
    penalty,
    reason
  };
}
