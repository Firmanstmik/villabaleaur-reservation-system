export interface FilterState {
  transactionType: 'all' | 'sale' | 'rent';
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: 'any' | '1' | '2' | '3' | '4';
  propertyType: 'all' | 'Villa' | 'Apartment' | 'Penthouse' | 'Commercial' | 'Land';
  bathrooms: 'any' | '1' | '2' | '3' | '4';
  minSize: string;
  maxSize: string;
  lifestyle: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  transactionType: 'all',
  location: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'any',
  propertyType: 'all',
  bathrooms: 'any',
  minSize: '',
  maxSize: '',
  lifestyle: [],
};

export const LIFESTYLE_TAGS = [
  'Waterfront',
  'Beachfront',
  'City Center',
  'Gated',
  'Pool',
  'Garden',
] as const;

export const PROPERTY_TYPES = [
  'all',
  'Villa',
  'Apartment',
  'Penthouse',
  'Commercial',
  'Land',
] as const;

export const BEDROOM_OPTIONS = ['any', '1', '2', '3', '4'] as const;
export const BATHROOM_OPTIONS = ['any', '1', '2', '3', '4'] as const;
