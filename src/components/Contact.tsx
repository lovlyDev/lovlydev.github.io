import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { links, TELEGRAM } from '../data/profile';
import { useLang } from '../i18n';
import { Icon } from './Icon';

/** Local time in Kursk, ticking every second. */
function useKurskTime() {
  const fmt = () => new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Moscow' }).format(new Date());
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Final section: a big line assembled letter by letter, a magnetic Telegram button and a live clock. */
export function Contact() {
  const { t } = useLang();
  const box = useRef<HTMLElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);
  const [seen, setSeen] = useState(false);
  const time = useKurskTime();
  const hour = Number(time.slice(0, 2));
  const day = hour >= 9 && hour < 23;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the button leans toward the cursor while it is close, then springs back
  const onMove = (e: MouseEvent) => {
    const b = btn.current;
    if (!b || matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    const r = b.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    const reach = 160;
    if (dist > reach) { b.style.transform = ''; return; }
    const pull = (1 - dist / reach) * .35;
    b.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
  };
  const onLeave = () => { if (btn.current) btn.current.style.transform = ''; };

  const word = t({ ru: 'Напишите.', en: 'Let’s talk.' });

  return (
    <section className={`contact wrap${seen ? ' seen' : ''}`} id="contact" ref={box} onMouseMove={onMove} onMouseLeave={onLeave}>
      <p className="mono muted contact-kicker">{t({ ru: 'Есть задача?', en: 'Have a project?' })}</p>
      <h2 className="contact-big" aria-label={word}>
        {[...word].map((ch, i) => (
          <span key={i} className="ch" style={{ '--i': i } as CSSProperties} aria-hidden="true">{ch}</span>
        ))}
      </h2>
      <div className="contact-row">
        <p className="muted contact-sub">{t({ ru: 'Расскажите, что нужно, — обсудим задачу, сроки и цену.', en: 'Tell me what you need — we’ll agree on scope, timeline and price.' })}</p>
        <div className="contact-cta">
          <a ref={btn} className="btn btn-primary btn-lg magnet" href={TELEGRAM} target="_blank" rel="noreferrer">
            {t({ ru: 'Написать в Telegram', en: 'Message on Telegram' })} <Icon name="arrow" />
          </a>
          <p className="mono clock">
            <span className={`dot${day ? '' : ' night'}`} />
            {t({ ru: 'Курск', en: 'Kursk' })} · {time}
            <span className="muted"> · {day ? t({ ru: 'на связи', en: 'online' }) : t({ ru: 'ночь, отвечу утром', en: 'night here, I’ll reply in the morning' })}</span>
          </p>
        </div>
      </div>
      <ul className="contact-list">
        {links.map((l, i) => (
          <li key={l.label} style={{ '--i': i } as CSSProperties}>
            <a href={l.href} target="_blank" rel="noreferrer">
              <span>{l.label}</span>
              <span className="mono muted">{l.handle}</span>
              <Icon name="arrowUpRight" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
