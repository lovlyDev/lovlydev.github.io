import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { siteRepo, sites, siteUrl } from '../data/sites';
import { useLang } from '../i18n';
import { Icon } from './Icon';

/** Coverflow: the chosen site sits in the centre, neighbours fan out in 3D. Cards follow a drag in real time. */
export function SitesShowcase() {
  const { t } = useLang();
  const [i, setI] = useState(Math.floor(sites.length / 2) - 1);
  const [dir, setDir] = useState(1);
  const [offset, setOffset] = useState(0); // live drag offset, in cards
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; t: number; moved: boolean; step: number } | null>(null);
  const wheelLock = useRef(0);
  const wheelSum = useRef(0);
  const iRef = useRef(i);
  iRef.current = i;

  const go = (k: number) => {
    const n = Math.min(sites.length - 1, Math.max(0, k));
    if (n !== i) setDir(n > i ? 1 : -1);
    setI(n);
  };
  const s = sites[i];

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
  };

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const card = stage.current?.querySelector<HTMLElement>('.flow-card');
    const step = card ? card.offsetWidth * .34 : 200;
    drag.current = { x: e.clientX, t: performance.now(), moved: false, step };
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) { d.moved = true; setDragging(true); stage.current?.setPointerCapture(e.pointerId); }
    // rubber-band at the ends
    let o = -dx / d.step;
    const target = i + o;
    if (target < 0) o = -i + target * .3;
    if (target > sites.length - 1) o = sites.length - 1 - i + (target - sites.length + 1) * .3;
    setOffset(o);
  };
  const onUp = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    const dx = e.clientX - d.x;
    const v = dx / Math.max(1, performance.now() - d.t); // px per ms
    let k = Math.round(i - dx / d.step);
    if (k === i && Math.abs(v) > .4) k = i + (v < 0 ? 1 : -1); // quick flick
    setDragging(false);
    setOffset(0);
    go(k);
    // swallow the click that follows a drag
    const stop = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
    addEventListener('click', stop, { capture: true, once: true });
    setTimeout(() => removeEventListener('click', stop, { capture: true }), 0);
  };

  // trackpad horizontal swipe
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (performance.now() < wheelLock.current) return;
      wheelSum.current += e.deltaX;
      if (Math.abs(wheelSum.current) > 50) {
        const sign = wheelSum.current > 0 ? 1 : -1;
        setDir(sign);
        setI(Math.min(sites.length - 1, Math.max(0, iRef.current + sign)));
        wheelSum.current = 0;
        wheelLock.current = performance.now() + 420;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onCardClick = (e: MouseEvent, k: number) => {
    if (k !== i) { e.preventDefault(); go(k); }
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

      <div className="flow" tabIndex={0} onKeyDown={onKey} style={{ '--glow': s.palette[2] } as CSSProperties}
        aria-roledescription={t({ ru: 'карусель', en: 'carousel' })} aria-label={t({ ru: 'Сайты', en: 'Websites' })}>
        <div className={`flow-stage${dragging ? ' dragging' : ''}`} ref={stage}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          {sites.map((x, k) => {
            const d = k - i - offset;
            const style = { '--d': d, '--a': Math.abs(d) } as CSSProperties;
            const on = k === i;
            return (
              <a key={x.id} className={`flow-card${on ? ' on' : ''}${Math.abs(d) > 3.2 ? ' far' : ''}`} style={style}
                href={siteUrl(x.id)} target="_blank" rel="noreferrer" draggable={false} tabIndex={on ? 0 : -1}
                onClick={e => onCardClick(e, k)}
                aria-label={on ? `${x.name} — ${t({ ru: 'открыть сайт', en: 'open website' })}` : x.name}>
                <img src={`./sites/${x.id}.webp`} alt="" loading={Math.abs(k - i) > 2 ? 'lazy' : undefined} draggable={false} />
                <span className="flow-phone"><img src={`./sites/${x.id}-m.webp`} alt="" loading="lazy" draggable={false} /></span>
              </a>
            );
          })}
        </div>

        <div className="flow-info" key={s.id} style={{ '--from': `${dir * 28}px` } as CSSProperties}>
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
          <button className="lb-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label={t({ ru: 'Предыдущий', en: 'Previous' })}><Icon name="left" size={20} /></button>
          <div className="flow-dots">
            {sites.map((x, k) => <button key={x.id} className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={x.name} />)}
          </div>
          <button className="lb-btn" onClick={() => go(i + 1)} disabled={i === sites.length - 1} aria-label={t({ ru: 'Следующий', en: 'Next' })}><Icon name="right" size={20} /></button>
        </div>
      </div>
    </section>
  );
}
