import type { Variants } from 'framer-motion';

// Standard Hardware Accelerated Spring physics (60 FPS optimized)
export const springTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 20
};

export const gentleSpringTransition = {
  type: 'spring',
  stiffness: 180,
  damping: 22
};

// Reusable Variants respecting Reduced Motion where necessary
export const fadeInSlideUp = (shouldReduce: boolean = false): Variants => ({
  initial: { 
    opacity: 0, 
    y: shouldReduce ? 0 : 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: shouldReduce ? 0.1 : 0.45, 
      ease: [0.16, 1, 0.3, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    y: shouldReduce ? 0 : -12,
    transition: { 
      duration: shouldReduce ? 0.05 : 0.2 
    }
  }
});

// Stagger child elements renderer
export const staggerContainer = (delay: number = 0.08): Variants => ({
  animate: {
    transition: {
      staggerChildren: delay
    }
  }
});

// Scale spring hover action
export const hoverScale = (shouldReduce: boolean = false) => {
  if (shouldReduce) return {};
  return {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  };
};

export const hoverScaleActive = (shouldReduce: boolean = false) => {
  if (shouldReduce) return {};
  return {
    scale: 0.98
  };
};

// Premium Modal transitions
export const modalOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const modalContentVariants = (shouldReduce: boolean = false): Variants => ({
  initial: { 
    opacity: 0, 
    scale: shouldReduce ? 1 : 0.92, 
    y: shouldReduce ? 0 : 15 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: shouldReduce ? 1 : 0.96, 
    y: shouldReduce ? 0 : 10,
    transition: { duration: 0.15 }
  }
});

// Premium Drawer Slide-in transitions
export const drawerVariants = (shouldReduce: boolean = false): Variants => ({
  initial: { 
    x: shouldReduce ? 0 : "100%",
    opacity: shouldReduce ? 0 : 1
  },
  animate: { 
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 220, damping: 24 }
  },
  exit: { 
    x: shouldReduce ? 0 : "100%",
    opacity: shouldReduce ? 0 : 0,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
});
