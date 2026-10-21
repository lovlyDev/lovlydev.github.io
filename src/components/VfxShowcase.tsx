import { useEffect, useRef, useState } from 'react';
import { vfx, type Vfx } from '../data/vfx';
import { useLang } from '../i18n';
import { Icon } from './Icon';
import { PinnedScroller } from './PinnedScroller';

/** Plays (muted) only while mostly on screen; sound is opt-in because browsers block autoplay with audio. */
function VfxVideo({ v }: { v: Vfx }) {
  const { t } = useLang();
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().catch(() => { /* autoplay refused: the poster stays */ });
      else el.pause();
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
    if (el.paused) el.play().catch(() => {});
  };

  return (
    <div className="vfx-frame" style={{ aspectRatio: String(v.aspect) }}>
      <video ref={video} src={`./vfx/${v.id}.mp4`} poster={`./vfx/${v.id}.webp`} muted={muted} loop playsInline preload="metadata" />
      <button className="vfx-sound mono" onClick={toggleSound} aria-pressed={!muted}>
        <Icon name={muted ? 'soundOff' : 'soundOn'} size={15} />
        {muted ? t({ ru: 'Включить звук', en: 'Sound on' }) : t({ ru: 'Выключить звук', en: 'Sound off' })}
      </button>
    </div>
  );
}

function VfxSlide({ v }: { v: Vfx }) {
  const { t } = useLang();
  return (
    <article className="work vfx">
      <div className="work-media">
        <VfxVideo v={v} />
      </div>
      <div className="work-text">
        <header className="work-head">
          <h3>{v.name}</h3>
          <span className="mono muted">{t(v.kind)} · Roblox · {v.duration}</span>
        </header>
        <p className="tagline">{t(v.about)}</p>
        <h4 className="mono">{t({ ru: 'Что внутри', en: 'What’s inside' })}</h4>
        <ul className="eng">
          {v.beats.map((b, k) => <li key={k}>{t(b)}</li>)}
        </ul>
        <p className="stack mono">{v.tags.join(' / ')}</p>
      </div>
    </article>
  );
}

export function VfxShowcase() {
  const { t } = useLang();
  return (
    <PinnedScroller
      id="vfx"
      title={t({ ru: 'VFX для Roblox', en: 'Roblox VFX' })}
      lead={t({ ru: 'Эффекты и скрипты на Luau для игр. Видео со звуком — включите его кнопкой на ролике.', en: 'Effects and Luau scripts for games. The videos have sound — turn it on with the button.' })}
      tabs={vfx.map(v => v.name)}
      slides={vfx.map(v => <VfxSlide key={v.id} v={v} />)}
    />
  );
}
