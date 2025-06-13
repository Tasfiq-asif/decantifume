// src/lib/animations/index.ts
import { Variants } from "framer-motion";
import { transitions } from "./transitions";

// Export transitions and easings
export * from "./transitions";

// Export all variants
export * from "./variants";

// Export utility functions
export const createStaggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0.2
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const createSlideVariant = (
  direction: "up" | "down" | "left" | "right",
  distance: number = 50
): Variants => {
  switch (direction) {
    case "up":
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0, transition: transitions.spring },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0, transition: transitions.spring },
      };
    case "left":
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0, transition: transitions.spring },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0, transition: transitions.spring },
      };
  }
};

export const createScaleVariant = (
  initialScale: number = 0.8,
  targetScale: number = 1
): Variants => ({
  hidden: { opacity: 0, scale: initialScale },
  visible: {
    opacity: 1,
    scale: targetScale,
    transition: transitions.elastic,
  },
});

// Performance optimized motion components props
export const motionProps = {
  // Reduce layout calculations
  layout: false,
  // Enable hardware acceleration
  style: { willChange: "transform, opacity" },
} as const;