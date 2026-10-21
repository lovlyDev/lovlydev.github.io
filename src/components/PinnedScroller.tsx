import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Pinning needs room: wide and tall enough viewport, and the user hasn't asked for less motion. */
function usePinnable() {
  const query = '(min-width: 961px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)';
  const [ok, setOk] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setOk(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return ok;
}

/** Each slide rests for half of its scroll segment, then slides to the next one. */
function easeSegments(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const t = f < 0.25 ? 0 : f > 0.75 ? 1 : (f - 0.25) / 0.5;
  return i + t * t * (3 - 2 * t);
}

type Props = {
  id: string;
  title: string;
  /** optional line under the title */
  lead?: ReactNode;
  /** tab label per slide */
  tabs: string[];
  slides: ReactNode[];
  /** called when the slide in view changes (pinned mode only) */
  onActive?: (k: number) => void;
};

/**
 * A section that sticks to the screen while vertical scrolling moves its slides sideways.
 * Falls back to a plain vertical list on small screens and with reduced motion.
 */
export function PinnedScroller({ id, title, lead, tabs, slides, onActive }: Props) {
  const pinned = usePinnable();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = slides.length;
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    if (!pinned) return;
    // Wheel scrolling moves in coarse steps; instead of copying those jumps, the rendered
    // position eases toward the scroll target every frame, so motion stays continuous.
    let raf = 0;
    let last = 0;
    let pos = 0;        // rendered position, in slides
    let fill = 0;       // rendered progress bar fill
    let shown = -1;

    const target = () => {
      const el = section.current!;
      const total = Math.max(1, el.offsetHeight - innerHeight);
      const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      return { progress, pos: easeSegments(progress * (n - 1)) };
    };

    const render = () => {
      const tr = track.current;
      if (!tr) return;
      // write styles directly: re-rendering React on every frame is wasteful
      tr.style.transform = `translate3d(calc(${-pos} * (100% + var(--slide-gap))), 0, 0)`;
      for (let k = 0; k < tr.children.length; k++) {
        (tr.children[k] as HTMLElement).style.opacity = String(1 - Math.min(1, Math.abs(pos - k)) * 0.75);
      }
      if (bar.current) bar.current.style.transform = `scaleX(${fill})`;
      const a = Math.round(pos);
      if (a !== shown) { shown = a; setActive(a); onActiveRef.current?.(a); }
    };

    const frame = (now: number) => {
      const dt = Math.min(64, now - (last || now)) / 1000;
      last = now;
      const goal = target();
      // frame-rate independent exponential smoothing (~200 ms to settle most of the way)
      const k = 1 - Math.exp(-dt * 9);
      pos += (goal.pos - pos) * k;
      fill += (goal.progress - fill) * k;
      const settled = Math.abs(goal.pos - pos) < 0.0005 && Math.abs(goal.progress - fill) < 0.0005;
      if (settled) { pos = goal.pos; fill = goal.progress; }
      render();
      raf = settled ? 0 : requestAnimationFrame(frame);
    };

    const wake = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

    const start = target();
    pos = start.pos; fill = start.progress;
    render();
    addEventListener('scroll', wake, { passive: true });
    addEventListener('resize', wake);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', wake); removeEventListener('resize', wake); };
  }, [pinned, n]);

  const jump = (k: number) => {
    const el = section.current;
    if (!el) return;
    const total = el.offsetHeight - innerHeight;
    scrollTo({ top: el.offsetTop + (k / Math.max(1, n - 1)) * total, behavior: 'smooth' });
  };

  if (!pinned) {
    return (
      <section className="section wrap" id={id}>
        <div className="section-head"><h2>{title}</h2></div>
        {lead && <p className="muted section-lead">{lead}</p>}
        {slides}
      </section>
    );
  }

  return (
    <section className="work-pin" id={id} ref={section} style={{ height: `${n * 100}vh` }}>
      <div className="work-sticky">
        <div className="wrap work-bar">
          <div>
            <h2>{title}</h2>
            {lead && <p className="muted section-lead">{lead}</p>}
          </div>
          <nav className="work-tabs" aria-label={title}>
            {tabs.map((label, k) => (
              <button key={label} className={k === active ? 'on' : ''} onClick={() => jump(k)}>{label}</button>
            ))}
          </nav>
          <div className="work-progress"><div ref={bar} /></div>
        </div>
        <div className="wrap work-viewport">
          <div className="work-track" ref={track}>
            {slides.map((s, k) => <div className="work-slide" key={k}>{s}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
