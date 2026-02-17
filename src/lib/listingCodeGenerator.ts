/**
 * Property Type to code mapping
 */
const PROPERTY_TYPE_MAP: Record<string, string> = {
  House: 'H',
  Villa: 'V',
  Apartment: 'A',
  Land: 'L',
  Commercial: 'C',
  Townhouse: 'T',
  Penthouse: 'P',
};

/**
 * Transaction type to code mapping
 */
const TRANSACTION_TYPE_MAP: Record<string, string> = {
  sale: 'S',
  rent: 'R',
};

/**
 * Generate a random 3-character alphanumeric ID
 * Excludes ambiguous characters: O, 0, I, 1
 * Uses: A-Z and 2-9
 */
function generateRandomId(): string {
  const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }
  return result;
}

/**
 * Generate structured listing code
 * Format: CC-TXPTXXX
 * - CC: ISO 3166-1 alpha-2 country code
 * - TX: Transaction type (S for Sale, R for Rent)
 * - PT: Property type (H, V, A, L, C, T, P)
 * - XXX: 3 character random ID
 */
export function generateListingCode(
  countryCode: string,
  priceType: string,
  propertyType: string
): string | null {
  // Require all three parameters
  if (!countryCode || !priceType || !propertyType) {
    return null;
  }

  const transactionCode = TRANSACTION_TYPE_MAP[priceType];
  const propertyCode = PROPERTY_TYPE_MAP[propertyType];

  if (!transactionCode || !propertyCode) {
    return null;
  }

  const randomId = generateRandomId();
  return `${countryCode.toUpperCase()}-${transactionCode}${propertyCode}${randomId}`;
}
