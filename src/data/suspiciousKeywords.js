/**
 * Categorized Suspicious Security Keywords for Phishing & URL Threat Detection
 */
export const SUSPICIOUS_KEYWORDS = {
  authentication: [
    'login', 'signin', 'sign-in', 'log-in', 'logon', 'authenticate', 'auth',
    'password', 'passcode', 'credential', 'credentials', 'reset-password',
    'forgot-password', 'change-password', 'unlock', 'session', 'oauth'
  ],
  verification: [
    'verify', 'verification', 'confirm', 'confirmation', 'validate', 'validation',
    'security-check', 'checkpoint', 'identity', 'id-verify', 'kyc', 'reactivate',
    'suspended', 'suspension', 'appeal', 'resolution-center', 'unblock', 'restore'
  ],
  financial: [
    'banking', 'bank', 'wallet', 'crypto', 'billing', 'invoice', 'payment',
    'card', 'creditcard', 'debitcard', 'paypal', 'refund', 'wire', 'transfer',
    'payout', 'metamask', 'ledger', 'trezor', 'seedphrase', 'secret-recovery'
  ],
  urgency: [
    'urgent', 'immediate', 'alert', 'warning', 'critical', 'action-required',
    'limited-time', 'expires', 'emergency', 'attention', 'notice', 'final-notice'
  ],
  incentive: [
    'reward', 'free', 'airdrop', 'bonus', 'claim', 'winner', 'gift', 'prize',
    'giveaway', 'lottery', 'voucher', 'promo', 'discount', 'nitro'
  ],
  system: [
    'update', 'upgrade', 'patch', 'service', 'support', 'helpdesk', 'secure',
    'portal', 'admin', 'administrator', 'system', 'server', 'gateway'
  ]
};

// Flattened list with categorized weights
export const ALL_KEYWORDS_LIST = Object.entries(SUSPICIOUS_KEYWORDS).flatMap(
  ([category, words]) => words.map(word => ({ word, category }))
);
