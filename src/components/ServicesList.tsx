import { useEffect, useRef, type CSSProperties } from 'react';
import { services } from '../data/profile';
import { useLang } from '../i18n';
import { Icon } from './Icon';

/** Services as rows: the title rolls over on hover, a line runs along the row, tags light up one by one. */
export function ServicesList() {
  const { t } = useLang();
  const box = useRef<HTMLUListElement>(null);

  // rows slide in one after another the first time the list is seen
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('seen'); io.disconnect(); } }, { threshold: .15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul className="svc-list" ref={box}>
      {services.map((s, i) => {
        const title = t(s.title);
        return (
          <li key={i} style={{ '--i': i } as CSSProperties}>
            <a href={s.to}>
              <h3 className="roll" aria-label={title}>
                <span aria-hidden="true">{title}</span>
                <span aria-hidden="true">{title}</span>
              </h3>
              <p className="muted">{t(s.text)}</p>
              <p className="mono svc-tags">{s.tags.map((tag, k) => <span key={tag} style={{ '--k': k } as CSSProperties}>{tag}</span>)}</p>
              <span className="svc-arrow"><Icon name="arrowUpRight" size={18} /></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
