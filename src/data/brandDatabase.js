/**
 * Brand Database for Impersonation Detection
 * Contains top targeted brands in phishing campaigns, their official domains,
 * and common homoglyphs / typo-squatting targets.
 */
export const MONITORED_BRANDS = [
  {
    id: 'google',
    name: 'Google',
    officialDomains: ['google.com', 'google.co.in', 'google.co.uk', 'google.de', 'google.fr', 'google.org', 'gstatic.com', 'googleusercontent.com', 'accounts.google.com'],
    keywords: ['google', 'gmail', 'gsuite', 'googledrive', 'gdrive', 'workspace'],
    homoglyphs: ['g00gle', 'googie', 'g0ogle', 'goog1e', 'gooogle', 'g00g1e', 'gmai1', 'gmall']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    officialDomains: ['paypal.com', 'paypal.me', 'paypal-community.com'],
    keywords: ['paypal', 'pay-pal', 'paypal-service', 'paypal-security', 'paypal-update'],
    homoglyphs: ['paypa1', 'paypai', 'paypaI', 'paypol', 'paypa-l', 'p0ypal', 'pay-pal-security', 'paypal1']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    officialDomains: ['amazon.com', 'amazon.co.uk', 'amazon.in', 'amazon.de', 'amazon.fr', 'amazon.ca', 'aws.amazon.com', 'media-amazon.com'],
    keywords: ['amazon', 'prime', 'amazon-pay', 'amazon-security', 'aws'],
    homoglyphs: ['arnazon', 'amaz0n', 'amz-security', 'amazn', 'amzon', 'amazom', 'arnaz0n']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    officialDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'microsoftonline.com', 'azure.com', 'windows.net', 'sharepoint.com'],
    keywords: ['microsoft', 'office365', 'outlook', 'onedrive', 'azure', 'msft'],
    homoglyphs: ['micros0ft', 'microsft', 'm1crosoft', 'micro-soft', 'off1ce', '0ffice', 'outl00k', 'outlo0k']
  },
  {
    id: 'apple',
    name: 'Apple',
    officialDomains: ['apple.com', 'icloud.com', 'appleid.apple.com', 'itunes.com'],
    keywords: ['apple', 'icloud', 'appleid', 'applestore', 'findmyiphone', 'itunes'],
    homoglyphs: ['app1e', 'appie', 'aple', 'app-le', '1cloud', 'icl0ud', 'app1e-id']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    officialDomains: ['netflix.com', 'nflxso.net', 'nflxext.com'],
    keywords: ['netflix', 'netflix-verify', 'netflix-billing'],
    homoglyphs: ['netf1ix', 'netfiix', 'netflx', 'netfllx', 'net-flix', 'netfl1x']
  },
  {
    id: 'facebook',
    name: 'Facebook / Meta',
    officialDomains: ['facebook.com', 'fb.com', 'meta.com', 'messenger.com'],
    keywords: ['facebook', 'fb', 'meta', 'face-book', 'meta-security'],
    homoglyphs: ['faceb00k', 'facebo0k', 'face-book', 'facebok', 'facbook', 'fb-security']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    officialDomains: ['instagram.com', 'instagr.am'],
    keywords: ['instagram', 'insta', 'ig-verify'],
    homoglyphs: ['1nstagram', 'instagrarn', 'instgrm', 'instgram', 'instagr4m']
  },
  {
    id: 'github',
    name: 'GitHub',
    officialDomains: ['github.com', 'github.io', 'githubusercontent.com'],
    keywords: ['github', 'git-hub'],
    homoglyphs: ['g1thub', 'gthub', 'git-hub-auth', 'git-hub']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    officialDomains: ['linkedin.com', 'licdn.com'],
    keywords: ['linkedin', 'linked-in'],
    homoglyphs: ['1inkedin', 'linked1n', 'llnkedin', 'linked-in-security']
  },
  {
    id: 'binance',
    name: 'Binance',
    officialDomains: ['binance.com', 'binance.org'],
    keywords: ['binance', 'bnb', 'binance-trade'],
    homoglyphs: ['b1nance', 'binonce', 'blnance', 'binanc3']
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    officialDomains: ['coinbase.com'],
    keywords: ['coinbase', 'coin-base'],
    homoglyphs: ['c0inbase', 'coinbas3', 'coin-base-auth', 'colnbase']
  },
  {
    id: 'chase',
    name: 'Chase Bank',
    officialDomains: ['chase.com'],
    keywords: ['chase', 'chasebank', 'chase-online'],
    homoglyphs: ['ch4se', 'chase-verify', 'chase-secure', 'chas3']
  },
  {
    id: 'bankofamerica',
    name: 'Bank of America',
    officialDomains: ['bankofamerica.com', 'bofa.com'],
    keywords: ['bankofamerica', 'bofa', 'bofa-online'],
    homoglyphs: ['bank0famerica', 'bankofamer1ca', 'bofa-verify']
  },
  {
    id: 'steam',
    name: 'Steam',
    officialDomains: ['steampowered.com', 'steamcommunity.com'],
    keywords: ['steam', 'steamcommunity', 'steampowered'],
    homoglyphs: ['stearncommunity', 'steamcornmunity', 'steampowred', 'st3am']
  },
  {
    id: 'discord',
    name: 'Discord',
    officialDomains: ['discord.com', 'discord.gg', 'discordapp.com'],
    keywords: ['discord', 'discord-nitro', 'discord-gift'],
    homoglyphs: ['d1scord', 'dlscord', 'discrod', 'discord-nltro', 'dlscord-app']
  }
];
