import { apiClient } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BestsellersSection } from '@/components/home/BestsellersSection';
import { FeaturedBundles } from '@/components/home/FeaturedBundles';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { TravelGuides } from '@/components/home/TravelGuides';
import { Category, Product } from '@/types';

async function getHomeData() {
  try {
    const [catRes, prodRes, kitsRes] = await Promise.all([
      apiClient.get('/categories').catch(() => null),
      apiClient.get('/products?limit=8').catch(() => null),
      apiClient.get('/products/kits').catch(() => null),
    ]);

    const categories: Category[] = catRes?.data?.data?.categories || [];
    const products: Product[] = prodRes?.data?.data || [];
    const kits: Product[] = kitsRes?.data?.data?.kits || [];

    return { categories, products, kits };
  } catch (err) {
    return { categories: [], products: [], kits: [] };
  }
}

export default async function HomePage() {
  const { categories, products, kits } = await getHomeData();

  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryGrid categories={categories} />
      <BestsellersSection products={products} />
      {kits.length > 0 && <FeaturedBundles bundles={kits} />}
      <WhyChooseUs />
      <Testimonials />
      <TravelGuides />
    </div>
  );
}

