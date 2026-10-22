import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { steps } from '../data/profile';
import { useLang, type L } from '../i18n';

const PIN_QUERY = '(min-width: 961px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)';

/** Element that appears once the scene's progress `--s` passes `at` (0…1). */
const at = (v: number) => ({ '--at': v } as CSSProperties);

function SceneChat({ t }: { t: (l: L) => string }) {
  return (
    <div className="sc sc-chat">
      <div className="sc-top"><span className="sc-ava">T</span><b>Telegram</b><small>lovlyDev</small></div>
      <div className="sc-msgs">
        <p className="bub in sc-in" style={at(.05)}>{t({ ru: 'Здравствуйте! Нужен сайт для автосервиса', en: 'Hi! I need a website for my car service' })}</p>
        <p className="bub in sc-in" style={at(.2)}>{t({ ru: 'Чтобы клиенты записывались сами', en: 'So clients can book on their own' })}</p>
        <p className="bub out sc-in" style={at(.45)}>{t({ ru: 'Привет! Сделаем. Какие услуги главные и есть ли логотип?', en: 'Hi! Sure. What are your main services and do you have a logo?' })}</p>
        <p className="bub typing sc-in" style={at(.7)}><i /><i /><i /></p>
      </div>
    </div>
  );
}

function SceneBrief({ t }: { t: (l: L) => string }) {
  const rows: [L, L][] = [
    [{ ru: 'Страницы', en: 'Pages' }, { ru: 'Главная, услуги, контакты', en: 'Home, services, contacts' }],
    [{ ru: 'Заявки', en: 'Requests' }, { ru: 'Сразу в Telegram', en: 'Straight to Telegram' }],
    [{ ru: 'Срок', en: 'Timeline' }, { ru: '7 дней', en: '7 days' }],
    [{ ru: 'Цена', en: 'Price' }, { ru: 'Согласована', en: 'Agreed' }],
  ];
  return (
    <div className="sc sc-brief">
      <div className="sc-top"><b>{t({ ru: 'План проекта', en: 'Project plan' })}</b><small className="mono">brief.md</small></div>
      <ul>
        {rows.map(([k, v], i) => (
          <li key={i} className="sc-in" style={at(.08 + i * .2)}>
            <span className="tick" /><span className="muted">{t(k)}</span><b>{t(v)}</b>
          </li>
        ))}
      </ul>
      <div className="sc-stamp sc-in" style={at(.9)}>{t({ ru: 'Договорились', en: 'Agreed' })}</div>
    </div>
  );
}

function SceneCode() {
  const code = [
    ['k', 'export function', 'f', ' Hero', 'p', '() {'],
    ['p', '  return ', 't', '<section ', 'a', 'className', 'p', '=', 's', '"hero"', 't', '>'],
    ['p', '    ', 't', '<h1>', 'p', 'Ремонт без лишних трат', 't', '</h1>'],
    ['p', '    ', 't', '<Button ', 'a', 'to', 'p', '=', 's', '"#book"', 't', ' />'],
    ['p', '  ', 't', '</section>', 'p', ';'],
    ['p', '}'],
  ];
  return (
    <div className="sc sc-code">
      <div className="sc-editor">
        <div className="sc-top"><span className="dots"><i /><i /><i /></span><small className="mono">Hero.tsx</small></div>
        <pre className="mono">
          {code.map((line, i) => (
            <span key={i} className="ln sc-type" style={at(i * .12)}>
              {line.reduce<[string, string][]>((acc, _v, j) => (j % 2 ? acc : [...acc, [line[j], line[j + 1]]]), []).map(([c, s], j) => <em key={j} className={`c-${c}`}>{s}</em>)}
            </span>
          ))}
        </pre>
      </div>
      <div className="sc-preview">
        <i className="pv-nav sc-in" style={at(.2)} />
        <i className="pv-h1 sc-in" style={at(.4)} />
        <i className="pv-h1 short sc-in" style={at(.5)} />
        <i className="pv-btn sc-in" style={at(.68)} />
        <i className="pv-img sc-in" style={at(.82)} />
      </div>
    </div>
  );
}

