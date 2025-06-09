"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 400]);

  useEffect(() => {
    const tl = gsap.timeline();

    // GSAP animations for text elements
    tl.fromTo(
      ".hero-title",
      {
        opacity: 0,
        y: 100,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "easeOut",
      }
    )
      .fromTo(
        ".hero-subtitle",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "easeOut",
        },
        "-=0.6"
      )
      .fromTo(
        ".hero-buttons",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "easeOut",
        },
        "-=0.4"
      );

    // Floating animation for background
    gsap.to(backgroundRef.current, {
      y: "+=20",
      duration: 4,
      ease: "easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[70vh] flex items-center px-8 mx-auto overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        ref={backgroundRef}
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <Image
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Luxury perfumes"
          fill
          priority
          className="object-cover brightness-[0.85] scale-110"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </motion.div>

      <div className="relative z-10 py-20">
        <div className="max-w-2xl text-white">
          <motion.h1
            className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {["Experience", "Luxury"].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-4"
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{
                  delay: 0.3 + index * 0.2,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            {["One", "Spray", "at", "a", "Time"].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8 + index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="hero-subtitle text-lg md:text-xl mb-8 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Discover premium decant perfumes at affordable prices. Try before
            you commit to full bottles.
          </motion.p>

          <motion.div
            className="hero-buttons flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 shadow-lg"
                asChild
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black backdrop-blur-sm"
                asChild
              >
                <Link href="/collections/bestsellers">Best Sellers</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
