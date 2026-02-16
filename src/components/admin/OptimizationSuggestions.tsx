import { Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetTab: string;
  action: () => void;
}

interface OptimizationSuggestionsProps {
  suggestions: OptimizationSuggestion[];
}

const priorityConfig = {
  high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-100 text-red-700' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700' },
};

export function OptimizationSuggestions({ suggestions }: OptimizationSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-border p-8 text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="text-emerald-600" size={24} />
        </div>
        <h3 className="text-sm font-black text-[#0e2e50] mb-2">Fully Optimized</h3>
        <p className="text-xs text-muted-foreground">
          Your listing is in great shape. No optimization suggestions at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <Lightbulb className="text-amber-500" size={20} />
        <h3 className="text-sm font-black text-[#0e2e50] uppercase tracking-wider">
          Optimization Suggestions
        </h3>
        <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
          {suggestions.length} {suggestions.length === 1 ? 'tip' : 'tips'}
        </span>
      </div>

      {/* Suggestions List */}
      <div className="divide-y divide-border">
        {suggestions.slice(0, 4).map((suggestion) => {
          const config = priorityConfig[suggestion.priority];
          return (
            <div key={suggestion.id} className={`p-4 ${config.bg} border-l-4 ${config.border} flex items-start justify-between gap-4 hover:bg-opacity-50 transition-colors`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold text-sm ${config.text}`}>{suggestion.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.badge} uppercase tracking-wider`}>
                    {suggestion.priority}
                  </span>
                </div>
                <p className={`text-xs ${config.text} opacity-75`}>{suggestion.description}</p>
              </div>
              <Button
                onClick={suggestion.action}
                variant="ghost"
                size="sm"
                className={`flex-shrink-0 ${config.text} hover:opacity-80 transition-opacity`}
              >
                <span className="text-xs font-bold">Fix</span>
                <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          );
        })}
      </div>

      {suggestions.length > 4 && (
        <div className="p-4 text-center border-t border-border">
          <p className="text-xs text-muted-foreground font-medium">
            Showing 4 of {suggestions.length} suggestions
          </p>
        </div>
      )}
    </div>
  );
}
