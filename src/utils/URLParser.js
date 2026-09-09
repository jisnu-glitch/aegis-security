/**
 * URL Parser and Structural Analyzer
 */

// Regex to detect IPv4 addresses (including raw and with port)
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
// Regex to detect IPv6 addresses
const IPV6_REGEX = /^\[?([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\]?$/;
// Regex to detect Hexadecimal or Octal IP encodings (used to bypass filters)
const HEX_OCTAL_IP_REGEX = /^(0x[0-9a-fA-F]+\.?)+$|^0[0-7]+(\.[0-7]+)*$/;

export function parseURL(rawUrl) {
  let trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    throw new Error('Please enter a valid URL to analyze.');
  }

  // Prepend protocol if user omitted it
  let hasExplicitProtocol = /^https?:\/\//i.test(trimmed);
  let urlToParse = hasExplicitProtocol ? trimmed : `http://${trimmed}`;

  let parsed;
  try {
    parsed = new URL(urlToParse);
  } catch (err) {
    // If standard URL constructor fails, attempt manual fallback
    try {
      urlToParse = `http://${trimmed.replace(/^\/+/, '')}`;
      parsed = new URL(urlToParse);
    } catch (e) {
      throw new Error('Invalid URL format. Please check the domain structure.');
    }
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(':', '').toLowerCase();
  const isHttps = protocol === 'https';
  const port = parsed.port || (isHttps ? '443' : '80');
  const pathname = parsed.pathname;
  const search = parsed.search;
  const hash = parsed.hash;
  const fullUrl = parsed.href;

  // Check if hostname is an IP Address
  const isIpv4 = IPV4_REGEX.test(hostname);
  const isIpv6 = IPV6_REGEX.test(hostname);
  const isEncodedIp = HEX_OCTAL_IP_REGEX.test(hostname);
  const isIpAddress = isIpv4 || isIpv6 || isEncodedIp;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

  // Extract domain parts
  const hostParts = hostname.split('.');
  let tld = '';
  let mainDomain = hostname;
  let subdomains = [];

  if (isIpAddress) {
    mainDomain = hostname;
    subdomains = [];
  } else if (hostParts.length > 1) {
    // Check for common compound TLDs like .co.uk, .com.au, .co.in
    const lastTwo = hostParts.slice(-2).join('.');
    const compoundTlds = ['co.uk', 'co.in', 'com.au', 'com.br', 'co.nz', 'co.za', 'com.mx', 'org.uk', 'gov.in'];
    
    if (compoundTlds.includes(lastTwo) && hostParts.length >= 3) {
      tld = lastTwo;
      mainDomain = hostParts[hostParts.length - 3] + '.' + tld;
      subdomains = hostParts.slice(0, hostParts.length - 3);
    } else {
      tld = hostParts[hostParts.length - 1];
      mainDomain = hostParts.slice(-2).join('.');
      subdomains = hostParts.slice(0, -2);
    }
  }

  // URL Length assessment
  const urlLength = fullUrl.length;
  let lengthStatus = 'Safe';
  let lengthRisk = 'Low';
  let lengthPenalty = 0;
  let lengthReason = `URL length is ${urlLength} characters (concise & standard).`;

  if (urlLength > 100) {
    lengthStatus = 'High Risk';
    lengthRisk = 'High';
    lengthPenalty = 12;
    lengthReason = `Excessive URL length (${urlLength} chars). Threat actors frequently utilize bloated URLs to obfuscate payloads.`;
  } else if (urlLength >= 50) {
    lengthStatus = 'Suspicious';
    lengthRisk = 'Medium';
    lengthPenalty = 5;
    lengthReason = `Elevated URL length (${urlLength} chars). May contain tracking or redirect tokens.`;
  }

  // Non-standard port check
  const standardPorts = ['80', '443', ''];
  const hasNonStandardPort = !standardPorts.includes(parsed.port);

  return {
    rawUrl: trimmed,
    fullUrl,
    hostname,
    protocol,
    isHttps,
    port,
    hasNonStandardPort,
    pathname,
    search,
    hash,
    mainDomain,
    subdomains,
    subdomainCount: subdomains.length,
    tld,
    isIpAddress,
    isIpv4,
    isIpv6,
    isEncodedIp,
    isLocalhost,
    urlLength,
    lengthAssessment: {
      status: lengthStatus,
      risk: lengthRisk,
      penalty: lengthPenalty,
      reason: lengthReason
    }
  };
}