function SceneLaunch({ t }: { t: (l: L) => string }) {
  return (
    <div className="sc sc-launch">
      <div className="sc-phone sc-in" style={at(.05)}>
        <img src="./sites/dental-m.webp" alt="" loading="lazy" />
      </div>
      <div className="sc-toast sc-in" style={at(.45)}>
        <span className="ok" />
        <div><b>{t({ ru: 'Сайт опубликован', en: 'Website is live' })}</b><small className="mono">lovlydev.github.io/concept-dental</small></div>
      </div>
      <div className="sc-toast alt sc-in" style={at(.75)}>
        <span className="ok tg" />
        <div><b>{t({ ru: 'Новая заявка', en: 'New request' })}</b><small>{t({ ru: 'Осмотр · завтра 10:20', en: 'Check-up · tomorrow 10:20' })}</small></div>
      </div>
    </div>
  );
}

/**
 * «How it works»: pinned while scrolling; each step plays its own little scene, scrubbed by scroll.
 * Without room for pinning (phones, reduced motion) the steps stack and each scene plays once in view.
 */
export function Process() {
  const { t } = useLang();
  const [pinned, setPinned] = useState(() => matchMedia(PIN_QUERY).matches);
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const n = steps.length;

  useEffect(() => {
    const mq = matchMedia(PIN_QUERY);
    const on = () => setPinned(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // pinned: scroll position eases toward its target every frame, like the work showcase
  useEffect(() => {
    if (!pinned) return;
    let raf = 0, last = 0, pos = -1, shown = -1;
    const goal = () => {
      const el = section.current!;
      const total = Math.max(1, el.offsetHeight - innerHeight);
      return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) * n;
    };
    const render = () => {
      const scenes = stage.current?.children;
      if (!scenes) return;
      const a = Math.min(n - 1, Math.floor(pos));
      for (let k = 0; k < scenes.length; k++) {
        // each scene plays during the first 70% of its segment, then rests
        const s = Math.min(1, Math.max(0, (pos - k) / .7));
        (scenes[k] as HTMLElement).style.setProperty('--s', s.toFixed(3));
      }
      rail.current?.style.setProperty('--p', String(Math.min(1, pos / n)));
      if (a !== shown) { shown = a; setActive(a); }
    };
    const frame = (now: number) => {
      const dt = Math.min(64, now - (last || now)) / 1000;
      last = now;
      const g = goal();
      if (pos < 0) pos = g;
      pos += (g - pos) * (1 - Math.exp(-dt * 8));
      const settled = Math.abs(g - pos) < .0005;
      if (settled) pos = g;
      render();
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
    wake();
    addEventListener('scroll', wake, { passive: true });
    addEventListener('resize', wake);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', wake); removeEventListener('resize', wake); };
  }, [pinned, n]);

  // stacked: play each scene once it is in view
  useEffect(() => {
    if (pinned) return;
    const scenes = [...(section.current?.querySelectorAll<HTMLElement>('.step-scene') ?? [])];
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('play'); io.unobserve(e.target); } }), { threshold: .35 });
    scenes.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [pinned]);

  const jump = (k: number) => {
    const el = section.current;
    if (!el) return;
    const total = el.offsetHeight - innerHeight;
    scrollTo({ top: el.offsetTop + ((k + .72) / n) * total, behavior: 'smooth' });
  };

  const scenes = [<SceneChat t={t} />, <SceneBrief t={t} />, <SceneCode />, <SceneLaunch t={t} />];
  const title = t({ ru: 'Как работаем', en: 'How it works' });

  if (!pinned) {
    return (
      <section className="section wrap proc-stack" id="process" ref={section}>
        <div className="section-head"><h2>{title}</h2></div>
        {steps.map((s, k) => (
          <div className="proc-row" key={k}>
            <div className="proc-text"><strong>{t(s.title)}</strong><span className="muted">{t(s.text)}</span></div>
            <div className="step-scene">{scenes[k]}</div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="proc-pin" id="process" ref={section} style={{ height: `${n * 85 + 40}vh` }}>
      <div className="proc-sticky">
        <div className="wrap">
          <div className="section-head"><h2>{title}</h2></div>
          <div className="proc-grid">
            <div className="proc-rail" ref={rail}>
              <div className="rail-line"><i /></div>
              <ol>
                {steps.map((s, k) => (
                  <li key={k} className={k === active ? 'on' : k < active ? 'done' : ''}>
                    <button onClick={() => jump(k)}>
                      <span className="rail-node" />
                      <strong>{t(s.title)}</strong>
                      <span className="muted">{t(s.text)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="proc-stage" ref={stage}>
              {scenes.map((sc, k) => <div key={k} className={`step-scene${k === active ? ' on' : ''}`}>{sc}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
