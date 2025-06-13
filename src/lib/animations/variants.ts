// src/lib/animations/variants.ts
import { Variants } from "framer-motion";
import { transitions } from "./transitions";

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Slide animations
export const slideVariants = {
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.spring,
    },
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.spring,
    },
  },
  left: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.spring,
    },
  },
  right: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.spring,
    },
  },
} as const;

// Scale animations
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.elastic,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
};

// Rotation animations
export const rotateVariants: Variants = {
  hidden: { opacity: 0, rotate: -180, scale: 0.5 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: transitions.elastic,
  },
};

// 3D animations
export const flipVariants: Variants = {
  hidden: { opacity: 0, rotateX: -90, scale: 0.8 },
  visible: {
    opacity: 1,
    rotateX: 0,
    scale: 1,
    transition: transitions.elastic,
  },
};

// Container animations for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
};

// Hover animations
export const hoverVariants = {
  lift: {
    y: -8,
    scale: 1.02,
    transition: transitions.bouncy,
  },
  scale: {
    scale: 1.05,
    transition: transitions.bouncy,
  },
  rotate: {
    rotate: 5,
    scale: 1.05,
    transition: transitions.bouncy,
  },
} as const;

// Loading animations
export const loadingVariants: Variants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Path drawing animation (for SVGs)
export const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
};

// GSAP Animation presets
export const gsapPresets = {
  fadeInUp: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
  },
  fadeInLeft: {
    from: { opacity: 0, x: -60 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
  },
  fadeInRight: {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
  },
  flipIn: {
    from: { opacity: 0, rotationX: -90, scale: 0.8 },
    to: { opacity: 1, rotationX: 0, scale: 1, duration: 1, ease: "power3.out" },
  },
  staggerFadeIn: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
  },
} as const;