"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const collections = [
  {
    id: "designer",
    title: "Designer",
    description: "Popular luxury brand fragrances",
    image:
      "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    link: "/collections/designer",
  },
  {
    id: "niche",
    title: "Niche",
    description: "Exclusive artisan perfumes",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    link: "/collections/niche",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function CollectionsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      className="py-16 bg-muted/30 overflow-hidden px-8"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-[1600px] mx-auto">
        <motion.div className="text-center mb-12" variants={titleVariants}>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Our Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated fragrance collections, from designer
            classics to niche discoveries
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -6,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
            >
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-shadow duration-500">
                <div className="relative h-[400px] overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <CardContent className="absolute bottom-0 left-0 right-0 p-6">
                    {/* Glass overlay for text */}
                    <div className="glass-card p-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {collection.title}
                      </h3>
                      <p className="mb-4 opacity-90">
                        {collection.description}
                      </p>
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all duration-300"
                        asChild
                      >
                        <Link href={collection.link}>Explore Collection</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
