import type { Metadata } from 'next';
import ContactSection from '@/components/forms/ContactSection';

export const metadata: Metadata = {
  title: 'Contact Us — Craftpack Solution',
  description: 'Get in touch with Craftpack Solution. Located in Addis Ababa, Ethiopia. Available Monday–Saturday 8AM–8PM. 24-hour response guarantee.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <ContactSection />
    </div>
  );
}
