import { projects, type Project } from '../data/projects';
import { useLang } from '../i18n';
import { Icon } from './Icon';
import { PinnedScroller } from './PinnedScroller';
import { Shot } from './Shot';

export const kloc = (n: number) => `~${Math.round(n / 1000)}k`;

// GitHub linguist colours, so the bars read the same as on the repo pages
const LANG_COLORS: Record<string, string> = {
  'C++': '#f34b7d',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  CSS: '#663399',
  Slang: '#1fbec9',
  Python: '#3572a5',
  'PL/pgSQL': '#336790',
};
const langColor = (name: string) => LANG_COLORS[name] ?? '#6e6e6e';

function LangBar({ langs }: { langs: [string, number][] }) {
  return (
    <div className="langs">
      <div className="lang-bar">
        {langs.map(([name, pct]) => <span key={name} style={{ width: `${pct}%`, background: langColor(name) }} title={`${name} ${pct}%`} />)}
      </div>
      <ul className="lang-legend mono">
        {langs.map(([name, pct]) => (
          <li key={name}><i style={{ background: langColor(name) }} />{name} <span className="muted">{pct}%</span></li>
        ))}
      </ul>
    </div>
  );
}

function Work({ p, onOpen }: { p: Project; onOpen: (i: number) => void }) {
  const { t } = useLang();
  const extra = p.shots.length - 5;
  return (
    <article className="work">
      <div className="work-media">
        <button className="shot-main" onClick={() => onOpen(0)} aria-label={t(p.shots[0])}>
          <Shot id={p.id} i={0} alt={t(p.shots[0])} />
        </button>
        <div className="shot-row">
          {p.shots.slice(1, 5).map((cap, k) => (
            <button key={k} onClick={() => onOpen(k + 1)} aria-label={t(cap)}>
              <Shot id={p.id} i={k + 1} lazy />
              {k === 3 && extra > 0 && <span className="more mono">+{extra}</span>}
            </button>
          ))}
        </div>
        <p className="stack mono">{p.stack.join(' / ')} <span className="muted">· {kloc(p.loc)} {t({ ru: 'строк', en: 'lines' })}</span></p>
        <LangBar langs={p.langs} />
      </div>

      <div className="work-text">
        <header className="work-head">
          <h3>{p.name}</h3>
          <span className="mono muted">{t(p.kind)} · {p.platforms}{p.version !== 'web' && ` · v${p.version}`}</span>
        </header>
        <p className="tagline">{t(p.tagline)}</p>
        <p className="muted about-p">{t(p.about)}</p>

        <h4 className="mono">{t({ ru: 'Как устроено', en: 'Under the hood' })}</h4>
        <ul className="eng">
          {p.engineering.map((e, k) => <li key={k}>{t(e)}</li>)}
        </ul>

        <div className="work-links">
          {p.links.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link">
              {t(l.label)} <Icon name="arrowUpRight" size={14} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function WorkShowcase({ onOpen }: { onOpen: (p: Project, i: number) => void }) {
  const { t } = useLang();
  return (
    <PinnedScroller
      id="work"
      title={t({ ru: 'Избранные работы', en: 'Selected work' })}
      tabs={projects.map(p => p.name)}
      slides={projects.map(p => <Work key={p.id} p={p} onOpen={i => onOpen(p, i)} />)}
    />
  );
}
