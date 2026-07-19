import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

// Required for static export: tells Next.js which [id] pages to generate
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
