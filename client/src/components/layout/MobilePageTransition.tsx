import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobilePageTransitionProps {
  children: ReactNode;
  enableSwipeBack?: boolean;
}

// Define page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: '100%',
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: '-100%',
  },
};

// Transition configuration
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export function MobilePageTransition({ 
  children, 
  enableSwipeBack = true 
}: MobilePageTransitionProps) {
  const isMobile = useIsMobile();
  const [location] = useLocation();

  // Handle swipe gestures for back navigation
  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
      if (enableSwipeBack && eventData.velocity > 0.3) {
        window.history.back();
      }
    },
    trackMouse: false,
    trackTouch: true,
  });

  // Only apply animations on mobile devices
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div {...swipeHandlers}>
      <motion.div
        key={location}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page-transition"
      >
        {children}
      </motion.div>
    </div>
  );
}