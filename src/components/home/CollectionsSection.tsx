import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const collections = [
  {
    id: 'designer',
    title: 'Designer',
    description: 'Popular luxury brand fragrances',
    image: 'https://images.unsplash.com/photo-1592914610354-fd354ea45e48?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    link: '/collections/designer'
  },
  {
    id: 'niche',
    title: 'Niche',
    description: 'Exclusive artisan perfumes',
    image: 'https://images.unsplash.com/photo-1583513364301-f9339bc6452c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
    link: '/collections/niche'
  },
];

export function CollectionsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Our Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated fragrance collections, from designer classics to niche discoveries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden border-none shadow-md">
              <div className="relative h-[300px]">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                  <p className="mb-4 opacity-90">{collection.description}</p>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                    <Link href={collection.link}>Explore Collection</Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 