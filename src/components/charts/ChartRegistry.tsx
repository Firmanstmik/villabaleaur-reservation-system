import { LineChartBlock } from './LineChartBlock';
import { BarChartBlock } from './BarChartBlock';
import { TimelineChartBlock } from './TimelineChartBlock';
import {
  yieldTrendsData,
  yieldComparisonData,
  leaseholdTermsData,
  baliPriceGrowthData,
  indonesiaYieldBandsData,
  infrastructureTimelineData,
  priceVsListingData,
  buyerCompositionData,
  daysOnMarketData,
} from '@/data/chartData';

const NAVY = '#0e2e50';
const SLATE_500 = '#64748b';
const SLATE_300 = '#94a3b8';

/**
 * Chart registry: maps chartId strings to rendered chart components.
 * Referenced from blogData.ts section.chartId fields.
 */
const chartRegistry: Record<string, () => JSX.Element> = {
  // ─── Blog 1: Capital Rotation ─────────────────────────────────

  'yield-trends-2018-2026': () => (
    <LineChartBlock
      title="Prime Residential Gross Yields (2018–2026)"
      description="Indicative gross yield trends across key markets. Data compiled from market reports."
      data={yieldTrendsData}
      xKey="year"
      yAxisSuffix="%"
      lines={[
        { dataKey: 'netherlands', label: 'Netherlands', color: NAVY },
        { dataKey: 'portugal', label: 'Portugal', color: SLATE_500 },
        { dataKey: 'bali', label: 'Bali (villa)', color: SLATE_300 },
      ]}
    />
  ),

  'yield-comparison-bar': () => (
    <BarChartBlock
      title="Gross vs Net Yield by Market (2026 Indicative)"
      description="Comparison of gross and estimated net yields after management costs, taxation, and operational expenses."
      data={yieldComparisonData}
      xKey="market"
      yAxisSuffix="%"
      bars={[
        { dataKey: 'grossYield', label: 'Gross Yield', color: NAVY },
        { dataKey: 'netYield', label: 'Net Yield', color: SLATE_300 },
      ]}
    />
  ),

  // ─── Blog 2: Indonesia Villa Investment ───────────────────────

  'leasehold-terms-bar': () => (
    <BarChartBlock
      title="Typical Leasehold Term Ranges by Region"
      description="Standard initial lease periods offered to foreign investors across key Indonesian markets."
      data={leaseholdTermsData}
      xKey="region"
      yAxisSuffix=" yr"
      bars={[
        { dataKey: 'minYears', label: 'Minimum Term', color: SLATE_300 },
        { dataKey: 'maxYears', label: 'Maximum Term', color: NAVY },
      ]}
    />
  ),

  'bali-price-growth': () => (
    <LineChartBlock
      title="Bali Premium Villa Price Index (2019–2026)"
      description="Indexed to 2019 = 100. Reflects premium corridor land and built villa appreciation."
      data={baliPriceGrowthData}
      xKey="year"
      lines={[
        { dataKey: 'priceIndex', label: 'Price Index', color: NAVY },
      ]}
    />
  ),

  'indonesia-yield-bands': () => (
    <BarChartBlock
      title="Gross Rental Yield Bands by Location"
      description="Indicative annual gross yield ranges for professionally managed villa assets at typical occupancy."
      data={indonesiaYieldBandsData}
      xKey="location"
      yAxisSuffix="%"
      bars={[
        { dataKey: 'low', label: 'Conservative', color: SLATE_300 },
        { dataKey: 'mid', label: 'Typical', color: SLATE_500 },
        { dataKey: 'high', label: 'Optimistic', color: NAVY },
      ]}
    />
  ),

  'infrastructure-timeline': () => (
    <TimelineChartBlock
      title="Indonesia Infrastructure Development Timeline"
      description="Key infrastructure milestones affecting property market dynamics in Bali and Lombok."
      events={infrastructureTimelineData}
    />
  ),

  // ─── Blog 3: Seller Representation NL ─────────────────────────

  'price-vs-listing': () => (
    <LineChartBlock
      title="Sale Price Relative to Listing Price — Randstad Region"
      description="Index where 100 = listing price. Values above 100 indicate overbidding; below 100 indicate negotiation discount."
      data={priceVsListingData}
      xKey="year"
      lines={[
        { dataKey: 'listingIndex', label: 'Listing Price', color: SLATE_300, strokeDasharray: '4 4' },
        { dataKey: 'saleIndex', label: 'Achieved Sale Price', color: NAVY },
      ]}
    />
  ),

  'buyer-composition': () => (
    <BarChartBlock
      title="Buyer Composition: Domestic vs International (%)"
      description="Estimated share of residential transactions by buyer origin in premium market segments."
      data={buyerCompositionData}
      xKey="segment"
      yAxisSuffix="%"
      bars={[
        { dataKey: 'domestic', label: 'Domestic Buyers', color: NAVY },
        { dataKey: 'international', label: 'International Buyers', color: SLATE_300 },
      ]}
    />
  ),

  'days-on-market': () => (
    <BarChartBlock
      title="Pricing Strategy Impact: Days on Market & Price Premium"
      description="Relationship between initial pricing strategy relative to market value, time to transaction, and achieved premium/discount."
      data={daysOnMarketData}
      xKey="strategy"
      bars={[
        { dataKey: 'daysOnMarket', label: 'Days on Market', color: NAVY },
      ]}
    />
  ),
};

export function renderChart(chartId: string): JSX.Element | null {
  const factory = chartRegistry[chartId];
  return factory ? factory() : null;
}
