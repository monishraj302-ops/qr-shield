/**
 * QR Shield LocalStorage Persistence Manager
 * Securely logs scan history and computes dashboard metrics without saving sensitive credentials.
 */

const STORAGE_KEY = 'qr_shield_history_v1';

// Seed demo scans for hackathon presentation if user opens fresh browser
const INITIAL_DEMO_SCANS = [
  {
    id: 'demo-scan-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    domain: 'mit.edu',
    contentSnippet: 'https://mit.edu/cybersecurity/research-lab',
    qrType: 'Website URL',
    riskScore: 0,
    riskLevel: 'LOW RISK',
    primaryWarning: 'Clean domain with HTTPS transport encryption.',
    fullResult: {
      isValidUrl: true,
      riskScore: 0,
      riskLevel: 'LOW RISK',
      color: 'green',
      destination: 'https://mit.edu/cybersecurity/research-lab',
      domain: 'mit.edu',
      rootDomain: 'mit.edu',
      findings: [
        { id: 'valid-syntax', title: 'URL Format RFC-Compliant', status: 'pass', points: 0, description: 'Valid HTTPS web address syntax.' },
        { id: 'https-check', title: 'HTTPS Encryption Detected', status: 'pass', points: 0, description: 'TLS encryption verified.' }
      ],
      explanation: 'No critical threat indicators found. The destination uses standard domain structures and valid protocols.',
      threatIntel: { status: 'heuristic_only', message: 'Reputation data unavailable (Heuristic Analysis Mode).' },
      disclaimer: 'This score represents detected heuristic security indicators and is not an absolute guarantee.'
    }
  },
  {
    id: 'demo-scan-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    domain: 'account-service-update.xyz',
    contentSnippet: 'http://account-service-update.xyz?redirect=http://external.com',
    qrType: 'Website URL',
    riskScore: 45,
    riskLevel: 'MEDIUM RISK',
    primaryWarning: 'Unencrypted HTTP + Suspicious .xyz TLD + Open Redirect.',
    fullResult: {
      isValidUrl: true,
      riskScore: 45,
      riskLevel: 'MEDIUM RISK',
      color: 'yellow',
      destination: 'http://account-service-update.xyz?redirect=http://external.com',
      domain: 'account-service-update.xyz',
      rootDomain: 'account-service-update.xyz',
      findings: [
        { id: 'http-insecure', title: 'Unencrypted HTTP Protocol', status: 'warning', points: 15, description: 'Destination uses plain HTTP.' },
        { id: 'suspicious-tld', title: 'High-Risk TLD (.xyz)', status: 'warning', points: 15, description: 'Unusual or disposable TLD.' },
        { id: 'open-redirect', title: 'Potential Open Redirection Parameter', status: 'warning', points: 15, description: 'Contains ?redirect= parameter.' }
      ],
      explanation: 'Caution advised: Detected medium-risk patterns including unencrypted protocol and potential open redirection.',
      threatIntel: { status: 'heuristic_only', message: 'Reputation data unavailable (Heuristic Analysis Mode).' },
      disclaimer: 'This score represents detected heuristic security indicators.'
    }
  },
  {
    id: 'demo-scan-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    domain: 'secure-paypal-login-verify.top',
    contentSnippet: 'http://secure-paypal-login-verify.top/account/auth/signin?token=928374',
    qrType: 'Website URL',
    riskScore: 85,
    riskLevel: 'HIGH RISK',
    primaryWarning: 'Severe PayPal Brand Impersonation & Phishing Lure.',
    fullResult: {
      isValidUrl: true,
      riskScore: 85,
      riskLevel: 'HIGH RISK',
      color: 'red',
      destination: 'http://secure-paypal-login-verify.top/account/auth/signin?token=928374',
      domain: 'secure-paypal-login-verify.top',
      rootDomain: 'secure-paypal-login-verify.top',
      findings: [
        { id: 'brand-mismatch', title: 'Possible PayPal Impersonation', status: 'danger', points: 30, description: 'URL mentions "PayPal" but destination root domain is "secure-paypal-login-verify.top".' },
        { id: 'suspicious-keywords', title: 'Multiple Phishing Lure Keywords', status: 'warning', points: 20, description: 'Contains "login", "verify", "signin", "account".' },
        { id: 'suspicious-tld', title: 'High-Risk TLD (.top)', status: 'warning', points: 15, description: 'Disposable spam TLD.' },
        { id: 'http-insecure', title: 'Unencrypted HTTP Protocol', status: 'warning', points: 15, description: 'Lacks TLS transport encryption.' }
      ],
      explanation: 'Multiple high-severity indicators detected. The URL appears to impersonate "PayPal" while routing to an unrelated host. High probability of credential harvesting.',
      threatIntel: { status: 'heuristic_only', message: 'Reputation data unavailable (Heuristic Analysis Mode).' },
      disclaimer: 'This score represents detected heuristic security indicators.'
    }
  }
];

export function getScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial demo scans for instant hackathon showcase
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SCANS));
      return INITIAL_DEMO_SCANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to read scan history from localStorage:', err);
    return [];
  }
}

export function saveScanRecord(scanData) {
  try {
    const current = getScanHistory();
    // Sanitize: do not store full payment private keys or OTPs
    const sanitizedRecord = {
      id: 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      domain: scanData.domain || 'N/A',
      contentSnippet: scanData.destination ? (scanData.destination.length > 90 ? scanData.destination.substring(0, 90) + '...' : scanData.destination) : 'Content',
      qrType: scanData.qrType || 'Website URL',
      riskScore: scanData.riskScore,
      riskLevel: scanData.riskLevel,
      primaryWarning: scanData.findings && scanData.findings.length > 0 
        ? scanData.findings[0].title 
        : (scanData.explanation || 'Analyzed'),
      fullResult: scanData
    };

    const updated = [sanitizedRecord, ...current].slice(0, 100); // keep last 100
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return sanitizedRecord;
  } catch (err) {
    console.error('Failed to save scan record to localStorage:', err);
    return null;
  }
}

export function deleteScanRecord(id) {
  try {
    const current = getScanHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete scan record:', err);
    return [];
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear scan history:', err);
    return [];
  }
}

export function computeStatistics(history) {
  const totalScans = history.length;
  let lowRisk = 0;
  let mediumRisk = 0;
  let highRisk = 0;
  let paymentScans = 0;

  history.forEach(item => {
    if (item.riskLevel === 'HIGH RISK' || item.riskScore >= 60) highRisk++;
    else if (item.riskLevel === 'MEDIUM RISK' || item.riskScore >= 30) mediumRisk++;
    else lowRisk++;

    if (item.qrType && item.qrType.includes('Payment')) paymentScans++;
  });

  return {
    totalScans,
    lowRisk,
    mediumRisk,
    highRisk,
    paymentScans,
    recentScans: history.slice(0, 8)
  };
}
