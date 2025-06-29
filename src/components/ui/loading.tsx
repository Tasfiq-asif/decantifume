"use client";

import { motion } from "framer-motion";

interface LoadingProps {
  fullscreen?: boolean;
  size?: "sm" | "md" | "lg";
  message?: string;
}

// Deterministic positions and values to prevent hydration mismatches
const PARTICLE_POSITIONS = [
  { top: 15, left: 20 },
  { top: 35, left: 75 },
  { top: 60, left: 45 },
  { top: 80, left: 85 },
  { top: 25, left: 60 },
  { top: 70, left: 15 },
];

const MIST_X_VALUES = [-3, 0, 3, -2, 2];
const PARTICLE_DURATIONS = [3, 4, 5, 3.5, 4.5, 3.8];

export function Loading({
  fullscreen = false,
  size = "md",
  message = "Loading...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      {fullscreen && (
        <>
          {/* Background effects */}
          <div className="absolute inset-0 bg-radial-lavender opacity-30" />
          <div className="absolute inset-0 bg-subtle-glow opacity-20" />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Perfume bottle animation */}
        <div className="relative">
          {/* Main bottle */}
          <motion.div
            className={`${sizeClasses[size]} relative`}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Bottle body */}
            <motion.div
              className="w-full h-full bg-gradient-to-b from-lavender-200/20 to-lavender-400/40 rounded-lg border border-lavender-300/30 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Liquid animation */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-lavender-400 to-lavender-300 rounded-b-lg"
                animate={{
                  height: ["30%", "50%", "30%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Sparkle effects */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${30 + i * 15}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>

            {/* Bottle cap */}
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-gradient-to-b from-gold-300 to-gold-400 rounded-t-lg border border-gold-500/30"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            {/* Spray mist */}
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.5, 1.2, 1.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-lavender-300 rounded-full"
                  style={{
                    left: `${-10 + i * 5}px`,
                    top: `${-i * 3}px`,
                  }}
                  animate={{
                    y: [0, -20, -40],
                    x: [0, MIST_X_VALUES[i] || 0],
                    opacity: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Floating particles around bottle */}
          {PARTICLE_POSITIONS.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-lavender-400/40 rounded-full"
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: PARTICLE_DURATIONS[i] || 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Brand name with typing effect */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h1
            className="text-2xl font-bold bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent mb-2"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            DECANT
          </motion.h1>

          {/* Loading text with dots animation */}
          <motion.p
            className="text-lavender-200 text-sm flex items-center justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span>{message}</span>
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                .
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-1 bg-lavender-800/30 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-lavender-400 to-lavender-300 rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Page loading wrapper component
export function PageLoading({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading && <Loading fullscreen />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: isLoading ? "none" : "block" }}
      >
        {children}
      </motion.div>
    </>
  );
}
