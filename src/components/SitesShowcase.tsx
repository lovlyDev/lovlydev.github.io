import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { siteRepo, sites, siteUrl } from '../data/sites';
import { useLang } from '../i18n';
import { Icon } from './Icon';

/** Coverflow: the chosen site sits in the centre, neighbours fan out in 3D. */
export function SitesShowcase() {
  const { t } = useLang();
  const [i, setI] = useState(Math.floor(sites.length / 2) - 1);
  const swipeX = useRef<number | null>(null);
  const go = (k: number) => setI(Math.min(sites.length - 1, Math.max(0, k)));
  const s = sites[i];

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
  };
  const onDown = (e: PointerEvent) => { swipeX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  };

  return (
    <section className="section wrap" id="sites">
      <div className="section-head"><h2>{t({ ru: 'Сайты', en: 'Websites' })}</h2></div>
      <p className="muted section-lead sites-lead">
        {t({
          ru: 'Концепты для вымышленных бизнесов: у каждого свой стиль, шрифты и анимации. Все адаптивные — откройте и посмотрите вживую.',
          en: 'Concepts for fictional businesses, each with its own style, fonts and motion. All responsive — open them and see for yourself.',
        })}
      </p>

      <div className="flow" tabIndex={0} onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { swipeX.current = null; }}
        aria-roledescription={t({ ru: 'карусель', en: 'carousel' })} aria-label={t({ ru: 'Сайты', en: 'Websites' })}>
        <div className="flow-stage">
          {sites.map((x, k) => {
            const d = k - i;
            const style = { '--d': d, '--a': Math.abs(d) } as CSSProperties;
            return d === 0 ? (
              <a key={x.id} className="flow-card on" style={style} href={siteUrl(x.id)} target="_blank" rel="noreferrer" draggable={false}
                aria-label={`${x.name} — ${t({ ru: 'открыть сайт', en: 'open website' })}`}>
                <img src={`./sites/${x.id}.webp`} alt="" draggable={false} />
                <span className="flow-phone"><img src={`./sites/${x.id}-m.webp`} alt="" draggable={false} /></span>
              </a>
            ) : (
              <button key={x.id} className="flow-card" style={style} onClick={() => go(k)} aria-label={x.name} tabIndex={-1} hidden={Math.abs(d) > 3}>
                <img src={`./sites/${x.id}.webp`} alt="" loading="lazy" draggable={false} />
              </button>
            );
          })}
        </div>

        <div className="flow-info" key={s.id}>
          <div className="site-title">
            <h3>{s.name}</h3>
            <span className="mono muted">{t(s.kind)} · {t({ ru: 'концепт', en: 'concept' })}</span>
          </div>
          <p className="muted">{t(s.about)}</p>
          <div className="site-meta mono">
            <span className="swatches">{s.palette.map(c => <i key={c} style={{ background: c }} title={c} />)}</span>
            <span>{s.fonts}</span>
          </div>
          <div className="work-links">
            <a className="link" href={siteUrl(s.id)} target="_blank" rel="noreferrer">{t({ ru: 'Открыть сайт', en: 'Open website' })} <Icon name="arrowUpRight" size={14} /></a>
            <a className="link" href={siteRepo(s.id)} target="_blank" rel="noreferrer">{t({ ru: 'Код', en: 'Source' })} <Icon name="arrowUpRight" size={14} /></a>
          </div>
        </div>

        <div className="flow-nav">
          <button onClick={() => go(i - 1)} disabled={i === 0} aria-label={t({ ru: 'Предыдущий', en: 'Previous' })}>←</button>
          <div className="flow-dots">
            {sites.map((x, k) => <button key={x.id} className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={x.name} />)}
          </div>
          <button onClick={() => go(i + 1)} disabled={i === sites.length - 1} aria-label={t({ ru: 'Следующий', en: 'Next' })}>→</button>
        </div>
      </div>
    </section>
  );
}
