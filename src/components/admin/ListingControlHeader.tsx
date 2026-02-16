import { useState } from 'react';
import { MoreVertical, MapPin, DollarSign, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface ListingControlHeaderProps {
  title: string;
  price: number | string;
  address: string;
  status: 'draft' | 'active' | 'under_offer' | 'sold' | 'archived';
  coverImage?: string;
  listingCode?: string;
  listingId?: string;
  performanceScore: number;
  daysOnMarket?: number;
  views?: number;
  onStatusChange?: (newStatus: string) => void;
  onPriceUpdate?: (newPrice: number) => void;
}

const statusColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
  draft: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', label: 'Draft' },
  active: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800 font-black', label: 'Active' },
  under_offer: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: 'Under Offer' },
  sold: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700', label: 'Sold' },
  archived: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600', label: 'Archived' },
};

const performanceTiers: Record<number, { color: string; label: string; barColor: string; insight: string }> = {
  0: { color: 'text-red-600', label: 'Low Tier', barColor: 'bg-red-500', insight: 'Below market benchmark.' },
  1: { color: 'text-amber-600', label: 'Standard Tier', barColor: 'bg-amber-500', insight: 'Slightly above area average visibility.' },
  2: { color: 'text-blue-600', label: 'Strong Tier', barColor: 'bg-blue-500', insight: 'Strong market positioning detected.' },
  3: { color: 'text-emerald-600', label: 'Elite Tier', barColor: 'bg-emerald-600', insight: 'Exceptional performance profile.' },
};

export function ListingControlHeader({
  title,
  price,
  address,
  status,
  coverImage,
  listingCode,
  listingId,
  performanceScore,
  daysOnMarket = 0,
  views = 0,
  onStatusChange,
  onPriceUpdate,
}: ListingControlHeaderProps) {
  const { language } = useLanguage();
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [newPrice, setNewPrice] = useState<string>(price.toString());

  const statusConfig = statusColors[status] || statusColors.draft;
  const scoreTier = Math.floor((performanceScore / 100) * 3);
  const scoreTierConfig = performanceTiers[scoreTier];

  const handleStatusChange = async (newStatus: string) => {
    onStatusChange?.(newStatus);
    toast.success(`Listing marked as ${statusColors[newStatus as keyof typeof statusColors]?.label}`);
  };

  const handlePriceUpdate = () => {
    const priceNum = parseFloat(newPrice);
    if (!isNaN(priceNum) && priceNum > 0) {
      onPriceUpdate?.(priceNum);
      setShowPriceEdit(false);
      toast.success('Price updated');
    } else {
      toast.error('Invalid price');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-border shadow-sm mb-6">
      {/* Hero Preview Strip */}
      <div className="relative h-40 bg-[#0e2e50]/5 overflow-hidden flex items-center justify-center">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0e2e50]/10 to-[#0e2e50]/5 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm font-medium">No cover image</p>
            </div>
          </div>
        )}
        {/* Stronger overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-end justify-end p-6">
          <div className="text-white w-full">
            {/* Title */}
            <h2 className="text-2xl font-black mb-3">{title}</h2>

            {/* Location and Price Row */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin size={16} />
                  <span>{address}</span>
                </div>

                {/* Micro-line of live data */}
                <div className="flex items-center gap-3 text-xs font-medium opacity-90">
                  <span className="capitalize">{status === 'draft' ? 'Draft' : 'Active'}</span>
                  <span>•</span>
                  <span>{daysOnMarket} days on market</span>
                  <span>•</span>
                  <span>{views} views</span>
                </div>
              </div>

              {/* Price (right-aligned) */}
              <div className="flex items-center gap-2 text-xl font-black">
                <DollarSign size={20} />
                <span>{typeof price === 'number' ? price.toLocaleString() : price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-6 border-t border-border flex items-center justify-between gap-8">
        <div className="flex items-center gap-8 flex-1">
          {/* Status Badge - Authoritative Style */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-5 py-2 rounded-lg text-sm font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1.5`}
                >
                  {statusConfig.label}
                  <ChevronDown size={12} className="opacity-40" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  Change Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(statusColors).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleStatusChange(key)}
                    className="cursor-pointer"
                  >
                    <span className={`${value.bg} ${value.border} border ${value.text} px-2 py-1 rounded text-xs font-medium`}>
                      {value.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Performance Score - Enhanced */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col gap-1.5 cursor-help">
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">Performance</span>
                  <div className="flex items-baseline gap-2">
                    <div className={`text-2xl font-black ${scoreTierConfig.color}`}>
                      {performanceScore}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">/100</div>
                  </div>
                  {/* Tier label and insight */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {scoreTierConfig.label}
                    </div>
                    {/* Progress bar */}
                    <div className="w-32 h-px bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${scoreTierConfig.barColor} transition-all duration-300`}
                        style={{ width: `${performanceScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {scoreTierConfig.insight}
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-48">
                <div className="space-y-2 text-xs">
                  <div className="font-semibold">Performance Factors</div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Visual Completeness</p>
                    <p>• Pricing Position</p>
                    <p>• Feature Depth</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right Side: Listing Code, View Live & Quick Actions */}
        <div className="flex items-center gap-6 ml-auto">
          {listingCode && (
            <div className="text-right">
              <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-1">
                Listing Code
              </div>
              <div className="font-mono font-medium text-[#0e2e50]/50">{listingCode}</div>
            </div>
          )}

          {/* View Live Button */}
          {listingId && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (status !== 'draft') {
                        window.open(`/${language}/properties/${listingId}`, '_blank');
                      }
                    }}
                    disabled={status === 'draft'}
                    variant={status === 'draft' ? 'outline' : 'ghost'}
                    size="sm"
                    className="gap-2 rounded-lg"
                  >
                    View Live
                    <ExternalLink size={14} />
                  </Button>
                </TooltipTrigger>
                {status === 'draft' && (
                  <TooltipContent side="bottom" className="text-xs">
                    Listing not yet published.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Quick Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <MoreVertical size={18} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Quick Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowPriceEdit(true)}
                className="cursor-pointer flex items-center gap-2"
              >
                <DollarSign size={16} />
                <span className="text-sm">Update Price</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange('under_offer')}
                className="cursor-pointer flex items-center gap-2"
              >
                <span className="text-sm">Mark as Under Offer</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('sold')}
                className="cursor-pointer flex items-center gap-2"
              >
                <span className="text-sm">Mark as Sold</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange('archived')}
                className="cursor-pointer flex items-center gap-2 text-amber-600"
              >
                <span className="text-sm">Archive Listing</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Price Edit Modal */}
      {showPriceEdit && (
        <div className="p-6 border-t border-border bg-secondary/30 flex items-center gap-4">
          <span className="text-sm font-bold text-[#0e2e50]">Update Price:</span>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0e2e50] size-5" />
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full pl-10 h-12 rounded-xl border border-border bg-white font-bold text-[#0e2e50] focus:outline-none focus:ring-2 focus:ring-[#0e2e50]/20"
              />
            </div>
            <Button
              onClick={handlePriceUpdate}
              className="bg-[#0e2e50] text-white rounded-xl px-6"
            >
              Update
            </Button>
            <Button
              onClick={() => setShowPriceEdit(false)}
              variant="outline"
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
