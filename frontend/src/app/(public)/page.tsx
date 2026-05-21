import type { Metadata } from 'next';
import HeroSection         from '@/components/home/HeroSection';
import FeaturedProducts    from '@/components/home/FeaturedProducts';
import TrustSection        from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import IndustriesPreview   from '@/components/home/IndustriesPreview';
import ProcessSection      from '@/components/home/ProcessSection';
import CTASection          from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Craftpack Solution — Premium Paper Bags & Packaging in Ethiopia',
  description: 'Ethiopia\'s leading paper bag and packaging manufacturer based in Addis Ababa. Custom printed bags, eco-friendly packaging, and bulk manufacturing for enterprises, hotels, cafes, and retailers.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <TrustSection />
      <IndustriesPreview />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
