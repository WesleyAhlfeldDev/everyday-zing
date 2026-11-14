'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Re-fetches the page's server data every few seconds while the tab is visible,
// and straight away when the tab comes back into view.
export default function AutoRefresh({ seconds = 30 }) {
  const router = useRouter();

  useEffect(() => {
    const tick = () => { if (document.visibilityState === 'visible') router.refresh(); };
    const timer = setInterval(tick, seconds * 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [router, seconds]);

  return null;
}
