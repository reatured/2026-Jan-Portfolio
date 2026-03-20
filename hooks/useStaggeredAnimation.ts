import { useState, useEffect } from 'react';

interface UseStaggeredAnimationProps {
  itemCount: number;
  baseDelay?: number;
  staggerDelay?: number;
  duration?: number;
}

export const useStaggeredAnimation = ({
  itemCount,
  baseDelay = 0,
  staggerDelay = 100,
  duration = 400,
}: UseStaggeredAnimationProps) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      const intervals: NodeJS.Timeout[] = [];
      
      // Stagger the appearance of items
      for (let i = 0; i < itemCount; i++) {
        const interval = setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(i));
        }, baseDelay + i * staggerDelay);
        intervals.push(interval);
      }
      
      return () => intervals.forEach(clearTimeout);
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [itemCount, baseDelay, staggerDelay]);

  const getItemStyle = (index: number) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index) 
      ? 'translateY(0)' 
      : 'translateY(20px)',
    transition: `all ${duration}ms cubic-bezier(0.05, 0.7, 0.1, 1)`,
  });

  return { visibleItems, getItemStyle };
};
