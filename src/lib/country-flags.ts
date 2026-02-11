/**
 * Country flags and information utility
 * Converts ISO country codes to flag emojis and provides country metadata
 */

// Map of ISO country codes to flag emojis
export const COUNTRY_FLAGS: Record<string, string> = {
  // European countries
  NL: '🇳🇱', // Netherlands
  BE: '🇧🇪', // Belgium
  DE: '🇩🇪', // Germany
  FR: '🇫🇷', // France
  GB: '🇬🇧', // United Kingdom
  IT: '🇮🇹', // Italy
  ES: '🇪🇸', // Spain
  PT: '🇵🇹', // Portugal
  CH: '🇨🇭', // Switzerland
  AT: '🇦🇹', // Austria
  PL: '🇵🇱', // Poland
  SE: '🇸🇪', // Sweden
  NO: '🇳🇴', // Norway
  DK: '🇩🇰', // Denmark
  FI: '🇫🇮', // Finland
  CZ: '🇨🇿', // Czech Republic
  HU: '🇭🇺', // Hungary
  RO: '🇷🇴', // Romania
  GR: '🇬🇷', // Greece
  IE: '🇮🇪', // Ireland

  // Asian countries
  ID: '🇮🇩', // Indonesia
  MY: '🇲🇾', // Malaysia
  SG: '🇸🇬', // Singapore
  TH: '🇹🇭', // Thailand
  PH: '🇵🇭', // Philippines
  VN: '🇻🇳', // Vietnam
  JP: '🇯🇵', // Japan
  KR: '🇰🇷', // South Korea
  CN: '🇨🇳', // China
  IN: '🇮🇳', // India

  // Americas
  US: '🇺🇸', // United States
  CA: '🇨🇦', // Canada
  MX: '🇲🇽', // Mexico
  BR: '🇧🇷', // Brazil
  AR: '🇦🇷', // Argentina

  // Other regions
  AU: '🇦🇺', // Australia
  NZ: '🇳🇿', // New Zealand
  ZA: '🇿🇦', // South Africa
};

// Country metadata
export const COUNTRIES: Record<string, { name: string; code: string }> = {
  NL: { name: 'Netherlands', code: 'NL' },
  BE: { name: 'Belgium', code: 'BE' },
  DE: { name: 'Germany', code: 'DE' },
  FR: { name: 'France', code: 'FR' },
  GB: { name: 'United Kingdom', code: 'GB' },
  IT: { name: 'Italy', code: 'IT' },
  ES: { name: 'Spain', code: 'ES' },
  PT: { name: 'Portugal', code: 'PT' },
  CH: { name: 'Switzerland', code: 'CH' },
  AT: { name: 'Austria', code: 'AT' },
  PL: { name: 'Poland', code: 'PL' },
  SE: { name: 'Sweden', code: 'SE' },
  NO: { name: 'Norway', code: 'NO' },
  DK: { name: 'Denmark', code: 'DK' },
  FI: { name: 'Finland', code: 'FI' },
  CZ: { name: 'Czech Republic', code: 'CZ' },
  HU: { name: 'Hungary', code: 'HU' },
  RO: { name: 'Romania', code: 'RO' },
  GR: { name: 'Greece', code: 'GR' },
  IE: { name: 'Ireland', code: 'IE' },
  ID: { name: 'Indonesia', code: 'ID' },
  MY: { name: 'Malaysia', code: 'MY' },
  SG: { name: 'Singapore', code: 'SG' },
  TH: { name: 'Thailand', code: 'TH' },
  PH: { name: 'Philippines', code: 'PH' },
  VN: { name: 'Vietnam', code: 'VN' },
  JP: { name: 'Japan', code: 'JP' },
  KR: { name: 'South Korea', code: 'KR' },
  CN: { name: 'China', code: 'CN' },
  IN: { name: 'India', code: 'IN' },
  US: { name: 'United States', code: 'US' },
  CA: { name: 'Canada', code: 'CA' },
  MX: { name: 'Mexico', code: 'MX' },
  BR: { name: 'Brazil', code: 'BR' },
  AR: { name: 'Argentina', code: 'AR' },
  AU: { name: 'Australia', code: 'AU' },
  NZ: { name: 'New Zealand', code: 'NZ' },
  ZA: { name: 'South Africa', code: 'ZA' },
};

/**
 * Get flag emoji for a country code
 */
export function getCountryFlag(countryCode?: string): string {
  if (!countryCode) return '📍';
  return COUNTRY_FLAGS[countryCode.toUpperCase()] || '📍';
}

/**
 * Get country name for a country code
 */
export function getCountryName(countryCode?: string): string | undefined {
  if (!countryCode) return undefined;
  return COUNTRIES[countryCode.toUpperCase()]?.name;
}

/**
 * Get list of all supported countries
 */
export function getSupportedCountries() {
  return Object.values(COUNTRIES).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
