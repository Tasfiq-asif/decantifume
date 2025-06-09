# 🎭 Animation Features Documentation

This document outlines all the modern animation features implemented in the Decantifume home page using GSAP and Framer Motion.

## 🚀 Technologies Used

- **Framer Motion**: React animation library for declarative animations
- **GSAP (GreenSock)**: High-performance animation library for complex timeline animations
- **React Intersection Observer**: For lazy loading and scroll-triggered animations

## 📦 Dependencies Installed

```bash
npm install framer-motion gsap @gsap/react react-intersection-observer
```

## 🎨 Animation Components Overview

### 1. HeroSection.tsx

**Features:**

- **Parallax scrolling** background image
- **Staggered text animations** with word-by-word reveals
- **GSAP timeline** for coordinated entrance effects
- **Framer Motion hover effects** on buttons
- **3D rotation effects** on text elements

**Key Animations:**

- Background image scales and moves with scroll
- Title words animate in with rotation and scale
- Subtitle and buttons have staggered entrance
- Floating background animation

### 2. FeaturedProducts.tsx

**Features:**

- **Lazy loading** with intersection observer
- **Staggered product card** animations
- **GSAP timeline** for coordinated reveals
- **Hover effects** with spring physics
- **Scale and lift animations** on interaction

**Key Animations:**

- Cards appear with scale and position animation
- Hover effects lift cards with spring physics
- Header animates from different directions
- Button has interactive scaling

### 3. FeaturesSection.tsx

**Features:**

- **Icon rotation** and scale animations
- **Staggered card** reveals
- **3D flip effects** on entrance
- **Floating icon** animations
- **Hover interactions** with spring physics

**Key Animations:**

- Icons rotate and scale on reveal
- Cards flip in with 3D rotation
- Continuous floating motion on icons
- Hover effects with rotation and scale

### 4. CollectionsSection.tsx

**Features:**

- **Parallax image effects** with different speeds
- **3D card hover** animations
- **Image zoom** on hover
- **Staggered entrance** animations
- **Dynamic overlay** opacity changes

**Key Animations:**

- Images move at different parallax speeds
- Cards have 3D hover transformations
- Image scaling on hover
- Gradient overlay opacity changes

### 5. NewsletterSection.tsx

**Features:**

- **Form state animations** with AnimatePresence
- **Loading spinner** animations
- **Success state** with SVG path drawing
- **Input focus** effects
- **Button interactions** with spring physics

**Key Animations:**

- Form to success state transition
- Loading spinner with rotation
- SVG checkmark path drawing
- Input scaling on focus
- Button hover and tap effects

## 🛠️ Animation Utilities

### `/src/lib/animations.ts`

A comprehensive animation utility library providing:

#### Predefined Variants

- `fadeVariants`: Simple opacity animations
- `slideVariants`: Directional slide animations
- `scaleVariants`: Scale-based animations
- `rotateVariants`: Rotation animations
- `flipVariants`: 3D flip animations
- `staggerContainer` & `staggerItem`: Staggered children animations

#### Hover Effects

- `hoverVariants.lift`: Lift and scale effect
- `hoverVariants.scale`: Simple scale effect
- `hoverVariants.rotate`: Rotate and scale effect

#### Loading Animations

- `loadingVariants.rotate`: Spinning animation
- `loadingVariants.pulse`: Pulsing scale animation
- `loadingVariants.bounce`: Bouncing animation

#### GSAP Presets

- `gsapPresets.fadeInUp`: Fade in from bottom
- `gsapPresets.scaleIn`: Scale in with back easing
- `gsapPresets.flipIn`: 3D flip entrance

#### Utility Functions

- `createStaggerContainer()`: Custom stagger settings
- `createSlideVariant()`: Custom slide animations
- `createScaleVariant()`: Custom scale animations

## 🎯 Performance Optimizations

### Framer Motion Optimizations

- `layout: false` to prevent layout calculations
- `willChange: 'transform, opacity'` for hardware acceleration
- `triggerOnce: true` for intersection observer

### GSAP Optimizations

- Timeline-based animations for better performance
- Transform3D for hardware acceleration
- Proper cleanup with useEffect dependencies

### Lazy Loading

- Intersection Observer for scroll-triggered animations
- Different threshold values for various components
- `triggerOnce` to prevent repeated animations

## 🎨 Animation Patterns Used

### 1. Entrance Animations

- **Fade + Slide**: Elements fade in while sliding from a direction
- **Scale + Fade**: Elements scale up while fading in
- **3D Flip**: Elements flip in with 3D rotations
- **Staggered**: Multiple elements animate in sequence

### 2. Interaction Animations

- **Hover Effects**: Scale, lift, and rotate on hover
- **Focus Effects**: Scale inputs on focus
- **Tap Effects**: Scale down on press
- **Loading States**: Spinning and pulsing animations

### 3. Scroll Animations

- **Parallax**: Background images move at different speeds
- **Lazy Loading**: Elements animate when they enter viewport
- **Progressive Disclosure**: Content reveals as user scrolls

### 4. State Transitions

- **Form States**: Smooth transitions between form and success states
- **Loading States**: Animated transitions during async operations
- **Content Swapping**: Smooth transitions with AnimatePresence

## 🚀 Usage Examples

### Basic Fade Animation

```tsx
import { motion } from "framer-motion";
import { fadeVariants } from "@/lib/animations";

<motion.div variants={fadeVariants} initial="hidden" animate="visible">
  Content
</motion.div>;
```

### Staggered Container

```tsx
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>;
```

### GSAP Timeline

```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MyComponent = () => {
  const ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  return <div ref={ref}>Content</div>;
};
```

### Intersection Observer with Lazy Loading

```tsx
import { useInView } from "react-intersection-observer";
import { observerOptions } from "@/lib/animations";

const LazyComponent = () => {
  const [ref, inView] = useInView(observerOptions);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
    >
      Content loads when in view
    </motion.div>
  );
};
```

## 🎪 Animation Best Practices

### 1. Performance

- Use `transform` and `opacity` for animations
- Avoid animating layout properties
- Enable hardware acceleration with `will-change`
- Use `triggerOnce` for scroll animations

### 2. User Experience

- Keep animations under 300ms for interactions
- Use easing functions for natural motion
- Provide loading states for async operations
- Respect user preferences for reduced motion

### 3. Code Organization

- Extract common animation variants
- Use the animation utility library
- Keep animation logic separate from component logic
- Use TypeScript for better type safety

## 🔧 Troubleshooting

### Common Issues

1. **Animations not triggering**

   - Check intersection observer thresholds
   - Verify `inView` state is being used correctly
   - Ensure proper dependency arrays in useEffect

2. **Performance issues**

   - Use `will-change` CSS property
   - Avoid animating layout properties
   - Use GSAP for complex timeline animations

3. **TypeScript errors**
   - Import proper types from framer-motion
   - Use the predefined variants from utilities
   - Check transition type definitions

## 📱 Mobile Considerations

- Reduced animation complexity on mobile devices
- Touch-friendly hover states
- Optimized performance for lower-end devices
- Proper viewport handling for scroll animations

## 🎯 Future Enhancements

Potential improvements for the animation system:

1. **Scroll-triggered animations** with GSAP ScrollTrigger
2. **Physics-based animations** with React Spring
3. **SVG path animations** for icons and illustrations
4. **Gesture-based animations** with Framer Motion gestures
5. **Theme-aware animations** that adapt to dark/light modes
