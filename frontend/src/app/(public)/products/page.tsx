import type { Metadata } from 'next';
import ProductCatalog from '@/components/products/ProductCatalog';

export const metadata: Metadata = {
  title: 'Products — Premium Paper Bags & Packaging',
  description: 'Browse our complete range of premium paper bags, eco-friendly packaging, luxury bags, and custom printed solutions for businesses of all sizes.',
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <ProductCatalog />
    </div>
  );
}
