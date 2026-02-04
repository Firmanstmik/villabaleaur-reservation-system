import { motion } from 'framer-motion';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/data/mockData';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const statusColors = {
  rent: 'bg-blue-500',
  sale: 'bg-green-500',
  investment: 'bg-purple-500',
};

const statusLabels = {
  rent: 'For Rent',
  sale: 'For Sale',
  investment: 'Investment',
};

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const formatPrice = (price: number, priceType: 'sale' | 'rent') => {
    if (priceType === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-hover group"
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border">
        {/* Image */}
        <div className="relative aspect-[4/3] image-zoom">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <Badge
            className={`absolute top-4 left-4 ${statusColors[property.status]} text-white border-0`}
          >
            {statusLabels[property.status]}
          </Badge>

          {/* Price Tag */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-lg font-bold text-ukon-navy">
              {formatPrice(property.price, property.priceType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-ukon-red transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin size={16} className="text-ukon-red" />
            <span className="text-sm">{property.address}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bed size={18} />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bath size={18} />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Square size={18} />
              <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
