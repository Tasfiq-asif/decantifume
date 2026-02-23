"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroButton } from "@/components/ui/hero-button";
import { transitions } from "@/lib/animations";

const stats = [
  { label: "Happy Customers", value: "5000+" },
  { label: "Authentic", value: "100%" },
  { label: "Free Shipping", value: "$50+" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 overflow-hidden bg-[#0f0f1a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background image with parallax scale */}
      <div className="absolute inset-0 z-0">
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Luxury perfumes"
            fill
            priority
            className="object-cover brightness-[0.3] opacity-50"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/90 via-[#0f0f1a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-radial-lavender" />
      </div>

      {/* Decorative gradient orbs */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-[#c8a2ff]/8 blur-[100px] pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[8%] w-96 h-96 rounded-full bg-[#d4b3ff]/6 blur-[120px] pointer-events-none"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[50%] right-[30%] w-48 h-48 rounded-full bg-[#b89bff]/5 blur-[80px] pointer-events-none"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1a] to-transparent z-10" />

      {/* Main content — centered */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-[#f0f0ff] via-[#e6d9ff] to-[#d4b3ff] bg-clip-text text-transparent"
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
          className="text-lg md:text-xl mb-10 text-[#b5a3d6] font-light max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, ...transitions.normal }}
        >
          Premium designer & niche fragrance decants — sample the world&apos;s
          finest scents without the full-bottle commitment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, ...transitions.normal }}
        >
          <HeroButton variant="primary" size="lg" asChild>
            <Link href="/products">Shop Now</Link>
          </HeroButton>
          <HeroButton variant="secondary" size="lg" asChild>
            <Link href="/about">How It Works</Link>
          </HeroButton>
        </motion.div>

        {/* Trust stats bar */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, ...transitions.normal }}
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-6 md:gap-10">
              <div className="text-center">
                <span className="block text-lg md:text-xl font-semibold text-[#e6d9ff]">
                  {stat.value}
                </span>
                <span className="block text-xs md:text-sm text-[#b5a3d6]/70 tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-[#3d3d5c]" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="text-xs text-[#b5a3d6]/60 uppercase tracking-widest">
          Scroll
        </span>
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#c8a2ff]/50"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </motion.section>
  );
}
