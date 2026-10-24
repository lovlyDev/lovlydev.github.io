import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { TELEGRAM } from '../data/profile';
import { useLang } from '../i18n';
import { Icon } from '../components/Icon';
import { cases, type Case, type Metric } from './data';

/** Adds `.in` to `.reveal` elements as they scroll into view. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CountUp({ m, run }: { m: Metric; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(m.value); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 1600);
      setV(Math.round(m.value * (1 - (1 - k) ** 4)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, m.value]);
  return <>{m.prefix}{v}{m.suffix}</>;
}

function Metrics({ c }: { c: Case }) {
  const { t } = useLang();
  const ref = useRef<HTMLDListElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: .4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <dl className="cs-metrics" ref={ref}>
      {c.metrics.map((m, i) => (
        <div key={i}><dt><CountUp m={m} run={run} /></dt><dd>{t(m.label)}</dd></div>
      ))}
    </dl>
  );
}

/** Scroll story: steps scroll on the left, a framed screen on the right swaps to the active step. */
function Story({ c }: { c: Case }) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);
  const mobileShots = c.steps.every(s => s.mobile);

  useEffect(() => {
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`cs-story ${mobileShots ? 'phone' : 'browser'}`}>
      <ol className="cs-steps">
        {c.steps.map((s, i) => (
          <li key={i} data-i={i} ref={el => { steps.current[i] = el; }} className={i === active ? 'on' : ''}>
            <span className="cs-step-bar" aria-hidden="true" />
            <h3>{t(s.title)}</h3>
            <p>{t(s.text)}</p>
            {/* phones and narrow screens see each screenshot inline */}
            <img className="cs-inline-shot" src={s.shot} alt="" loading="lazy" />
          </li>
        ))}
      </ol>
      <div className="cs-media" aria-hidden="true">
        <div className="cs-frame">
          {!mobileShots && <div className="cs-bar"><i /><i /><i /><span>{c.nda ? '•••••' : t(c.name)}</span></div>}
          <div className="cs-screens">
            {c.steps.map((s, i) => (
              <img key={i} src={s.shot} alt="" loading={i < 2 ? 'eager' : 'lazy'} style={{ '--d': i - active } as CSSProperties} className={i === active ? 'on' : i < active ? 'past' : 'next'} />
            ))}
          </div>
        </div>
        <div className="cs-dots">{c.steps.map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}</div>
      </div>
    </div>
  );
}

function CaseSection({ c, next }: { c: Case; next?: Case }) {
  const { t } = useLang();
  return (
    <section className="cs" id={c.id} style={{ '--accent': c.accent } as CSSProperties}>
      <div className="wrap">
        <header className="cs-head reveal">
          <div className="cs-title">
            {c.logo ? <img className="cs-logo" src={c.logo} alt="" /> : <span className="cs-logo cs-logo-nda"><Icon name="lock" size={22} /></span>}
            <div>
              <p className="mono cs-kind">{t(c.kind)}</p>
              <h2>{t(c.name)}</h2>
            </div>
          </div>
          <p className="mono cs-period"><i />{t(c.period)}</p>
        </header>

        <div className="cs-intro reveal">
          <p className="cs-lead">{t(c.intro)}</p>
          <p className="cs-role"><Icon name="arrow" size={16} />{t(c.role)}</p>
        </div>

        <Metrics c={c} />

        <ul className="cs-stack reveal">{c.stack.map((s, i) => <li key={s} style={{ '--i': i } as CSSProperties}>{s}</li>)}</ul>

        {c.nda && (
          <div className="cs-nda reveal">
            <Icon name="lock" size={18} />
            <p><b>{t({ ru: 'Под NDA.', en: 'Under NDA.' })}</b> {t(c.nda)}</p>
          </div>
        )}
      </div>

      <div className="wrap"><Story c={c} /></div>

      <div className="wrap cs-bottom">
        <div className="cs-features reveal">
          <h3>{t({ ru: 'Что внутри', en: 'Under the hood' })}</h3>
          <ul>{c.features.map((f, i) => <li key={i}><Icon name="check" size={16} />{t(f)}</li>)}</ul>
        </div>
        <aside className="cs-side reveal">
          <div className="cs-estimate">
            <span className="mono">{t({ ru: 'Стоимость проекта', en: 'Project cost' })}</span>
            <b>{t(c.price)}</b>
          </div>
          {c.links && (
            <div className="cs-links">
              {c.links.map(l => (
                <a key={l.href} className="btn btn-primary" href={l.href} target="_blank" rel="noreferrer">{t(l.label)} <Icon name="arrowUpRight" size={16} /></a>
              ))}
            </div>
          )}
        </aside>
      </div>

      {c.reviews.length > 0 && (
        <div className="wrap cs-reviews">
          {c.reviews.map((r, i) => (
            <blockquote key={i} className="reveal">
              <span className="cs-quote" aria-hidden="true">“</span>
              <p>{t(r.text)}</p>
              <footer><span className="cs-avatar"><Icon name={c.nda ? 'lock' : 'check'} size={14} /></span><b>{t(r.author)}</b><span>· {t(r.role)}</span></footer>
            </blockquote>
          ))}
        </div>
      )}

      {next && (
        <a className="wrap cs-next reveal" href={`#${next.id}`}>
          <span className="mono">{t({ ru: 'Следующий кейс', en: 'Next case' })}</span>
          <b>{t(next.name)}</b>
          <Icon name="arrow" size={22} />
        </a>
      )}
    </section>
  );
}

