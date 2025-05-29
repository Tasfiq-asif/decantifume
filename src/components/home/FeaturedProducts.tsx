"use client";

import { ProductCard, Product } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for featured products
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    description:
      "A luxurious amber floral fragrance with notes of jasmine, saffron, cedarwood, and ambergris.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    sizes: [
      { id: "1-10ml", size: "10ml", price: 24.99 },
      { id: "1-30ml", size: "30ml", price: 59.99 },
    ],
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Aventus",
    brand: "Creed",
    description:
      "A sophisticated blend of blackcurrant, bergamot, apple, pineapple, rose, birch, and musk.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    sizes: [
      { id: "2-10ml", size: "10ml", price: 29.99 },
      { id: "2-30ml", size: "30ml", price: 69.99 },
    ],
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Black Orchid",
    brand: "Tom Ford",
    description:
      "A luxurious and sensual fragrance with notes of black truffle, ylang-ylang, bergamot, and blackcurrant.",
    price: 22.99,
    image:
      "https://images.unsplash.com/photo-1590736969297-8d5848b10042?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    sizes: [
      { id: "3-10ml", size: "10ml", price: 22.99 },
      { id: "3-30ml", size: "30ml", price: 54.99 },
    ],
  },
  {
    id: "4",
    name: "Santal 33",
    brand: "Le Labo",
    description:
      "An iconic fragrance featuring notes of cardamom, iris, violet, and Australian sandalwood.",
    price: 27.99,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    sizes: [
      { id: "4-10ml", size: "10ml", price: 27.99 },
      { id: "4-30ml", size: "30ml", price: 64.99 },
    ],
    isNew: true,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Featured Perfumes
            </h2>
            <p className="text-muted-foreground">
              Our most popular scents, carefully selected for you
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
