import { useEffect, useRef, useState } from 'react';
import { Dithering } from '@paper-design/shaders-react';

/** Dithered warp behind the hero. Loaded lazily; stops animating when out of view or with reduced motion. */
export default function HeroShader() {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} style={{ position: 'absolute', inset: 0 }}>
      <Dithering style={{ position: 'absolute', inset: 0 }} colorBack="#000000" colorFront="#3a3a3a"
        shape="warp" type="4x4" size={2} speed={still || !visible ? 0 : 0.35} maxPixelCount={6_000_000} />
    </div>
  );
}
