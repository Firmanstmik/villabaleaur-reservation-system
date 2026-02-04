
# UKON Estate Website Clone

I'll create an exact clone of your Framer website with a dynamic backend and rich animations. Here's the comprehensive plan:

---

## 🎨 Design System
- **Primary accent**: Red (#DC2626) for CTAs and highlights
- **Logo**: Navy blue UKON ESTATE branding
- **Typography**: Clean, modern sans-serif fonts
- **Style**: White backgrounds, rounded corners, card-based layouts
- **Animations**: Scroll-triggered reveals, hover effects, smooth transitions, pulsing elements

---

## 📄 Pages to Build

### 1. Homepage
- **Animated Navigation** - Sticky header with smooth scroll, logo, nav links, and red "Contact Us Now" button with blinking green dot
- **Hero Section** - Full-width luxury property background, animated headline "WHERE DREAMS COME TRUE", fade-in description, animated stats counter (200+ Projects, 70+ Clients, $10M+ Value), floating Google reviews badge with customer avatars
- **Featured Properties** - Animated grid of 6 property cards with hover zoom effects, property tags (For Rent/Sell/Investment), specs with icons
- **Services Section** - 6 animated service cards with icons: Property Sales, Buyer Representation, Rental Management, Investment Consulting, Property Valuation, Tailored Solutions
- **About Section** - Stats with number animation, Vision & Mission cards with slide-in effects, large property showcase image
- **Agents Carousel** - Horizontally scrolling team member cards with photos, names, and locations
- **Testimonials** - Client reviews carousel with star ratings, photos, and slide animations
- **CTA Footer** - "Where Dreams Come True" with WhatsApp contact button

### 2. Properties Page
- Header with animated title
- Filter tabs (All / Rent / Sale) with smooth tab switching
- Search functionality
- Animated property grid with hover effects
- Property cards showing: image, name, address, beds, baths, sqft, price, and status badge

### 3. Services Page
- Hero section with service overview
- Detailed cards for each of the 6 services
- Call-to-action sections

### 4. About Page
- Company story and mission
- Team overview with stats
- Vision and values sections

### 5. Agents Page
- Full team directory
- Individual agent cards with photos, locations, and specialties
- Link to contact each agent

### 6. Blog Page
- Blog listing with preview cards
- Search and category filtering

---

## ⚡ Animations & Interactions

- **Scroll-triggered animations**: Elements fade/slide in as user scrolls
- **Hover effects**: Cards lift with shadow, images zoom, buttons glow
- **Blinking green dot**: Pulsing animation on Contact Us button
- **Number counters**: Stats animate from 0 to final value
- **Carousel animations**: Smooth sliding for agents and testimonials
- **Page transitions**: Smooth fade between routes
- **Parallax effects**: Subtle depth on hero background

---

## 🗄️ Backend (Lovable Cloud + Supabase)

### Database Tables
- **Properties**: id, title, address, price, bedrooms, bathrooms, sqft, status (rent/sale/investment), images, description, featured
- **Agents**: id, name, location, photo, specialty, contact info
- **Testimonials**: id, client name, photo, review text, rating, client type
- **Blog Posts**: id, title, content, featured image, category, published date

### Features
- Admin-ready structure for future property management
- Image storage for property photos
- Dynamic data loading with React Query

---

## 📱 Responsive Design
- Desktop-first with full mobile optimization
- Mobile hamburger menu with smooth slide-in
- Responsive property grids (3 cols → 2 cols → 1 col)
- Touch-friendly carousels

---

This will give you a production-ready, modern real estate website that matches your Framer design with even more polish through rich animations!
