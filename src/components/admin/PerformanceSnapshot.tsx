import { Eye, BookmarkIcon, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

interface PerformanceSnapshotProps {
  status: 'draft' | 'active' | 'under_offer' | 'sold' | 'archived';
  daysOnMarket?: number;
  views?: number;
  saves?: number;
  inquiries?: number;
  lastUpdated?: string;
  performanceScore: number;
}

export function PerformanceSnapshot({
  status,
  daysOnMarket = 0,
  views = 0,
  saves = 0,
  inquiries = 0,
  lastUpdated,
  performanceScore,
}: PerformanceSnapshotProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'Just now';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const metrics = [
    { icon: Eye, label: 'Views', value: views, color: 'text-blue-600' },
    { icon: BookmarkIcon, label: 'Saves', value: saves, color: 'text-red-600' },
    { icon: MessageSquare, label: 'Inquiries', value: inquiries, color: 'text-emerald-600' },
  ];

  return (
    <div className="bg-white rounded-[2rem] border border-border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0e2e50]/40">
          Listing Performance
        </h3>
        {status === 'active' && daysOnMarket !== undefined && (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Calendar size={14} />
            <span>{daysOnMarket} days on market</span>
          </div>
        )}
      </div>

      {/* Performance Score */}
      <div className="p-4 bg-gradient-to-br from-[#0e2e50]/5 to-emerald-50 rounded-xl border border-emerald-200/30">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Overall Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-600">{performanceScore}</span>
              <span className="text-sm font-bold text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-border">
            <TrendingUp className="text-emerald-600" size={28} />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-3 bg-secondary/30 rounded-xl text-center">
              <Icon className={`${metric.color} mx-auto mb-2`} size={20} />
              <p className="text-2xl font-black text-[#0e2e50]">{metric.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Last Updated - Subtle Auto-save Indicator */}
      <div className="pt-4 border-t border-border text-[10px] text-muted-foreground/60 font-medium">
        <p>• Auto-saved {formatDate(lastUpdated)}</p>
      </div>

      {/* Executive Insights */}
      {performanceScore >= 75 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-xs font-semibold text-emerald-900">
            Elite profile. Listing positioned for strong market attention.
          </p>
        </div>
      )}
      {performanceScore >= 50 && performanceScore < 75 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs font-semibold text-blue-900">
            Standard profile. Targeted improvements can increase inquiry rate.
          </p>
        </div>
      )}
      {performanceScore < 50 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-semibold text-amber-900">
            Optimization available. Review suggestions for performance uplift.
          </p>
        </div>
      )}
    </div>
  );
}
