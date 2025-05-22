import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Luxury perfumes"
          fill
          priority
          className="object-cover brightness-[0.85]"
        />
      </div>
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Experience Luxury<br />One Spray at a Time
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover premium decant perfumes at affordable prices. 
            Try before you commit to full bottles.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90" asChild>
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black" asChild>
              <Link href="/collections/bestsellers">Best Sellers</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 