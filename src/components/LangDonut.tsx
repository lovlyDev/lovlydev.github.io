import { useEffect, useRef, useState } from 'react';
import { projects, totalLoc } from '../data/projects';
import { useLang } from '../i18n';
import { langColor } from './WorkShowcase';

// lines of code per language across all projects, from each project's language share
const langs = (() => {
  const t: Record<string, number> = {};
  for (const p of projects) for (const [l, pct] of p.langs) if (l !== 'Other') t[l] = (t[l] ?? 0) + (p.loc * pct) / 100;
  return Object.entries(t)
    .map(([name, lines]) => ({ name, lines, color: langColor(name), used: projects.filter(p => p.langs.some(([l, pct]) => l === name && pct >= 3)).map(p => p.name) }))
    .filter(l => l.lines > 900)
    .sort((a, b) => b.lines - a.lines);
})();
const counted = langs.reduce((s, l) => s + l.lines, 0);
const kl = (n: number) => `~${Math.max(1, Math.round(n / 1000))}k`;

const RO = 90;         // outer radius
const RI = 70;         // inner radius
const GAP = 2.2;       // degrees between slices
const CORNER = 2.5;    // corner rounding, px

const pt = (r: number, deg: number) => {
  const a = (deg - 90) * Math.PI / 180;
  return `${(100 + r * Math.cos(a)).toFixed(2)} ${(100 + r * Math.sin(a)).toFixed(2)}`;
};

/** A ring sector from a0 to a1 (degrees, clockwise from 12 o'clock) with slightly rounded corners. */
function sector(a0: number, a1: number, ro = RO, ri = RI) {
  const span = a1 - a0;
  if (span <= 0.05) return '';
  // keep the rounding smaller than the sector itself
  const c = Math.min(CORNER, (span * Math.PI / 180) * ri / 2.2, (ro - ri) / 2.2);
  const dO = (c / ro) * 180 / Math.PI, dI = (c / ri) * 180 / Math.PI;
  const large = span - 2 * dO > 180 ? 1 : 0;
  return [
    `M ${pt(ro - c, a0)}`,
    `Q ${pt(ro, a0)} ${pt(ro, a0 + dO)}`,
    `A ${ro} ${ro} 0 ${large} 1 ${pt(ro, a1 - dO)}`,
    `Q ${pt(ro, a1)} ${pt(ro - c, a1)}`,
    `L ${pt(ri + c, a1)}`,
    `Q ${pt(ri, a1)} ${pt(ri, a1 - dI)}`,
    `A ${ri} ${ri} 0 ${large} 0 ${pt(ri, a0 + dI)}`,
    `Q ${pt(ri, a0)} ${pt(ri + c, a0)}`,
    'Z',
  ].join(' ');
}

/**
 * Code by language. The ring draws itself once in view; hovering a language (in the ring or the legend)
 * highlights it, and leaving returns to the overall total with nothing selected.
 */
export function LangDonut() {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 0 → 1 once in view: slices sweep in one after another
  const [grow, setGrow] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setGrow(1); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 1400);
      setGrow(1 - (1 - k) ** 3);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  const touch = matchMedia('(hover: none)').matches;
  let acc = 0;
  const cur = active === null ? null : langs[active];

  return (
    <div className={`donut${seen ? ' seen' : ''}${cur ? ' has-active' : ''}`} ref={box}>
      <div className="donut-head">
        <span className="mono">{t({ ru: 'Код по языкам', en: 'Code by language' })}</span>
        <span className="mono muted">{t({ ru: `по ${projects.length} проектам`, en: `across ${projects.length} projects` })}</span>
      </div>

      <div className="donut-ring" onMouseLeave={() => setActive(null)}>
        <svg viewBox="0 0 200 200" role="img" aria-label={t({ ru: 'Код по языкам', en: 'Code by language' })}>
          <circle cx="100" cy="100" r={(RO + RI) / 2} className="donut-track" style={{ strokeWidth: RO - RI }} />
          {langs.map((x, i) => {
            const span = (x.lines / counted) * 360;
            const a0 = acc + GAP / 2;
            const full = Math.max(.6, span - GAP);
            acc += span;
            // the whole ring sweeps clockwise; each slice shows the part already reached
            const reach = grow * 360 - a0;
            const shown = Math.max(0, Math.min(full, reach));
            const on = active === i;
            return <path key={x.name} d={sector(a0, a0 + shown, on ? RO + 4 : RO, on ? RI - 2 : RI)} fill={x.color} className={`donut-slice${on ? ' on' : ''}`} onMouseEnter={() => setActive(i)} />;
          })}
        </svg>
        <div className="donut-center" key={cur?.name ?? 'all'}>
          <b>{cur ? `${Math.round((cur.lines / totalLoc) * 100)}%` : kl(totalLoc)}</b>
          <span>{cur ? cur.name : t({ ru: `строк · ${langs.length} языков`, en: `lines · ${langs.length} languages` })}</span>
        </div>
      </div>

      <ul className="donut-legend" onMouseLeave={() => setActive(null)}>
        {langs.map((x, i) => (
          <li key={x.name} className={active === i ? 'on' : ''} tabIndex={0}
            onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
            <i style={{ background: x.color }} />
            <span>{x.name}</span>
            <b className="mono">{kl(x.lines)}</b>
          </li>
        ))}
      </ul>

      <p className="mono donut-used">
        {cur ? <>{t({ ru: 'в проектах', en: 'used in' })}: {cur.used.join(' · ')}</> : (touch ? t({ ru: 'нажмите на язык', en: 'tap a language' }) : t({ ru: 'наведите на язык', en: 'hover a language' }))}
      </p>
    </div>
  );
}
