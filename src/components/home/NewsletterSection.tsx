"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      setEmail("");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      ref={ref}
      className="py-16 bg-primary/5"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="px-8">
        <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight mb-3"
            variants={titleVariants}
          >
            Join Our Newsletter
          </motion.h2>

          <motion.p
            className="text-muted-foreground mb-8"
            variants={titleVariants}
          >
            Subscribe to receive updates on new arrivals, special offers, and
            fragrance tips
          </motion.p>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="success"
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-[#c8a2ff]/10 border border-[#c8a2ff]/20 text-[#e6d9ff] px-6 py-4 rounded-lg"
              >
                <div className="inline-flex items-center">
                  <div className="w-6 h-6 bg-[#c8a2ff] rounded-full mr-3 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#1a1a2e]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Thank you for subscribing! We&apos;ll be in touch with
                  exclusive offers.
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center"
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Subscribing...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        Subscribe Now
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.p
            className="text-xs text-muted-foreground mt-4"
            variants={titleVariants}
          >
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
