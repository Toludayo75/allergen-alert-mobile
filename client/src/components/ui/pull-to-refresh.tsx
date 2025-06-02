import React, { ReactNode, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  className = ''
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  
  const REFRESH_THRESHOLD = 80; // Distance to pull before triggering refresh
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) { // Only allow pull when at the top of the page
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0 && window.scrollY === 0) {
      // Apply resistance to the pull
      const resistance = 0.4;
      const distance = Math.min(diff * resistance, 120);
      setPullDistance(distance);
      
      // Prevent default scroll behavior when pulling
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    if (pullDistance >= REFRESH_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
      }
    } else {
      // Reset if not refreshing
      setPullDistance(0);
      setIsPulling(false);
    }
  };
  
  // Add passive listeners to improve performance
  useEffect(() => {
    const preventDefaultScroll = (e: TouchEvent) => {
      if (isPulling && window.scrollY === 0) {
        e.preventDefault();
      }
    };
    
    // Add the event listener with passive: false to allow preventDefault
    document.addEventListener('touchmove', preventDefaultScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefaultScroll);
    };
  }, [isPulling]);
  
  return (
    <div 
      className={`pull-to-refresh-container ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isRefreshing ? 60 : pullDistance, 
              opacity: isRefreshing ? 1 : pullDistance / REFRESH_THRESHOLD 
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="flex justify-center items-center overflow-hidden bg-gray-50"
          >
            <div className="flex flex-col items-center justify-center">
              {isRefreshing ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <motion.div 
                  animate={{ 
                    rotate: pullDistance >= REFRESH_THRESHOLD ? 180 : 0,
                    scale: pullDistance / REFRESH_THRESHOLD > 1 ? 1 : pullDistance / REFRESH_THRESHOLD
                  }}
                  className="text-primary"
                >
                  ↓
                </motion.div>
              )}
              <span className="text-xs mt-1 text-gray-500">
                {isRefreshing 
                  ? "Refreshing..." 
                  : pullDistance >= REFRESH_THRESHOLD 
                    ? "Release to refresh" 
                    : "Pull down to refresh"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </div>
  );
}