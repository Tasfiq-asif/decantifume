"use client";

import { ProductCard, Product } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

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
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function FeaturedProducts() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && headerRef.current && gridRef.current) {
      const tl = gsap.timeline();

      // Animate header
      tl.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: -50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "easeOut",
        }
      );

      // Animate grid items with stagger
      tl.fromTo(
        ".product-card",
        {
          opacity: 0,
          y: 60,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "easeOut",
          stagger: 0.15,
        },
        "-=0.4"
      );
    }
  }, [inView]);

  return (
    <motion.section
      ref={ref}
      className="py-16"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-center mb-10"
          variants={headerVariants}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Featured Perfumes
            </h2>
            <p className="text-muted-foreground">
              Our most popular scents, carefully selected for you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card"
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                },
              }}
              whileTap={{ scale: 0.98 }}
              custom={index}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
