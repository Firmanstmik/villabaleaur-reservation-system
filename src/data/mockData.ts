export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  priceType: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: 'rent' | 'sale' | 'investment';
  image: string;
  featured: boolean;
}

export interface Agent {
  id: string;
  name: string;
  location: string;
  photo: string;
  specialty: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientType: string;
  photo: string;
  review: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  author: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    address: '123 Palm Avenue, Miami, FL',
    price: 1250000,
    priceType: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    status: 'sale',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    title: 'Downtown Penthouse',
    address: '456 Sky Tower, New York, NY',
    price: 8500,
    priceType: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200,
    status: 'rent',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    featured: true,
  },
  {
    id: '3',
    title: 'Beachfront Estate',
    address: '789 Ocean Drive, Malibu, CA',
    price: 3500000,
    priceType: 'sale',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 6800,
    status: 'investment',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    featured: true,
  },
  {
    id: '4',
    title: 'Contemporary Townhouse',
    address: '321 Urban Lane, Austin, TX',
    price: 4200,
    priceType: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    status: 'rent',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    featured: true,
  },
  {
    id: '5',
    title: 'Hillside Retreat',
    address: '555 Mountain View, Denver, CO',
    price: 890000,
    priceType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    status: 'sale',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    featured: true,
  },
  {
    id: '6',
    title: 'Urban Loft Living',
    address: '888 Arts District, Chicago, IL',
    price: 5500,
    priceType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    status: 'rent',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    featured: true,
  },
  {
    id: '7',
    title: 'Waterfront Condo',
    address: '100 Harbor View, Seattle, WA',
    price: 720000,
    priceType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1900,
    status: 'sale',
    image: 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?w=800&q=80',
    featured: false,
  },
  {
    id: '8',
    title: 'Garden Villa',
    address: '200 Rose Lane, Phoenix, AZ',
    price: 650000,
    priceType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    status: 'investment',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    featured: false,
  },
];

export const agents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'Miami, FL',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    specialty: 'Luxury Homes',
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'New York, NY',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialty: 'Commercial Properties',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    location: 'Los Angeles, CA',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    specialty: 'Beachfront Properties',
  },
  {
    id: '4',
    name: 'David Williams',
    location: 'Austin, TX',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    specialty: 'Investment Properties',
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    location: 'Denver, CO',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    specialty: 'Mountain Retreats',
  },
  {
    id: '6',
    name: 'Robert Kim',
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    specialty: 'Urban Living',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Jennifer Adams',
    clientType: 'Home Buyer',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    review: 'UKON Estate made our dream home a reality! Their team was professional, patient, and truly understood what we were looking for. Highly recommend!',
    rating: 5,
  },
  {
    id: '2',
    clientName: 'Marcus Thompson',
    clientType: 'Property Investor',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    review: 'As an investor, I need a team that understands the market. UKON Estate delivered exceptional ROI on all my investments. They are the best in the business!',
    rating: 5,
  },
  {
    id: '3',
    clientName: 'Amanda Foster',
    clientType: 'Home Seller',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    review: 'Sold my property above asking price in just 2 weeks! The marketing and negotiation skills of the UKON team are unmatched.',
    rating: 5,
  },
  {
    id: '4',
    clientName: 'Robert Chen',
    clientType: 'Rental Client',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    review: 'Found the perfect rental apartment through UKON Estate. The process was smooth and the team was incredibly helpful throughout.',
    rating: 5,
  },
];

export const services: Service[] = [
  {
    id: '1',
    title: 'Property Sales',
    description: 'Expert guidance through the entire sales process, from listing to closing. We maximize your property value with strategic marketing.',
    icon: 'Home',
  },
  {
    id: '2',
    title: 'Buyer Representation',
    description: 'Dedicated support for finding your perfect home. We negotiate the best deals and ensure a smooth buying experience.',
    icon: 'Users',
  },
  {
    id: '3',
    title: 'Rental Management',
    description: 'Comprehensive rental services for landlords and tenants. From screening to maintenance, we handle it all.',
    icon: 'Key',
  },
  {
    id: '4',
    title: 'Investment Consulting',
    description: 'Strategic advice for real estate investments. We identify opportunities that deliver strong returns.',
    icon: 'TrendingUp',
  },
  {
    id: '5',
    title: 'Property Valuation',
    description: 'Accurate market valuations backed by data and local expertise. Know the true worth of your property.',
    icon: 'BarChart',
  },
  {
    id: '6',
    title: 'Tailored Solutions',
    description: 'Customized real estate solutions for unique needs. Whether relocating or downsizing, we adapt to you.',
    icon: 'Settings',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Tips for First-Time Home Buyers',
    excerpt: 'Navigate the home buying process with confidence using these essential tips from our experts.',
    category: 'Buying',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    date: '2024-01-15',
    author: 'Sarah Johnson',
  },
  {
    id: '2',
    title: 'Real Estate Market Trends 2024',
    excerpt: 'Stay ahead of the curve with our comprehensive analysis of this years real estate market.',
    category: 'Market',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
    date: '2024-01-10',
    author: 'Michael Chen',
  },
  {
    id: '3',
    title: 'Maximizing Your Rental Income',
    excerpt: 'Learn strategies to increase your rental property profits while keeping tenants happy.',
    category: 'Investing',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    date: '2024-01-05',
    author: 'David Williams',
  },
  {
    id: '4',
    title: 'Home Staging Secrets',
    excerpt: 'Transform your property to sell faster and for more money with professional staging tips.',
    category: 'Selling',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    date: '2024-01-01',
    author: 'Emily Rodriguez',
  },
];

export const stats = {
  projects: 200,
  clients: 70,
  value: 10,
};

export const whatsappNumber = '+1234567890';
