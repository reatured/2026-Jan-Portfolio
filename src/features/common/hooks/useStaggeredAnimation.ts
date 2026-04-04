import { useEffect, useState } from 'react';

interface UseStaggeredAnimationProps {
  itemCount: number;
  baseDelay?: number;
  staggerDelay?: number;
  duration?: number;
  enabled?: boolean;
  respectReducedMotion?: boolean;
}

export const useStaggeredAnimation = ({
  itemCount,
  baseDelay = 0,
  staggerDelay = 100,
  duration = 400,
  enabled = true,
  respectReducedMotion = true,
}: UseStaggeredAnimationProps) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    setVisibleItems(new Set());

    if (!enabled) {
      return;
    }

    const prefersReducedMotion =
      respectReducedMotion &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, index) => index)));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < itemCount; i += 1) {
      timers.push(
        setTimeout(() => {
          setVisibleItems(prev => {
            const next = new Set(prev);
            next.add(i);
            return next;
          });
        }, baseDelay + i * staggerDelay),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [itemCount, baseDelay, staggerDelay, enabled, respectReducedMotion]);

  const getItemStyle = (index: number) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index) 
      ? 'translateY(0)' 
      : 'translateY(20px)',
    transition: `opacity ${duration}ms var(--easing-emphasized-decelerate), transform ${duration}ms var(--easing-emphasized-decelerate)`,
    transitionDelay: visibleItems.has(index) ? '0ms' : `${Math.min(index * 35, 180)}ms`,
    willChange: 'opacity, transform',
  });

  return {
    visibleItems,
    getItemStyle,
    isVisible: (index: number) => visibleItems.has(index),
  };
};
