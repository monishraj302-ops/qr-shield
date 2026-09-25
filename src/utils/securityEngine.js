/**
 * QR Shield Heuristic Security Engine
 * Performs deep, explainable inspection of decoded URLs and payloads.
 * Evaluates domain structure, obfuscation, brand mismatches, and protocol flags.
 */

// Known brand entities frequently targeted by credential harvesters
const BRAND_REGISTRY = [
  { name: 'PayPal', keywords: ['paypal'], legitimateRoots: ['paypal.com', 'paypal.me'] },
  { name: 'Google', keywords: ['google', 'gmail'], legitimateRoots: ['google.com', 'google.co.in', 'youtube.com'] },
  { name: 'Microsoft', keywords: ['microsoft', 'outlook', 'office365', 'live'], legitimateRoots: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'office365.com'] },
  { name: 'Apple', keywords: ['apple', 'icloud'], legitimateRoots: ['apple.com', 'icloud.com'] },
  { name: 'Amazon', keywords: ['amazon', 'primevideo'], legitimateRoots: ['amazon.com', 'amazon.in', 'amazon.co.uk'] },
  { name: 'Netflix', keywords: ['netflix'], legitimateRoots: ['netflix.com'] },
  { name: 'Meta / Facebook', keywords: ['facebook', 'meta', 'instagram', 'whatsapp'], legitimateRoots: ['facebook.com', 'meta.com', 'instagram.com', 'whatsapp.com', 'wa.me'] },
  { name: 'State Bank of India (SBI)', keywords: ['onlinesbi', 'statebankofindia'], legitimateRoots: ['sbi.co.in', 'onlinesbi.sbi'] },
  { name: 'HDFC Bank', keywords: ['hdfcbank', 'hdfc'], legitimateRoots: ['hdfcbank.com'] },
  { name: 'Chase Bank', keywords: ['chasebank', 'chase'], legitimateRoots: ['chase.com'] },
  { name: 'Binance', keywords: ['binance'], legitimateRoots: ['binance.com'] },
  { name: 'Steam', keywords: ['steampowered', 'steamcommunity'], legitimateRoots: ['steampowered.com', 'steamcommunity.com'] },
  { name: 'Twitter / X', keywords: ['twitter', 'x-auth'], legitimateRoots: ['x.com', 'twitter.com'] },
  { name: 'Dropbox', keywords: ['dropbox'], legitimateRoots: ['dropbox.com'] }
];

// Suspicious / high-abuse TLDs commonly seen in phishing and throwaway spam campaigns
const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'work', 'buzz', 'click',
  'loan', 'cam', 'live', 'shop', 'link', 'stream', 'club', 'guru', 'rest',
  'icu', 'fit', 'surf', 'bar', 'monster', 'fun'
]);

// Urgent / phishing keywords
const SUSPICIOUS_KEYWORDS = [
  'login', 'verify', 'verification', 'password', 'account', 'security',
  'urgent', 'update', 'banking', 'wallet', 'kyc', 'auth', 'authenticate',
  'signin', 'recover', 'billing', 'confirm', 'validation', 'unlock', 'suspended'
];

// Known URL shorteners
const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'ow.ly', 'buff.ly', 'cutt.ly', 'rb.gy', 'rebrand.ly'
]);

/**
 * Calculate Shannon Entropy of a string to detect randomized/generated strings
 */
function calculateEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const freqs = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    freqs[char] = (freqs[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in freqs) {
    const p = freqs[char] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/**
 * Extract root domain from hostname (handles simple 2-level TLDs e.g. .co.in, .com)
 */
function extractRootDomain(hostname) {
  if (!hostname) return '';
  const parts = hostname.toLowerCase().split('.');
  if (parts.length <= 2) return hostname.toLowerCase();

  const secondToLast = parts[parts.length - 2];
  const commonTwoLevel = ['co', 'com', 'org', 'edu', 'gov', 'net', 'ac'];

  if (commonTwoLevel.includes(secondToLast) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

/**
 * Check if hostname is an IPv4 or IPv6 address
 */
function isIpAddress(hostname) {
  // IPv4 regex
  const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
  // IPv6 check
  const ipv6Regex = /^\[?[a-fA-F0-9:]+\]?$/;
  return ipv4Regex.test(hostname) || (hostname.includes(':') && ipv6Regex.test(hostname));
}

/**
 * Main Security Analysis Function
 */
export function analyzeSecurity(payloadInfo) {
  const { type, displayContent, normalizedUrl, metadata } = payloadInfo;

  // Non-URL Payloads (UPI, Text, Wifi, etc.)
  if (type !== 'Website URL' || !normalizedUrl) {
    return handleNonUrlPayload(payloadInfo);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch (err) {
    return {
      isValidUrl: false,
      riskScore: 65,
      riskLevel: 'HIGH RISK',
      color: 'red',
      destination: normalizedUrl,
      domain: 'Invalid / Malformed',
      findings: [
        {
          id: 'invalid-url',
          title: 'Malformed URL Syntax',
          status: 'danger',
          points: 65,
          description: 'The scanned content looks like a URL but violates standard RFC 3986 format specification.'
        }
      ],
      explanation: 'Malformed URLs are frequently crafted by attackers attempting to exploit browser parsing bugs or obfuscate malicious destinations.',
      threatIntel: { status: 'unavailable', message: 'Reputation data unavailable (RFC syntax error).' }
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const rootDomain = extractRootDomain(hostname);
  const fullPath = parsedUrl.pathname.toLowerCase() + parsedUrl.search.toLowerCase();
  const tld = hostname.split('.').pop();
  const subdomains = hostname.split('.').slice(0, -2);

  const findings = [];
  let score = 0;

  // 1. URL Validation Check
  findings.push({
    id: 'valid-syntax',
    title: 'URL Format RFC-Compliant',
    status: 'pass',
    points: 0,
    description: `Valid ${parsedUrl.protocol.replace(':', '').toUpperCase()} web address syntax.`
  });

  // 2. Protocol Check (HTTPS vs HTTP)
  if (parsedUrl.protocol === 'https:') {
    findings.push({
      id: 'https-check',
      title: 'HTTPS Encryption Detected',
      status: 'pass',
      points: 0,
      description: 'The destination uses TLS/HTTPS for transport encryption. Note: HTTPS prevents eavesdropping on transit, but does NOT guarantee the site is benign.'
    });
  } else if (parsedUrl.protocol === 'http:') {
    score += 15;
    findings.push({
      id: 'http-insecure',
      title: 'Unencrypted HTTP Protocol',
      status: 'warning',
      points: 15,
      description: 'Destination uses plain HTTP. Traffic is unencrypted, susceptible to network eavesdropping, packet sniffing, or man-in-the-middle injection.'
    });
  }

  // 3. Raw IP Address Check
  if (isIpAddress(hostname)) {
    score += 30;
    findings.push({
      id: 'raw-ip',
      title: 'Raw IP Address Destination',
      status: 'danger',
      points: 30,
      description: `Destination links directly to numeric IP address '${hostname}' instead of a registered domain name. Legitimate consumer services virtually never use raw IPs.`
    });
  }

  // 4. Excessive Subdomains (Mobile URL Spoofing)
  if (subdomains.length >= 3) {
    score += 20;
    findings.push({
      id: 'excessive-subdomains',
      title: 'Excessive Subdomain Chaining',
      status: 'danger',
      points: 20,
      description: `Domain has ${subdomains.length} subdomain layers (${hostname}). Attackers stack subdomains to trick mobile users where only the initial text fits on screen.`
    });
  } else if (subdomains.length === 2) {
    score += 5;
    findings.push({
      id: 'multiple-subdomains',
      title: 'Multiple Subdomain Layers',
      status: 'info',
      points: 5,
      description: `Two subdomain layers detected (${hostname}). Common in large services, but verify domain authenticity.`
    });
  }

  // 5. Suspicious TLD
  if (SUSPICIOUS_TLDS.has(tld)) {
    score += 15;
    findings.push({
      id: 'suspicious-tld',
      title: `High-Risk TLD (.${tld})`,
      status: 'warning',
      points: 15,
      description: `Top-Level Domain .${tld} has historically high abuse rates in automated spam, disposable phishing, and malware campaigns.`
    });
  }

  // 6. IDN / Punycode Homograph Attack
  if (hostname.includes('xn--')) {
    score += 25;
    findings.push({
      id: 'punycode-homograph',
      title: 'Punycode / IDN Homograph Detected',
      status: 'danger',
      points: 25,
      description: 'Internationalized Domain Name (xn--) detected. Attackers use visually identical Cyrillic/Greek characters (e.g. "а" vs "a") to spoof known brands.'
    });
  }

  // 7. Shannon Entropy / Random Domain Strings
  const domainWithoutTld = hostname.replace(`.${tld}`, '').replace(/[^a-z0-9]/g, '');
  const entropy = calculateEntropy(domainWithoutTld);
  if (domainWithoutTld.length >= 10 && entropy > 3.65) {
    score += 15;
    findings.push({
      id: 'high-entropy',
      title: 'Unusually Random Domain Name',
      status: 'warning',
      points: 15,
      description: `High lexical entropy detected (${entropy.toFixed(2)} bits/char). Domain resembles algorithmically generated or throwaway domain strings.`
    });
  }

  // 8. Brand Mismatch / Phishing Impersonation Check
  let brandMismatchDetected = null;
  for (const brand of BRAND_REGISTRY) {
    const mentionsBrand = brand.keywords.some(kw => 
      hostname.includes(kw) || fullPath.includes(kw)
    );

    if (mentionsBrand) {
      const isLegit = brand.legitimateRoots.some(legit => rootDomain === legit || rootDomain.endsWith('.' + legit));
      if (!isLegit) {
        brandMismatchDetected = {
          brand: brand.name,
          actualDomain: rootDomain,
          legitimate: brand.legitimateRoots.join(', ')
        };
        break;
      }
    }
  }

  if (brandMismatchDetected) {
    score += 30;
    findings.push({
      id: 'brand-mismatch',
      title: `Possible ${brandMismatchDetected.brand} Impersonation`,
      status: 'danger',
      points: 30,
      description: `URL references "${brandMismatchDetected.brand}" in domain or path, but the actual destination domain is "${brandMismatchDetected.actualDomain}". Legitimate domains are: ${brandMismatchDetected.legitimate}.`
    });
  }

  // 9. Suspicious Urgency / Credential Keywords
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(kw => 
    hostname.includes(kw) || fullPath.includes(kw)
  );

  if (matchedKeywords.length >= 2) {
    score += 20;
    findings.push({
      id: 'suspicious-keywords',
      title: 'Multiple Phishing Lure Keywords',
      status: 'warning',
      points: 20,
      description: `Detected security/credential keywords: [${matchedKeywords.join(', ')}]. While valid for account management, these are heavily leveraged in credential harvesting lures.`
    });
  } else if (matchedKeywords.length === 1) {
    score += 10;
    findings.push({
      id: 'single-keyword',
      title: `Auth-Related Keyword Detected ('${matchedKeywords[0]}')`,
      status: 'info',
      points: 10,
      description: `Contains credential/action keyword '${matchedKeywords[0]}'. Make sure you initiated this login action.`
    });
  }

  // 10. URL Obfuscation: Hex/Percent Encoding & Embedded Credentials
  const percentMatches = (normalizedUrl.match(/%[0-9a-fA-F]{2}/g) || []).length;
  if (percentMatches >= 4) {
    score += 15;
    findings.push({
      id: 'excessive-encoding',
      title: 'Heavy URL Percent Encoding',
      status: 'warning',
      points: 15,
      description: `Detected ${percentMatches} percent-encoded characters. Attackers frequently encode malicious payloads to evade basic gateway filters.`
    });
  }

  if (normalizedUrl.includes('@')) {
    score += 25;
    findings.push({
      id: 'embedded-credentials',
      title: 'Embedded Credentials / @ Character Trick',
      status: 'danger',
      points: 25,
      description: 'URL contains the "@" character before the domain. Historically used in browser phishing to disguise the real target server.'
    });
  }

  // 11. Open Redirect Parameters
  const redirectParams = ['redirect', 'url', 'dest', 'next', 'return', 'to', 'r', 'goto'];
  const hasRedirectParam = redirectParams.some(param => parsedUrl.searchParams.has(param));
  if (hasRedirectParam) {
    score += 15;
    findings.push({
      id: 'open-redirect',
      title: 'Potential Open Redirection Parameter',
      status: 'warning',
      points: 15,
      description: 'URL contains redirection parameters (e.g. ?redirect= or ?url=). Attackers exploit unvalidated redirects to bounce victims from a trusted site to a malicious landing page.'
    });
  }

  // 12. Shortener Service Check
  if (KNOWN_SHORTENERS.has(rootDomain)) {
    score += 10;
    findings.push({
      id: 'url-shortener',
      title: 'Concealed Destination via URL Shortener',
      status: 'warning',
      points: 10,
      description: `Destination uses shortener service '${rootDomain}'. The true landing page is obfuscated until followed.`
    });
  }

  // Cap score between 0 and 100
  score = Math.min(100, Math.max(0, score));

  // Determine Risk Category
  let riskLevel = 'LOW RISK';
  let color = 'green';
  if (score >= 60) {
    riskLevel = 'HIGH RISK';
    color = 'red';
  } else if (score >= 30) {
    riskLevel = 'MEDIUM RISK';
    color = 'yellow';
  }

  // Generate plain-English explanation
  const explanation = generateExplanation(score, findings, brandMismatchDetected, hostname);

  return {
    isValidUrl: true,
    riskScore: score,
    riskLevel,
    color,
    destination: normalizedUrl,
    domain: hostname,
    rootDomain,
    findings,
    explanation,
    threatIntel: {
      status: 'heuristic_only',
      message: 'Reputation data unavailable (Heuristic Analysis Mode). No third-party threat API configured in offline demo.'
    },
    disclaimer: 'This score represents detected heuristic security indicators and is not an absolute guarantee that a website is benign or malicious.'
  };
}

/**
 * Handle non-URL payloads such as UPI payments, text, and wifi
 */
function handleNonUrlPayload(payloadInfo) {
  const { type, displayContent, metadata, warning } = payloadInfo;

  if (type === 'UPI / Payment QR') {
    return {
      isValidUrl: false,
      isFinancial: true,
      riskScore: 40,
      riskLevel: 'MEDIUM RISK',
      color: 'yellow',
      destination: displayContent,
      domain: metadata.payeeVpa || 'UPI Payment',
      findings: [
        {
          id: 'financial-upi',
          title: 'Financial Payment Intent Detected',
          status: 'warning',
          points: 40,
          description: `Payee: ${metadata.payeeName} (${metadata.payeeVpa}). Amount: ${metadata.amount}.`
        },
        {
          id: 'upi-pin-alert',
          title: 'Strict PIN & OTP Safety Advisory',
          status: 'danger',
          points: 0,
          description: 'UPI PIN is NEVER required to receive money or cashbacks. Entering your PIN always deducts funds from your bank account.'
        }
      ],
      explanation: 'Financial QR codes should be manually inspected before scanning with payment apps. Fraudsters often distribute static QR stickers in retail stores or advertise fake cashback prizes that debit victim accounts.',
      threatIntel: { status: 'not_applicable', message: 'Threat-intel databases do not index peer-to-peer UPI VPA endpoints.' },
      disclaimer: warning
    };
  }

  // Plain Text, Wifi, Phone, Email
  return {
    isValidUrl: false,
    riskScore: 10,
    riskLevel: 'LOW RISK',
    color: 'green',
    destination: displayContent,
    domain: type,
    findings: [
      {
        id: 'non-url-payload',
        title: `${type} Content Extracted`,
        status: 'pass',
        points: 10,
        description: `Content decoded safely without web browser execution: ${displayContent.substring(0, 100)}`
      }
    ],
    explanation: `${type} content decoded safely. No automatic web navigation was initiated. Review the raw data before using or sharing.`,
    threatIntel: { status: 'not_applicable', message: 'Direct text payload does not query external DNS or web domains.' },
    disclaimer: 'Always verify unexpected messages or phone numbers to prevent social engineering scams.'
  };
}

/**
 * Synthesize simple explainable summary
 */
function generateExplanation(score, findings, brandMismatch, hostname) {
  if (score >= 60) {
    if (brandMismatch) {
      return `Multiple high-severity indicators detected. The URL appears to impersonate "${brandMismatch.brand}" while routing to an unrelated host ("${brandMismatch.actualDomain}"). Proceeding carries a high risk of credential harvesting or fraud.`;
    }
    const dangerFindings = findings.filter(f => f.status === 'danger').map(f => f.title);
    return `Critical security warnings triggered: ${dangerFindings.join(', ') || 'High risk heuristics'}. Avoid entering passwords, personal information, or financial credentials on this destination.`;
  }

  if (score >= 30) {
    const warnFindings = findings.filter(f => f.status === 'warning' || f.status === 'danger').map(f => f.title);
    return `Caution advised: Detected medium-risk patterns including ${warnFindings.join(' and ')}. Verify the link origin carefully before interacting.`;
  }

  return `No critical threat indicators found. The destination uses standard domain structures and valid protocols. Exercise ordinary caution as cyber actors can occasionally compromise legitimate domains.`;
}
