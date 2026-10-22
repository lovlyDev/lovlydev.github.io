import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { projects } from '../data/projects';
import { useLang, type L } from '../i18n';

type Layer = { id: string; title: L; langs: string[]; tools: string; text: L; color: string };

/** «From metal to interface», bottom layer last. */
const layers: Layer[] = [
  {
    id: 'ui', title: { ru: 'Интерфейс', en: 'Interface' }, langs: ['TypeScript', 'JavaScript', 'CSS'], tools: 'TypeScript · React · CSS', color: '#3178c6',
    text: { ru: 'Сайты, панели и интерфейсы приложений: быстрые, адаптивные, с анимациями.', en: 'Websites, dashboards and app UIs: fast, responsive, animated.' },
  },
  {
    id: 'sys', title: { ru: 'Системы', en: 'Systems' }, langs: ['Rust'], tools: 'Rust · Tauri · Node.js', color: '#dea584',
    text: { ru: 'Бэкенды и десктоп: работа с файлами, git, базами данных и автообновлением.', en: 'Backends and desktop: files, git, databases and auto-updates.' },
  },
  {
    id: 'core', title: { ru: 'Ядро', en: 'Core' }, langs: ['C++', 'Slang'], tools: 'C++23 · Vulkan · Slang', color: '#f34b7d',
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
  return { lines, used };
});
const kl = (n: number) => `~${Math.max(1, Math.round(n / 1000))}k`;

/** Three plates that fly together as the block scrolls in; hovering a plate shows what lives on it. */
export function StackLayers() {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--p', '1'); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = el.getBoundingClientRect().top;
      el.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight - top) / (innerHeight * .75))).toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const l = layers[hover], st = stats[hover];

  return (
    <div className="stk" ref={box}>
      <div className="stack-scene" onMouseLeave={() => setHover(0)}>
        {layers.map((x, k) => (
          <button key={x.id} className={`plate${hover === k ? ' on' : ''}`} style={{ '--k': k, '--c': x.color } as CSSProperties}
            onMouseEnter={() => setHover(k)} onFocus={() => setHover(k)} onClick={() => setHover(k)}>
            <span className="plate-top"><b>{t(x.title)}</b><small className="mono">{x.tools}</small></span>
          </button>
        ))}
      </div>
      <div className="stack-info" key={l.id}>
        <p className="mono stack-kicker"><i style={{ background: l.color }} />{t({ ru: 'слой', en: 'layer' })} · {t(l.title)}</p>
        <p className="stack-text">{t(l.text)}</p>
        <dl>
          <div><dt className="mono">{t({ ru: 'код', en: 'code' })}</dt><dd>{kl(st.lines)} {t({ ru: 'строк', en: 'lines' })}</dd></div>
          <div><dt className="mono">{t({ ru: 'в проектах', en: 'in projects' })}</dt><dd>{st.used.join(' · ')}</dd></div>
        </dl>
      </div>
    </div>
  );
}
