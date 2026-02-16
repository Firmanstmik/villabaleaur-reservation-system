import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface MarketIntelligenceProps {
  price: number;
  areaM2: number;
  areaPricePerM2: number; // Mock data
  pricePerM2: number; // Calculated from price / areaM2
  isSimulated?: boolean;
}

export function MarketIntelligence({
  price,
  areaM2,
  areaPricePerM2,
  pricePerM2,
  isSimulated = true,
}: MarketIntelligenceProps) {
  const pricePosition = pricePerM2 > areaPricePerM2 ? 'above' : pricePerM2 < areaPricePerM2 ? 'below' : 'in line';
  const priceDifference = Math.abs(pricePerM2 - areaPricePerM2);
  const priceDifferencePercent = ((priceDifference / areaPricePerM2) * 100).toFixed(1);

  const positionConfig = {
    above: {
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: 'Above Market',
      description: `Your price per m² is ${priceDifferencePercent}% above the area average.`,
    },
    below: {
      icon: TrendingDown,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Below Market',
      description: `Your price per m² is ${priceDifferencePercent}% below the area average.`,
    },
    'in line': {
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      label: 'In Line with Market',
      description: 'Your price is competitively positioned.',
    },
  };

  const config = positionConfig[pricePosition];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-[2rem] p-6 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0e2e50]/40">
          Market Position
        </h3>
        {isSimulated && (
          <span className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded text-muted-foreground uppercase tracking-wider">
            Simulation (Beta)
          </span>
        )}
      </div>

      {/* Price Comparison Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Your Price per m² */}
        <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Your Price / m²
          </p>
          <p className={`text-2xl font-black ${config.color}`}>
            ${pricePerM2.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Based on {areaM2} m² ({new Intl.NumberFormat().format(price)} total)
          </p>
        </div>

        {/* Area Average per m² */}
        <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Area Average / m²
          </p>
          <p className="text-2xl font-black text-muted-foreground">
            ${areaPricePerM2.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Based on recent comparable sales
          </p>
        </div>
      </div>

      {/* Position Badge */}
      <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={config.color} size={20} />
          <div>
            <p className={`text-sm font-black ${config.color}`}>{config.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="pt-3 border-t border-white/30 flex items-start gap-2 text-[10px] text-muted-foreground">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <p>
          Market data is simulated for demonstration. Real pricing intelligence will be available with your market integration.
        </p>
      </div>
    </div>
  );
}
