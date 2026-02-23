"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.section
      className="relative min-h-[85vh] flex items-center px-8 mx-auto overflow-hidden bg-[#0f0f1a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Luxury perfumes"
          fill
          priority
          className="object-cover brightness-[0.35] scale-110 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/90 via-[#0f0f1a]/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-lavender" />
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1a] to-transparent z-10" />

      <div className="relative z-10 py-20">
        <div className="max-w-2xl">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-[#f0f0ff] via-[#e6d9ff] to-[#d4b3ff] bg-clip-text text-transparent"
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
            className="text-lg md:text-xl mb-8 text-[#b5a3d6] font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Discover premium decant perfumes at affordable prices. Try before
            you commit to full bottles.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                className="bg-lavender-gradient text-[#1a1a2e] hover:shadow-lavender font-semibold tracking-wide"
                asChild
              >
                <Link href="/products">Shop Now</Link>
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
                className="text-[#e6d9ff] border-[#3d3d5c] hover:bg-[#c8a2ff]/10 hover:border-[#c8a2ff]/40 backdrop-blur-sm glass-effect"
                asChild
              >
                <Link href="/products">Best Sellers</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
