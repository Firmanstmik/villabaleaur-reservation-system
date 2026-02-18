/**
 * Chart data registry for blog articles.
 * All data is indicative and illustrative, compiled from publicly available market reports.
 * Chart IDs are referenced from blogData.ts section chartId fields.
 */

// ─── Blog 1: Capital Rotation ───────────────────────────────────────────────

export const yieldTrendsData = [
  { year: '2018', netherlands: 4.1, portugal: 5.8, bali: 10.2 },
  { year: '2019', netherlands: 3.8, portugal: 5.5, bali: 10.5 },
  { year: '2020', netherlands: 3.5, portugal: 5.1, bali: 7.8 },
  { year: '2021', netherlands: 3.2, portugal: 4.8, bali: 8.6 },
  { year: '2022', netherlands: 3.0, portugal: 4.5, bali: 9.4 },
  { year: '2023', netherlands: 2.9, portugal: 4.3, bali: 10.1 },
  { year: '2024', netherlands: 3.1, portugal: 4.4, bali: 10.8 },
  { year: '2025', netherlands: 3.0, portugal: 4.6, bali: 11.0 },
  { year: '2026', netherlands: 2.9, portugal: 4.5, bali: 10.6 },
];

export const yieldComparisonData = [
  { market: 'Netherlands', grossYield: 3.2, netYield: 2.4 },
  { market: 'Portugal', grossYield: 5.1, netYield: 3.8 },
  { market: 'Bali', grossYield: 10.2, netYield: 6.1 },
  { market: 'Lombok', grossYield: 11.8, netYield: 7.0 },
];

// ─── Blog 2: Indonesia Villa Investment ─────────────────────────────────────

export const leaseholdTermsData = [
  { region: 'Seminyak', minYears: 20, maxYears: 30 },
  { region: 'Canggu', minYears: 25, maxYears: 30 },
  { region: 'Uluwatu', minYears: 25, maxYears: 30 },
  { region: 'Ubud', minYears: 20, maxYears: 25 },
  { region: 'Lombok South', minYears: 25, maxYears: 30 },
  { region: 'Gili Islands', minYears: 20, maxYears: 25 },
];

export const baliPriceGrowthData = [
  { year: '2019', priceIndex: 100 },
  { year: '2020', priceIndex: 92 },
  { year: '2021', priceIndex: 98 },
  { year: '2022', priceIndex: 118 },
  { year: '2023', priceIndex: 138 },
  { year: '2024', priceIndex: 156 },
  { year: '2025', priceIndex: 172 },
  { year: '2026', priceIndex: 183 },
];

export const indonesiaYieldBandsData = [
  { location: 'Seminyak', low: 7.0, mid: 9.5, high: 12.0 },
  { location: 'Canggu', low: 8.0, mid: 10.5, high: 13.0 },
  { location: 'Uluwatu', low: 7.5, mid: 9.0, high: 11.5 },
  { location: 'Ubud', low: 5.5, mid: 7.0, high: 9.0 },
  { location: 'Lombok', low: 9.0, mid: 11.5, high: 14.0 },
];

export const infrastructureTimelineData = [
  {
    year: '2019',
    label: 'Lombok International Airport expansion commenced',
    status: 'completed' as const,
  },
  {
    year: '2021',
    label: 'Mandalika SEZ and street circuit completed',
    status: 'completed' as const,
    detail: 'First MotoGP event hosted, establishing international tourism profile.',
  },
  {
    year: '2023',
    label: 'Southern Lombok coastal road network expanded',
    status: 'completed' as const,
    detail: 'Connecting Kuta, Selong Belanak, and Gerupuk corridors.',
  },
  {
    year: '2024',
    label: 'Bali southern bypass road improvements',
    status: 'completed' as const,
  },
  {
    year: '2025',
    label: 'Lombok resort zone water and digital infrastructure',
    status: 'in-progress' as const,
    detail: 'Fibre broadband and desalination facilities under construction.',
  },
  {
    year: '2026–28',
    label: 'North Bali tourism corridor development',
    status: 'planned' as const,
    detail: 'Government-designated priority zone for tourism redistribution.',
  },
];

// ─── Blog 3: Seller Representation NL ───────────────────────────────────────

export const priceVsListingData = [
  { year: '2020', listingIndex: 100, saleIndex: 101.2 },
  { year: '2021', listingIndex: 100, saleIndex: 106.8 },
  { year: '2022', listingIndex: 100, saleIndex: 104.3 },
  { year: '2023', listingIndex: 100, saleIndex: 99.2 },
  { year: '2024', listingIndex: 100, saleIndex: 100.8 },
  { year: '2025', listingIndex: 100, saleIndex: 101.5 },
  { year: '2026', listingIndex: 100, saleIndex: 102.1 },
];

export const buyerCompositionData = [
  { segment: 'Amsterdam', domestic: 68, international: 32 },
  { segment: 'The Hague', domestic: 74, international: 26 },
  { segment: 'Rotterdam', domestic: 82, international: 18 },
  { segment: 'Eindhoven', domestic: 79, international: 21 },
  { segment: 'Utrecht', domestic: 86, international: 14 },
];

export const daysOnMarketData = [
  { strategy: 'Below market', daysOnMarket: 18, achievedPremium: 3.2 },
  { strategy: 'At market', daysOnMarket: 28, achievedPremium: 1.1 },
  { strategy: 'Above 3%', daysOnMarket: 52, achievedPremium: -1.4 },
  { strategy: 'Above 5%', daysOnMarket: 78, achievedPremium: -3.1 },
  { strategy: 'Above 8%+', daysOnMarket: 112, achievedPremium: -5.2 },
];
