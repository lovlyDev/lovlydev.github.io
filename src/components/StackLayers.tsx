import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { projects, totalLoc } from '../data/projects';
import { useLang, type L } from '../i18n';

type Layer = { id: string; title: L; langs: string[]; tools: string; text: L; color: string };

/** «From metal to interface», top layer first. */
const layers: Layer[] = [
  {
    id: 'ui', title: { ru: 'Интерфейс', en: 'Interface' }, langs: ['TypeScript', 'JavaScript', 'CSS'], tools: 'TypeScript · React · CSS', color: '#4f8ff0',
    text: { ru: 'Сайты, панели и интерфейсы приложений: быстрые, адаптивные, с анимациями.', en: 'Websites, dashboards and app UIs: fast, responsive, animated.' },
  },
  {
    id: 'sys', title: { ru: 'Системы', en: 'Systems' }, langs: ['Rust'], tools: 'Rust · Tauri · Node.js', color: '#e3a06f',
    text: { ru: 'Бэкенды и десктоп: работа с файлами, git, базами данных и автообновлением.', en: 'Backends and desktop: files, git, databases and auto-updates.' },
  },
  {
    id: 'core', title: { ru: 'Ядро', en: 'Core' }, langs: ['C++', 'Slang'], tools: 'C++23 · Vulkan · Slang', color: '#f0577f',
    text: { ru: 'Вычисления на CPU и GPU, где важна каждая миллисекунда.', en: 'CPU and GPU compute where every millisecond counts.' },
  },
];

// lines per layer, from each project's language share
const stats = layers.map(l => {
  let lines = 0;
  const used: string[] = [];
  for (const p of projects) {
    const share = p.langs.filter(([lang]) => l.langs.includes(lang)).reduce((s, [, pct]) => s + pct, 0);
    lines += p.loc * share / 100;
    if (share >= 3) used.push(p.name);
  }
  return { lines, used, share: Math.round(lines / totalLoc * 100) };
});
const kl = (n: number) => `~${Math.max(1, Math.round(n / 1000))}k`;

/**
 * Three solid plates stacked in isometric view. They fly together as the block scrolls in;
 * the chosen plate slides out of the stack. Layers cycle on their own until the visitor picks one.
 */
export function StackLayers() {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [seen, setSeen] = useState(false);

  // assembly progress, driven by scroll
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--p', '1'); setSeen(true); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, (innerHeight - el.getBoundingClientRect().top) / (innerHeight * .7)));
      el.style.setProperty('--p', p.toFixed(3));
      if (p >= 1) setSeen(true);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // gentle auto-tour once assembled, until the visitor takes over
  useEffect(() => {
    if (!seen || touched) return;
    const id = setInterval(() => setActive(a => (a + 1) % layers.length), 3200);
    return () => clearInterval(id);
  }, [seen, touched]);

  const pick = (k: number) => { setTouched(true); setActive(k); };
  const l = layers[active], st = stats[active];

  return (
    <div className="stk" ref={box} style={{ '--c': l.color } as CSSProperties}>
      <div className="stk-scene" aria-hidden="true">
        <div className="stk-iso">
          {layers.map((x, k) => (
            <div key={x.id} className={`plate${active === k ? ' on' : ''}`} style={{ '--k': k, '--pc': x.color } as CSSProperties}
              onMouseEnter={() => pick(k)} onClick={() => pick(k)}>
              <span className="plate-face">
                <span className="plate-grid" />
                <b>{t(x.title)}</b>
                <small className="mono">{x.tools}</small>
              </span>
              <span className="plate-side" />
            </div>
          ))}
        </div>
      </div>

      <div className="stk-panel">
        <div className="stk-tabs" role="tablist" aria-label={t({ ru: 'Слои стека', en: 'Stack layers' })}>
          {layers.map((x, k) => (
            <button key={x.id} role="tab" aria-selected={active === k} className={active === k ? 'on' : ''}
              style={{ '--pc': x.color } as CSSProperties} onClick={() => pick(k)} onMouseEnter={() => pick(k)}>
              <i />{t(x.title)}
              {active === k && !touched && <span className="stk-timer" />}
            </button>
          ))}
        </div>
        <div className="stk-info" key={l.id}>
          <p className="stk-text">{t(l.text)}</p>
          <div className="stk-share">
            <div className="stk-bar"><i style={{ width: `${st.share}%` }} /></div>
            <span className="mono">{kl(st.lines)} {t({ ru: 'строк', en: 'lines' })} · {st.share}%</span>
          </div>
          <dl>
            <div><dt className="mono">{t({ ru: 'стек', en: 'stack' })}</dt><dd>{l.tools}</dd></div>
            <div><dt className="mono">{t({ ru: 'в проектах', en: 'in projects' })}</dt><dd>{st.used.join(' · ')}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
