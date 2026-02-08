import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Property } from '@/data/mockData';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const statusColors = {
  rent: 'bg-white/90 text-foreground',
  sale: 'bg-white/90 text-foreground',
  investment: 'bg-white/90 text-foreground',
};

const statusLabels = {
  rent: 'For Rent',
  sale: 'For Sell',
  investment: 'For Investment',
};

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge - Top Right */}
        <div
          className={`absolute top-4 right-4 ${statusColors[property.status]} px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm`}
        >
          {statusLabels[property.status]}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin size={14} className="text-ukon-red" />
          <span className="text-sm">{property.address.split(',').slice(-2).join(',').trim()}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground">
          {property.title}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/>
              <path d="M21 7H3l2-4h14l2 4Z"/>
              <path d="M7 11h4"/>
            </svg>
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/>
              <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/>
            </svg>
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
            </svg>
            <span>{property.sqft.toLocaleString()} sq.ft</span>
          </div>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-foreground pt-1">
          {formatPrice(property.price)}
        </p>
      </div>
    </motion.div>
  );
}
