import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { ServicesSection } from '@/components/home/ServicesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { AgentsCarousel } from '@/components/home/AgentsCarousel';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <ServicesSection />
        <AboutSection />
        <AgentsCarousel />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
