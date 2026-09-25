/**
 * QR Code Content Classifier and Parser
 * Detects payload types and extracts key metadata safely without executing or navigating.
 */

export const QR_TYPES = {
  URL: 'Website URL',
  UPI: 'UPI / Payment QR',
  PHONE: 'Phone Number',
  EMAIL: 'Email Address',
  WIFI: 'Wi-Fi Network Config',
  GEO: 'Geo Location',
  TEXT: 'Plain Text',
  UNKNOWN: 'Unknown / Unsupported'
};

export function parseQrPayload(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') {
    return {
      type: QR_TYPES.UNKNOWN,
      raw: '',
      displayContent: 'Empty or invalid payload',
      metadata: {},
      isNavigable: false
    };
  }

  const trimmed = rawContent.trim();

  // 1. UPI Payment QR (e.g., upi://pay?pa=merchant@bank&pn=MerchantName&am=100&cu=INR&tn=Bill)
  if (trimmed.toLowerCase().startsWith('upi://pay')) {
    try {
      const url = new URL(trimmed.replace(/^upi:\/\//i, 'http://dummy.upi/'));
      const pa = url.searchParams.get('pa') || 'N/A'; // Payee address (VPA)
      const pn = url.searchParams.get('pn') || 'Unnamed Payee';
      const am = url.searchParams.get('am'); // Amount
      const cu = url.searchParams.get('cu') || 'INR';
      const tn = url.searchParams.get('tn') || 'None'; // Note / Transaction note

      return {
        type: QR_TYPES.UPI,
        raw: trimmed,
        displayContent: trimmed,
        metadata: {
          payeeVpa: pa,
          payeeName: decodeURIComponent(pn),
          amount: am ? `${am} ${cu}` : 'Flexible / User-specified',
          transactionNote: decodeURIComponent(tn)
        },
        isNavigable: false,
        warning: 'Financial Transaction detected. Never approve a payment or enter your UPI PIN to RECEIVE money. Legitimate payment requests require your PIN only when DEBITING funds.'
      };
    } catch {
      return {
        type: QR_TYPES.UPI,
        raw: trimmed,
        displayContent: trimmed,
        metadata: { info: 'Unparsed UPI payload format' },
        isNavigable: false,
        warning: 'Verify payee details manually before making any payment.'
      };
    }
  }

  // 2. Wi-Fi Configuration (e.g., WIFI:S:MySSID;T:WPA;P:password;;)
  if (trimmed.toUpperCase().startsWith('WIFI:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);
    const hiddenMatch = trimmed.match(/H:([^;]+)/i);
    
    return {
      type: QR_TYPES.WIFI,
      raw: trimmed,
      displayContent: trimmed,
      metadata: {
        networkName: ssidMatch ? ssidMatch[1] : 'Unknown SSID',
        securityType: typeMatch ? typeMatch[1] : 'WPA/WPA2',
        isHidden: hiddenMatch ? hiddenMatch[1] : 'false',
        passwordMasked: '•••••••• (Protected for security)'
      },
      isNavigable: false,
      warning: 'Connecting to untrusted or rogue Wi-Fi access points can expose unencrypted network traffic to eavesdropping or man-in-the-middle attacks.'
    };
  }

  // 3. Tel / Phone
  if (trimmed.toLowerCase().startsWith('tel:')) {
    const phone = trimmed.replace(/^tel:/i, '');
    return {
      type: QR_TYPES.PHONE,
      raw: trimmed,
      displayContent: phone,
      metadata: { phoneNumber: phone },
      isNavigable: false,
      warning: 'Be cautious of unsolicited calls or high-rate premium toll numbers.'
    };
  }

  // 4. Email (mailto:)
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    try {
      const emailUrl = new URL(trimmed);
      const recipient = emailUrl.pathname;
      const subject = emailUrl.searchParams.get('subject') || 'None';
      return {
        type: QR_TYPES.EMAIL,
        raw: trimmed,
        displayContent: recipient,
        metadata: {
          recipient,
          subject: decodeURIComponent(subject)
        },
        isNavigable: false,
        warning: 'Ensure the recipient address matches who you intend to email. Phishing emails often spoof or imitate legitimate support addresses.'
      };
    } catch {
      return {
        type: QR_TYPES.EMAIL,
        raw: trimmed,
        displayContent: trimmed,
        metadata: {},
        isNavigable: false
      };
    }
  }

  // 5. Geo Location
  if (trimmed.toLowerCase().startsWith('geo:')) {
    const coords = trimmed.replace(/^geo:/i, '').split('?')[0];
    return {
      type: QR_TYPES.GEO,
      raw: trimmed,
      displayContent: coords,
      metadata: { coordinates: coords },
      isNavigable: false
    };
  }

  // 6. Website URL
  const isUrlScheme = /^https?:\/\//i.test(trimmed);
  const isLikelyDomain = /^[a-z0-9]([a-z0-9-]*\.)+[a-z]{2,}(\/.*)?$/i.test(trimmed);

  if (isUrlScheme || isLikelyDomain) {
    const normalizedUrl = isUrlScheme ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(normalizedUrl);
      return {
        type: QR_TYPES.URL,
        raw: trimmed,
        normalizedUrl,
        displayContent: normalizedUrl,
        metadata: {
          protocol: parsed.protocol.replace(':', '').toUpperCase(),
          host: parsed.hostname,
          port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
          pathname: parsed.pathname,
          search: parsed.search || 'None',
          hash: parsed.hash || 'None'
        },
        isNavigable: true
      };
    } catch {
      // Fallback if URL constructor fails
    }
  }

  // 7. Plain Text
  return {
    type: QR_TYPES.TEXT,
    raw: trimmed,
    displayContent: trimmed.length > 300 ? trimmed.substring(0, 300) + '...' : trimmed,
    metadata: {
      characterCount: trimmed.length,
      snippet: trimmed.substring(0, 80)
    },
    isNavigable: false,
    warning: 'Text payloads are generally safe, but verify that no sensitive credentials or recovery keys are embedded.'
  };
}
