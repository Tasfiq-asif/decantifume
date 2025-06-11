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
      className="relative min-h-[70vh] flex items-center px-8 mx-auto overflow-hidden bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800"
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
          className="object-cover brightness-[0.4] scale-110 opacity-60"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-dark-purple-950/80 via-dark-purple-900/60 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.div
          className="absolute inset-0 bg-radial-lavender"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        />
      </motion.div>

      <div className="relative z-10 py-20">
        <div className="max-w-2xl text-lavender-50">
          <motion.h1
            className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent"
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
            className="hero-subtitle text-lg md:text-xl mb-8 text-lavender-200 font-light"
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
                className="bg-lavender-gradient text-dark-purple-800 hover:shadow-lavender font-semibold tracking-wide"
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
                className="text-lavender-200 border-lavender-400 hover:bg-lavender-400 hover:text-dark-purple-800 backdrop-blur-sm glass-effect"
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
