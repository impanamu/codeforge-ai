import { useState, useEffect, useRef } from 'react';

/**
 * useTypewriter — streams text character-by-character with a blinking cursor.
 * @param {string} text — the full text to animate
 * @param {number} speed — ms per character (default 12ms → ~83 chars/sec)
 * @returns {{ displayed: string, isDone: boolean }}
 */
export const useTypewriter = (text, speed = 12) => {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Reset whenever the target text changes
    setDisplayed('');
    setIsDone(false);
    indexRef.current = 0;

    if (!text) {
      setIsDone(true);
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  return { displayed, isDone };
};

/**
 * useCountUp — animates a number from 0 to target over duration ms.
 * @param {number} target
 * @param {number} duration — total animation time in ms (default 1200)
 * @param {boolean} trigger — only starts when true (for on-mount or intersection)
 */
export const useCountUp = (target, duration = 1200, trigger = true) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger || !target) return;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, trigger]);

  return count;
};
