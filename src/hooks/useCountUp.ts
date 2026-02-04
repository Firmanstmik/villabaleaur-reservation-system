import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp({
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  prefix = '',
}: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef<number>(0);

  const start = () => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = Date.now() + delay;
    const step = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(step);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * end);

      if (current !== countRef.current) {
        countRef.current = current;
        setCount(current);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(step);
  };

  const reset = () => {
    setCount(0);
    setHasStarted(false);
    countRef.current = 0;
  };

  const formattedValue = `${prefix}${count}${suffix}`;

  return { count, formattedValue, start, reset, hasStarted };
}
