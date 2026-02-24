/**
 * NearbyAmenities Display Component
 * Shows nearby points of interest on property detail page
 */

import { NearbyPOI, POI_CATEGORIES } from '@/types/poi';
import { Info } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface NearbyAmenitiesProps {
  amenities: NearbyPOI[] | undefined;
  showEmpty?: boolean;
}

const NearbyAmenities = ({
  amenities,
  showEmpty = true,
}: NearbyAmenitiesProps) => {
  // Handle empty state
  if (!amenities || amenities.length === 0) {
    if (!showEmpty) return null;

    return (
      <div className="text-center py-8 bg-secondary/5 rounded-xl border-2 border-dashed border-border">
        <Info size={32} className="mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground font-medium">
          No nearby amenities data available
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          This may be a rural or remote area
        </p>
      </div>
    );
  }

  // Group amenities by category
  const amenitiesByCategory: Record<string, NearbyPOI[]> = {};
  amenities.forEach((amenity) => {
    if (!amenitiesByCategory[amenity.category]) {
      amenitiesByCategory[amenity.category] = [];
    }
    amenitiesByCategory[amenity.category].push(amenity);
  });

  // Sort by category priority
  const sortedCategories = Object.entries(amenitiesByCategory)
    .map(([category, items]) => ({
      category,
      config: POI_CATEGORIES[category as keyof typeof POI_CATEGORIES],
      items: items.sort((a, b) => a.distance_meters - b.distance_meters),
    }))
    .sort((a, b) => (a.config?.priority || 999) - (b.config?.priority || 999))
    .filter((item) => item.config); // Filter out unknown categories

  // Expand top 2 categories by default (highest priority)
  const defaultExpanded = sortedCategories.slice(0, 2).map((c) => c.category);

  return (
    <div>
      <Accordion type="multiple" defaultValue={defaultExpanded}>
        {sortedCategories.map(({ category, config, items }) => (
          <AccordionItem key={category} value={category} className="border-none">
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="flex items-center gap-2 text-sm font-bold text-[#0e2e50]">
                <span className="text-base">{config.icon}</span>
                {config.label}
                <span className="text-[11px] font-semibold text-muted-foreground bg-secondary/20 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((amenity, idx) => (
                  <div
                    key={`${category}-${idx}`}
                    className="flex items-center justify-between p-3 bg-secondary/10 rounded-xl border border-border/50 hover:border-border hover:bg-secondary/20 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                        {config.icon}
                      </div>
                      <p className="font-semibold text-sm text-[#0e2e50] truncate min-w-0">
                        {amenity.name}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-[#0e2e50]/5 text-[#0e2e50] rounded-lg whitespace-nowrap ml-2">
                      {amenity.distance_display}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Metadata */}
      {amenities.some((a) => a.custom) && (
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Includes {amenities.filter((a) => a.custom).length} custom amenity
            {amenities.filter((a) => a.custom).length !== 1 ? 'ies' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyAmenities;
