import { SiteLayout } from '@/components/layout/SiteLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProducts />
      <CollectionsSection />
      <NewsletterSection />
    </SiteLayout>
  );
}
