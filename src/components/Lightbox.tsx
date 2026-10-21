import { useEffect, useState } from 'react';
import type { Project } from '../data/projects';
import { useLang } from '../i18n';
import { Icon } from './Icon';
import { Shot } from './Shot';

export function Lightbox({ project, start, onClose }: { project: Project; start: number; onClose: () => void }) {
  const { t } = useLang();
  const [i, setI] = useState(start);
  const n = project.shots.length;
  const go = (d: number) => setI(v => (v + d + n) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  });

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={project.name} onClick={onClose}>
      <div className="lb-top" onClick={e => e.stopPropagation()}>
        <span className="mono">{project.name}</span>
        <span className="mono muted">{i + 1} / {n}</span>
        <button className="lb-btn" onClick={onClose} aria-label={t({ ru: 'Закрыть', en: 'Close' })}><Icon name="close" size={18} /></button>
      </div>

      <div className="lb-stage" onClick={e => e.stopPropagation()}>
        <button className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Previous"><Icon name="left" size={20} /></button>
        <Shot key={i} id={project.id} i={i} alt={t(project.shots[i])} />
        <button className="lb-btn lb-next" onClick={() => go(1)} aria-label="Next"><Icon name="right" size={20} /></button>
      </div>

      <div className="lb-bottom" onClick={e => e.stopPropagation()}>
        <p>{t(project.shots[i])}</p>
        <div className="lb-thumbs">
          {project.shots.map((cap, k) => (
            <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={t(cap)}>
              <Shot id={project.id} i={k} lazy />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
