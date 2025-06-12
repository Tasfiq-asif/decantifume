"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

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
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 1,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function CollectionsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && headerRef.current && cardsRef.current) {
      const tl = gsap.timeline();

      // Animate header
      tl.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: -60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "easeOut",
        }
      );

      // Animate cards
      tl.fromTo(
        ".collection-card",
        {
          opacity: 0,
          y: 100,
          rotationY: -20,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          ease: "easeOut",
          stagger: 0.2,
        },
        "-=0.5"
      );
    }
  }, [inView]);

  return (
    <motion.section
      ref={ref}
      className="py-16 bg-muted/30 overflow-hidden"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="">
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
          variants={titleVariants}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
            }
            transition={{
              delay: 0.2,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            Our Collections
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore our carefully curated fragrance collections, from designer
            classics to niche discoveries
          </motion.p>
        </motion.div>

        <motion.div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              variants={cardVariants}
              className="collection-card"
              whileHover={{
                scale: 1.02,
                y: -10,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-shadow duration-500">
                <motion.div
                  className="relative h-[300px] overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.div
                    style={{ y: index === 0 ? y1 : y2 }}
                    className="relative h-full"
                  >
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover scale-110 transition-transform duration-700 hover:scale-125"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <motion.h3
                      className="text-2xl font-bold mb-2"
                      initial={{ opacity: 0, x: -30 }}
                      animate={
                        inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                      }
                      transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                    >
                      {collection.title}
                    </motion.h3>

                    <motion.p
                      className="mb-4 opacity-90"
                      initial={{ opacity: 0, x: -30 }}
                      animate={
                        inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                      }
                      transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                    >
                      {collection.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                      }
                      transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all duration-300"
                        asChild
                      >
                        <Link href={collection.link}>Explore Collection</Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
