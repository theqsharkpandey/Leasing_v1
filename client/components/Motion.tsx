"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function getDirectionOffset(direction: "up" | "down" | "left" | "right") {
  switch (direction) {
    case "up":
      return { x: 0, y: 30 };
    case "down":
      return { x: 0, y: -30 };
    case "left":
      return { x: 30, y: 0 };
    case "right":
      return { x: -30, y: 0 };
  }
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const prefersReducedMotion = useReducedMotion();
  const offset = getDirectionOffset(direction);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: prefersReducedMotion ? 0 : offset.x,
        y: prefersReducedMotion ? 0 : offset.y,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: EASE,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: prefersReducedMotion ? 0.2 : 0.5,
            ease: EASE,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { AnimatePresence, motion };
