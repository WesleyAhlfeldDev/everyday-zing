'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Reveals every [data-rise] element once as it scrolls into view. Elements
// inside one section stagger by their order (--d). Without this script, or
// with reduced motion, everything is simply shown.
export default function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const els = [...document.querySelectorAll('[data-rise]:not(.is-in)')];
    if (!('IntersectionObserver' in window)) return undefined;

    // Number each element within its section so the parts arrive in turn.
    const counts = new Map();
    for (const el of els) {
      const section = el.closest('section, header, footer') || document.body;
      const n = counts.get(section) || 0;
      counts.set(section, n + 1);
      el.style.setProperty('--d', String(Math.min(n, 6)));
    }

    const io = new IntersectionObserver((list) => {
      for (const entry of list) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    root.classList.add('motion');
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
