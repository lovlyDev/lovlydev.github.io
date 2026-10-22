import { useEffect, useRef, useState } from 'react';
import { projects, totalLoc } from '../data/projects';
import { useLang } from '../i18n';
import { langColor } from './WorkShowcase';

// lines of code per language across all projects, from each project's language share
const langs = (() => {
  const t: Record<string, number> = {};
  for (const p of projects) for (const [l, pct] of p.langs) if (l !== 'Other') t[l] = (t[l] ?? 0) + (p.loc * pct) / 100;
  return Object.entries(t)
    .map(([name, lines]) => ({ name, lines, share: lines / totalLoc, color: langColor(name), used: projects.filter(p => p.langs.some(([l, pct]) => l === name && pct >= 3)).map(p => p.name) }))
    .filter(l => l.lines > 900)
    .sort((a, b) => b.lines - a.lines);
})();
const kl = (n: number) => `~${Math.max(1, Math.round(n / 1000))}k`;

const R = 80;
const C = 2 * Math.PI * R;
const GAP = 3;

/** Donut of code by language; the ring draws itself once in view, hovering a language highlights its slice. */
export function LangDonut() {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const total = langs.reduce((s, l) => s + l.share, 0);
  let acc = 0;
  const l = langs[active];

  return (
    <div className={`donut${seen ? ' seen' : ''}`} ref={box}>
      <div className="donut-ring">
      <svg viewBox="0 0 200 200" role="img" aria-label={t({ ru: 'Код по языкам', en: 'Code by language' })}>
        <circle cx="100" cy="100" r={R} className="donut-track" />
        {langs.map((x, i) => {
          const part = (x.share / total) * C;
          const el = (
            <circle key={x.name} cx="100" cy="100" r={R} className={`donut-slice${active === i ? ' on' : ''}`} stroke={x.color}
              strokeDasharray={`${seen ? Math.max(.5, part - GAP) : 0} ${C}`} strokeDashoffset={-acc}
              style={{ transitionDelay: seen ? `${i * .12}s, 0s` : '0s' }}
              onMouseEnter={() => setActive(i)} />
          );
          acc += part;
          return el;
        })}
      </svg>
      <div className="donut-center" key={l.name} aria-live="polite">
        <b>{Math.round(l.share * 100)}%</b>
        <span>{l.name}</span>
      </div>
      </div>
      <div className="donut-side">
        <p className="mono donut-kicker">{t({ ru: 'код по языкам', en: 'code by language' })} · {kl(totalLoc)} {t({ ru: 'строк', en: 'lines' })}</p>
        <ul>
          {langs.map((x, i) => (
            <li key={x.name} className={active === i ? 'on' : ''} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0}>
              <i style={{ background: x.color }} />{x.name}<span className="mono">{kl(x.lines)}</span>
            </li>
          ))}
        </ul>
        <p className="mono donut-used">{t({ ru: 'в проектах', en: 'in' })}: {l.used.join(' · ')}</p>
      </div>
    </div>
  );
}
