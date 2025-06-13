// src/lib/animations/transitions.ts
import { Transition } from "framer-motion";

// Common easing functions (Framer Motion compatible)
export const easings = {
  power1: [0.25, 0.46, 0.45, 0.94],
  power2: [0.455, 0.03, 0.515, 0.955],
  power3: [0.215, 0.61, 0.355, 1],
  power4: [0.77, 0, 0.175, 1],
  back: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  linear: "linear",
} as const;

// Common transition configurations
export const transitions = {
  fast: { duration: 0.3, ease: easings.power2 },
  normal: { duration: 0.5, ease: easings.power3 },
  slow: { duration: 0.8, ease: easings.power3 },
  spring: { type: "spring", stiffness: 100, damping: 15 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 17 } as Transition,
  elastic: { type: "spring", stiffness: 200, damping: 20 } as Transition,
} as const;

// Intersection Observer options
export const observerOptions = {
  threshold: 0.1,
  triggerOnce: true,
} as const;

export const observerOptionsStrict = {
  threshold: 0.3,
  triggerOnce: true,
} as const;