import { useEffect } from 'react';

/**
 * Drives the «cut» line under every section heading: each `.section-head` gets `--p` (0…1)
 * from how far it has travelled up the viewport, and CSS draws the line and lifts the title from it.
 */
export function SectionLines() {
  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLElement>('.section-head')];
    if (!heads.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heads.forEach(h => h.style.setProperty('--p', '1'));
      return;
    }
    document.documentElement.classList.add('cut-lines');
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      for (const h of heads) {
        const top = h.getBoundingClientRect().top;
        // starts when the heading enters at the bottom, finishes at ~45% of the screen
        const p = Math.min(1, Math.max(0, (vh - top) / (vh * .55)));
        h.style.setProperty('--p', p.toFixed(3));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('cut-lines');
    };
  }, []);
  return null;
}