/** Editorial list of cases; on pointer devices a screenshot trails the cursor over the hovered row. */
function CaseIndex() {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0, r: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const hovering = hover !== null;

  // reveal lives in state: the rows' className changes on hover and would drop a class added from outside
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: .2 });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!hovering) return;
    let raf = 0;
    const tick = () => {
      const p = pos.current, dx = target.current.x - p.x;
      p.x += dx * .14;
      p.y += (target.current.y - p.y) * .14;
      // tilt with horizontal speed
      p.r += (Math.max(-7, Math.min(7, dx * .05)) - p.r) * .12;
      preview.current!.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.r}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovering]);

  const move = (e: MouseEvent) => {
    const r = box.current!.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (!hovering) Object.assign(pos.current, target.current, { r: 0 });
  };

  return (
    <div className={`cs-list${hovering ? ' has-hover' : ''}`} ref={box} onMouseMove={move} onMouseLeave={() => setHover(null)}>
      {cases.map((c, i) => (
        <a key={c.id} href={`#${c.id}`} className={`cs-row${shown ? ' in' : ''}${hover === i ? ' on' : ''}`} style={{ '--accent': c.accent, '--i': i } as CSSProperties} onMouseEnter={() => setHover(i)}>
          <span className="cs-row-name"><i />{t(c.name)}</span>
          <span className="cs-row-meta"><span className="cs-row-kind">{t(c.kind)}</span><span className="cs-row-period mono">{t(c.period)}</span></span>
          <span className="cs-row-price mono">{t(c.price)}</span>
        </a>
      ))}
      <div className={`cs-preview${hovering && cases[hover].steps[0].mobile ? ' tall' : ''}${hovering ? ' show' : ''}`} ref={preview} aria-hidden="true">
        {cases.map((c, i) => <img key={c.id} src={c.steps[0].shot} alt="" className={hover === i ? 'on' : ''} />)}
      </div>
    </div>
  );
}

export function Cases() {
  const { lang, setLang, t } = useLang();
  const bar = useRef<HTMLDivElement>(null);
  useReveal();
  useEffect(() => { document.title = t({ ru: 'Кейсы · lovlyDev', en: 'Case studies · lovlyDev' }); }, [t]);
  useEffect(() => {
    const on = () => { const h = document.documentElement; bar.current?.style.setProperty('transform', `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - innerHeight)})`); };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  const title = t({ ru: 'Кейсы', en: 'Case studies' });

  return (
    <>
      <div className="cs-progress" ref={bar} />
      <nav className="nav">
        <div className="wrap nav-inner">
          <a href="./" className="logo">lovlyDev</a>
          <div className="nav-links">
            <a href="./">← {t({ ru: 'Портфолио', en: 'Portfolio' })}</a>
            {cases.map(c => <a key={c.id} href={`#${c.id}`}>{c.nda ? t({ ru: 'Платформа (NDA)', en: 'Platform (NDA)' }) : t(c.name)}</a>)}
            <a href="./price.html">{t({ ru: 'Цены', en: 'Pricing' })}</a>
          </div>
          <div className="lang" role="group" aria-label="Language">
            {(['ru', 'en'] as const).map(l => <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
          </div>
          <a className="btn btn-primary btn-sm" href={TELEGRAM} target="_blank" rel="noreferrer">{t({ ru: 'Обсудить проект', en: 'Start a project' })}</a>
        </div>
      </nav>

      <main>
        <header className="wrap cs-hero">
          <p className="mono muted hero-tag"><span className="dot" />{t({ ru: 'Проекты для заказчиков', en: 'Client projects' })}</p>
          <h1 aria-label={title}>{[...title].map((ch, i) => <span key={i} style={{ '--i': i } as CSSProperties} aria-hidden="true">{ch}</span>)}</h1>
          <p className="cs-hero-lead">{t({ ru: 'Два проекта, которые я сделал с нуля: от технического задания и архитектуры до запуска. Скриншоты — с работающих сборок.', en: 'Two projects I built from scratch: from the spec and architecture to launch. Screenshots come from running builds.' })}</p>
          <CaseIndex />
        </header>

        {cases.map((c, i) => <CaseSection key={c.id} c={c} next={cases[i + 1]} />)}

        <section className="wrap cs-final reveal">
          <h2>{t({ ru: 'Нужен похожий проект?', en: 'Need something similar?' })}</h2>
          <p className="muted">{t({ ru: 'Расскажите задачу — оценю сроки и стоимость. Или прикиньте сами в калькуляторе.', en: 'Tell me about the task and I’ll estimate time and cost. Or try the calculator.' })}</p>
          <div className="cs-final-btns">
            <a className="btn btn-primary btn-lg" href={TELEGRAM} target="_blank" rel="noreferrer">{t({ ru: 'Написать в Telegram', en: 'Message on Telegram' })} <Icon name="arrow" /></a>
            <a className="btn btn-ghost btn-lg" href="./price.html">{t({ ru: 'Калькулятор стоимости', en: 'Price calculator' })}</a>
          </div>
        </section>
      </main>

      <footer className="footer wrap mono muted">
        <span>© {new Date().getFullYear()} {t({ ru: 'Артём', en: 'Artem' })} / lovlyDev</span>
        <a href="./">{t({ ru: 'На главную', en: 'Home' })} ↑</a>
      </footer>
    </>
  );
}
