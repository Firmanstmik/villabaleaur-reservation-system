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
  images: string[];
  featured: boolean;
  type: string;
  listingCode?: string;
  ownership?: string;
  yearBuilt?: string;
  surfaceArea?: string;
  buildingArea?: string;
  description?: string;
  features: Record<string, string>;
  nearbyAmenities?: {
    name: string;
    distance: string;
    type: 'school' | 'hospital' | 'shopping' | 'transport' | 'airport' | 'park';
  }[];
  isUkonAgent: boolean;
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
    sqft: 450,
    status: 'sale',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    ],
    featured: true,
    type: 'Villa',
    listingCode: 'LV-MIA-001',
    ownership: 'Freehold',
    yearBuilt: '2022',
    surfaceArea: '500 m2',
    buildingArea: '450 m2',
    features: {
      'Condition': 'New',
      'View': 'Garden',
      'Distance to Beach': '5 mins',
      'Pool': 'Private 12m',
      'Garden': 'Landscaped',
      'Kitchen': 'Fully Equipped',
    },
    nearbyAmenities: [
      { name: 'Miami International School', distance: '800m', type: 'school' },
      { name: 'Coconut Grove Hospital', distance: '1.2km', type: 'hospital' },
      { name: 'The Fresh Market', distance: '400m', type: 'shopping' },
      { name: 'Metrobus Station', distance: '200m', type: 'transport' },
    ],
    isUkonAgent: true,
  },
  {
    id: '2',
    title: 'Downtown Penthouse',
    address: '456 Sky Tower, New York, NY',
    price: 8500,
    priceType: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 220,
    status: 'rent',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    ],
    featured: true,
    type: 'Penthouse',
    listingCode: 'PH-NYC-002',
    ownership: 'Leasehold',
    yearBuilt: '2020',
    surfaceArea: '220 m2',
    buildingArea: '220 m2',
    features: {
      'Floor': '42nd',
      'View': 'City Skyline',
      'Gym': 'In-building',
      'Security': '24/7 Doorman',
      'Terrace': 'Private',
      'Distance to Park': '2 mins',
    },
    nearbyAmenities: [
      { name: 'PS 158 Manhattan', distance: '500m', type: 'school' },
      { name: 'Lenox Hill Hospital', distance: '1.5km', type: 'hospital' },
      { name: 'Bloomingdale\'s', distance: '900m', type: 'shopping' },
      { name: '59th St Subway Station', distance: '300m', type: 'transport' },
    ],
    isUkonAgent: false,
  },
  {
    id: '3',
    title: 'Beachfront Estate',
    address: '789 Ocean Drive, Malibu, CA',
    price: 3500000,
    priceType: 'sale',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 680,
    status: 'investment',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    ],
    featured: true,
    type: 'Villa',
    listingCode: 'BE-MAL-003',
    ownership: 'Freehold',
    yearBuilt: '2019',
    surfaceArea: '1000 m2',
    buildingArea: '680 m2',
    features: {
      'Beach Access': 'Direct',
      'ROI': 'Up to 12%',
      'Status': 'Operational',
      'Management': 'In-house',
      'Guest Facilities': 'Sauna, Gym',
      'Furniture': 'Included',
    },
    nearbyAmenities: [
      { name: 'Malibu Elementary School', distance: '2.5km', type: 'school' },
      { name: 'St. John\'s Health Center', distance: '8km', type: 'hospital' },
      { name: 'Malibu Village', distance: '3.2km', type: 'shopping' },
      { name: 'Pacific Coast Hwy Bus Stop', distance: '150m', type: 'transport' },
    ],
    isUkonAgent: true,
  },
  {
    id: '4',
    title: 'Contemporary Townhouse',
    address: '321 Urban Lane, Austin, TX',
    price: 4200,
    priceType: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 280,
    status: 'rent',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80',
    ],
    featured: true,
    type: 'Townhouse',
    listingCode: 'TH-AUS-004',
    ownership: 'Freehold',
    yearBuilt: '2021',
    surfaceArea: '300 m2',
    buildingArea: '280 m2',
    features: {
      'Parking': '2 Cars',
      'Smart Home': 'Yes',
      'Patio': 'Yes',
      'Distance to Downtown': '10 mins',
      'Pet Friendly': 'Yes',
      'Utilities': 'Low Energy',
    },
    nearbyAmenities: [
      { name: 'Austin High School', distance: '1.8km', type: 'school' },
      { name: 'St. David\'s Medical Center', distance: '3.5km', type: 'hospital' },
      { name: 'Whole Foods Market', distance: '1.1km', type: 'shopping' },
      { name: 'CapMetro Bus Stop', distance: '250m', type: 'transport' },
    ],
    isUkonAgent: false,
  },
];

export const agents: Agent[] = [
  { id: '1', name: 'Gino Beelt', location: 'Miami, FL', photo: '', specialty: 'Luxury Homes' },
  { id: '2', name: 'Pak Kumis', location: 'New York, NY', photo: '', specialty: 'Commercial Properties' },
  { id: '3', name: 'Paul Wennink', location: 'Los Angeles, CA', photo: '', specialty: 'Beachfront Properties' },
  { id: '4', name: 'Raffy Ukon', location: 'Austin, TX', photo: '', specialty: 'Investment Properties' },
  { id: '5', name: 'Roselynn Chai', location: 'Denver, CO', photo: '', specialty: 'Mountain Retreats' },
  { id: '6', name: 'Marco Loureiro', location: 'Chicago, IL', photo: '', specialty: 'Urban Living' },
  { id: '7', name: 'Jeroen Egbers', location: 'San Francisco, CA', photo: '', specialty: 'Tech Hub Living' },
  { id: '8', name: 'Hendrik Ukon', location: 'Barcelona, Spain', photo: '', specialty: 'Historic Villas' },
  { id: '9', name: 'Afifah Ukon', location: 'London, UK', photo: '', specialty: 'Modern Apartments' },
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

export const whatsappNumber = '+31853331000';
export const whatsappUrl = 'https://wa.me/31853331000?text=Hello%2C%20I%E2%80%99m%20interested%20in%20a%20property%20on%20your%20website.%20Could%20you%20please%20share%20more%20details%20about%3A';
