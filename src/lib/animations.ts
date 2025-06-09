// Animation utilities for consistent motion design across the app
import { Variants, Transition } from "framer-motion";

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

// Intersection Observer options
export const observerOptions = {
  threshold: 0.1,
  triggerOnce: true,
} as const;

export const observerOptionsStrict = {
  threshold: 0.3,
  triggerOnce: true,
} as const;

// Animation utility functions
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
