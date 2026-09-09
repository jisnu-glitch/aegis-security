/**
 * Brand Impersonation and Typo-squatting Detection Engine
 */
import { MONITORED_BRANDS } from '../data/brandDatabase.js';

// Calculate Levenshtein Distance between two strings
export function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Normalize common visual homoglyphs and character swaps
function normalizeHomoglyphs(str) {
  return str
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/!/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/8/g, 'b')
    .replace(/vv/g, 'w')
    .replace(/rn/g, 'm')
    .replace(/cl/g, 'd')
    .replace(/[-_.]/g, '');
}

export function detectBrandImpersonation(parsedUrl) {
  const { hostname, mainDomain, subdomains, pathname } = parsedUrl;
  const hostLower = hostname.toLowerCase();
  const pathLower = pathname.toLowerCase();
  const normalizedHost = normalizeHomoglyphs(hostLower);

  // Check if this domain is an exact match for an official legitimate brand domain
  for (const brand of MONITORED_BRANDS) {
    const isOfficial = brand.officialDomains.some(official => {
      return hostLower === official || hostLower.endsWith('.' + official);
    });

    if (isOfficial) {
      return {
        detected: false,
        isLegitimateBrandDomain: true,
        brand: brand.name,
        risk: 'Low',
        penalty: 0,
        similarity: 100,
        type: 'Verified Official Domain',
        reason: `Matches official verified domain infrastructure for ${brand.name}.`
      };
    }
  }

  // Now scan for impersonation across monitored brands
  for (const brand of MONITORED_BRANDS) {
    const brandName = brand.name;
    const brandKey = brand.id.toLowerCase();
    const normalizedBrandKey = normalizeHomoglyphs(brandKey);

    // 1. Direct homoglyph list match in hostname or pathname
    if (brand.homoglyphs) {
      for (const h of brand.homoglyphs) {
        if (hostLower.includes(h.toLowerCase()) || pathLower.includes(h.toLowerCase())) {
          return {
            detected: true,
            isLegitimateBrandDomain: false,
            brand: brandName,
            matchedPattern: h,
            risk: 'High',
            penalty: 25,
            type: 'Homoglyph / Typo-squatting',
            reason: `Possible ${brandName} brand impersonation detected via visual character substitution ('${h}').`
          };
        }
      }
    }

    // 2. Normalized string inclusion in non-official domain or path
    if ((normalizedHost.includes(normalizedBrandKey) && !hostLower.includes(brandKey)) ||
        (normalizeHomoglyphs(pathLower).includes(normalizedBrandKey) && !brand.officialDomains.some(d => hostLower.includes(d)))) {
      return {
        detected: true,
        isLegitimateBrandDomain: false,
        brand: brandName,
        risk: 'High',
        penalty: 25,
        type: 'Visual Spoofing / Lookalike Pattern',
        reason: `Targeted visual lookalike pattern detected matching ${brandName}.`
      };
    }

    // 3. Brand name embedded with deceptive prefixes/suffixes (e.g., paypal-security.com, google-verify.xyz)
    const sld = mainDomain ? mainDomain.split('.')[0] : hostLower;
    if (sld.includes(brandKey) || hostLower.includes(`${brandKey}-`) || hostLower.includes(`-${brandKey}`) || pathLower.includes(`${brandKey}-`)) {
      return {
        detected: true,
        isLegitimateBrandDomain: false,
        brand: brandName,
        risk: 'High',
        penalty: 25,
        type: 'Brand Subdomain / Prefix Spoofing',
        reason: `The brand name '${brandName}' is embedded in an unauthorized host or path ('${hostname}${pathname}').`
      };
    }

    // 4. Brand keyword in subdomain on a 3rd party domain (e.g., paypal.somedomain.com)
    const hasBrandInSubdomain = subdomains.some(sub => sub.toLowerCase().includes(brandKey));
    if (hasBrandInSubdomain) {
      return {
        detected: true,
        isLegitimateBrandDomain: false,
        brand: brandName,
        risk: 'High',
        penalty: 25,
        type: 'Subdomain Brand Hijack',
        reason: `Brand name '${brandName}' is used in a subdomain of an unverified parent domain '${mainDomain}'.`
      };
    }

    // 5. Levenshtein edit distance on Second Level Domain
    if (sld.length >= 4 && brandKey.length >= 4) {
      const dist = levenshteinDistance(sld, brandKey);
      if (dist === 1 || (dist === 2 && sld.length > 5)) {
        return {
          detected: true,
          isLegitimateBrandDomain: false,
          brand: brandName,
          risk: 'High',
          penalty: 25,
          type: 'Fuzzy Distance Typo-squatting',
          reason: `High phonetic and string proximity (${dist} character edit distance) to '${brandName}'.`
        };
      }
    }
  }

  return {
    detected: false,
    isLegitimateBrandDomain: false,
    brand: null,
    risk: 'Low',
    penalty: 0,
    type: 'None',
    reason: 'No recognized brand impersonation patterns detected in domain.'
  };
}
