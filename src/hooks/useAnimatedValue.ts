import { useState, useEffect, useRef } from 'react';

/**
 * Smoothly animates a number value change over 500ms
 * Uses requestAnimationFrame for smooth, performant animation
 */
export function useAnimatedValue(targetValue: number): number {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(displayValue);

  useEffect(() => {
    const ANIMATION_DURATION = 500; // ms

    // If already at target, don't animate
    if (displayValue === targetValue) {
      return;
    }

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = Date.now();
    startValueRef.current = displayValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Linear interpolation for smooth, analytical feel (no easing)
      const current = startValueRef.current + (targetValue - startValueRef.current) * progress;
      setDisplayValue(Math.round(current));

      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, displayValue]);

  return displayValue;
}
