import { useEffect, useRef, useState } from 'react';
import { projects, totalLoc } from '../data/projects';
import { useLang } from '../i18n';
import { kloc } from './WorkShowcase';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = (k: number) => 1 - (1 - k) ** 4;

/** Becomes true once the element scrolls into view. */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Counts from 0 to `to` once `run` turns true. */
function useCount(to: number, run: boolean, ms: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduced()) { setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      setV(to * easeOut(k));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return v;
}

/** Terminal-style text reveal: characters settle left to right out of random glyphs. */
function useScramble(text: string, run: boolean, ms: number) {
  const [out, setOut] = useState(text.replace(/\S/g, '·'));
  useEffect(() => {
    if (!run) return;
    if (reduced()) { setOut(text); return; }
    const glyphs = '01#$%&*+<>/\\=';
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const fixed = Math.floor(k * text.length);
      setOut([...text].map((c, i) => (i < fixed || c === ' ' ? c : glyphs[(i * 7 + Math.floor(now / 45)) % glyphs.length])).join(''));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, run, ms]);
  return out;
}

const byLoc = [...projects].sort((a, b) => b.loc - a.loc);

export function Facts() {
  const { t } = useLang();
  const [ref, seen] = useSeen<HTMLDListElement>();
  const count = useCount(projects.length, seen, 1100);
  const loc = useCount(totalLoc, seen, 2200);
  const years = useCount(4, seen, 1400);
  const stack = useScramble('C++ · Rust · TS', seen, 1300);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <dl className={`facts${seen ? ' seen' : ''}`} ref={ref}>
      <div>
        <dt>{Math.round(count)}</dt>
        <dd>{t({ ru: 'продуктов в открытом доступе', en: 'products shipped publicly' })}</dd>
        <p className="fact-more mono">{projects.map(p => p.name).join(' · ')}</p>
      </div>
      <div className="fact-loc">
        <dt>{loc >= totalLoc ? kloc(totalLoc) : `~${Math.round(loc / 1000)}k`}</dt>
        <dd>{t({ ru: 'строк кода в этих проектах', en: 'lines of code across them' })}</dd>
        <div className="loc-bar" onMouseLeave={() => setHover(null)}>
          {byLoc.map((p, k) => (
            <i key={p.id} style={{ flexGrow: p.loc, transitionDelay: `${.9 + k * .12}s` }} className={hover === p.id ? 'on' : ''} onMouseEnter={() => setHover(p.id)} />
          ))}
        </div>
        <p className="fact-more mono">
          {byLoc.map((p, k) => (
            <span key={p.id} className={hover === p.id ? 'on' : ''} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}>
              {p.name} {kloc(p.loc).slice(1)}{k < byLoc.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </div>
      <div>
        <dt>{Math.round(years)}</dt>
        <dd>{t({ ru: 'года в разработке', en: 'years of development' })}</dd>
        <p className="fact-more mono">{t({ ru: 'с 2022 · от вёрстки до GPU', en: 'since 2022 · from HTML to GPU' })}</p>
      </div>
      <div>
        <dt className="mono-dt">{stack}</dt>
        <dd>{t({ ru: 'от железа до интерфейса', en: 'from metal to interface' })}</dd>
        <p className="fact-more mono">{t({ ru: 'ядра · бэкенд и десктоп · UI', en: 'cores · backend & desktop · UI' })}</p>
      </div>
    </dl>
  );
}
