"use client";

import { Truck, ShieldCheck, Banknote, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Free Shipping",
    description: "Free shipping on all orders over $50",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Easy Returns",
    description: "30-day easy return policy",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Authentic Fragrances",
    description: "100% genuine, carefully sourced",
  },
  {
    icon: <Banknote className="h-6 w-6" />,
    title: "Secure Payment",
    description: "Multiple secure payment options",
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

const featureVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.8,
    },
  },
};

const iconVariants = {
  hidden: {
    scale: 0,
    rotate: -180,
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
};

export function FeaturesSection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && featuresRef.current) {
      const featureCards =
        featuresRef.current.querySelectorAll(".feature-card");

      gsap.fromTo(
        featureCards,
        {
          opacity: 0,
          y: 80,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          ease: "easeOut",
          stagger: 0.15,
        }
      );

      // Add floating animation to icons
      gsap.to(".feature-icon", {
        y: "+=8",
        duration: 2,
        ease: "easeInOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });
    }
  }, [inView]);

  return (
    <motion.section
      ref={ref}
      className="py-12 bg-muted/50"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="">
        <motion.div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card flex flex-col items-center text-center"
              variants={featureVariants}
              whileHover={{
                y: -8,
                scale: 1.05,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                },
              }}
              custom={index}
            >
              <motion.div
                className="feature-icon mb-4 bg-primary/10 p-3 rounded-full text-primary"
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                {feature.icon}
              </motion.div>

              <motion.h3
                className="text-lg font-medium mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                {feature.title}
              </motion.h3>

              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
