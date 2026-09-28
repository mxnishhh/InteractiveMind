'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from 'framer-motion';

// Soft, editorial easing curve
export const EDITORIAL_EASE = [0.21, 0.47, 0.32, 0.98] as const;
export const SMOOTH_EASE = [0.25, 0.1, 0.25, 1.0] as const;

interface BaseMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  viewportMargin?: string;
}

interface FadeUpProps extends BaseMotionProps {
  distance?: number;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  distance = 24,
  viewportMargin = '-60px',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn: React.FC<BaseMotionProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  viewportMargin = '-60px',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScaleRevealProps extends BaseMotionProps {
  scale?: number;
}

export const ScaleReveal: React.FC<ScaleRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.65,
  scale = 0.97,
  viewportMargin = '-60px',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewportMargin?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.04,
  viewportMargin = '-60px',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  scale?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className,
  distance = 20,
  duration = 0.55,
  scale,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: distance,
      ...(scale ? { scale } : {}),
    },
    visible: {
      opacity: 1,
      y: 0,
      ...(scale ? { scale: 1 } : {}),
      transition: {
        duration,
        ease: EDITORIAL_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

interface ImageRevealProps extends BaseMotionProps {
  scaleFrom?: number;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.75,
  scaleFrom = 0.97,
  viewportMargin = '-60px',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: scaleFrom }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverLift?: boolean;
  tapScale?: boolean;
  className?: string;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  hoverLift = true,
  tapScale = true,
  className,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={
        hoverLift
          ? {
              y: -3,
              transition: { duration: 0.25, ease: SMOOTH_EASE },
            }
          : undefined
      }
      whileTap={
        tapScale
          ? {
              scale: 0.99,
              transition: { duration: 0.15 },
            }
          : undefined
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  className,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <button className={className} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -1.5, scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};
