"use client";

import { Truck, ShieldCheck, Banknote, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const featureVariants = {
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

export function FeaturesSection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      className="py-12 bg-muted/50"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-[1600px] mx-auto px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card flex flex-col items-center text-center p-6 lg:rounded-none lg:first:rounded-l-xl lg:last:rounded-r-xl lg:border-r lg:border-[rgba(200,162,255,0.1)] lg:last:border-r-0"
              variants={featureVariants}
            >
              <div className="mb-4 bg-primary/10 p-3 rounded-full text-primary">
                {feature.icon}
              </div>

              <h3 className="text-lg font-medium mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
